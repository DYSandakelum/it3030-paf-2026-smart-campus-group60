package com.smartcampus.service.validation;

import com.smartcampus.exception.ConflictException;
import com.smartcampus.model.dto.StatusUpdateDTO;
import org.springframework.stereotype.Component;

@Component
public class TicketValidator {

    public void validateStatusTransition(String currentStatus, String newStatus) {
        switch (currentStatus) {
            case "OPEN":
                if (!newStatus.equals("IN_PROGRESS") && !newStatus.equals("REJECTED")) {
                    throw new ConflictException("OPEN tickets can only be moved to IN_PROGRESS or REJECTED");
                }
                break;
            case "IN_PROGRESS":
                if (!newStatus.equals("RESOLVED")) {
                    throw new ConflictException("IN_PROGRESS tickets can only be moved to RESOLVED");
                }
                break;
            case "RESOLVED":
                if (!newStatus.equals("CLOSED")) {
                    throw new ConflictException("RESOLVED tickets can only be moved to CLOSED");
                }
                break;
            case "CLOSED":
                throw new ConflictException("CLOSED tickets cannot be changed");
            case "REJECTED":
                throw new ConflictException("REJECTED tickets cannot be changed");
            default:
                throw new ConflictException("Invalid status: " + currentStatus);
        }
    }

    public void validateResolutionNotes(String status, String resolutionNotes) {
        if ("RESOLVED".equals(status) && (resolutionNotes == null || resolutionNotes.trim().isEmpty())) {
            throw new ConflictException("Resolution notes are required when resolving a ticket");
        }
    }

    public void validateRejectionReason(String status, String rejectionReason) {
        if ("REJECTED".equals(status) && (rejectionReason == null || rejectionReason.trim().isEmpty())) {
            throw new ConflictException("Rejection reason is required when rejecting a ticket");
        }
    }
}