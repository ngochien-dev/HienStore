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

    ProductVariantDto variantToDto(ProductVariant variant);
    ProductVariant dtoToVariant(ProductVariantDto variantDto);

    ProductImageDto imageToDto(ProductImage image);
    ProductImage dtoToImage(ProductImageDto imageDto);
}
