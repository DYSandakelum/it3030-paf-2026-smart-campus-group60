package com.smartcampus.backend.resource.mapper;

import com.smartcampus.backend.resource.Resource;
import com.smartcampus.backend.resource.dto.ResourceRequest;
import com.smartcampus.backend.resource.dto.ResourceResponse;

public final class ResourceMapper {

    private ResourceMapper() {
    }

    public static Resource toEntity(ResourceRequest request) {
        if (request == null) {
            return null;
        }

        return Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .availabilityWindow(request.getAvailabilityWindow())
                .status(request.getStatus())
                .description(request.getDescription())
                .createdByUserId(request.getCreatedByUserId())
                .build();
    }

    public static void updateEntity(Resource existing, ResourceRequest request) {
        existing.setName(request.getName());
        existing.setType(request.getType());
        existing.setCapacity(request.getCapacity());
        existing.setLocation(request.getLocation());
        existing.setAvailabilityWindow(request.getAvailabilityWindow());
        existing.setStatus(request.getStatus());
        existing.setDescription(request.getDescription());
        // createdByUserId is immutable by design for this module
    }

    public static ResourceResponse toResponse(Resource resource) {
        if (resource == null) {
            return null;
        }

        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityWindow(resource.getAvailabilityWindow())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .createdByUserId(resource.getCreatedByUserId())
                .build();
    }
}
