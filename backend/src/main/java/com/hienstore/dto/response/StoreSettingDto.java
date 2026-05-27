package com.hienstore.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreSettingDto {
    private String storeName;
    private String storeEmail;
    private String storePhone;
    private String storeAddress;
    private String facebookUrl;
    private String instagramUrl;
}
