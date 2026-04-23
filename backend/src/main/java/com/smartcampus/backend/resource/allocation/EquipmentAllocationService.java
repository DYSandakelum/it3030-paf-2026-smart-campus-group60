package com.smartcampus.backend.resource.allocation;

import com.smartcampus.backend.resource.Resource;
import com.smartcampus.backend.resource.ResourceRepository;
import com.smartcampus.backend.resource.allocation.dto.EquipmentAllocationRequest;
import com.smartcampus.backend.resource.allocation.dto.EquipmentAllocationResponse;
import com.smartcampus.backend.resource.allocation.dto.EquipmentAvailabilityResponse;
import com.smartcampus.backend.resource.allocation.exception.EquipmentUnavailableException;
import com.smartcampus.backend.resource.enums.ResourceType;
import com.smartcampus.backend.resource.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentAllocationService {

    private final EquipmentAllocationRepository allocationRepository;
    private final ResourceRepository resourceRepository;

    @Transactional(readOnly = true)
    public EquipmentAvailabilityResponse getAvailability(Long equipmentId, Instant startTime, Instant endTime) {
        Resource equipment = resourceRepository.findById(equipmentId)
                .orElseThrow(() -> new ResourceNotFoundException(equipmentId));

        if (equipment.getType() != ResourceType.EQUIPMENT) {
            throw new IllegalArgumentException("Resource is not equipment");
        }

        int totalQuantity = equipment.getCapacity() == null ? 0 : equipment.getCapacity();

        List<EquipmentAllocation> overlapping = allocationRepository.findOverlappingForEquipment(
                equipmentId,
                startTime,
                endTime
        );

    int peakConcurrentAllocated = computePeakConcurrentAllocated(overlapping, startTime, endTime);
    int availableQuantity = Math.max(0, totalQuantity - peakConcurrentAllocated);
    Instant nextAvailableAt = overlapping.stream()
        .map(EquipmentAllocation::getEndTime)
        .max(Instant::compareTo)
        .orElse(null);

        return EquipmentAvailabilityResponse.builder()
                .equipmentId(equipmentId)
                .startTime(startTime)
                .endTime(endTime)
                .totalQuantity(totalQuantity)
        .allocatedQuantity(peakConcurrentAllocated)
                .availableQuantity(availableQuantity)
                .nextAvailableAt(nextAvailableAt)
                .build();
    }

    @Transactional
    public EquipmentAllocationResponse allocate(EquipmentAllocationRequest request, Authentication authentication) {
        validateRequest(request);

        Resource hall = resourceRepository.findById(request.getHallId())
                .orElseThrow(() -> new ResourceNotFoundException(request.getHallId()));
        Resource equipment = resourceRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException(request.getEquipmentId()));

        if (equipment.getType() != ResourceType.EQUIPMENT) {
            throw new IllegalArgumentException("Selected resource is not equipment");
        }
        if (hall.getType() == ResourceType.EQUIPMENT) {
            throw new IllegalArgumentException("Hall resource must be a room (not equipment)");
        }

        EquipmentAvailabilityResponse availability = getAvailability(
                equipment.getId(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (availability.getAvailableQuantity() < request.getQuantity()) {
            throw new EquipmentUnavailableException(
                    "Equipment ran out for the selected time window",
                    availability
            );
        }

        String userId = authentication == null ? "unknown" : authentication.getName();

        EquipmentAllocation saved = allocationRepository.save(EquipmentAllocation.builder()
                .equipment(equipment)
                .hall(hall)
                .quantity(request.getQuantity())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .allocatedByUserId(userId)
                .build());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EquipmentAllocationResponse> listForHall(Long hallId) {
        return allocationRepository.findAllByHallIdOrderByStartTimeDesc(hallId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long allocationId) {
        allocationRepository.deleteById(allocationId);
    }

    private void validateRequest(EquipmentAllocationRequest request) {
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new IllegalArgumentException("Start and end time are required");
        }
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }
    }

    private EquipmentAllocationResponse toResponse(EquipmentAllocation allocation) {
        return EquipmentAllocationResponse.builder()
                .id(allocation.getId())
                .hallId(allocation.getHall().getId())
                .hallName(allocation.getHall().getName())
                .equipmentId(allocation.getEquipment().getId())
                .equipmentName(allocation.getEquipment().getName())
                .quantity(allocation.getQuantity())
                .startTime(allocation.getStartTime())
                .endTime(allocation.getEndTime())
                .allocatedByUserId(allocation.getAllocatedByUserId())
                .createdAt(allocation.getCreatedAt())
                .build();
    }

    private int computePeakConcurrentAllocated(List<EquipmentAllocation> allocations, Instant windowStart, Instant windowEnd) {
        if (allocations == null || allocations.isEmpty()) return 0;

        record Event(Instant time, int delta) {}

        List<Event> events = new ArrayList<>();
        for (EquipmentAllocation ea : allocations) {
            if (ea.getStartTime() == null || ea.getEndTime() == null) continue;
            if (ea.getQuantity() == null || ea.getQuantity() <= 0) continue;

            Instant start = ea.getStartTime().isAfter(windowStart) ? ea.getStartTime() : windowStart;
            Instant end = ea.getEndTime().isBefore(windowEnd) ? ea.getEndTime() : windowEnd;

            if (!end.isAfter(start)) continue;

            events.add(new Event(start, ea.getQuantity()));
            events.add(new Event(end, -ea.getQuantity()));
        }

        if (events.isEmpty()) return 0;

        events.sort(Comparator
            .comparing(Event::time)
            // At the same instant, process releases before allocations.
            .thenComparingInt(Event::delta));

        int running = 0;
        int peak = 0;
        for (Event event : events) {
            running += event.delta();
            if (running > peak) peak = running;
        }

        return Math.max(0, peak);
    }
}
