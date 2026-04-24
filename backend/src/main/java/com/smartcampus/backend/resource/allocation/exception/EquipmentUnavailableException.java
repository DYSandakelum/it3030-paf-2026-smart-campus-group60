package com.smartcampus.backend.resource.allocation.exception;

import com.smartcampus.backend.resource.allocation.dto.EquipmentAvailabilityResponse;
import lombok.Getter;

@Getter
public class EquipmentUnavailableException extends RuntimeException {

    private final EquipmentAvailabilityResponse availability;

    public EquipmentUnavailableException(String message, EquipmentAvailabilityResponse availability) {
        super(message);
        this.availability = availability;
    }
}
