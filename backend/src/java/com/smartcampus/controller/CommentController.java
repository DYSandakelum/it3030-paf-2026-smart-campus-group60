package com.smartcampus.controller;

import com.smartcampus.model.dto.CommentDTO;
import com.smartcampus.service.interfaces.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class CommentController {

    @Autowired
    private CommentService commentService;

    // POST: Add comment to ticket
    @PostMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        CommentDTO comment = commentService.addComment(ticketId, commentDTO.getText(), userDetails.getUsername());
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    // GET: Get comments by ticket
    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<CommentDTO>> getCommentsByTicket(
            @PathVariable Long ticketId,
            Pageable pageable) {

        Page<CommentDTO> comments = commentService.getCommentsByTicket(ticketId, pageable);
        return ResponseEntity.ok(comments);
    }

    // PUT: Update comment (only author)
    @PutMapping("/{commentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        CommentDTO updatedComment = commentService.updateComment(commentId, commentDTO.getText(), userDetails.getUsername());
        return ResponseEntity.ok(updatedComment);
    }

    // DELETE: Delete comment (only author)
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        commentService.deleteComment(commentId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}