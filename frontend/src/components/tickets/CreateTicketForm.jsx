import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../services/ticketService';
import '../../styles/global.css';

const categories = ['IT Equipment', 'Furniture', 'Plumbing', 'Electrical', 'Cleaning', 'Network', 'Other'];
const priorities = ['LOW', 'MEDIUM', 'HIGH'];
const MAX_ATTACHMENTS = 3;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

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

    const getAttachmentError = (filesToValidate) => {
        if (!filesToValidate || filesToValidate.length === 0) {
            return null;
        }

        if (filesToValidate.length > MAX_ATTACHMENTS) {
            return `Maximum ${MAX_ATTACHMENTS} attachments allowed`;
        }

        const invalidTypeFile = filesToValidate.find((file) => !file.type?.startsWith('image/'));
        if (invalidTypeFile) {
            return 'Only image files are allowed';
        }

        const oversizedFile = filesToValidate.find((file) => file.size > MAX_FILE_SIZE_BYTES);
        if (oversizedFile) {
            return 'Each file must be 5MB or less';
        }

        return null;
    };

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

        const attachmentError = getAttachmentError(files);
        if (attachmentError) {
            nextErrors.attachments = attachmentError;
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
        const selected = Array.from(event.target.files || []);
        const attachmentError = getAttachmentError(selected);
        const limitedSelection = selected.slice(0, MAX_ATTACHMENTS);

        setFiles(limitedSelection);
        setErrors((prev) => ({
            ...prev,
            attachments: attachmentError || ''
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        setServerError('');

        try {
            const authUser = localStorage.getItem('authUsername') || 'user';
            const authPass = localStorage.getItem('authPassword') || 'password';
            
            const createdTicket = await createTicket(formData, files);
            
            if (!createdTicket?.id) {
                throw new Error('Server response missing ticket ID');
            }
            
            setFormData({
                category: '',
                description: '',
                priority: 'MEDIUM',
                preferredContact: '',
                resourceLocation: ''
            });
            setFiles([]);
            setErrors({});
            
            navigate('/tickets', {
                state: {
                    createdTicket,
                    refreshAt: Date.now()
                }
            });
        } catch (error) {
            console.error('Ticket creation error:', error);
            
            let errorMessage = 'Failed to create ticket';
            
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                errorMessage = 'Authentication failed - please check credentials';
            } else if (error?.response?.data?.message) {
                errorMessage = `Failed to create ticket: ${error.response.data.message}`;
            } else if (error?.response?.data?.error) {
                errorMessage = `Failed to create ticket: ${error.response.data.error}`;
            } else if (error?.message) {
                errorMessage = `Failed to create ticket: ${error.message}`;
            }
            
            setServerError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const charCount = formData.description.length;

    return (
        <form onSubmit={handleSubmit} className="card">
            {serverError && (
                <div className="alert alert-danger">
                    {serverError}
                </div>
            )}

            {/* Category Section */}
            <div className="form-group">
                <label className="form-label">
                    Category <span className="required">*</span>
                </label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`form-control ${errors.category ? 'error' : ''}`}
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
            </div>

            {/* Priority & Location Row */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="form-control"
                    >
                        {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                                {priority}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Resource/Location</label>
                    <input
                        type="text"
                        name="resourceLocation"
                        value={formData.resourceLocation}
                        onChange={handleChange}
                        placeholder="e.g., Lab 101 or Office Building A"
                        className="form-control"
                    />
                </div>
            </div>

            {/* Description Section */}
            <div className="form-group">
                <label className="form-label">
                    Description <span className="required">*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please describe the issue in detail. Include what you were doing when the issue occurred..."
                    className={`form-control ${errors.description ? 'error' : ''}`}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span className="form-hint">
                        {errors.description ? (
                            <span style={{ color: '#ef4444' }}>{errors.description}</span>
                        ) : (
                            `${charCount}/1000 characters`
                        )}
                    </span>
                </div>
            </div>

            {/* Contact Section */}
            <div className="form-group">
                <label className="form-label">Preferred Contact</label>
                <input
                    type="text"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                    placeholder="Email or phone number"
                    className="form-control"
                />
                <span className="form-hint">We'll use this to contact you about your ticket</span>
            </div>

            {/* Attachments Section */}
            <div className="form-group">
                <label className="form-label">Attachments</label>
                <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-input"
                    />
                    <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1f2937' }}>
                            Click to upload or drag and drop
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                            PNG, JPG, GIF up to 5MB (max 3 files)
                        </p>
                    </label>
                </div>
                {errors.attachments && <span className="form-error">{errors.attachments}</span>}
                {files.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                            Selected Files ({files.length})
                        </p>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                            {files.map((file, idx) => (
                                <li key={idx} style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '6px', marginBottom: '4px', fontSize: '12px', color: '#374151' }}>
                                    📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="btn-group" style={{ marginTop: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                <button
                    type="button"
                    onClick={() => navigate('/tickets')}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Creating...' : 'Create Ticket'}
                </button>
            </div>
        </form>
    );
};

export default CreateTicketForm;
