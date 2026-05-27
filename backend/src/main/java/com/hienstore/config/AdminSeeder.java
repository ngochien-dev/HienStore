package com.hienstore.config;

import com.hienstore.entity.Account;
import com.hienstore.entity.User;
import com.hienstore.enums.Role;
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
        if (userRepository.findByEmail("admin@hienstore.com").isEmpty()) {
            Account adminAccount = Account.builder()
                    .username("admin@hienstore.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isEnabled(true)
                    .build();

            User admin = User.builder()
                    .email("admin@hienstore.com")
                    .firstName("Admin")
                    .lastName("HienStore")
                    .account(adminAccount)
                    .build();
            
            userRepository.save(admin);
            System.out.println("✅ MẶC ĐỊNH TẠO TÀI KHOẢN ADMIN THÀNH CÔNG: admin@hienstore.com / admin123");
        }

        if (userRepository.findByEmail("user@hienstore.com").isEmpty()) {
            Account userAccount = Account.builder()
                    .username("user@hienstore.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.CUSTOMER)
                    .isEnabled(true)
                    .build();

            User user = User.builder()
                    .email("user@hienstore.com")
                    .firstName("Test")
                    .lastName("User")
                    .account(userAccount)
                    .build();
            
            userRepository.save(user);
            System.out.println("✅ MẶC ĐỊNH TẠO TÀI KHOẢN USER THÀNH CÔNG: user@hienstore.com / user123");
        }
    }
}
