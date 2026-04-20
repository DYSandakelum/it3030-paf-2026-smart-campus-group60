package com.smartcampus.backend.resource.dto;

import com.smartcampus.backend.resource.enums.ResourceStatus;
import com.smartcampus.backend.resource.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponse {

    private Long id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private String availabilityWindow;
    private ResourceStatus status;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdByUserId;
}
