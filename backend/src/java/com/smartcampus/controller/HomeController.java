package com.smartcampus.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> body = new LinkedHashMap<>();
        body.put("message", "SmartCampus backend is running");
        body.put("health", "/api/health");
        body.put("tickets", "/api/tickets");
        body.put("comments", "/api/comments");
        return ResponseEntity.ok(body);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> body = new LinkedHashMap<>();
        body.put("status", "UP");
        return ResponseEntity.ok(body);
    }
}
