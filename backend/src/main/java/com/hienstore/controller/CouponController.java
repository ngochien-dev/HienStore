package com.hienstore.controller;

import com.hienstore.dto.response.CouponDto;
import com.hienstore.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/validate")
    public ResponseEntity<CouponDto> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal orderValue) {
        return ResponseEntity.ok(couponService.validateCoupon(code, orderValue));
    }

    @GetMapping("/active")
    public ResponseEntity<java.util.List<CouponDto>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }
}
