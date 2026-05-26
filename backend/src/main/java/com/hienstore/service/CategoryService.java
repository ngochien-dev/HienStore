package com.hienstore.service;

import com.hienstore.dto.response.CategoryDto;
import com.hienstore.entity.Category;
import com.hienstore.mapper.CategoryMapper;
import com.hienstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Cacheable(value = "categories", key = "'all'")
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryMapper.toDtoList(categoryRepository.findAll());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return categoryMapper.toDto(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public CategoryDto createCategory(com.hienstore.dto.request.CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();
        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }
    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public CategoryDto updateCategory(Long id, com.hienstore.dto.request.CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        
        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Soft delete or just toggle isActive
        category.setIsActive(!category.getIsActive());
        categoryRepository.save(category);
    }
}
