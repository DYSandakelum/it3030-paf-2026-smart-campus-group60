package com.smartcampus.config;

import com.smartcampus.model.entity.User;
import com.smartcampus.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            upsertUser(userRepository, "user", "End User");
            upsertUser(userRepository, "admin", "Administrator");
            upsertUser(userRepository, "tech", "Technician");
        };
    }

    private void upsertUser(UserRepository userRepository, String email, String name) {
        userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            user.setName(name);
            return userRepository.save(user);
        });
    }
}
