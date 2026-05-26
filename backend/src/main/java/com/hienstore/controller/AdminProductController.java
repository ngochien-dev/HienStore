package com.hienstore.controller;

import com.hienstore.dto.request.ProductRequest;
import com.hienstore.dto.response.ProductDto;
import com.hienstore.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductDto product = productService.createProduct(request);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        ProductDto product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
