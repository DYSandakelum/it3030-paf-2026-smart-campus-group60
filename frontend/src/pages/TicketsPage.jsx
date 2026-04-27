import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllTickets } from '../services/ticketService';
import '../styles/global.css';

const getStatusColor = (status) => {
    const colors = {
        OPEN: '#ef4444',
        IN_PROGRESS: '#f59e0b',
        RESOLVED: '#10b981',
        CLOSED: '#6b7280',
        REJECTED: '#ef4444'
    };
    return colors[status] || '#6b7280';
};

const getPriorityColor = (priority) => {
    const colors = {
        HIGH: '#ef4444',
        MEDIUM: '#f59e0b',
        LOW: '#10b981'
    };
    return colors[priority] || '#6b7280';
};

const TicketsPage = () => {
    const location = useLocation();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadTickets = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getAllTickets(0, 20);
                let nextTickets = response?.content || [];

                const createdTicket = location.state?.createdTicket;
                if (createdTicket?.id) {
                    const alreadyInList = nextTickets.some((ticket) => ticket.id === createdTicket.id);
                    if (!alreadyInList) {
                        nextTickets = [createdTicket, ...nextTickets];
                    }
                }

                setTickets(nextTickets);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load tickets');
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [location.key, location.state]);

    return (
        <div className="page-container wide">
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="page-title">Support Tickets</h1>
                        <p className="page-subtitle">Track and manage all support requests</p>
                    </div>
                    <Link to="/tickets/create" className="btn btn-primary">
                        <span>+</span> Create Ticket
                    </Link>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading tickets...</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="card text-center">
                    <div style={{ padding: '40px 0' }}>
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>No tickets found yet</p>
                        <p className="text-muted">Create your first support ticket to get started</p>
                        <Link to="/tickets/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
                            Create Your First Ticket
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-2">
                    {tickets.map((ticket) => (
                        <Link
                            key={ticket.id}
                            to={`/tickets/${ticket.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="card" style={{ cursor: 'pointer', height: '100%', transition: 'all 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                                            {ticket.category || 'Uncategorized'}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                                            Ticket #{ticket.id}
                                        </p>
                                    </div>
                                    <span className="badge" style={{ backgroundColor: getStatusColor(ticket.status) + '20', color: getStatusColor(ticket.status) }}>
                                        {ticket.status}
                                    </span>
                                </div>

                                <p style={{ margin: '12px 0', fontSize: '14px', color: '#444', lineHeight: '1.5' }}>
                                    {(ticket.description || '').substring(0, 100)}
                                    {ticket.description && ticket.description.length > 100 ? '...' : ''}
                                </p>

                                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                                    <span className="badge" style={{ backgroundColor: getPriorityColor(ticket.priority) + '20', color: getPriorityColor(ticket.priority), fontSize: '11px' }}>
                                        {ticket.priority} Priority
                                    </span>
                                    {ticket.createdAt && (
                                        <span className="badge badge-gray">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketsPage;
