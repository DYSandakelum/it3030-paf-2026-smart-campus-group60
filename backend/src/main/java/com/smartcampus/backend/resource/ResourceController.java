package com.smartcampus.backend.resource;

import com.smartcampus.backend.common.ApiResponse;
import com.smartcampus.backend.resource.dto.ResourceFilterRequest;
import com.smartcampus.backend.resource.dto.ResourceRequest;
import com.smartcampus.backend.resource.dto.ResourceResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getAll() {
        List<ResourceResponse> resources = resourceService.getAll();
        return ResponseEntity.ok(ApiResponse.success("Resources fetched", resources));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> getById(
            @PathVariable Long id) {
        ResourceResponse resource = resourceService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Resource fetched", resource));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceResponse>> create(
            @Valid @RequestBody ResourceRequest request) {
        ResourceResponse created = resourceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequest request) {
        ResourceResponse updated = resourceService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Resource updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> search(
            @ModelAttribute ResourceFilterRequest filter) {
        List<ResourceResponse> results = resourceService.search(filter);
        return ResponseEntity.ok(ApiResponse.success("Resources fetched", results));
    }
}
