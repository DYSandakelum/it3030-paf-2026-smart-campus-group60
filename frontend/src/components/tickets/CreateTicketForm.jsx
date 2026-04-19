import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../services/ticketService';

const categories = ['IT Equipment', 'Furniture', 'Plumbing', 'Electrical', 'Cleaning', 'Network', 'Other'];
const priorities = ['LOW', 'MEDIUM', 'HIGH'];

const CreateTicketForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        priority: 'MEDIUM',
        preferredContact: '',
        resourceLocation: ''
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const nextErrors = {};

        if (!formData.category.trim()) {
            nextErrors.category = 'Category is required';
        }

        const descriptionLength = formData.description.trim().length;
        if (descriptionLength < 10) {
            nextErrors.description = 'Description must be at least 10 characters';
        }

        if (descriptionLength > 1000) {
            nextErrors.description = 'Description cannot exceed 1000 characters';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (event) => {
        const selected = Array.from(event.target.files || []).slice(0, 3);
        setFiles(selected);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        setServerError('');

        try {
            const createdTicket = await createTicket(formData, files);
            navigate('/tickets', {
                state: {
                    createdTicket,
                    refreshAt: Date.now()
                }
            });
        } catch (error) {
            const details =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message;
            setServerError(details ? `Failed to create ticket: ${details}` : 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            {serverError ? (
                <div style={{ background: '#fdecea', color: '#b71c1c', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
                    {serverError}
                </div>
            ) : null}

            <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Category *</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.category ? '1px solid #c62828' : '1px solid #ccc' }}
                >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                {errors.category ? <div style={{ color: '#c62828', marginTop: '4px', fontSize: '14px' }}>{errors.category}</div> : null}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px' }}>Priority *</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                        {priorities.map((priority) => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px' }}>Resource/Location</label>
                    <input
                        type="text"
                        name="resourceLocation"
                        value={formData.resourceLocation}
                        onChange={handleChange}
                        placeholder="e.g. Lab 101"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe the issue in detail"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: errors.description ? '1px solid #c62828' : '1px solid #ccc' }}
                />
                {errors.description ? <div style={{ color: '#c62828', marginTop: '4px', fontSize: '14px' }}>{errors.description}</div> : null}
            </div>

            <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Preferred Contact</label>
                <input
                    type="text"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                    placeholder="Email or phone"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Attachments (max 3 files)</label>
                <input type="file" multiple onChange={handleFileChange} />
                {files.length ? (
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>
                        {files.length} file(s) selected
                    </div>
                ) : null}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                    type="button"
                    onClick={() => navigate('/tickets')}
                    style={{ border: '1px solid #ccc', background: 'white', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ border: 'none', background: '#007bff', color: 'white', padding: '10px 16px', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Creating...' : 'Create Ticket'}
                </button>
            </div>
        </form>
    );
};

export default CreateTicketForm;
