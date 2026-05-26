package com.hienstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal basePrice;
    private Boolean isPublished;
    private CategoryDto category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductVariantDto> variants;
    private List<ProductImageDto> images;
}
