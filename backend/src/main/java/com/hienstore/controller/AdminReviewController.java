package com.hienstore.controller;

import com.hienstore.dto.response.ReviewDto;
import com.hienstore.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminReviewController {

    private final ReviewService reviewService;

    // Get all reviews (Optional pagination for admin)
    @GetMapping
    public ResponseEntity<Page<ReviewDto>> getAllReviews(Pageable pageable) {
        return ResponseEntity.ok(reviewService.getAllReviews(pageable));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id, null, true);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<ReviewDto> replyToReview(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String replyText = body.get("replyText");
        if (replyText == null || replyText.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reviewService.replyToReview(id, replyText));
    }

    @PutMapping("/{id}/toggle-hide")
    public ResponseEntity<ReviewDto> toggleHideReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.toggleHideReview(id));
    }
}
