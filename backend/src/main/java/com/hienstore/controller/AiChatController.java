package com.hienstore.controller;

import com.hienstore.dto.request.AiChatRequest;
import com.hienstore.service.GeminiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat/ai")
@RequiredArgsConstructor
@Tag(name = "AI Chat", description = "AI Shopping Assistant via Gemini API")
public class AiChatController {

    private final GeminiService geminiService;

    @Operation(summary = "Chat with AI Assistant")
    @PostMapping
    public ResponseEntity<String> chatWithAi(@RequestBody AiChatRequest request) {
        String response = geminiService.generateChatResponse(request);
        return ResponseEntity.ok(response);
    }
}
