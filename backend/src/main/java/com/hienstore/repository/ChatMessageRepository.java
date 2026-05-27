package com.hienstore.repository;

import com.hienstore.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE (m.sender.id = :user1Id AND m.recipient.id = :user2Id) OR (m.sender.id = :user2Id AND m.recipient.id = :user1Id) ORDER BY m.timestamp ASC")
    List<ChatMessage> findChatHistory(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    // For admin to get all users they have chatted with or received messages from
    @Query("SELECT DISTINCT u.email FROM ChatMessage m JOIN User u ON (m.sender.id = u.id OR m.recipient.id = u.id) WHERE u.id != :adminId")
    List<String> findChattedUserEmails(@Param("adminId") Long adminId);
}
