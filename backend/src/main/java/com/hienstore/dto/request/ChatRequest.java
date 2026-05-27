package com.hienstore.dto.request;

import lombok.Data;

@Data
public class ChatRequest {
    private String recipientEmail;
    private String content;
}
