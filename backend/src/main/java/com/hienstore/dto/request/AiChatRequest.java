package com.hienstore.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class AiChatRequest {
    private List<AiMessage> messages;
}
