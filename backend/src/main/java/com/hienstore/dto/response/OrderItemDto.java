package com.hienstore.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private Long id;
    private Integer quantity;
    private BigDecimal price;
    private ProductVariantDto productVariant;
}
