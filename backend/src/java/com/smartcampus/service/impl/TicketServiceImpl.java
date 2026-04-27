package com.smartcampus.service.impl;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.UnauthorizedException;
import com.smartcampus.exception.ConflictException;
import com.smartcampus.model.dto.TicketRequestDTO;
import com.smartcampus.model.dto.TicketResponseDTO;
import com.smartcampus.model.dto.StatusUpdateDTO;
import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.entity.Attachment;
import com.smartcampus.model.entity.User;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.interfaces.TicketService;
import com.smartcampus.utils.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    @Override
    public TicketResponseDTO createTicket(TicketRequestDTO request, String userEmail, MultipartFile[] files) {
        User user = resolveUser(userEmail);

        if (files != null && files.length > 3) {
            throw new ConflictException("Maximum 3 attachments allowed");
        }

        Ticket ticket = new Ticket();
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setResourceLocation(request.getResourceLocation());
        ticket.setStatus("OPEN");
        ticket.setCreatedBy(user);

        Ticket savedTicket = ticketRepository.save(ticket);

        if (files != null && files.length > 0) {
            fileUploadUtil.saveAttachments(files, savedTicket);
        }

        return convertToDTO(savedTicket);
    }

    @Override
    public Page<TicketResponseDTO> getAllTickets(String userEmail, String role, String status, String priority, String category, Pageable pageable) {
        Page<Ticket> tickets;
        User user = resolveUser(userEmail);

        if ("ADMIN".equals(role)) {
            tickets = ticketRepository.filterTickets(status, priority, category, pageable);
        } else {
            tickets = ticketRepository.filterTicketsForUser(user, status, priority, category, pageable);
        }

        return tickets.map(this::convertToDTO);
    }

    @Override
    public TicketResponseDTO getTicketById(Long id, String userEmail, String role) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        User user = resolveUser(userEmail);

        boolean isAdmin = "ADMIN".equals(role);
        boolean isCreator = ticket.getCreatedBy().getId().equals(user.getId());
        boolean isAssigned = ticket.getAssignedTo() != null && 
                            ticket.getAssignedTo().getId().equals(user.getId());

        if (!isAdmin && !isCreator && !isAssigned) {
            throw new UnauthorizedException("You don't have permission to view this ticket");
        }

        return convertToDTO(ticket);
    }

    @Override
    public TicketResponseDTO updateTicketStatus(Long id, StatusUpdateDTO statusUpdate, 
                                                String userEmail, String role) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        User user = resolveUser(userEmail);

        boolean isAdmin = "ADMIN".equals(role);
        boolean isAssigned = ticket.getAssignedTo() != null && 
                            ticket.getAssignedTo().getId().equals(user.getId());

        if (!isAdmin && !isAssigned) {
            throw new UnauthorizedException("Only admin or assigned technician can update status");
        }

        if ("REJECTED".equals(statusUpdate.getStatus()) && !isAdmin) {
            throw new UnauthorizedException("Only admin can reject a ticket");
        }

        if (!isValidStatusTransition(ticket.getStatus(), statusUpdate.getStatus())) {
            throw new ConflictException("Invalid status transition from " + ticket.getStatus() + 
                                       " to " + statusUpdate.getStatus());
        }

        if ("RESOLVED".equals(statusUpdate.getStatus()) && 
            (statusUpdate.getResolutionNotes() == null || statusUpdate.getResolutionNotes().trim().isEmpty())) {
            throw new ConflictException("Resolution notes are required when resolving a ticket");
        }

        if ("REJECTED".equals(statusUpdate.getStatus()) && 
            (statusUpdate.getRejectionReason() == null || statusUpdate.getRejectionReason().trim().isEmpty())) {
            throw new ConflictException("Rejection reason is required when rejecting a ticket");
        }

        ticket.setStatus(statusUpdate.getStatus());
        if (statusUpdate.getResolutionNotes() != null) {
            ticket.setResolutionNotes(statusUpdate.getResolutionNotes());
        }
        if (statusUpdate.getRejectionReason() != null) {
            ticket.setRejectionReason(statusUpdate.getRejectionReason());
        }

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDTO(updatedTicket);
    }

    @Override
    public TicketResponseDTO assignTechnician(Long id, Long technicianId, String adminEmail) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        User technician = userRepository.findById(technicianId)
            .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        ticket.setAssignedTo(technician);
        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDTO(updatedTicket);
    }

    @Override
    public void deleteTicket(Long id, String userEmail, String role) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        User user = resolveUser(userEmail);

        boolean isAdmin = "ADMIN".equals(role);
        boolean isCreator = ticket.getCreatedBy().getId().equals(user.getId());

        if (!isAdmin && !isCreator) {
            throw new UnauthorizedException("Only admin or ticket creator can delete tickets");
        }

        fileUploadUtil.deleteAttachments(ticket.getAttachments() == null ? Collections.emptyList() : ticket.getAttachments());
        ticketRepository.delete(ticket);
    }

    private boolean isValidStatusTransition(String current, String next) {
        if (next == null) {
            return false;
        }
        switch (current) {
            case "OPEN": return next.equals("IN_PROGRESS") || next.equals("REJECTED");
            case "IN_PROGRESS": return next.equals("RESOLVED");
            case "RESOLVED": return next.equals("CLOSED");
            case "CLOSED": return false;
            case "REJECTED": return false;
            default: return false;
        }
    }

    private User resolveUser(String principalName) {
        return userRepository.findByEmail(principalName)
            .orElseGet(() -> {
                User user = new User();
                user.setEmail(principalName);
                user.setName(principalName);
                return userRepository.save(user);
            });
    }

    private TicketResponseDTO convertToDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setCategory(ticket.getCategory());
        dto.setDescription(ticket.getDescription());
        dto.setPriority(ticket.getPriority());
        dto.setPreferredContact(ticket.getPreferredContact());
        dto.setResourceLocation(ticket.getResourceLocation());
        dto.setStatus(ticket.getStatus());
        dto.setRejectionReason(ticket.getRejectionReason());
        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());

        if (ticket.getCreatedBy() != null) {
            dto.setCreatedByName(ticket.getCreatedBy().getName());
            dto.setCreatedByEmail(ticket.getCreatedBy().getEmail());
        }

        if (ticket.getAssignedTo() != null) {
            dto.setAssignedToName(ticket.getAssignedTo().getName());
            dto.setAssignedToEmail(ticket.getAssignedTo().getEmail());
        }

        if (ticket.getAttachments() != null) {
            dto.setAttachments(ticket.getAttachments().stream()
                .map(Attachment::getFilePath)
                .collect(Collectors.toList()));
        }

        return dto;
    }
}