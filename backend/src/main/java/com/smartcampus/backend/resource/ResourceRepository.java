package com.smartcampus.backend.resource;

import com.smartcampus.backend.resource.enums.ResourceStatus;
import com.smartcampus.backend.resource.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    @Query("""
            select r from Resource r
            where (:type is null or r.type = :type)
              and (:status is null or r.status = :status)
              and (:capacity is null or r.capacity >= :capacity)
                                                        and (
                                                                :location is null
                                                                or lower(r.location) like lower(concat('%', :location, '%'))
                                                                or lower(r.name) like lower(concat('%', :location, '%'))
                                                        )
            """)
    List<Resource> search(
            @Param("type") ResourceType type,
            @Param("capacity") Integer capacity,
            @Param("location") String location,
            @Param("status") ResourceStatus status
    );
}
