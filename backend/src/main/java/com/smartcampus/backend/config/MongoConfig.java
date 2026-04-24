package com.smartcampus.backend.config;

import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@Profile("!local")
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.smartcampus.backend")
public class MongoConfig {
}