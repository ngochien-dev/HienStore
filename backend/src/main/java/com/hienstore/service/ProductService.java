package com.hienstore.service;

import com.hienstore.dto.response.ProductDto;
import com.hienstore.entity.Product;
import com.hienstore.mapper.ProductMapper;
import com.hienstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final com.hienstore.repository.CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<ProductDto> getPublishedProducts(Pageable pageable) {
        return productRepository.findByIsPublishedTrue(pageable)
                .map(productMapper::toDto);
    }

    @Cacheable(value = "products", key = "#slug")
    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return productMapper.toDto(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndIsPublishedTrue(categoryId, pageable)
                .map(productMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable)
                .map(productMapper::toDto);
    }

    @Transactional
    public ProductDto createProduct(com.hienstore.dto.request.ProductRequest request) {
        com.hienstore.entity.Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .basePrice(request.getBasePrice())
                .category(category)
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .build();

        // Save first to generate product ID
        product = productRepository.save(product);

        // Process images
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            java.util.List<com.hienstore.entity.ProductImage> images = new java.util.ArrayList<>();
            boolean isFirst = true;
            for (String imgUrl : request.getImages()) {
                if (imgUrl != null && !imgUrl.trim().isEmpty()) {
                    images.add(com.hienstore.entity.ProductImage.builder()
                            .product(product)
                            .imageUrl(imgUrl.trim())
                            .isPrimary(isFirst)
                            .build());
                    isFirst = false;
                }
            }
            product.setImages(images);
        }

        // Process default variant / stock quantity
        Integer stock = request.getStockQuantity() != null ? request.getStockQuantity() : 0;
        java.util.List<com.hienstore.entity.ProductVariant> variants = new java.util.ArrayList<>();
        variants.add(com.hienstore.entity.ProductVariant.builder()
                .product(product)
                .sku("SKU-" + product.getSlug().toUpperCase() + "-" + System.currentTimeMillis())
                .color("Freesize")
                .size("Freesize")
                .price(product.getBasePrice())
                .stockQuantity(stock)
                .build());
        product.setVariants(variants);

        product = productRepository.save(product);
        return productMapper.toDto(product);
    }

    @Transactional
    public ProductDto updateProduct(Long id, com.hienstore.dto.request.ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        com.hienstore.entity.Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setBasePrice(request.getBasePrice());
        product.setCategory(category);
        if (request.getIsPublished() != null) {
            product.setIsPublished(request.getIsPublished());
        }

        // Update images
        if (request.getImages() != null) {
            product.getImages().clear();
            boolean isFirst = true;
            for (String imgUrl : request.getImages()) {
                if (imgUrl != null && !imgUrl.trim().isEmpty()) {
                    product.getImages().add(com.hienstore.entity.ProductImage.builder()
                            .product(product)
                            .imageUrl(imgUrl.trim())
                            .isPrimary(isFirst)
                            .build());
                    isFirst = false;
                }
            }
        }

        // Update stock
        if (request.getStockQuantity() != null) {
            if (product.getVariants() != null && !product.getVariants().isEmpty()) {
                com.hienstore.entity.ProductVariant variant = product.getVariants().get(0);
                variant.setStockQuantity(request.getStockQuantity());
                variant.setPrice(request.getBasePrice());
            } else {
                java.util.List<com.hienstore.entity.ProductVariant> variants = new java.util.ArrayList<>();
                variants.add(com.hienstore.entity.ProductVariant.builder()
                        .product(product)
                        .sku("SKU-" + product.getSlug().toUpperCase() + "-" + System.currentTimeMillis())
                        .color("Freesize")
                        .size("Freesize")
                        .price(product.getBasePrice())
                        .stockQuantity(request.getStockQuantity())
                        .build());
                product.setVariants(variants);
            }
        }

        product = productRepository.save(product);
        return productMapper.toDto(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
}
