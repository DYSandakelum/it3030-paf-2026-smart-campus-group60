package com.smartcampus.repository;

import com.smartcampus.model.entity.Attachment;
import com.smartcampus.model.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByTicket(Ticket ticket);
    void deleteByTicket(Ticket ticket);
}