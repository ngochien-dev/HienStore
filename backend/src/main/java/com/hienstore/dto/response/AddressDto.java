package com.hienstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private Long id;
    private String fullName;
    private String phone;
    private String streetNumber;
    private String streetName;
    private String ward;
    private String district;
    private String city;
    private Boolean isDefault;
    private String fullAddress;
}
