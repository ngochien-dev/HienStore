package com.hienstore.controller;

import com.hienstore.dto.response.DashboardStatsDto;
import com.hienstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "Admin Dashboard Statistics")
public class AdminDashboardController {

    private final OrderService orderService;

    @Operation(summary = "Get dashboard statistics")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(orderService.getDashboardStats());
    }
}
