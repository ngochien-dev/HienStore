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
