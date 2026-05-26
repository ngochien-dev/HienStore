package com.hienstore.service;

import com.hienstore.entity.SiteSetting;
import com.hienstore.repository.SiteSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteSettingService {

    private final SiteSettingRepository siteSettingRepository;

    @Cacheable("siteSettings")
    @Transactional(readOnly = true)
    public Map<String, String> getAllSettings() {
        return siteSettingRepository.findAll().stream()
                .collect(Collectors.toMap(SiteSetting::getSettingKey, SiteSetting::getSettingValue));
    }

    @CacheEvict(value = "siteSettings", allEntries = true)
    @Transactional
    public void updateSettings(Map<String, String> settings) {
        settings.forEach((key, value) -> {
            SiteSetting setting = siteSettingRepository.findById(key)
                    .orElse(SiteSetting.builder().settingKey(key).build());
            setting.setSettingValue(value);
            siteSettingRepository.save(setting);
        });
    }
}
