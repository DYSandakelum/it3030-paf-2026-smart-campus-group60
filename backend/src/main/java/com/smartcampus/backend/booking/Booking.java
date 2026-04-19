package com.smartcampus.backend.booking;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String resourceId;
    private String resourceName;

    private String userId;
    private String userName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String purpose;

    @Builder.Default
    private Status status = Status.PENDING;

    private String notes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }
}
