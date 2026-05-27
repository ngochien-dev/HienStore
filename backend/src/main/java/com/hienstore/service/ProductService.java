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
import org.springframework.cache.annotation.CacheEvict;

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

    @Transactional(readOnly = true)
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(productMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> searchAllProducts(String keyword, Pageable pageable) {
        return productRepository.searchAllProducts(keyword, pageable).map(productMapper::toDto);
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

    @Transactional(readOnly = true)
    public Page<ProductDto> filterProducts(Long categoryId, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, String keyword, Pageable pageable) {
        return productRepository.filterProducts(categoryId, minPrice, maxPrice, keyword != null && !keyword.trim().isEmpty() ? keyword.trim() : null, pageable)
                .map(productMapper::toDto);
    }

    @CacheEvict(value = "products", allEntries = true)
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

        // Process variants / stock quantity
        java.util.List<com.hienstore.entity.ProductVariant> variants = new java.util.ArrayList<>();
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (com.hienstore.dto.request.ProductVariantRequest vr : request.getVariants()) {
                String sku = (vr.getSku() != null && !vr.getSku().trim().isEmpty()) ? vr.getSku() : "SKU-" + product.getSlug().toUpperCase() + "-" + (vr.getColor() != null ? vr.getColor().toUpperCase() : "FS") + "-" + (vr.getSize() != null ? vr.getSize().toUpperCase() : "FS") + "-" + System.currentTimeMillis();
                variants.add(com.hienstore.entity.ProductVariant.builder()
                        .product(product)
                        .color(vr.getColor() != null && !vr.getColor().trim().isEmpty() ? vr.getColor() : "Freesize")
                        .size(vr.getSize() != null && !vr.getSize().trim().isEmpty() ? vr.getSize() : "Freesize")
                        .sku(sku)
                        .price(vr.getPrice() != null ? vr.getPrice() : product.getBasePrice())
                        .stockQuantity(vr.getStockQuantity() != null ? vr.getStockQuantity() : 0)
                        .imageUrl(vr.getImageUrl())
                        .build());
            }
        } else {
            Integer stock = request.getStockQuantity() != null ? request.getStockQuantity() : 0;
            variants.add(com.hienstore.entity.ProductVariant.builder()
                    .product(product)
                    .sku("SKU-" + product.getSlug().toUpperCase() + "-" + System.currentTimeMillis())
                    .color("Freesize")
                    .size("Freesize")
                    .price(product.getBasePrice())
                    .stockQuantity(stock)
                    .build());
        }
        product.setVariants(variants);

        product = productRepository.save(product);
        return productMapper.toDto(product);
    }

    @CacheEvict(value = "products", allEntries = true)
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

        // Update variants / stock
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            java.util.List<com.hienstore.entity.ProductVariant> currentVariants = product.getVariants();
            java.util.List<com.hienstore.entity.ProductVariant> toKeep = new java.util.ArrayList<>();

            for (com.hienstore.dto.request.ProductVariantRequest vr : request.getVariants()) {
                com.hienstore.entity.ProductVariant variant = null;
                if (vr.getId() != null) {
                    variant = currentVariants.stream()
                            .filter(v -> v.getId().equals(vr.getId()))
                            .findFirst()
                            .orElse(null);
                }

                if (variant == null) {
                    String sku = (vr.getSku() != null && !vr.getSku().trim().isEmpty()) ? vr.getSku() : "SKU-" + product.getSlug().toUpperCase() + "-" + (vr.getColor() != null ? vr.getColor().toUpperCase() : "FS") + "-" + (vr.getSize() != null ? vr.getSize().toUpperCase() : "FS") + "-" + System.currentTimeMillis();
                    variant = com.hienstore.entity.ProductVariant.builder()
                            .product(product)
                            .color(vr.getColor() != null && !vr.getColor().trim().isEmpty() ? vr.getColor() : "Freesize")
                            .size(vr.getSize() != null && !vr.getSize().trim().isEmpty() ? vr.getSize() : "Freesize")
                            .sku(sku)
                            .price(vr.getPrice() != null ? vr.getPrice() : product.getBasePrice())
                            .stockQuantity(vr.getStockQuantity() != null ? vr.getStockQuantity() : 0)
                            .imageUrl(vr.getImageUrl())
                            .build();
                } else {
                    variant.setColor(vr.getColor() != null && !vr.getColor().trim().isEmpty() ? vr.getColor() : "Freesize");
                    variant.setSize(vr.getSize() != null && !vr.getSize().trim().isEmpty() ? vr.getSize() : "Freesize");
                    if (vr.getSku() != null && !vr.getSku().trim().isEmpty()) {
                        variant.setSku(vr.getSku());
                    }
                    variant.setPrice(vr.getPrice() != null ? vr.getPrice() : product.getBasePrice());
                    variant.setStockQuantity(vr.getStockQuantity() != null ? vr.getStockQuantity() : 0);
                    variant.setImageUrl(vr.getImageUrl());
                }
                toKeep.add(variant);
            }

            // Remove orphans
            currentVariants.removeIf(v -> !toKeep.contains(v));

            // Add new ones or keep existing
            for (com.hienstore.entity.ProductVariant v : toKeep) {
                if (!currentVariants.contains(v)) {
                    currentVariants.add(v);
                }
            }
        } else if (request.getStockQuantity() != null) {
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

    @CacheEvict(value = "products", allEntries = true)
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
}
