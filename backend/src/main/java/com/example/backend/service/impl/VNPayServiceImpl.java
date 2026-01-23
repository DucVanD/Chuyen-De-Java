package com.example.backend.service.impl;

import com.example.backend.config.VNPayConfig;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderDetail;
import com.example.backend.entity.Product;
import com.example.backend.entity.Voucher;
import com.example.backend.entity.enums.OrderStatus;
import com.example.backend.entity.enums.PaymentStatus;
import com.example.backend.exception.BusinessException;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.VoucherRepository;
import com.example.backend.service.VNPayService;
import com.example.backend.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayServiceImpl implements VNPayService {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final VoucherRepository voucherRepository;

    @Override
    @Transactional
    public String createPaymentUrl(Integer orderId, HttpServletRequest request) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng với ID: " + orderId));

        // Tạo vnp_TxnRef unique
        String vnpTxnRef = "ORDER" + orderId + "_" + System.currentTimeMillis();

        // Tạo các tham số VNPay
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVnpVersion());
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());

        // Số tiền nhân với 100 để triệt tiêu phần thập phân
        long amount = order.getTotalAmount().multiply(new BigDecimal(100)).longValue();
        vnpParams.put("vnp_Amount", String.valueOf(amount));

        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + orderId);
        vnpParams.put("vnp_OrderType", "billpayment");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
        vnpParams.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        // Thời gian tạo
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(new Date());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        // Tạo secure hash
        String queryUrl = VNPayUtil.hashAllFields(vnpParams);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getVnpHashSecret(), queryUrl);

        // Debug logging
        String paymentUrl = vnPayConfig.getVnpApiUrl() + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
        System.out.println("=== VNPay Payment URL Debug ===");
        System.out.println("Order ID: " + orderId);
        System.out.println("TxnRef: " + vnpTxnRef);
        System.out.println("Amount: " + amount);
        System.out.println("Payment URL: " + paymentUrl);
        System.out.println("===============================");

        return paymentUrl;
    }

    @Override
    @Transactional
    public Map<String, String> handleCallback(Map<String, String> params) {
        Map<String, String> result = new HashMap<>();

        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            params.remove("vnp_SecureHash");
            params.remove("vnp_SecureHashType");

            // Verify signature
            String signValue = VNPayUtil.hashAllFields(params);
            String checkSum = VNPayUtil.hmacSHA512(vnPayConfig.getVnpHashSecret(), signValue);

            if (!checkSum.equals(vnpSecureHash)) {
                result.put("status", "error");
                result.put("message", "Chữ ký không hợp lệ");
                return result;
            }

            String vnpTxnRef = params.get("vnp_TxnRef");
            String vnpResponseCode = params.get("vnp_ResponseCode");

            // Extract orderId from vnpTxnRef (format: ORDER123_1737177600000)
            String orderIdStr = vnpTxnRef.split("_")[0].replace("ORDER", "");
            Integer orderId = Integer.parseInt(orderIdStr);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng với ID: " + orderId));

            System.out.println("=== VNPay Callback Debug ===");
            System.out.println("TxnRef: " + vnpTxnRef);
            System.out.println("ResponseCode: " + vnpResponseCode);
            System.out.println("Order ID: " + orderId);
            System.out.println("Order Status: " + order.getStatus());
            System.out.println("===========================");

            // Update status based on response code
            if ("00".equals(vnpResponseCode)) {
                // Payment successful
                if (order.getStatus() != OrderStatus.PENDING) {
                    result.put("status", "error");
                    result.put("message", "Đơn hàng không hợp lệ hoặc đã bị hủy");
                    result.put("orderId", String.valueOf(orderId));
                    return result;
                }

                order.setPaymentStatus(PaymentStatus.PAID);
                orderRepository.save(order);

                result.put("status", "thành công");
                result.put("message", "Thanh toán thành công");
                result.put("orderId", String.valueOf(orderId));

                System.out.println("✅ Payment successful for order: " + orderId);
            } else {
                // Payment failed or cancelled
                order.setStatus(OrderStatus.CANCELLED);
                order.setPaymentStatus(PaymentStatus.UNPAID);
                order.setCancelReason("Hủy thanh toán VNPay - Mã lỗi: " + vnpResponseCode);

                // Restore stock for all products in order
                for (OrderDetail detail : order.getOrderDetails()) {
                    if (detail.getProduct() != null) {
                        Product product = detail.getProduct();
                        int currentQty = product.getQty() != null ? product.getQty() : 0;
                        int restoreQty = detail.getQuantity();

                        // Handle WEIGHT type products
                        if (product.getSaleType() == com.example.backend.entity.SaleType.WEIGHT) {
                            int baseWeight = product.getBaseWeight() != null ? product.getBaseWeight() : 0;
                            restoreQty = restoreQty * baseWeight;
                        }

                        product.setQty(currentQty + restoreQty);
                        productRepository.save(product);

                        System.out.println("🔄 Restored stock for: " + product.getName() + " | +" + restoreQty + " -> "
                                + product.getQty());
                    }
                }

                // Revert voucher usage
                if (order.getVoucher() != null) {
                    try {
                        Voucher voucher = voucherRepository.findById(order.getVoucher().getId()).orElse(null);
                        if (voucher != null && voucher.getUsedCount() != null && voucher.getUsedCount() > 0) {
                            voucher.setUsedCount(voucher.getUsedCount() - 1);
                            voucherRepository.save(voucher);
                            System.out.println("🔄 Reverted voucher usage: " + voucher.getVoucherCode());
                        }
                    } catch (Exception e) {
                        System.err.println("❌ Failed to revert voucher usage: " + e.getMessage());
                    }
                }

                orderRepository.save(order);

                result.put("status", "đã_hủy");
                result.put("message", "Thanh toán đã bị hủy");
                result.put("orderId", String.valueOf(orderId));
                result.put("reason", "Người dùng hủy thanh toán hoặc thanh toán thất bại");

                System.out.println("❌ Payment cancelled for order: " + orderId);
            }

        } catch (Exception e) {
            System.err.println("❌ Error in handleCallback: " + e.getMessage());
            e.printStackTrace();

            result.put("status", "error");
            result.put("message", "Lỗi xử lý callback: " + e.getMessage());
            result.put("orderId", "0");
        }

        return result;
    }
}
