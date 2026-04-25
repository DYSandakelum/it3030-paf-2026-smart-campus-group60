package com.smartcampus.backend.booking;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByUserId(String userId);

    List<Booking> findByStatus(Booking.Status status);

    List<Booking> findByUserIdAndStatus(String userId, Booking.Status status);

    List<Booking> findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThan(
            String resourceId,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    List<Booking> findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
            String resourceId,
            LocalDateTime endTime,
            LocalDateTime startTime,
            String id
    );
}