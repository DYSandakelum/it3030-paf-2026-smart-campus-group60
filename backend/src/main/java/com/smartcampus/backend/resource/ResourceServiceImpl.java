package com.smartcampus.backend.resource;

import com.smartcampus.backend.resource.dto.ResourceFilterRequest;
import com.smartcampus.backend.resource.dto.ResourceRequest;
import com.smartcampus.backend.resource.dto.ResourceResponse;
import com.smartcampus.backend.resource.exception.ResourceNotFoundException;
import com.smartcampus.backend.resource.mapper.ResourceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceResponse create(ResourceRequest request) {
        Resource resource = ResourceMapper.toEntity(request);
        Resource saved = resourceRepository.save(resource);
        return ResourceMapper.toResponse(saved);
    }

    @Override
    public ResourceResponse update(Long id, ResourceRequest request) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        ResourceMapper.updateEntity(existing, request);
        Resource saved = resourceRepository.save(existing);
        return ResourceMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        resourceRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getAll() {
        return resourceRepository.findAll()
                .stream()
                .map(ResourceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponse getById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return ResourceMapper.toResponse(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> search(ResourceFilterRequest filter) {
        ResourceFilterRequest safeFilter = (filter == null) ? new ResourceFilterRequest() : filter;

        return resourceRepository.search(
                        safeFilter.getType(),
                        safeFilter.getCapacity(),
                        normalizeBlankToNull(safeFilter.getLocation()),
                        safeFilter.getStatus()
                )
                .stream()
                .map(ResourceMapper::toResponse)
                .toList();
    }

    private static String normalizeBlankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
