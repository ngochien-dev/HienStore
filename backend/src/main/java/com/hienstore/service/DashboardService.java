package com.hienstore.service;

import com.hienstore.dto.response.DashboardDto;
import com.hienstore.dto.response.OrderDto;
import com.hienstore.dto.response.ProductDto;
import com.hienstore.entity.Order;
import com.hienstore.mapper.OrderMapper;
import com.hienstore.mapper.ProductMapper;
import com.hienstore.repository.OrderRepository;
import com.hienstore.repository.ProductRepository;
import com.hienstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public DashboardDto getDashboardStats() {
        BigDecimal totalRevenue = orderRepository.sumTotalRevenueExcludingCancelled(com.hienstore.entity.OrderStatus.CANCELLED);
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(com.hienstore.entity.OrderStatus.PENDING);
        long deliveredOrders = orderRepository.countByStatus(com.hienstore.entity.OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(com.hienstore.entity.OrderStatus.CANCELLED);
        long totalCustomers = userRepository.count();
        long totalProducts = productRepository.count();

        // Get recent 10 orders
        List<OrderDto> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc()
                .stream().map(orderMapper::toDto).collect(Collectors.toList());

        // Get recent 5 products
        List<ProductDto> recentProducts = productRepository.findAll(PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                .getContent().stream().map(productMapper::toDto).collect(Collectors.toList());

        List<DashboardDto.RevenueByDate> revenueByDate = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDateTime startDate = today.minusDays(6).atStartOfDay();
        
        List<Order> recentValidOrders = orderRepository.findByCreatedAtAfterAndStatusNot(startDate, com.hienstore.entity.OrderStatus.CANCELLED);
        
        for (int i = 6; i >= 0; i--) {
            LocalDate targetDate = today.minusDays(i);
            BigDecimal dayRevenue = recentValidOrders.stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().equals(targetDate))
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            revenueByDate.add(DashboardDto.RevenueByDate.builder()
                .date(targetDate.format(DateTimeFormatter.ofPattern("dd/MM")))
                .revenue(dayRevenue)
                .build());
        }

        return DashboardDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .deliveredOrders(deliveredOrders)
                .cancelledOrders(cancelledOrders)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .recentOrders(recentOrders)
                .recentProducts(recentProducts)
                .revenueByDate(revenueByDate)
                .build();
    }
}
