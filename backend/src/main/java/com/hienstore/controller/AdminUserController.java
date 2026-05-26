package com.hienstore.controller;

import com.hienstore.dto.response.UserDto;
import com.hienstore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserDto>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok().build();
    }
}
