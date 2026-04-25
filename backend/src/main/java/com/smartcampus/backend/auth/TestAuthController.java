package com.smartcampus.backend.auth;

import com.smartcampus.backend.config.JwtUtil;
import com.smartcampus.backend.user.User;
import com.smartcampus.backend.user.UserRepository;
import com.smartcampus.backend.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Profile("!local")
public class TestAuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/create-user-and-token")
    public ResponseEntity<String> createTestUser(
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam(defaultValue = "USER") UserRole role) {

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(
                    User.builder()
                        .email(email)
                        .name(name)
                        .role(role)
                        .oauthProvider("test")
                        .oauthId("test-" + email)
                        .build()
                ));

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(token);
    }
}