package com.smartcampus.backend.resource.allocation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface EquipmentAllocationRepository extends JpaRepository<EquipmentAllocation, Long> {

    @Query("""
            select ea from EquipmentAllocation ea
            where ea.equipment.id = :equipmentId
              and ea.startTime < :endTime
              and ea.endTime > :startTime
            order by ea.endTime asc
            """)
    List<EquipmentAllocation> findOverlappingForEquipment(
            @Param("equipmentId") Long equipmentId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime
    );

    @Query("""
            select ea from EquipmentAllocation ea
            where ea.hall.id = :hallId
            order by ea.startTime desc
            """)
    List<EquipmentAllocation> findAllByHallIdOrderByStartTimeDesc(@Param("hallId") Long hallId);
}
