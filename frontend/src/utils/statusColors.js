export const getStatusColor = (status) => {
    switch (status) {
        case 'OPEN':
            return 'status-open';
        case 'IN_PROGRESS':
            return 'status-progress';
        case 'RESOLVED':
            return 'status-resolved';
        case 'CLOSED':
            return 'status-closed';
        case 'REJECTED':
            return 'status-rejected';
        default:
            return '';
    }
};

export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'HIGH':
            return 'priority-high';
        case 'MEDIUM':
            return 'priority-medium';
        case 'LOW':
            return 'priority-low';
        default:
            return '';
    }
};

export const getStatusLabel = (status) => {
    const labels = {
        OPEN: 'Open',
        IN_PROGRESS: 'In Progress',
        RESOLVED: 'Resolved',
        CLOSED: 'Closed',
        REJECTED: 'Rejected'
    };

    return labels[status] || status;
};

export const getPriorityLabel = (priority) => {
    const labels = {
        HIGH: 'High',
        MEDIUM: 'Medium',
        LOW: 'Low'
    };

    return labels[priority] || priority;
};