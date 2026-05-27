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
                .adminReply(review.getAdminReply())
                .repliedAt(review.getRepliedAt())
                .build();
    }
}
