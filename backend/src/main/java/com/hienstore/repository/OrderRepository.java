package com.hienstore.repository;

import com.hienstore.entity.Order;
import com.hienstore.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserAccountUsernameOrderByCreatedAtDesc(String username, Pageable pageable);
    
    Optional<Order> findByIdAndUserAccountUsername(Long id, String username);

    // Admin: findAll with eager fetching to avoid LazyInitializationException
    @EntityGraph(attributePaths = {"items", "items.productVariant", "items.productVariant.product", "items.productVariant.product.images"})
    @Query("SELECT o FROM Order o")
    Page<Order> findAllWithDetails(Pageable pageable);

    // Dashboard queries
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status <> 'CANCELLED'")
    BigDecimal sumTotalRevenueExcludingCancelled();

    long countByStatus(OrderStatus status);

    List<Order> findTop10ByOrderByCreatedAtDesc();

    List<Order> findByCreatedAtAfterAndStatusNot(java.time.LocalDateTime startDate, OrderStatus status);

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i WHERE o.user.id = :userId AND i.productVariant.product.id = :productId AND o.status = 'DELIVERED'")
    boolean hasUserBoughtProduct(@org.springframework.data.repository.query.Param("userId") Long userId, @org.springframework.data.repository.query.Param("productId") Long productId);
}
