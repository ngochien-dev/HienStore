package com.hienstore.controller;

import com.hienstore.dto.response.NotificationDto;
import com.hienstore.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification", description = "In-App Notifications API")
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Get user notifications")
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<NotificationDto>> getUserNotifications(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(notificationService.getUserNotifications(principal.getName(), PageRequest.of(page, size)));
    }

    @Operation(summary = "Count unread notifications")
    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> countUnreadNotifications(Principal principal) {
        long count = notificationService.countUnreadNotifications(principal.getName());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @Operation(summary = "Mark notification as read")
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(Principal principal, @PathVariable Long id) {
        notificationService.markAsRead(principal.getName(), id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Mark all notifications as read")
    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
        return ResponseEntity.ok().build();
    }
}
