package com.hienstore.service;

import com.hienstore.dto.request.LoginRequest;
import com.hienstore.dto.request.RegisterRequest;
import com.hienstore.dto.response.AuthResponse;
import com.hienstore.entity.Account;
import com.hienstore.entity.User;
import com.hienstore.enums.Role;
import com.hienstore.repository.AccountRepository;
import com.hienstore.repository.UserRepository;
import com.hienstore.security.CustomUserDetails;
import com.hienstore.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (accountRepository.existsByUsername(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create Account
        Account account = Account.builder()
                .username(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .build();

        // Create User
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .account(account)
                .build();

        userRepository.save(user);

        var userDetails = new CustomUserDetails(account);
        var jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .role(account.getRole().name())
                .fullName(user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : ""))
                .point(user.getPoint())
                .userType(user.getUserType().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByAccountUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var userDetails = new CustomUserDetails(user.getAccount());
        var jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getAccount().getRole().name())
                .fullName(user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : ""))
                .point(user.getPoint())
                .userType(user.getUserType().name())
                .build();
    }

    @Transactional
    public void forgotPassword(String email) {
        Account account = accountRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email này"));

        // Generate 6-digit code
        String resetToken = String.format("%06d", new java.util.Random().nextInt(999999));
        account.setResetToken(resetToken);
        account.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        accountRepository.save(account);

        emailService.sendPasswordResetEmail(email, resetToken);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        Account account = accountRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Mã xác nhận không hợp lệ hoặc đã hết hạn"));

        if (account.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Mã xác nhận đã hết hạn");
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        account.setResetToken(null);
        account.setResetTokenExpiry(null);
        accountRepository.save(account);
    }

    public AuthResponse getMe(String username) {
        var user = userRepository.findByAccountUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getAccount().getRole().name())
                .fullName(user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : ""))
                .point(user.getPoint())
                .userType(user.getUserType().name())
                .token("") // No need to send token back
                .build();
    }
}
