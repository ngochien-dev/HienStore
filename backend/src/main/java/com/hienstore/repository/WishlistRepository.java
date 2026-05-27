package com.hienstore.repository;

import com.hienstore.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Page<Wishlist> findByUserAccountUsernameOrderByCreatedAtDesc(String username, Pageable pageable);
    
    Optional<Wishlist> findByUserAccountUsernameAndProductId(String username, Long productId);
    
    boolean existsByUserAccountUsernameAndProductId(String username, Long productId);
}
