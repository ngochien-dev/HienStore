package com.hienstore.service;

import com.hienstore.dto.request.AddToCartRequest;
import com.hienstore.dto.response.CartDto;
import com.hienstore.entity.Cart;
import com.hienstore.entity.CartItem;
import com.hienstore.entity.ProductVariant;
import com.hienstore.entity.User;
import com.hienstore.mapper.CartMapper;
import com.hienstore.repository.CartRepository;
import com.hienstore.repository.ProductVariantRepository;
import com.hienstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository variantRepository;
    private final CartMapper cartMapper;

    @Transactional
    public CartDto getCart(String username) {
        Cart cart = getOrCreateCart(username);
        return cartMapper.toDto(cart);
    }

    @Transactional
    public CartDto addToCart(String username, AddToCartRequest request) {
        Cart cart = getOrCreateCart(username);
        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock available");
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProductVariant().getId().equals(variant.getId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (variant.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Not enough stock available for this quantity");
            }
            existingItem.setQuantity(newQuantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .productVariant(variant)
                    .quantity(request.getQuantity())
                    .build();
            cart.addItem(newItem);
        }

        cartRepository.save(cart);
        return cartMapper.toDto(cart);
    }

    @Transactional
    public CartDto updateItemQuantity(String username, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(username);
        
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cart.removeItem(item);
        } else {
            if (item.getProductVariant().getStockQuantity() < quantity) {
                throw new RuntimeException("Not enough stock available");
            }
            item.setQuantity(quantity);
        }

        cartRepository.save(cart);
        return cartMapper.toDto(cart);
    }

    @Transactional
    public CartDto removeItem(String username, Long itemId) {
        Cart cart = getOrCreateCart(username);
        
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));
                
        cart.removeItem(item);
        cartRepository.save(cart);
        return cartMapper.toDto(cart);
    }

    @Transactional
    public void clearCart(String username) {
        Cart cart = getOrCreateCart(username);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(String username) {
        User user = userRepository.findByAccountUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = Cart.builder()
                    .user(user)
                    .build();
            return cartRepository.save(newCart);
        });
    }
}
