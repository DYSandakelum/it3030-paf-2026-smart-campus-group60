package com.smartcampus.backend.notification;

import lombok.Data;

@Data
public class SendNotificationRequest {
    private String userId;
    private NotificationType type;
    private String message;
}