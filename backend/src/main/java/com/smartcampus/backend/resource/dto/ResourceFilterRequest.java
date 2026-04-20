package com.smartcampus.backend.resource.dto;

import com.smartcampus.backend.resource.enums.ResourceStatus;
import com.smartcampus.backend.resource.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceFilterRequest {

    private ResourceType type;
    private Integer capacity;
    private String location;
    private ResourceStatus status;
}
