import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TicketsPage from './pages/TicketsPage.jsx';
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import CreateTicketPage from './pages/CreateTicketPage.jsx';

function App() {
    return (
        <Router>
            <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/tickets" />} />
                    <Route path="/tickets" element={<TicketsPage />} />
                    <Route path="/tickets/create" element={<CreateTicketPage />} />
                    <Route path="/tickets/:id" element={<TicketDetailPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;