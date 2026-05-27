package com.hienstore.service;

import com.hienstore.dto.request.ReviewRequest;
import com.hienstore.dto.response.ReviewDto;
import com.hienstore.entity.Product;
import com.hienstore.entity.Review;
import com.hienstore.entity.User;
import com.hienstore.mapper.ReviewMapper;
import com.hienstore.repository.ProductRepository;
import com.hienstore.repository.ReviewRepository;
import com.hienstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final com.hienstore.repository.OrderRepository orderRepository;
    private final ReviewMapper reviewMapper;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public Page<ReviewDto> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductIdAndIsHiddenFalseOrderByCreatedAtDesc(productId, pageable)
                .map(reviewMapper::toDto);
    }
    
    @Transactional(readOnly = true)
    public Page<ReviewDto> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(reviewMapper::toDto);
    }

    @Transactional
    public ReviewDto createReview(String username, ReviewRequest request) {
        User user = userRepository.findByAccountUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // User can only review a product once
        if (reviewRepository.existsByProductIdAndUserId(product.getId(), user.getId())) {
            throw new RuntimeException("Bạn đã đánh giá sản phẩm này rồi.");
        }
        
        // User must have bought the product
        if (!orderRepository.hasUserBoughtProduct(user.getId(), product.getId(), com.hienstore.entity.OrderStatus.DELIVERED)) {
            throw new RuntimeException("Bạn cần mua và nhận được sản phẩm này trước khi đánh giá.");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .imageUrl(request.getImageUrl())
                .isHidden(false)
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update product rating
        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId()).orElse(0.0);
        long reviewCount = reviewRepository.countByProductId(product.getId());
        
        product.setAverageRating(avgRating);
        product.setReviewCount(reviewCount);
        productRepository.save(product);
        
        return reviewMapper.toDto(savedReview);
    }

    private void recalculateProductRating(Product product) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId()).orElse(0.0);
        long reviewCount = reviewRepository.countByProductId(product.getId());
        
        product.setAverageRating(avgRating);
        product.setReviewCount(reviewCount);
        productRepository.save(product);
    }

    @Transactional
    public ReviewDto updateReview(Long reviewId, ReviewRequest request, String username) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getAccount().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền sửa đánh giá này");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setImageUrl(request.getImageUrl());
        
        Review savedReview = reviewRepository.save(review);
        recalculateProductRating(review.getProduct());
        
        return reviewMapper.toDto(savedReview);
    }

    @Transactional
    public void deleteReview(Long reviewId, String username, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!isAdmin && !review.getUser().getAccount().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền xóa đánh giá này");
        }

        Product product = review.getProduct();
        reviewRepository.deleteById(reviewId);
        recalculateProductRating(product);
    }

    @Transactional
    public ReviewDto toggleHideReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
                
        review.setIsHidden(!review.getIsHidden());
        Review savedReview = reviewRepository.save(review);
        
        recalculateProductRating(review.getProduct());
        return reviewMapper.toDto(savedReview);
    }

    @Transactional
    public ReviewDto replyToReview(Long reviewId, String replyText) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setAdminReply(replyText);
        review.setRepliedAt(java.time.LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);

        User user = review.getUser();

        // In-App Notification
        notificationService.createNotification(
            user,
            "Quản trị viên đã trả lời",
            "Quản trị viên vừa trả lời đánh giá của bạn cho sản phẩm " + review.getProduct().getName(),
            "REVIEW_REPLY",
            "/product/" + review.getProduct().getSlug()
        );

        // Send email notification to user
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            String fullName = user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : "");
            emailService.sendReviewReplyEmail(
                user.getEmail(),
                fullName,
                review.getProduct().getName(),
                replyText
            );
        }

        return reviewMapper.toDto(savedReview);
    }
}
