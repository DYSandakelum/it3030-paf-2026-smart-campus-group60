import api from './api.jsx';

export const getCommentsByTicket = async (ticketId, page = 0, size = 10) => {
    const response = await api.get(`/comments/ticket/${ticketId}?page=${page}&size=${size}`);
    return response.data;
};

export const addComment = async (ticketId, text) => {
    const response = await api.post(`/comments/ticket/${ticketId}`, { text });
    return response.data;
};

export const updateComment = async (commentId, text) => {
    const response = await api.put(`/comments/${commentId}`, { text });
    return response.data;
};

export const deleteComment = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
};
