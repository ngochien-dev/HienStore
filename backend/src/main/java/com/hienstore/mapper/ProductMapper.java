package com.hienstore.mapper;

import com.hienstore.dto.response.ProductDto;
import com.hienstore.dto.response.ProductImageDto;
import com.hienstore.dto.response.ProductVariantDto;
import com.hienstore.entity.Product;
import com.hienstore.entity.ProductImage;
import com.hienstore.entity.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {
    
    ProductDto toDto(Product product);
    
    @Mapping(target = "category", ignore = true)
    Product toEntity(ProductDto productDto);

    List<ProductDto> toDtoList(List<Product> products);

    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.slug", target = "productSlug")
    @Mapping(target = "imageUrl", expression = "java(getVariantImageUrl(variant))")
    ProductVariantDto variantToDto(ProductVariant variant);

    default String getVariantImageUrl(ProductVariant variant) {
        if (variant == null) return null;
        if (variant.getImageUrl() != null && !variant.getImageUrl().trim().isEmpty()) {
            return variant.getImageUrl();
        }
        if (variant.getProduct() != null && variant.getProduct().getImages() != null) {
            return variant.getProduct().getImages().stream()
                    .filter(img -> img.getIsPrimary() != null && img.getIsPrimary())
                    .map(img -> img.getImageUrl())
                    .findFirst()
                    .orElse(variant.getProduct().getImages().stream()
                            .map(img -> img.getImageUrl())
                            .findFirst()
                            .orElse(null));
        }
        return null;
    }

    ProductVariant dtoToVariant(ProductVariantDto variantDto);

    ProductImageDto imageToDto(ProductImage image);
    ProductImage dtoToImage(ProductImageDto imageDto);
}
