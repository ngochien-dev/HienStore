package com.hienstore.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariantRequest {
    private Long id; // null for new variants
    private String color;
    private String size;
    private String sku;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private String imageUrl;
}
