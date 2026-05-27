package com.hienstore.service;

import com.hienstore.dto.response.ProductDto;
import com.hienstore.entity.Product;
import com.hienstore.entity.User;
import com.hienstore.entity.Wishlist;
import com.hienstore.mapper.ProductMapper;
import com.hienstore.repository.ProductRepository;
import com.hienstore.repository.UserRepository;
import com.hienstore.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public Page<ProductDto> getUserWishlist(String username, Pageable pageable) {
        return wishlistRepository.findByUserAccountUsernameOrderByCreatedAtDesc(username, pageable)
                .map(wishlist -> productMapper.toDto(wishlist.getProduct()));
    }
    
    @Transactional(readOnly = true)
    public List<Long> getUserWishlistProductIds(String username) {
        return wishlistRepository.findByUserAccountUsernameOrderByCreatedAtDesc(username, Pageable.unpaged())
                .getContent().stream()
                .map(w -> w.getProduct().getId())
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleWishlist(String username, Long productId) {
        if (wishlistRepository.existsByUserAccountUsernameAndProductId(username, productId)) {
            Wishlist wishlist = wishlistRepository.findByUserAccountUsernameAndProductId(username, productId)
                    .orElseThrow(() -> new RuntimeException("Wishlist not found"));
            wishlistRepository.delete(wishlist);
        } else {
            User user = userRepository.findByAccountUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
                    
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(wishlist);
        }
    }
}
