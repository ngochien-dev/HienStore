package com.hienstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {
    private Long id;
    private ProductVariantDto productVariant;
    private Integer quantity;
    private BigDecimal subTotal; // quantity * productVariant.price
}
