package com.smartcampus.backend.user;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.time.LocalDateTime;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private UserRole role = UserRole.USER;

    private String oauthProvider;
    private String oauthId;
    private String profilePicture;

    private LocalDateTime createdAt = LocalDateTime.now();
}