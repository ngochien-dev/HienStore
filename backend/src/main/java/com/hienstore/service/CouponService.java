package com.hienstore.service;

import com.hienstore.dto.request.CouponRequest;
import com.hienstore.dto.response.CouponDto;
import com.hienstore.entity.Coupon;
import com.hienstore.mapper.CouponMapper;
import com.hienstore.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponService {
    
    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;

    @Transactional(readOnly = true)
    public Page<CouponDto> getAllCoupons(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return couponRepository.searchCoupons(keyword.trim(), pageable).map(couponMapper::toDto);
        }
        return couponRepository.findAll(pageable).map(couponMapper::toDto);
    }

    @Transactional(readOnly = true)
    public java.util.List<CouponDto> getActiveCoupons() {
        return couponRepository.findActiveCoupons().stream().map(couponMapper::toDto).collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public CouponDto createCoupon(CouponRequest request) {
        if (couponRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Mã giảm giá đã tồn tại");
        }
        
        Coupon coupon = new Coupon();
        couponMapper.updateEntity(coupon, request);
        return couponMapper.toDto(couponRepository.save(coupon));
    }

    @Transactional
    public CouponDto updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá"));
                
        // Check code uniqueness if changed
        if (!coupon.getCode().equals(request.getCode()) && couponRepository.findByCode(request.getCode()).isPresent()) {
            throw new RuntimeException("Mã giảm giá đã tồn tại");
        }
        
        couponMapper.updateEntity(coupon, request);
        return couponMapper.toDto(couponRepository.save(coupon));
    }

    @Transactional
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public CouponDto validateCoupon(String code, BigDecimal orderValue) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));
                
        if (!coupon.getIsActive()) {
            throw new RuntimeException("Mã giảm giá đã bị vô hiệu hóa");
        }
        
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn");
        }
        
        if (coupon.getUsageLimit() > 0 && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");
        }
        
        if (coupon.getMinOrderValue().compareTo(orderValue) > 0) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã này");
        }
        
        return couponMapper.toDto(coupon);
    }
}
