package com.hienstore.controller;

import com.hienstore.dto.request.ChatRequest;
import com.hienstore.dto.response.ChatMessageDto;
import com.hienstore.entity.ChatMessage;
import com.hienstore.entity.User;
import com.hienstore.repository.ChatMessageRepository;
import com.hienstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    // WebSocket Endpoint: Client sends to /app/chat
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatRequest chatRequest, Principal principal) {
        String senderEmail = principal.getName();
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
                
        User recipient;
        if (chatRequest.getRecipientEmail() == null || chatRequest.getRecipientEmail().isEmpty()) {
            // User sending to admin, find an admin
            recipient = userRepository.findAll().stream()
                    .filter(u -> u.getAccount().getRole().name().equals("ADMIN"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
        } else {
            recipient = userRepository.findByEmail(chatRequest.getRecipientEmail())
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .sender(sender)
                .recipient(recipient)
                .content(chatRequest.getContent())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        ChatMessage savedMsg = chatMessageRepository.save(chatMessage);
        
        ChatMessageDto dto = ChatMessageDto.builder()
                .id(savedMsg.getId())
                .senderEmail(sender.getEmail())
                .senderName(sender.getFullName())
                .recipientEmail(recipient.getEmail())
                .content(savedMsg.getContent())
                .timestamp(savedMsg.getTimestamp())
                .isRead(false)
                .build();

        // Send to recipient
        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(), "/queue/messages", dto
        );
        
        // Also send back to sender to confirm
        messagingTemplate.convertAndSendToUser(
                sender.getEmail(), "/queue/messages", dto
        );
    }

    // REST endpoints to load history
    @GetMapping("/api/chat/history/{userEmail}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(Principal principal, @PathVariable String userEmail) {
        User currentUser = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User targetUser;
        if (userEmail.equals("admin")) {
             targetUser = userRepository.findAll().stream()
                    .filter(u -> u.getAccount().getRole().name().equals("ADMIN"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
        } else {
             targetUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        List<ChatMessage> messages = chatMessageRepository.findChatHistory(currentUser.getId(), targetUser.getId());
        
        return ResponseEntity.ok(messages.stream().map(m -> ChatMessageDto.builder()
                .id(m.getId())
                .senderEmail(m.getSender().getEmail())
                .senderName(m.getSender().getFullName())
                .recipientEmail(m.getRecipient().getEmail())
                .content(m.getContent())
                .timestamp(m.getTimestamp())
                .isRead(m.getIsRead())
                .build()).collect(Collectors.toList()));
    }

    @GetMapping("/api/chat/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getChattedUsers(Principal principal) {
        User admin = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
                
        List<String> emails = chatMessageRepository.findChattedUserEmails(admin.getId());
        
        List<UserDto> users = emails.stream()
            .map(email -> userRepository.findByEmail(email).orElse(null))
            .filter(java.util.Objects::nonNull)
            .map(u -> new UserDto(u.getEmail(), u.getFullName(), u.getAvatar()))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(users);
    }
    
    @lombok.Data
    @lombok.AllArgsConstructor
    static class UserDto {
        private String email;
        private String fullName;
        private String avatar;
    }
}
