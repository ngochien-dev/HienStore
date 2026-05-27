package com.hienstore.dto.request;

import lombok.Data;

@Data
public class AiMessage {
    private String role; // "user" or "model"
    private String content;
}
