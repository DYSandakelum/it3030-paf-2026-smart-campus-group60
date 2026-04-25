package com.smartcampus.backend.auth;

import com.smartcampus.backend.config.JwtUtil;
import com.smartcampus.backend.user.User;
import com.smartcampus.backend.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private static final String FRONTEND_CALLBACK_URL =
            "http://localhost:3000/auth/callback?token=";

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");
        String oauthId = oauth2User.getAttribute("sub");

        User user = userService.findOrCreateUser(
                email, name, picture, "google", oauthId);

        String token = jwtUtil.generateToken(user);

        getRedirectStrategy().sendRedirect(request, response,
                FRONTEND_CALLBACK_URL + token);
    }
}