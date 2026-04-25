package com.smartcampus.backend.resource.allocation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class EquipmentAllocationResponse {
    private Long id;
    private Long hallId;
    private String hallName;
    private Long equipmentId;
    private String equipmentName;
    private Integer quantity;
    private Instant startTime;
    private Instant endTime;
    private String allocatedByUserId;
    private Instant createdAt;
}
