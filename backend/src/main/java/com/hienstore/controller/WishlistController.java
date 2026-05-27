package com.hienstore.controller;

import com.hienstore.dto.response.ProductDto;
import com.hienstore.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist Management")
public class WishlistController {

    private final WishlistService wishlistService;

    @Operation(summary = "Get user's wishlist products")
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getUserWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(wishlistService.getUserWishlist(userDetails.getUsername(), pageable));
    }
    
    @Operation(summary = "Get user's wishlist product IDs")
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getUserWishlistProductIds(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(wishlistService.getUserWishlistProductIds(userDetails.getUsername()));
    }

    @Operation(summary = "Toggle product in wishlist")
    @PostMapping("/{productId}/toggle")
    public ResponseEntity<Void> toggleWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        wishlistService.toggleWishlist(userDetails.getUsername(), productId);
        return ResponseEntity.ok().build();
    }
}
