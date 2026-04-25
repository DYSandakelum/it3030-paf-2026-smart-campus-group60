import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById } from '../services/ticketService';
import TicketDetail from '../components/tickets/TicketDetail';
import '../styles/global.css';
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
        return (
            <div className="page-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading ticket details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={() => navigate('/tickets')} className="btn btn-secondary">
                        ← Back to Tickets
                    </button>
                </div>
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="page-container wide">
            <div style={{ marginBottom: '24px' }}>
                <button onClick={() => navigate('/tickets')} className="btn btn-secondary">
                    ← Back to Tickets
                </button>
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