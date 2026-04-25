package com.smartcampus.service.interfaces;

import com.smartcampus.model.dto.TicketRequestDTO;
import com.smartcampus.model.dto.TicketResponseDTO;
import com.smartcampus.model.dto.StatusUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface TicketService {
    TicketResponseDTO createTicket(TicketRequestDTO request, String userEmail, MultipartFile[] files);
    Page<TicketResponseDTO> getAllTickets(String userEmail, String role, String status, String priority, String category, Pageable pageable);
    TicketResponseDTO getTicketById(Long id, String userEmail, String role);
    TicketResponseDTO updateTicketStatus(Long id, StatusUpdateDTO statusUpdate, String userEmail, String role);
    TicketResponseDTO assignTechnician(Long id, Long technicianId, String adminEmail);
    void deleteTicket(Long id, String userEmail, String role);
}