import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById } from '../services/ticketService';
import TicketDetail from '../components/tickets/TicketDetail';
import '../styles/ticketDetailPage.css';

const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState('USER');
    const [currentUserEmail, setCurrentUserEmail] = useState('user');

    useEffect(() => {
        const loadTicket = async () => {
            setLoading(true);
            setError('');

            try {
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                const username = localStorage.getItem('authUsername') || storedUser?.email || 'user';
                setCurrentUserRole(storedUser?.role || (username === 'admin' ? 'ADMIN' : 'USER'));
                setCurrentUserEmail(storedUser?.email || username);

                const response = await getTicketById(id);
                setTicket(response);
            } catch (requestError) {
                setError(requestError?.response?.data?.message || 'Ticket not found');
            } finally {
                setLoading(false);
            }
        };

        loadTicket();
    }, [id]);

    if (loading) {
        return <div className="ticket-page-state">Loading ticket details...</div>;
    }

    if (error) {
        return (
            <div className="ticket-page-shell">
                <div className="ticket-page-topbar">
                    <button onClick={() => navigate('/tickets')} className="back-button">
                        Back to Tickets
                    </button>
                </div>
                <div className="ticket-page-error-card">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ticket-page-shell">
            <div className="ticket-page-topbar">
                <button onClick={() => navigate('/tickets')} className="back-button">
                    Back to Tickets
                </button>
                <div className="ticket-page-title-block">
                    <h1>Ticket Details</h1>
                    <p>View information clearly and track the status progression.</p>
                </div>
            </div>
            <TicketDetail
                ticket={ticket}
                onTicketUpdate={setTicket}
                currentUserRole={currentUserRole}
                currentUserEmail={currentUserEmail}
            />
        </div>
    );
};

export default TicketDetailPage;