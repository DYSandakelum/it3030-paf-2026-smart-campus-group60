package com.smartcampus.controller;

import com.smartcampus.model.dto.TicketRequestDTO;
import com.smartcampus.model.dto.TicketResponseDTO;
import com.smartcampus.model.dto.StatusUpdateDTO;
import com.smartcampus.service.interfaces.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // POST: Create new ticket (USER, ADMIN)
    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<TicketResponseDTO> createTicket(
            @Valid @RequestPart("ticket") TicketRequestDTO request,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @AuthenticationPrincipal UserDetails userDetails) {

        TicketResponseDTO response = ticketService.createTicket(request, userDetails.getUsername(), files);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // POST: Create ticket without attachments (JSON)
    @PostMapping(consumes = "application/json")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<TicketResponseDTO> createTicketJson(
            @Valid @RequestBody TicketRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {

        TicketResponseDTO response = ticketService.createTicket(request, userDetails.getUsername(), null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // GET: Get all tickets
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<TicketResponseDTO>> getAllTickets(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        String role = resolveRole(userDetails);
        Page<TicketResponseDTO> tickets = ticketService.getAllTickets(userDetails.getUsername(), role, null, null, null, pageable);
        return ResponseEntity.ok(tickets);
    }

    // GET: Filter tickets by status/priority/category
    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<TicketResponseDTO>> filterTickets(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        String role = resolveRole(userDetails);
        Page<TicketResponseDTO> tickets = ticketService.getAllTickets(userDetails.getUsername(), role, status, priority, category, pageable);
        return ResponseEntity.ok(tickets);
    }

    // GET: Get single ticket by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<TicketResponseDTO> getTicketById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        String role = resolveRole(userDetails);
        TicketResponseDTO ticket = ticketService.getTicketById(id, userDetails.getUsername(), role);
        return ResponseEntity.ok(ticket);
    }

    // PUT: Update ticket status
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<TicketResponseDTO> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO statusUpdate,
            @AuthenticationPrincipal UserDetails userDetails) {

        String role = resolveRole(userDetails);
        TicketResponseDTO updatedTicket = ticketService.updateTicketStatus(id, statusUpdate, userDetails.getUsername(), role);
        return ResponseEntity.ok(updatedTicket);
    }

    // PUT: Assign technician (ADMIN only)
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDTO> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId,
            @AuthenticationPrincipal UserDetails adminDetails) {

        TicketResponseDTO ticket = ticketService.assignTechnician(id, technicianId, adminDetails.getUsername());
        return ResponseEntity.ok(ticket);
    }

    // DELETE: Delete ticket
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        String role = resolveRole(userDetails);
        ticketService.deleteTicket(id, userDetails.getUsername(), role);
        return ResponseEntity.noContent().build();
    }

    private String resolveRole(UserDetails userDetails) {
        String authority = userDetails.getAuthorities().iterator().next().getAuthority();
        if (authority.startsWith("ROLE_")) {
            return authority.substring(5);
        }
        return authority;
    }
}