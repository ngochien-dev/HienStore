package com.hienstore.config;

import com.hienstore.entity.User;
import com.hienstore.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrator");
            admin.setRole("ROLE_ADMIN");
            admin.setStatus("ACTIVE");
            
            userRepository.save(admin);
            System.out.println("✅ MẶC ĐỊNH TẠO TÀI KHOẢN ADMIN THÀNH CÔNG: admin / admin123");
        }
    }
}
