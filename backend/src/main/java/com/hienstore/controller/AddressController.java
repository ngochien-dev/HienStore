package com.hienstore.controller;

import com.hienstore.dto.request.AddressRequest;
import com.hienstore.dto.response.AddressDto;
import com.hienstore.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Tag(name = "Address", description = "Address Management API for User")
public class AddressController {

    private final AddressService addressService;

    @Operation(summary = "Get user addresses")
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AddressDto>> getUserAddresses(Principal principal) {
        return ResponseEntity.ok(addressService.getUserAddresses(principal.getName()));
    }

    @Operation(summary = "Create new address")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressDto> createAddress(
            Principal principal,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(addressService.createAddress(principal.getName(), request));
    }

    @Operation(summary = "Update address")
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressDto> updateAddress(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.updateAddress(principal.getName(), id, request));
    }

    @Operation(summary = "Delete address")
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteAddress(
            Principal principal,
            @PathVariable Long id) {
        addressService.deleteAddress(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
