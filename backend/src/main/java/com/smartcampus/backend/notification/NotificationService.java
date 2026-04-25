package com.smartcampus.backend.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Profile("!local")
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(String userId,
                                           NotificationType type,
                                           String message,
                                           String referenceId) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getMyNotifications(String userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository
                .countByUserIdAndIsReadFalse(userId);
    }

    public Notification markAsRead(String notificationId,
                                   String userId) {
        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                    new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException(
                "You can only mark your own notifications as read");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository
                .findByUserIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(String notificationId,
                                   String userId) {
        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                    new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException(
                "You can only delete your own notifications");
        }

        notificationRepository.deleteById(notificationId);
    }
}