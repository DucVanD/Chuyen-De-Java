package com.example.backend.service.impl;

import com.example.backend.entity.enums.OrderStatus;
import com.example.backend.entity.enums.PaymentMethod;
import com.example.backend.entity.enums.PaymentStatus;
import com.example.backend.dto.OrderDto;
import com.example.backend.entity.*;
import com.example.backend.mapper.OrderMapper;
import com.example.backend.exception.BusinessException;
import com.example.backend.repository.*;
import com.example.backend.service.OrderService;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;
    private final ProductRepository productRepository;
    private final com.example.backend.repository.StockMovementRepository stockMovementRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            UserRepository userRepository,
            VoucherRepository voucherRepository,
            ProductRepository productRepository,
            com.example.backend.repository.StockMovementRepository stockMovementRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.voucherRepository = voucherRepository;
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Override
    public List<OrderDto> getAll() {
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<OrderDto> getPage(int page, int size, String orderCode,
            com.example.backend.entity.enums.OrderStatus status,
            com.example.backend.entity.enums.PaymentMethod paymentMethod) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("id").descending());

        // Build dynamic specification
        org.springframework.data.jpa.domain.Specification<Order> spec = (root, query, cb) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();

            if (orderCode != null && !orderCode.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("orderCode")), "%" + orderCode.toLowerCase() + "%"));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (paymentMethod != null) {
                predicates.add(cb.equal(root.get("paymentMethod"), paymentMethod));
            }

            // ✅ Lọc các đơn hàng chưa bị xóa mềm
            predicates.add(cb.isNull(root.get("deletedAt")));

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        return orderRepository.findAll(spec, pageable).map(OrderMapper::toDto);
    }

    @Override
    public OrderDto getById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng"));

        OrderDto dto = OrderMapper.toDto(order);

        // Populate creator info (Người tạo đơn)
        if (order.getCreatedBy() != null) {
            userRepository.findById(order.getCreatedBy()).ifPresent(creator -> {
                dto.setCreatedByName(creator.getName());
                dto.setCreatedByEmail(creator.getEmail());
            });
        }

        // Populate updater info (Nhân viên chốt đơn/xử lý cuối)
        if (order.getUpdatedBy() != null) {
            userRepository.findById(order.getUpdatedBy()).ifPresent(updater -> {
                dto.setUpdatedByName(updater.getName());
                dto.setUpdatedByEmail(updater.getEmail());
            });
        }

        return dto;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public OrderDto create(OrderDto dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

        Voucher voucher = null;
        // Handle voucherCode from frontend
        if (dto.getVoucherCode() != null && !dto.getVoucherCode().isEmpty()) {
            voucher = voucherRepository.findByVoucherCode(dto.getVoucherCode())
                    .orElse(null);
        } else if (dto.getVoucherId() != null) {
            voucher = voucherRepository.findById(dto.getVoucherId())
                    .orElse(null);
        }

        Order order = OrderMapper.toEntity(dto, user, voucher);

        // Generate unique order code if not provided
        if (order.getOrderCode() == null || order.getOrderCode().isEmpty()) {
            order.setOrderCode(generateOrderCode());
        }

        Order saved = orderRepository.save(order);

        // Process OrderDetails if present
        if (dto.getOrderDetails() != null && !dto.getOrderDetails().isEmpty()) {

            List<OrderDetail> details = dto.getOrderDetails().stream()
                    .map(detailDto -> {
                        Product product = productRepository.findById(detailDto.getProductId())
                                .orElseThrow(
                                        () -> new BusinessException(
                                                "Sản phẩm không tồn tại: " + detailDto.getProductId()));

                        // Deduct product quantity (WEIGHT: grams, PACKAGE: units)
                        int currentQty = product.getQty() != null ? product.getQty() : 0;
                        int orderQty = detailDto.getQuantity();
                        int deductQty = orderQty;

                        if (product.getSaleType() == com.example.backend.entity.SaleType.WEIGHT) {
                            int baseWeight = product.getBaseWeight() != null ? product.getBaseWeight() : 0;
                            deductQty = orderQty * baseWeight;
                        }

                        if (currentQty < deductQty) {
                            throw new BusinessException("Sản phẩm " + product.getName()
                                    + " không đủ hàng trong kho. Hiện có: " + currentQty
                                    + ", Yêu cầu: " + deductQty);
                        }

                        product.setQty(currentQty - deductQty);
                        productRepository.save(product);

                        // ✅ CREATE ITEMIZED STOCK MOVEMENT
                        StockMovement stockMovement = StockMovement.builder()
                                .product(product)
                                .order(saved)
                                .movementType(com.example.backend.entity.enums.StockMovementType.OUT)
                                .quantity(deductQty)
                                .unitPrice(detailDto.getPriceBuy()) // Use the purchase price for this item
                                .currentStock(product.getQty())
                                .note("Xuất kho đơn hàng: " + saved.getOrderCode())
                                .build();
                        stockMovementRepository.save(stockMovement);

                        System.out.println(
                                "✅ Itemized stock movement created: " + product.getName() + " | -" + deductQty);

                        return com.example.backend.mapper.OrderDetailMapper.toEntity(detailDto, saved, product);
                    })
                    .collect(Collectors.toList());

            saved.setOrderDetails(details);
            orderRepository.save(saved);
        }

        // Increment voucher usage if voucher was applied
        if (voucher != null && voucher.getId() != null) {
            try {
                Voucher voucherToUpdate = voucherRepository.findById(voucher.getId()).orElse(null);
                if (voucherToUpdate != null) {
                    // Handle null usedCount (initialize to 0 if null)
                    Integer currentCount = voucherToUpdate.getUsedCount();
                    if (currentCount == null) {
                        currentCount = 0;
                    }
                    voucherToUpdate.setUsedCount(currentCount + 1);
                    voucherRepository.save(voucherToUpdate);
                    System.out.println("✅ Voucher usage incremented: " + voucherToUpdate.getVoucherCode() + " -> "
                            + voucherToUpdate.getUsedCount());
                }
            } catch (Exception e) {
                // Log but don't fail the order
                System.err.println("❌ Failed to increment voucher usage: " + e.getMessage());
                e.printStackTrace();
            }
        }

        return OrderMapper.toDto(saved);
    }

    @Override
    public OrderDto updateStatus(Integer id, OrderDto dto) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = dto.getStatus();

        // 🔒 Khóa đơn đã GIAO hoặc đã HỦY
        if (currentStatus == OrderStatus.COMPLETED || currentStatus == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Đơn hàng đã hoàn tất hoặc đã hủy, không thể cập nhật");
        }

        // ❌ Online chưa thanh toán mà đòi giao
        if (order.getPaymentMethod().isOnline()
                && newStatus == OrderStatus.SHIPPING
                && order.getPaymentStatus() != PaymentStatus.PAID) {
            throw new IllegalStateException("Chưa thanh toán, không thể giao hàng");
        }

        // ✅ COD hoàn tất → auto PAID
        if (newStatus == OrderStatus.COMPLETED
                && order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        // ❌ Hủy đơn đã thanh toán → hoàn tiền
        if (newStatus == OrderStatus.CANCELLED
                && order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        // Cập nhật status
        order.setStatus(newStatus);

        // Cập nhật thông tin khách hàng (nếu có)
        if (dto.getReceiverName() != null) {
            order.setReceiverName(dto.getReceiverName());
        }
        if (dto.getReceiverEmail() != null) {
            order.setReceiverEmail(dto.getReceiverEmail());
        }
        if (dto.getReceiverPhone() != null) {
            order.setReceiverPhone(dto.getReceiverPhone());
        }
        if (dto.getReceiverAddress() != null) {
            order.setReceiverAddress(dto.getReceiverAddress());
        }
        if (dto.getWard() != null) {
            order.setWard(dto.getWard());
        }
        if (dto.getDistrict() != null) {
            order.setDistrict(dto.getDistrict());
        }

        Order updated = orderRepository.save(order);
        return OrderMapper.toDto(updated);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void cancel(Integer id, String reason) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng"));

        OrderStatus currentStatus = order.getStatus();

        // Check if order allows cancellation (PENDING or CONFIRMED only)
        if (currentStatus != OrderStatus.PENDING && currentStatus != OrderStatus.CONFIRMED) {
            throw new IllegalStateException(
                    "Chỉ có thể hủy đơn hàng khi đang chờ xử lý hoặc đã xác nhận. Trạng thái hiện tại: "
                            + currentStatus);
        }

        // 1. Restore Stock & Record Itemized Stock Movements
        for (OrderDetail detail : order.getOrderDetails()) {
            if (detail.getProduct() != null) {
                com.example.backend.entity.Product product = detail.getProduct();
                int currentQty = product.getQty() != null ? product.getQty() : 0;
                int restoreQty = detail.getQuantity();

                if (product.getSaleType() == com.example.backend.entity.SaleType.WEIGHT) {
                    int baseWeight = product.getBaseWeight() != null ? product.getBaseWeight() : 0;
                    restoreQty = restoreQty * baseWeight;
                }

                product.setQty(currentQty + restoreQty);
                productRepository.save(product);

                // ✅ CREATE ITEMIZED RESTORATION MOVEMENT
                StockMovement sm = StockMovement.builder()
                        .product(product)
                        .order(order)
                        .movementType(com.example.backend.entity.enums.StockMovementType.IN) // Refund/Cancel = IN
                        .quantity(restoreQty)
                        .unitPrice(detail.getPriceBuy()) // Record what price was refunded/restored
                        .currentStock(product.getQty())
                        .note("Hoàn kho từ đơn hàng hủy: " + order.getOrderCode())
                        .createdAt(java.time.LocalDateTime.now())
                        .build();
                stockMovementRepository.save(sm);

                System.out.println("🔄 Restored stock itemized for: " + product.getName() + " | +" + restoreQty);
            }
        }

        // 2. Revert Voucher Usage
        if (order.getVoucher() != null) {
            try {
                Voucher voucher = voucherRepository.findById(order.getVoucher().getId()).orElse(null);
                if (voucher != null && voucher.getUsedCount() > 0) {
                    voucher.setUsedCount(voucher.getUsedCount() - 1);
                    voucherRepository.save(voucher);
                    System.out.println("🔄 Reverted voucher usage: " + voucher.getVoucherCode());
                }
            } catch (Exception e) {
                System.err.println("❌ Failed to revert voucher usage: " + e.getMessage());
            }
        }

        // 3. Update Payment Status (if PAID -> REFUNDED)
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        // 4. Update Order Status
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason(reason);
        // order.setNote(reason); // Reverted per user request

        orderRepository.save(order);
    }

    @Override
    public void delete(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng"));

        // ✅ Thực hiện XÓA MỀM (Soft Delete)
        // Điều này giúp giữ lại dữ liệu cho báo cáo và tránh lỗi Foreign Key Constraint
        order.setDeletedAt(java.time.LocalDateTime.now());
        orderRepository.save(order);
    }

    @Override
    public List<OrderDto> getTrash() {
        return orderRepository.findAll().stream()
                .filter(o -> o.getDeletedAt() != null)
                .sorted((o1, o2) -> o2.getDeletedAt().compareTo(o1.getDeletedAt()))
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void restore(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng trong thùng rác"));
        order.setDeletedAt(null);
        orderRepository.save(order);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void permanentDelete(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Không tìm thấy đơn hàng để xóa vĩnh viễn"));

        if (order.getDeletedAt() == null) {
            throw new BusinessException("Chỉ có thể xóa vĩnh viễn đơn hàng đã nằm trong thùng rác");
        }

        // cascade delete will handle stockMovements and orderDetails due to previous
        // fix
        orderRepository.delete(order);
    }

    @Override
    public Integer getUserIdByUsername(String username) {
        // Username is actually email in this system
        com.example.backend.entity.User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));
        return user.getId();
    }

    @Override
    public java.util.Map<String, Object> getUserOrders(Integer userId, int page,
            java.util.Map<String, Object> filters) {
        // Get orders for this specific user directly from database (Optimized)
        java.util.List<com.example.backend.entity.Order> allOrders = orderRepository.findByUserId(userId).stream()
                .sorted((o1, o2) -> o2.getId().compareTo(o1.getId()))
                .collect(java.util.stream.Collectors.toList());

        // Apply filters
        java.util.List<com.example.backend.entity.Order> filteredOrders = allOrders.stream()
                .filter(o -> {
                    // Filter by status
                    if (filters.containsKey("status")) {
                        Integer status = (Integer) filters.get("status");
                        if (!(o.getStatus().ordinal() + 1 == status))
                            return false;
                    }

                    // Filter by payment method
                    if (filters.containsKey("payment")) {
                        String payment = (String) filters.get("payment");
                        if (!o.getPaymentMethod().name().equals(payment))
                            return false;
                    }

                    // Add more filters as needed (date range, price range, etc.)

                    return true;
                })
                .collect(java.util.stream.Collectors.toList());

        // Pagination
        int pageSize = 10;
        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, filteredOrders.size());
        java.util.List<com.example.backend.entity.Order> paginatedOrders = filteredOrders.subList(start, end);

        // Build response
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("status", true);

        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("orders", paginatedOrders.stream().map(com.example.backend.mapper.OrderMapper::toDto)
                .collect(java.util.stream.Collectors.toList()));

        // Pagination info
        java.util.Map<String, Object> pagination = new java.util.HashMap<>();
        pagination.put("current_page", page);
        pagination.put("last_page", (int) Math.ceil((double) filteredOrders.size() / pageSize));
        pagination.put("total", filteredOrders.size());
        data.put("pagination", pagination);

        // Summary statistics
        java.util.Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("total_orders", filteredOrders.size());
        summary.put("total_products", filteredOrders.stream()
                .mapToInt(o -> o.getOrderDetails().size()).sum());
        summary.put("delivered_orders", filteredOrders.stream()
                .filter(o -> o.getStatus() == com.example.backend.entity.enums.OrderStatus.COMPLETED).count());
        summary.put("delivered_shipping", filteredOrders.stream()
                .filter(o -> o.getStatus() == com.example.backend.entity.enums.OrderStatus.SHIPPING).count());

        summary.put("pending_orders", filteredOrders.stream()
                .filter(o -> o.getStatus() == com.example.backend.entity.enums.OrderStatus.PENDING).count());
        summary.put("confirmed_orders", filteredOrders.stream()
                .filter(o -> o.getStatus() == com.example.backend.entity.enums.OrderStatus.CONFIRMED).count());
        summary.put("canceled_orders", filteredOrders.stream()
                .filter(o -> o.getStatus() == com.example.backend.entity.enums.OrderStatus.CANCELLED).count());
        data.put("summary", summary);

        response.put("data", data);
        return response;
    }

    /**
     * Generate unique order code with format: ORD-YYYYMMDD-XXXXXX
     * Example: ORD-20260102-123456
     */
    private String generateOrderCode() {
        String datePart = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = String.format("%06d", (int) (Math.random() * 1000000));
        return "ORD-" + datePart + "-" + randomPart;
    }

}
