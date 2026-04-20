package com.smartcampus.backend.resource.dto;

import com.smartcampus.backend.resource.enums.ResourceStatus;
import com.smartcampus.backend.resource.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceRequest {

    @NotBlank(message = "name is required")
    @Size(max = 255, message = "name must be at most 255 characters")
    private String name;

    @NotNull(message = "type is required")
    private ResourceType type;

    @NotNull(message = "capacity is required")
    @Min(value = 0, message = "capacity must be 0 or greater")
    private Integer capacity;

    @NotBlank(message = "location is required")
    @Size(max = 255, message = "location must be at most 255 characters")
    private String location;

    @Size(max = 255, message = "availabilityWindow must be at most 255 characters")
    private String availabilityWindow;

    @NotNull(message = "status is required")
    private ResourceStatus status;

    @Size(max = 2000, message = "description must be at most 2000 characters")
    private String description;

    @NotBlank(message = "createdByUserId is required")
    @Size(max = 100, message = "createdByUserId must be at most 100 characters")
    private String createdByUserId;
}
