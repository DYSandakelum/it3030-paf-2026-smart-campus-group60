import api from './api.jsx';

export const createTicket = async (ticketData, files = []) => {
    if (!files || files.length === 0) {
        const response = await api.post('/tickets', ticketData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }

    const formData = new FormData();
    formData.append(
        'ticket',
        new Blob([JSON.stringify(ticketData)], {
            type: 'application/json'
        })
    );
    files.forEach((file) => formData.append('files', file));

    const response = await api.post('/tickets', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getAllTickets = async (page = 0, size = 10) => {
    const response = await api.get(`/tickets?page=${page}&size=${size}`);
    return response.data;
};

export const getTicketById = async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
};

export const updateTicketStatus = async (id, statusData) => {
    const response = await api.put(`/tickets/${id}/status`, statusData);
    return response.data;
};

export const assignTechnician = async (id, technicianId) => {
    const response = await api.put(`/tickets/${id}/assign?technicianId=${technicianId}`);
    return response.data;
};

export const deleteTicket = async (id) => {
    await api.delete(`/tickets/${id}`);
};

export const filterTickets = async (filters, page = 0, size = 10) => {
    const params = new URLSearchParams({
        page,
        size,
        ...filters
    });
    const response = await api.get(`/tickets/filter?${params}`);
    return response.data;
};
