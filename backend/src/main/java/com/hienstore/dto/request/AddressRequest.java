package com.hienstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;
    
    private String streetNumber;
    
    @NotBlank(message = "Tên đường không được để trống")
    private String streetName;
    
    @NotBlank(message = "Phường/Xã không được để trống")
    private String ward;
    
    @NotBlank(message = "Quận/Huyện không được để trống")
    private String district;
    
    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    private String city;
    
    private Boolean isDefault;
}
