import React from 'react';
import CreateTicketForm from '../components/tickets/CreateTicketForm.jsx';

const CreateTicketPage = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <h1>Create Ticket</h1>
                <p>Submit a new issue and track it through resolution.</p>
            </div>
            <CreateTicketForm />
        </div>
    );
};

export default CreateTicketPage;
