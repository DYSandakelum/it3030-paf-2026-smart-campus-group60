package com.smartcampus.backend.notification;

import com.smartcampus.backend.common.ApiResponse;
import com.smartcampus.backend.user.User;
import com.smartcampus.backend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Profile("!local")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications() {
        User currentUser = userService.getCurrentUser();
        List<Notification> notifications = notificationService
                .getMyNotifications(currentUser.getId());
        return ResponseEntity.ok(
            ApiResponse.success("Notifications fetched", notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        long count = notificationService
                .getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(
            ApiResponse.success("Unread count fetched", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(
            @PathVariable String id) {
        User currentUser = userService.getCurrentUser();
        Notification updated = notificationService
                .markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(
            ApiResponse.success("Marked as read", updated));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(
            ApiResponse.success("All marked as read", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable String id) {
        User currentUser = userService.getCurrentUser();
        notificationService.deleteNotification(
                id, currentUser.getId());
        return ResponseEntity.ok(
            ApiResponse.success("Notification deleted", null));
    }
}