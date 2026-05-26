package com.hienstore.service;

import com.hienstore.dto.response.UserDto;
import com.hienstore.entity.Account;
import com.hienstore.entity.User;
import com.hienstore.repository.AccountRepository;
import com.hienstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return userRepository.searchUsers(keyword.trim(), pageable).map(this::mapToDto);
        }
        return userRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Account account = user.getAccount();
        if (account != null) {
            account.setIsEnabled(!account.getIsEnabled());
            accountRepository.save(account);
        }
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .userType(user.getUserType() != null ? user.getUserType().name() : null)
                .isEmailVerified(user.getIsEmailVerified())
                .isPhoneVerified(user.getIsPhoneVerified())
                .createdAt(user.getCreatedAt())
                .username(user.getAccount() != null ? user.getAccount().getUsername() : null)
                .role(user.getAccount() != null ? user.getAccount().getRole().name() : null)
                .isEnabled(user.getAccount() != null ? user.getAccount().getIsEnabled() : false)
                .build();
    }
}
