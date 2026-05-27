package com.hienstore.mapper;

import com.hienstore.dto.response.ReviewDto;
import com.hienstore.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewDto toDto(Review review) {
        if (review == null) {
            return null;
        }

        return ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFirstName() + " " + review.getUser().getLastName())
                .userAvatar(review.getUser().getAvatar())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .imageUrl(review.getImageUrl())
                .isHidden(review.getIsHidden())
                .replies(review.getReplies() != null ? review.getReplies().stream().map(reply -> com.hienstore.dto.response.ReviewReplyDto.builder()
                        .id(reply.getId())
                        .userName(reply.getUser().getFirstName() + " " + reply.getUser().getLastName())
                        .userEmail(reply.getUser().getEmail())
                        .userRole(reply.getUser().getAccount().getRole().name())
                        .userAvatar(reply.getUser().getAvatar())
                        .content(reply.getContent())
                        .createdAt(reply.getCreatedAt())
                        .build()).collect(java.util.stream.Collectors.toList()) : new java.util.ArrayList<>())
                .build();
    }
}
