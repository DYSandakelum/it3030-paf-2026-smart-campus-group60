package com.smartcampus.service.interfaces;

import com.smartcampus.model.dto.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    CommentDTO addComment(Long ticketId, String text, String userEmail);
    Page<CommentDTO> getCommentsByTicket(Long ticketId, Pageable pageable);
    CommentDTO updateComment(Long commentId, String newText, String userEmail);
    void deleteComment(Long commentId, String userEmail);
}