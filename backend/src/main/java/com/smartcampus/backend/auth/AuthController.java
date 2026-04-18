package com.smartcampus.backend.auth;

import com.smartcampus.backend.common.ApiResponse;
import com.smartcampus.backend.user.User;
import com.smartcampus.backend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(
            ApiResponse.success("Current user fetched", user));
    }
}