package com.smartcampus.repository;

import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    Page<Ticket> findByCreatedBy(User user, Pageable pageable);
    
    Page<Ticket> findByAssignedTo(User user, Pageable pageable);
    
    @Query("SELECT t FROM Ticket t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:category IS NULL OR LOWER(t.category) LIKE LOWER(CONCAT('%', :category, '%')))")
    Page<Ticket> filterTickets(@Param("status") String status,
                               @Param("priority") String priority,
                               @Param("category") String category,
                               Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE " +
           "(t.createdBy = :user OR t.assignedTo = :user) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:category IS NULL OR LOWER(t.category) LIKE LOWER(CONCAT('%', :category, '%')))")
    Page<Ticket> filterTicketsForUser(@Param("user") User user,
                                      @Param("status") String status,
                                      @Param("priority") String priority,
                                      @Param("category") String category,
                                      Pageable pageable);
}