package com.hienstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {

    private BigDecimal totalRevenue;
    private long totalOrders;
    private long pendingOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private long totalCustomers;
    private long totalProducts;
    private List<RecentOrderDto> recentOrders;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrderDto {
        private Long id;
        private String customerName;
        private BigDecimal totalAmount;
        private String status;
        private String createdAt;
    }
}
