package com.smartcampus.repository;

import com.smartcampus.model.entity.Comment;
import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByTicket(Ticket ticket, Pageable pageable);
    void deleteByAuthor(User author);
}