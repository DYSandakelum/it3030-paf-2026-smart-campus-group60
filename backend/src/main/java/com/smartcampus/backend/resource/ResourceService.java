package com.smartcampus.backend.resource;

import com.smartcampus.backend.resource.dto.ResourceFilterRequest;
import com.smartcampus.backend.resource.dto.ResourceRequest;
import com.smartcampus.backend.resource.dto.ResourceResponse;

import java.util.List;

public interface ResourceService {

    ResourceResponse create(ResourceRequest request);

    ResourceResponse update(Long id, ResourceRequest request);

    void delete(Long id);

    List<ResourceResponse> getAll();

    ResourceResponse getById(Long id);

    List<ResourceResponse> search(ResourceFilterRequest filter);
}
