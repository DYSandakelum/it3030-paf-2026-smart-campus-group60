import React, { useState } from 'react';

const UpdateTicketStatus = ({ currentStatus, onUpdate, onCancel, loading, isAdmin }) => {
    const [status, setStatus] = useState(currentStatus);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');
    
    const statusOptions = [
        { value: 'IN_PROGRESS', label: 'In Progress', fromStatuses: ['OPEN'] },
        { value: 'RESOLVED', label: 'Resolved', fromStatuses: ['IN_PROGRESS'] },
        { value: 'CLOSED', label: 'Closed', fromStatuses: ['RESOLVED'] },
        { value: 'REJECTED', label: 'Rejected', fromStatuses: ['OPEN'] }
    ];
    
    const availableStatuses = statusOptions.filter(option => 
        option.fromStatuses.includes(currentStatus) && (option.value !== 'REJECTED' || isAdmin)
    );
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (status === 'RESOLVED' && !resolutionNotes.trim()) {
            setError('Resolution notes are required');
            return;
        }
        
        if (status === 'REJECTED' && !rejectionReason.trim()) {
            setError('Rejection reason is required');
            return;
        }
        
        const statusData = {
            status,
            resolutionNotes: status === 'RESOLVED' ? resolutionNotes : null,
            rejectionReason: status === 'REJECTED' ? rejectionReason : null
        };
        
        onUpdate(statusData);
    };
    
    return (
        <div className="status-update-modal">
            <div className="modal-content">
                <h3>Update Ticket Status</h3>
                
                {error && <div className="alert alert-error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Status</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="status-select"
                        >
                            {availableStatuses.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {status === 'RESOLVED' && (
                        <div className="form-group">
                            <label>Resolution Notes *</label>
                            <textarea
                                rows="3"
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                placeholder="Describe how the issue was resolved..."
                                required
                            />
                        </div>
                    )}
                    
                    {status === 'REJECTED' && (
                        <div className="form-group">
                            <label>Rejection Reason *</label>
                            <textarea
                                rows="3"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Provide reason for rejection..."
                                required
                            />
                        </div>
                    )}
                    
                    <div className="modal-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTicketStatus;