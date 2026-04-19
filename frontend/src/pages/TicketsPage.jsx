import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllTickets } from '../services/ticketService';

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
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Incident Tickets</h1>
                <Link to="/tickets/create" style={{
                    background: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '10px 16px',
                    borderRadius: '6px'
                }}>
                    + Create Ticket
                </Link>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                {loading ? <p>Loading tickets...</p> : null}
                {error ? <p style={{ color: '#c62828' }}>{error}</p> : null}

                {!loading && !error && tickets.length === 0 ? (
                    <p>No tickets found. Click Create Ticket to submit one.</p>
                ) : null}

                {!loading && !error && tickets.length > 0 ? (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {tickets.map((ticket) => (
                            <Link
                                key={ticket.id}
                                to={`/tickets/${ticket.id}`}
                                style={{
                                    textDecoration: 'none',
                                    color: '#1a1a1a',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '8px',
                                    padding: '12px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong>{ticket.category || 'Uncategorized'}</strong>
                                    <span>{ticket.status}</span>
                                </div>
                                <div style={{ fontSize: '14px', color: '#555', marginBottom: '6px' }}>
                                    Priority: {ticket.priority || 'MEDIUM'}
                                </div>
                                <div style={{ fontSize: '14px', color: '#444' }}>
                                    {ticket.description || 'No description'}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default TicketsPage;
