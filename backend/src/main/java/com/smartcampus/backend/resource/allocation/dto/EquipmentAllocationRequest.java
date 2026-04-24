package com.smartcampus.backend.resource.allocation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class EquipmentAllocationRequest {

    @NotNull
    private Long hallId;

    @NotNull
    private Long equipmentId;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    private Instant startTime;

    @NotNull
    private Instant endTime;
}
