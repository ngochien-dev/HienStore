package com.hienstore.controller;

import com.hienstore.dto.response.StoreSettingDto;
import com.hienstore.service.StoreSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminStoreSettingController {

    private final StoreSettingService storeSettingService;

    @GetMapping
    public ResponseEntity<StoreSettingDto> getSettings() {
        return ResponseEntity.ok(storeSettingService.getSettings());
    }

    @PutMapping
    public ResponseEntity<StoreSettingDto> updateSettings(@RequestBody StoreSettingDto dto) {
        return ResponseEntity.ok(storeSettingService.updateSettings(dto));
    }
}
