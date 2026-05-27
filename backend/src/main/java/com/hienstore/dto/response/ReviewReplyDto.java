package com.hienstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReplyDto {
    private Long id;
    private String userName;
    private String userEmail;
    private String userRole;
    private String userAvatar;
    private String content;
    private LocalDateTime createdAt;
}
