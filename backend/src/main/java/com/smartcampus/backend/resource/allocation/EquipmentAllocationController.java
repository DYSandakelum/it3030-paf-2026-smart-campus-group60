package com.smartcampus.backend.resource.allocation;

import com.smartcampus.backend.common.ApiResponse;
import com.smartcampus.backend.resource.allocation.dto.EquipmentAllocationRequest;
import com.smartcampus.backend.resource.allocation.dto.EquipmentAllocationResponse;
import com.smartcampus.backend.resource.allocation.dto.EquipmentAvailabilityResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/equipment-allocations")
@RequiredArgsConstructor
public class EquipmentAllocationController {

    private final EquipmentAllocationService allocationService;

    @GetMapping("/hall/{hallId}")
    public ResponseEntity<ApiResponse<List<EquipmentAllocationResponse>>> listForHall(@PathVariable Long hallId) {
        return ResponseEntity.ok(ApiResponse.success("Allocations fetched", allocationService.listForHall(hallId)));
    }

    @GetMapping("/availability")
    public ResponseEntity<ApiResponse<EquipmentAvailabilityResponse>> getAvailability(
            @RequestParam Long equipmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endTime
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Availability fetched",
                allocationService.getAvailability(equipmentId, startTime, endTime)
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EquipmentAllocationResponse>> allocate(
            @Valid @RequestBody EquipmentAllocationRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Equipment allocated",
                allocationService.allocate(request, authentication)
        ));
    }

    @DeleteMapping("/{allocationId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long allocationId) {
        allocationService.delete(allocationId);
        return ResponseEntity.ok(ApiResponse.success("Allocation deleted", null));
    }
}
