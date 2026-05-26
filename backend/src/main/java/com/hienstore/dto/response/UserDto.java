package com.hienstore.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String userType;
    private Boolean isEmailVerified;
    private Boolean isPhoneVerified;
    private LocalDateTime createdAt;
    
    // Account details
    private String username;
    private String role;
    private Boolean isEnabled;
}
