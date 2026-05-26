package com.hienstore.controller;

import com.hienstore.service.SiteSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SettingController {

    private final SiteSettingService siteSettingService;

    @GetMapping
    public ResponseEntity<Map<String, String>> getSettings() {
        return ResponseEntity.ok(siteSettingService.getAllSettings());
    }
}
