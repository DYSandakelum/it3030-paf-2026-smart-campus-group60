package com.smartcampus.backend.booking;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        validateBookingTime(booking.getStartTime(), booking.getEndTime());
        validateNoOverlap(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime(),
                null
        );

        if (booking.getStatus() == null) {
            booking.setStatus(Booking.Status.PENDING);
        }

        LocalDateTime now = LocalDateTime.now();
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings(String userId, Booking.Status status) {
        if (userId != null && status != null) {
            return bookingRepository.findByUserIdAndStatus(userId, status);
        }
        if (userId != null) {
            return bookingRepository.findByUserId(userId);
        }
        if (status != null) {
            return bookingRepository.findByStatus(status);
        }
        return bookingRepository.findAll();
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getBookingsByResource(String resourceId) {
        return bookingRepository.findByResourceId(resourceId);
    }

    public Booking updateBooking(String id, Booking updatedBooking) {
        Booking existingBooking = getBookingById(id);

        validateBookingTime(updatedBooking.getStartTime(), updatedBooking.getEndTime());
        validateNoOverlap(
                updatedBooking.getResourceId(),
                updatedBooking.getStartTime(),
                updatedBooking.getEndTime(),
                id
        );

        existingBooking.setResourceId(updatedBooking.getResourceId());
        existingBooking.setResourceName(updatedBooking.getResourceName());
        existingBooking.setUserId(updatedBooking.getUserId());
        existingBooking.setUserName(updatedBooking.getUserName());
        existingBooking.setStartTime(updatedBooking.getStartTime());
        existingBooking.setEndTime(updatedBooking.getEndTime());
        existingBooking.setPurpose(updatedBooking.getPurpose());
        existingBooking.setStatus(updatedBooking.getStatus());
        existingBooking.setNotes(updatedBooking.getNotes());
        existingBooking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(existingBooking);
    }

    public Booking updateBookingStatus(String id, Booking.Status status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }

    private void validateBookingTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new RuntimeException("Start time and end time are required");
        }
        if (!endTime.isAfter(startTime)) {
            throw new RuntimeException("End time must be after start time");
        }
    }

    private void validateNoOverlap(String resourceId,
                                   LocalDateTime startTime,
                                   LocalDateTime endTime,
                                   String bookingIdToExclude) {
        if (resourceId == null || resourceId.isBlank()) {
            throw new RuntimeException("Resource ID is required");
        }

        boolean hasOverlap;
        if (bookingIdToExclude == null) {
            hasOverlap = !bookingRepository
                    .findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThan(
                            resourceId, endTime, startTime)
                    .isEmpty();
        } else {
            hasOverlap = !bookingRepository
                    .findByResourceIdAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
                            resourceId, endTime, startTime, bookingIdToExclude)
                    .isEmpty();
        }

        if (hasOverlap) {
            throw new RuntimeException("Booking time overlaps with an existing booking for this resource");
        }
    }
}
