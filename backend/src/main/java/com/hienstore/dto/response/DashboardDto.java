package com.hienstore.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardDto {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long pendingOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Long totalCustomers;
    private Long totalProducts;
    
    private List<RevenueByDate> revenueByDate;
    private List<OrderDto> recentOrders;
    private List<ProductDto> recentProducts;
    
    @Data
    @Builder
    public static class RevenueByDate {
        private String date;
        private BigDecimal revenue;
    }
}
