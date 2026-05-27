package com.hienstore.controller;

import com.hienstore.dto.request.ReviewRequest;
import com.hienstore.dto.response.ReviewDto;
import com.hienstore.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<ReviewDto>> getProductReviews(
            @PathVariable Long productId,
            Pageable pageable) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId, pageable));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDto> createReview(
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reviewService.createReview(authentication.getName(), request));
    }

    @PostMapping("/{reviewId}/reply")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDto> replyToReview(
            @PathVariable Long reviewId,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        String replyText = payload.get("reply");
        if (replyText == null || replyText.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        ReviewDto reviewDto = reviewService.replyToReview(reviewId, replyText, principal.getName());
        return ResponseEntity.ok(reviewDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDto> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reviewService.updateReview(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            Authentication authentication) {
        reviewService.deleteReview(id, authentication.getName(), false);
        return ResponseEntity.ok().build();
    }
}
