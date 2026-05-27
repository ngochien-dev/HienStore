package com.hienstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponRequest {
    @NotBlank
    private String code;

    @NotBlank
    private String discountType;

    @NotNull
    private BigDecimal discountValue;

    @NotNull
    private BigDecimal minOrderValue;

    private BigDecimal maxDiscountAmount;

    private LocalDateTime expiryDate;

    private Integer usageLimit;

    private Boolean isActive;
}
