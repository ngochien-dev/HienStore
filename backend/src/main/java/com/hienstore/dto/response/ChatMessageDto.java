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
public class ChatMessageDto {
    private Long id;
    private String senderEmail;
    private String senderName;
    private String recipientEmail;
    private String content;
    private LocalDateTime timestamp;
    private Boolean isRead;
}
