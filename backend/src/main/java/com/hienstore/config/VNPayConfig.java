package com.hienstore.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class VNPayConfig {
    @Value("${vnpay.pay-url}")
    private String payUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    public static final String vnp_PayUrl = "vnp_PayUrl";
    public static final String vnp_ReturnUrl = "vnp_ReturnUrl";
    public static final String vnp_TmnCode = "vnp_TmnCode";
    public static final String vnp_HashSecret = "vnp_HashSecret";
    public static final String vnp_apiUrl = "vnp_apiUrl";
}
