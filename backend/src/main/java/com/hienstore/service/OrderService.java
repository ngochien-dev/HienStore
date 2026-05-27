package com.hienstore.service;

import com.hienstore.dto.request.OrderRequest;
import com.hienstore.dto.response.DashboardStatsDto;
import com.hienstore.dto.response.OrderDto;
import com.hienstore.dto.response.CouponDto;
import com.hienstore.entity.*;
import com.hienstore.mapper.OrderMapper;
import com.hienstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;
    private final CouponService couponService;
    private final CouponRepository couponRepository;
    private final EmailService emailService;

    private final NotificationService notificationService;

    @Transactional
    public OrderDto createOrder(String username, OrderRequest request) {
        User user = userRepository.findByAccountUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cart.getItems();
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .phone(request.getPhone())
                .shippingAddress(request.getShippingAddress())
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.UNPAID)
                .build();

        for (CartItem cartItem : cartItems) {
            ProductVariant variant = cartItem.getProductVariant();

            if (variant.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Product " + variant.getProduct().getName() + " does not have enough stock.");
            }

            // Decrease stock
            variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
            productVariantRepository.save(variant);

            BigDecimal basePrice = variant.getPrice() != null ? variant.getPrice() : variant.getProduct().getBasePrice();
            BigDecimal price = variant.getSalePrice() != null ? variant.getSalePrice() : basePrice;
            BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productVariant(variant)
                    .quantity(cartItem.getQuantity())
                    .price(price)
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);
        
        // Calculate Membership Discount
        BigDecimal membershipDiscountPercentage = BigDecimal.ZERO;
        switch (user.getUserType()) {
            case SILVER: membershipDiscountPercentage = BigDecimal.valueOf(3); break;
            case GOLD: membershipDiscountPercentage = BigDecimal.valueOf(5); break;
            case DIAMOND: membershipDiscountPercentage = BigDecimal.valueOf(10); break;
            default: break;
        }
        BigDecimal membershipDiscount = totalAmount.multiply(membershipDiscountPercentage).divide(BigDecimal.valueOf(100));
        order.setMembershipDiscount(membershipDiscount);
        totalAmount = totalAmount.subtract(membershipDiscount);
        
        // Handle Coupon
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            CouponDto coupon = couponService.validateCoupon(request.getCouponCode(), totalAmount);
            if (coupon.getDiscountType().equals("PERCENTAGE")) {
                discountAmount = totalAmount.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
                if (coupon.getMaxDiscountAmount() != null && discountAmount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                    discountAmount = coupon.getMaxDiscountAmount();
                }
            } else {
                discountAmount = coupon.getDiscountValue();
            }
            if (discountAmount.compareTo(totalAmount) > 0) {
                discountAmount = totalAmount; // Cap discount to total amount
            }
            
            order.setDiscountAmount(discountAmount);
            order.setCouponCode(coupon.getCode());
            order.setTotalAmount(totalAmount.subtract(discountAmount));
            
            Coupon couponEntity = couponRepository.findByCode(coupon.getCode()).get();
            couponEntity.setUsedCount(couponEntity.getUsedCount() + 1);
            couponRepository.save(couponEntity);
        }

        Order savedOrder = orderRepository.save(order);

        // Send confirmation email asynchronously
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            String fullName = user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : "");
            emailService.sendOrderConfirmationEmail(
                user.getEmail(), 
                fullName, 
                savedOrder.getId().toString(), 
                savedOrder.getTotalAmount().doubleValue()
            );
        }

        notificationService.createNotification(
            user,
            "Đặt hàng thành công",
            "Đơn hàng #" + savedOrder.getId() + " của bạn đã được tạo thành công.",
            "ORDER_STATUS",
            "/profile/orders"
        );

        // Clear cart
        cartItemRepository.deleteAll(cartItems);
        cart.getItems().clear();
        cartRepository.save(cart);

        return orderMapper.toDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> getUserOrders(String username, Pageable pageable) {
        return orderRepository.findByUserAccountUsernameOrderByCreatedAtDesc(username, pageable)
                .map(orderMapper::toDto);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, String username) {
        Order order = orderRepository.findByIdAndUserAccountUsername(orderId, username)
                .orElseThrow(() -> new RuntimeException("Order not found or access denied"));
        return orderMapper.toDto(order);
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, String username) {
        Order order = orderRepository.findByIdAndUserAccountUsername(orderId, username)
                .orElseThrow(() -> new RuntimeException("Order not found or access denied"));
        
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        
        // Hoàn kho
        for (OrderItem orderItem : order.getItems()) {
            ProductVariant variant = orderItem.getProductVariant();
            if (variant != null) {
                variant.setStockQuantity(variant.getStockQuantity() + orderItem.getQuantity());
                productVariantRepository.save(variant);
            }
        }
        
        notificationService.createNotification(
            order.getUser(),
            "Đơn hàng đã hủy",
            "Đơn hàng #" + order.getId() + " đã được hủy thành công.",
            "ORDER_STATUS",
            "/profile/orders"
        );
        
        return orderMapper.toDto(orderRepository.save(order));
    }

    // Admin methods
    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAllWithDetails(pageable).map(orderMapper::toDto);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByIdForAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderMapper.toDto(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status, PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Hoàn kho nếu cập nhật sang CANCELLED từ một trạng thái khác CANCELLED
        if (status != null && status == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
            for (OrderItem orderItem : order.getItems()) {
                ProductVariant variant = orderItem.getProductVariant();
                if (variant != null) {
                    variant.setStockQuantity(variant.getStockQuantity() + orderItem.getQuantity());
                    productVariantRepository.save(variant);
                }
            }
        }
        
        // Tích điểm và nâng hạng nếu giao thành công
        if (status != null && status == OrderStatus.DELIVERED && order.getStatus() != OrderStatus.DELIVERED) {
            int earnedPoints = order.getTotalAmount().divide(BigDecimal.valueOf(1000)).intValue();
            User orderUser = order.getUser();
            orderUser.setPoint(orderUser.getPoint() + earnedPoints);
            
            int currentPoints = orderUser.getPoint();
            if (currentPoints >= 10000) {
                orderUser.setUserType(com.hienstore.enums.UserType.DIAMOND);
            } else if (currentPoints >= 5000) {
                orderUser.setUserType(com.hienstore.enums.UserType.GOLD);
            } else if (currentPoints >= 1000) {
                orderUser.setUserType(com.hienstore.enums.UserType.SILVER);
            } else {
                orderUser.setUserType(com.hienstore.enums.UserType.COPPER);
            }
            userRepository.save(orderUser);
        }
        
        boolean statusChanged = status != null && status != order.getStatus();
        
        if (status != null) {
            order.setStatus(status);
        }
        if (paymentStatus != null) {
            order.setPaymentStatus(paymentStatus);
        }
        
        Order savedOrder = orderRepository.save(order);
        
        if (statusChanged) {
            String statusMsg = "";
            switch (status) {
                case PROCESSING: statusMsg = "đang được xử lý"; break;
                case SHIPPED: statusMsg = "đang được giao đến bạn"; break;
                case DELIVERED: statusMsg = "đã giao thành công"; break;
                case CANCELLED: statusMsg = "đã bị hủy"; break;
                default: statusMsg = "đã cập nhật trạng thái mới";
            }
            
            notificationService.createNotification(
                savedOrder.getUser(),
                "Cập nhật đơn hàng",
                "Đơn hàng #" + savedOrder.getId() + " " + statusMsg,
                "ORDER_STATUS",
                "/profile/orders"
            );
        }
        
        return orderMapper.toDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        BigDecimal totalRevenue = orderRepository.sumTotalRevenueExcludingCancelled(OrderStatus.CANCELLED);
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);
        long totalCustomers = userRepository.count();
        long totalProducts = productRepository.count();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        List<DashboardStatsDto.RecentOrderDto> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(order -> DashboardStatsDto.RecentOrderDto.builder()
                        .id(order.getId())
                        .customerName(order.getReceiverName())
                        .totalAmount(order.getTotalAmount())
                        .status(order.getStatus().name())
                        .createdAt(order.getCreatedAt() != null ? order.getCreatedAt().format(formatter) : "")
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .deliveredOrders(deliveredOrders)
                .cancelledOrders(cancelledOrders)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .recentOrders(recentOrders)
                .build();
    }
}

