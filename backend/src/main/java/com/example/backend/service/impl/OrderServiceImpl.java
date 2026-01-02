package com.example.backend.service.impl;

import com.example.backend.entity.enums.OrderStatus;
import com.example.backend.entity.enums.PaymentMethod;
import com.example.backend.entity.enums.PaymentStatus;
import com.example.backend.dto.OrderDto;
import com.example.backend.entity.*;
import com.example.backend.mapper.OrderMapper;
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
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

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

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        return orderRepository.findAll(spec, pageable).map(OrderMapper::toDto);
    }

    @Override
    public OrderDto getById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderMapper.toDto(order);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public OrderDto create(OrderDto dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

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
            int totalItemsCount = 0;

            List<OrderDetail> details = dto.getOrderDetails().stream()
                    .map(detailDto -> {
                        Product product = productRepository.findById(detailDto.getProductId())
                                .orElseThrow(
                                        () -> new RuntimeException("Product not found: " + detailDto.getProductId()));

                        // Deduct product quantity
                        int currentQty = product.getQty() != null ? product.getQty() : 0;
                        int orderQty = detailDto.getQuantity();

                        if (currentQty < orderQty) {
                            throw new RuntimeException("Insufficient stock for product: " + product.getName()
                                    + ". Available: " + currentQty + ", Requested: " + orderQty);
                        }

                        product.setQty(currentQty - orderQty);
                        productRepository.save(product);
                        System.out.println("✅ Product qty updated: " + product.getName() + " -> " + product.getQty());

                        return com.example.backend.mapper.OrderDetailMapper.toEntity(detailDto, saved, product);
                    })
                    .collect(Collectors.toList());

            saved.setOrderDetails(details);
            orderRepository.save(saved);

            // Create ONE summary stock movement for the entire order
            // Set product to NULL since this is an order summary, not a specific product
            // movement
            if (!details.isEmpty()) {
                totalItemsCount = dto.getOrderDetails().size();
                int totalQuantity = dto.getOrderDetails().stream()
                        .mapToInt(com.example.backend.dto.OrderDetailDto::getQuantity)
                        .sum();

                StockMovement stockMovement = StockMovement.builder()
                        .product(null) // NULL for order summary
                        .order(saved)
                        .movementType(com.example.backend.entity.enums.StockMovementType.OUT)
                        .quantity(totalQuantity)
                        .unitPrice(dto.getTotalAmount())
                        .currentStock(0) // Not applicable for order summary
                        .note("Order " + saved.getOrderCode() + " - " + totalItemsCount + " items (total qty)")
                        .build();
                stockMovementRepository.save(stockMovement);
                System.out.println("✅ Stock movement created: Order " + saved.getOrderCode() + " - " + totalQuantity
                        + " units total");
            }
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
                .orElseThrow(() -> new RuntimeException("Order not found"));

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

        order.setStatus(newStatus);

        Order updated = orderRepository.save(order);
        return OrderMapper.toDto(updated);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void cancel(Integer id, String reason) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();

        // Check if order allows cancellation (PENDING or CONFIRMED only)
        if (currentStatus != OrderStatus.PENDING && currentStatus != OrderStatus.CONFIRMED) {
            throw new IllegalStateException(
                    "Chỉ có thể hủy đơn hàng khi đang chờ xử lý hoặc đã xác nhận. Trạng thái hiện tại: "
                            + currentStatus);
        }

        // 1. Restore Stock
        // Iterate through order details and increment product quantity
        for (OrderDetail detail : order.getOrderDetails()) {
            if (detail.getProduct() != null) {
                com.example.backend.entity.Product product = detail.getProduct();
                int currentQty = product.getQty() != null ? product.getQty() : 0;
                int restoreQty = detail.getQuantity();

                product.setQty(currentQty + restoreQty);
                productRepository.save(product);
                System.out.println("🔄 Restored stock for: " + product.getName() + " | +" + restoreQty + " -> "
                        + product.getQty());
            }
        }

        // Record Stock Movement for Restoration (Optional but good for tracking)
        // We can create one summary movement OR one per product. Let's do summary like
        // in create()
        if (!order.getOrderDetails().isEmpty()) {
            int totalRestoreQty = order.getOrderDetails().stream().mapToInt(OrderDetail::getQuantity).sum();
            StockMovement stockMovement = StockMovement.builder()
                    .product(null)
                    .order(order)
                    .movementType(com.example.backend.entity.enums.StockMovementType.IN) // Refund/Cancel = IN
                    .quantity(totalRestoreQty)
                    .unitPrice(java.math.BigDecimal.ZERO)
                    .currentStock(0)
                    .note("Restock from Cancelled Order " + order.getOrderCode())
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            stockMovementRepository.save(stockMovement);
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
        orderRepository.deleteById(id);
    }

    @Override
    public Integer getUserIdByUsername(String username) {
        // Username is actually email in this system
        com.example.backend.entity.User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @Override
    public java.util.Map<String, Object> getUserOrders(Integer userId, int page,
            java.util.Map<String, Object> filters) {
        // Get all orders for this user
        java.util.List<com.example.backend.entity.Order> allOrders = orderRepository.findAll().stream()
                .filter(o -> o.getUser().getId().equals(userId))
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
