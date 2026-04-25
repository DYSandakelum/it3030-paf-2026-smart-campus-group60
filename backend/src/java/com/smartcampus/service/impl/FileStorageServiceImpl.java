package com.smartcampus.service.impl;

import com.smartcampus.exception.FileStorageException;
import com.smartcampus.model.entity.Attachment;
import com.smartcampus.model.entity.Ticket;
import com.smartcampus.repository.AttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageServiceImpl {

    @Autowired
    private AttachmentRepository attachmentRepository;

    private final String UPLOAD_DIR = "uploads/tickets/";

    public List<Attachment> saveAttachments(MultipartFile[] files, Ticket ticket) {
        List<Attachment> attachments = new ArrayList<>();

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR + ticket.getId());
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];

                // Validate file type
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw new FileStorageException("Only image files are allowed");
                }

                // Validate file size (max 5MB)
                if (file.getSize() > 5 * 1024 * 1024) {
                    throw new FileStorageException("File size exceeds 5MB limit");
                }

                // Generate unique filename
                String originalFileName = file.getOriginalFilename();
                String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                String newFileName = UUID.randomUUID().toString() + fileExtension;

                // Save file
                Path filePath = uploadPath.resolve(newFileName);
                Files.copy(file.getInputStream(), filePath);

                // Create attachment entity
                Attachment attachment = new Attachment();
                attachment.setFileName(originalFileName);
                attachment.setFilePath(filePath.toString());
                attachment.setOrderIndex(i + 1);
                attachment.setTicket(ticket);

                attachments.add(attachmentRepository.save(attachment));
            }
        } catch (IOException e) {
            throw new FileStorageException("Could not save file: " + e.getMessage());
        }

        return attachments;
    }

    public void deleteAttachments(List<Attachment> attachments) {
        for (Attachment attachment : attachments) {
            try {
                Path filePath = Paths.get(attachment.getFilePath());
                Files.deleteIfExists(filePath);
                attachmentRepository.delete(attachment);
            } catch (IOException e) {
                System.err.println("Could not delete file: " + attachment.getFilePath());
            }
        }
    }
}