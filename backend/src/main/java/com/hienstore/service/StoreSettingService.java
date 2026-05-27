package com.hienstore.service;

import com.hienstore.dto.response.StoreSettingDto;
import com.hienstore.entity.StoreSetting;
import com.hienstore.repository.StoreSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StoreSettingService {

    private final StoreSettingRepository storeSettingRepository;

    @Transactional(readOnly = true)
    public StoreSettingDto getSettings() {
        StoreSetting setting = storeSettingRepository.findById(1L).orElse(new StoreSetting());
        return mapToDto(setting);
    }

    @Transactional
    public StoreSettingDto updateSettings(StoreSettingDto dto) {
        StoreSetting setting = storeSettingRepository.findById(1L).orElse(new StoreSetting());
        setting.setId(1L); // Force ID 1 for singleton
        setting.setStoreName(dto.getStoreName());
        setting.setStoreEmail(dto.getStoreEmail());
        setting.setStorePhone(dto.getStorePhone());
        setting.setStoreAddress(dto.getStoreAddress());
        setting.setFacebookUrl(dto.getFacebookUrl());
        setting.setInstagramUrl(dto.getInstagramUrl());
        
        return mapToDto(storeSettingRepository.save(setting));
    }

    private StoreSettingDto mapToDto(StoreSetting entity) {
        return StoreSettingDto.builder()
                .storeName(entity.getStoreName())
                .storeEmail(entity.getStoreEmail())
                .storePhone(entity.getStorePhone())
                .storeAddress(entity.getStoreAddress())
                .facebookUrl(entity.getFacebookUrl())
                .instagramUrl(entity.getInstagramUrl())
                .build();
    }
}
