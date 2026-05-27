package com.hienstore.mapper;

import com.hienstore.dto.response.NotificationDto;
import com.hienstore.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    public NotificationDto toDto(Notification notification) {
        if (notification == null) return null;
        
        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .type(notification.getType())
                .targetUrl(notification.getTargetUrl())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
