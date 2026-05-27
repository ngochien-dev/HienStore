package com.hienstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;

@SpringBootApplication
@EnableCaching
public class HienStoreApplication {

    @Autowired
    private CacheManager cacheManager;

    public static void main(String[] args) {
        SpringApplication.run(HienStoreApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void clearCacheOnStartup() {
        cacheManager.getCacheNames().forEach(cacheName -> cacheManager.getCache(cacheName).clear());
        System.out.println("Cleared all caches on startup to sync with database.");
    }
}
