import React, { useState, useEffect } from 'react';
import { getAllTickets } from '../../services/ticketService';

const TicketStats = () => {
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        rejected: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const response = await getAllTickets(0, 100);
            const tickets = response.content;
            
            // Calculate statistics
            const newStats = {
                total: tickets.length,
                open: tickets.filter(t => t.status === 'OPEN').length,
                inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
                resolved: tickets.filter(t => t.status === 'RESOLVED').length,
                closed: tickets.filter(t => t.status === 'CLOSED').length,
                rejected: tickets.filter(t => t.status === 'REJECTED').length,
                highPriority: tickets.filter(t => t.priority === 'HIGH').length,
                mediumPriority: tickets.filter(t => t.priority === 'MEDIUM').length,
                lowPriority: tickets.filter(t => t.priority === 'LOW').length
            };
            
            setStats(newStats);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="stats-loading">
                <div className="spinner"></div>
                <p>Loading statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stats-error">
                <p>{error}</p>
                <button onClick={loadStats} className="retry-btn">Retry</button>
            </div>
        );
    }

    return (
        <div className="ticket-stats">
            <div className="stats-header">
                <h3>Ticket Statistics</h3>
                <button onClick={loadStats} className="refresh-btn" title="Refresh">
                    🔄
                </button>
            </div>
            
            {/* Status Statistics */}
            <div className="stats-section">
                <h4>By Status</h4>
                <div className="stats-grid">
                    <div className="stat-card status-open">
                        <div className="stat-value">{stats.open}</div>
                        <div className="stat-label">Open</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${(stats.open / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="stat-card status-progress">
                        <div className="stat-value">{stats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="stat-card status-resolved">
                        <div className="stat-value">{stats.resolved}</div>
                        <div className="stat-label">Resolved</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${(stats.resolved / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="stat-card status-closed">
                        <div className="stat-value">{stats.closed}</div>
                        <div className="stat-label">Closed</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${(stats.closed / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="stat-card status-rejected">
                        <div className="stat-value">{stats.rejected}</div>
                        <div className="stat-label">Rejected</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${(stats.rejected / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Priority Statistics */}
            <div className="stats-section">
                <h4>By Priority</h4>
                <div className="stats-grid priority-stats">
                    <div className="stat-card priority-high">
                        <div className="stat-value">{stats.highPriority}</div>
                        <div className="stat-label">High Priority</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${(stats.highPriority / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="stat-card priority-medium">
                        <div className="stat-value">{stats.mediumPriority}</div>
                        <div className="stat-label">Medium Priority</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${(stats.mediumPriority / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="stat-card priority-low">
                        <div className="stat-value">{stats.lowPriority}</div>
                        <div className="stat-label">Low Priority</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${(stats.lowPriority / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Summary */}
            <div className="stats-summary">
                <div className="summary-item">
                    <span className="summary-label">Total Tickets:</span>
                    <span className="summary-value">{stats.total}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Completion Rate:</span>
                    <span className="summary-value">
                        {Math.round(((stats.resolved + stats.closed) / stats.total) * 100)}%
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Open Rate:</span>
                    <span className="summary-value">
                        {Math.round((stats.open / stats.total) * 100)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TicketStats;