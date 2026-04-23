import React from 'react';
import CreateTicketForm from '../components/tickets/CreateTicketForm.jsx';
import '../styles/global.css';

const CreateTicketPage = () => {
    return (
        <div className="page-container narrow">
            <div className="page-header">
                <h1 className="page-title">Create New Ticket</h1>
                <p className="page-subtitle">Submit a detailed description of your issue and we'll get to it as soon as possible</p>
            </div>
            <CreateTicketForm />
        </div>
    );
};

export default CreateTicketPage;
