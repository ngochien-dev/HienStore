package com.hienstore.repository;

import com.hienstore.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserAccountUsernameOrderByCreatedAtDesc(String username, Pageable pageable);
    
    Optional<Order> findByIdAndUserAccountUsername(Long id, String username);
}
