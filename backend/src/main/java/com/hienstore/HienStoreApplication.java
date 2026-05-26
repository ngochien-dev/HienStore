package com.hienstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class HienStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(HienStoreApplication.class, args);
    }
}
