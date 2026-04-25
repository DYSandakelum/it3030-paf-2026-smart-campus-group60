import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateTicketStatus, deleteTicket, assignTechnician } from '../../services/ticketService';
import { getStatusColor, getPriorityColor, getStatusLabel, getPriorityLabel } from '../../utils/statusColors';
import UpdateTicketStatus from './UpdateTicketStatus';
import AttachmentGallery from './AttachmentGallery';
import CommentSection from '../comments/CommentSection';

const TicketDetail = ({ ticket, onTicketUpdate, currentUserRole, currentUserEmail }) => {
    const navigate = useNavigate();
    const [showStatusUpdate, setShowStatusUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const canUpdateStatus = currentUserRole === 'ADMIN' || 
                       (ticket.assignedToEmail === currentUserEmail);
    
    const canDelete = currentUserRole === 'ADMIN' || 
                   (ticket.createdByEmail === currentUserEmail);

    const canShowStatusUpdate = canUpdateStatus && ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED';

    const workflowStatuses = [
        { key: 'IN_PROGRESS', label: 'IN-PROGRESS' },
        { key: 'RESOLVED', label: 'RESOLVED' },
        { key: 'CLOSED', label: 'CLOSED' }
    ];
    
    const handleStatusUpdate = async (statusData) => {
        setLoading(true);
        try {
            const updated = await updateTicketStatus(ticket.id, statusData);
            onTicketUpdate(updated);
            setShowStatusUpdate(false);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert(error.response?.data?.message || 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            setLoading(true);
            try {
                await deleteTicket(ticket.id);
                navigate('/tickets');
            } catch (error) {
                console.error('Failed to delete:', error);
                alert(error.response?.data?.message || 'Failed to delete ticket');
            } finally {
                setLoading(false);
            }
        }
    };
    
    return (
        <div className="ticket-detail-container">
            <div className="ticket-detail-header">
                <div className="ticket-badges">
                    <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityLabel(ticket.priority)}
                    </span>
                    <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                    </span>
                </div>
                
                <div className="ticket-actions">
                    {canShowStatusUpdate && (
                        <button 
                            onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                            className="btn-outline"
                            disabled={loading}
                        >
                            Update Status
                        </button>
                    )}
                    {canDelete && (
                        <button 
                            onClick={handleDelete}
                            className="btn-danger"
                            disabled={loading}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
            
            {showStatusUpdate && (
                <UpdateTicketStatus 
                    currentStatus={ticket.status}
                    onUpdate={handleStatusUpdate}
                    onCancel={() => setShowStatusUpdate(false)}
                    loading={loading}
                    isAdmin={currentUserRole === 'ADMIN'}
                />
            )}
            
            <div className="ticket-detail-body">
                <h1 className="ticket-category">{ticket.category}</h1>

                <div className="ticket-section">
                    <h3 className="section-title">Status Options</h3>
                    <div className="status-option-row">
                        {workflowStatuses.map((option) => (
                            <span
                                key={option.key}
                                className={`status-option-chip ${ticket.status === option.key ? 'active' : ''}`}
                            >
                                {option.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="ticket-info-grid">
                    <div className="info-item">
                        <span className="info-label">Ticket ID:</span>
                        <span className="info-value">#{ticket.id}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Created by:</span>
                        <span className="info-value">{ticket.createdByName}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Created at:</span>
                        <span className="info-value">
                            {new Date(ticket.createdAt).toLocaleString()}
                        </span>
                    </div>
                    {ticket.assignedToName && (
                        <div className="info-item">
                            <span className="info-label">Assigned to:</span>
                            <span className="info-value">{ticket.assignedToName}</span>
                        </div>
                    )}
                    {ticket.resourceLocation && (
                        <div className="info-item">
                            <span className="info-label">Location:</span>
                            <span className="info-value">{ticket.resourceLocation}</span>
                        </div>
                    )}
                    {ticket.preferredContact && (
                        <div className="info-item">
                            <span className="info-label">Contact:</span>
                            <span className="info-value">{ticket.preferredContact}</span>
                        </div>
                    )}
                </div>
                
                <div className="ticket-description-section">
                    <h3>Description</h3>
                    <p>{ticket.description}</p>
                </div>
                
                {ticket.resolutionNotes && (
                    <div className="ticket-resolution-section">
                        <h3>Resolution Notes</h3>
                        <p>{ticket.resolutionNotes}</p>
                    </div>
                )}
                
                {ticket.rejectionReason && (
                    <div className="ticket-rejection-section">
                        <h3>Rejection Reason</h3>
                        <p>{ticket.rejectionReason}</p>
                    </div>
                )}
                
                {ticket.attachments && ticket.attachments.length > 0 && (
                    <AttachmentGallery attachments={ticket.attachments} />
                )}
                
                <CommentSection ticketId={ticket.id} currentUserEmail={currentUserEmail} />
            </div>
        </div>
    );
};

export default TicketDetail;