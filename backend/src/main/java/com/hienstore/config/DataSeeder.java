// package com.hienstore.config;

// import com.hienstore.entity.Account;
// import com.hienstore.entity.User;
// import com.hienstore.enums.Role;
// import com.hienstore.enums.UserType;
// import com.hienstore.repository.AccountRepository;
// import com.hienstore.repository.UserRepository;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component;
// import org.springframework.transaction.annotation.Transactional;

// @Component
// @RequiredArgsConstructor
// @Slf4j
// public class DataSeeder implements CommandLineRunner {

//     private final AccountRepository accountRepository;
//     private final UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder;

//     @Override
//     @Transactional
//     public void run(String... args) throws Exception {
//         if (!accountRepository.existsByUsername("admin")) {
//             log.info("Creating default admin account...");

//             Account adminAccount = Account.builder()
//                     .username("admin")
//                     .password(passwordEncoder.encode("admin123"))
//                     .role(Role.ADMIN)
//                     .isEnabled(true)
//                     .build();

//             User adminUser = User.builder()
//                     .firstName("Admin")
//                     .lastName("System")
//                     .email("admin@hienstore.com")
//                     .phone("0999999999")
//                     .userType(UserType.GOLD)
//                     .account(adminAccount)
//                     .isEmailVerified(true)
//                     .isPhoneVerified(true)
//                     .build();

//             userRepository.save(adminUser);
//             log.info("Default admin account created successfully. Username: admin / Password: admin123");
//         }
//     }
// }

package com.hienstore.config;

import com.hienstore.entity.Account;
import com.hienstore.entity.User;
import com.hienstore.enums.Role;
import com.hienstore.enums.UserType;
import com.hienstore.repository.AccountRepository;
import com.hienstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (!accountRepository.existsByUsername("admin")) {
            log.info("Starting default admin account creation...");
            try {
                Account adminAccount = Account.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .isEnabled(true)
                        .build();

                User adminUser = User.builder()
                        .firstName("Admin")
                        .lastName("System")
                        .email("admin@hienstore.com")
                        .phone("0999999999")
                        .userType(UserType.GOLD)
                        .account(adminAccount)
                        .isEmailVerified(true)
                        .isPhoneVerified(true)
                        .build();

                userRepository.save(adminUser);
                log.info("Default admin account created successfully.");
            } catch (Exception e) {
                // Nếu có lỗi (như trùng email), catch tại đây để app vẫn khởi động bình thường
                log.error("Failed to seed admin account, maybe it already exists: {}", e.getMessage());
            }
        } else {
            log.info("Admin account already exists, skipping seed.");
        }
    }
}