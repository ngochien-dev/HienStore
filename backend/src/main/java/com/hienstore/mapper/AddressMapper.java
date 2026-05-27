package com.hienstore.mapper;

import com.hienstore.dto.response.AddressDto;
import com.hienstore.entity.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    public AddressDto toDto(Address address) {
        if (address == null) return null;
        
        return AddressDto.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .streetNumber(address.getStreetNumber())
                .streetName(address.getStreetName())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .isDefault(address.getIsDefault())
                .fullAddress(address.getFullAddress())
                .build();
    }
}
