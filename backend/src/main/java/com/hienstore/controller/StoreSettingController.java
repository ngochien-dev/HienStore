package com.hienstore.controller;

import com.hienstore.dto.response.StoreSettingDto;
import com.hienstore.service.StoreSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class StoreSettingController {

    private final StoreSettingService storeSettingService;

    @GetMapping
    public ResponseEntity<StoreSettingDto> getSettings() {
        return ResponseEntity.ok(storeSettingService.getSettings());
    }
}
