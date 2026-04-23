package com.smartcampus.backend.resource.allocation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class EquipmentAvailabilityResponse {
    private Long equipmentId;
    private Instant startTime;
    private Instant endTime;
    private Integer totalQuantity;
    private Integer allocatedQuantity;
    private Integer availableQuantity;
    private Instant nextAvailableAt;
}
