package com.smartcampus.backend.booking;

import com.smartcampus.backend.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @RequestBody Booking booking) {
        Booking created = bookingService.createBooking(booking);
        return ResponseEntity.ok(
                ApiResponse.success("Booking created", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Booking.Status status) {
        List<Booking> bookings = bookingService.getAllBookings(userId, status);
        return ResponseEntity.ok(
                ApiResponse.success("Bookings fetched", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(
            @PathVariable String id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Booking fetched", booking));
    }

    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByResource(
            @PathVariable String resourceId) {
        List<Booking> bookings = bookingService.getBookingsByResource(resourceId);
        return ResponseEntity.ok(
                ApiResponse.success("Resource bookings fetched", bookings));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> updateBooking(
            @PathVariable String id,
            @RequestBody Booking booking) {
        Booking updated = bookingService.updateBooking(id, booking);
        return ResponseEntity.ok(
                ApiResponse.success("Booking updated", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable String id,
            @RequestBody Map<String, Booking.Status> payload) {
        Booking.Status status = payload.get("status");
        if (status == null) {
            throw new RuntimeException("Status is required");
        }

        Booking updated = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(
                ApiResponse.success("Booking status updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(
            @PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(
                ApiResponse.success("Booking deleted", null));
    }
}
