import React, { useState } from 'react';
import { updateComment, deleteComment } from '../../services/commentService';

const CommentEditDelete = ({ 
    comment, 
    currentUserRole, 
    onUpdate, 
    onDelete,
    onCancel 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');

    // Check if user can edit/delete
    const canEdit = currentUserRole === 'ADMIN' || 
                   comment.authorEmail === currentUserRole;

    const handleEdit = () => {
        setIsEditing(true);
        setEditText(comment.text);
        setError('');
    };

    const handleUpdate = async () => {
        if (!editText.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (editText === comment.text) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const updatedComment = await updateComment(comment.id, editText);
            onUpdate(updatedComment);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        setError('');

        try {
            await deleteComment(comment.id);
            onDelete(comment.id);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete comment');
            setShowDeleteConfirm(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(comment.text);
        setError('');
        if (onCancel) onCancel();
    };

    if (!canEdit) {
        return null;
    }

    if (showDeleteConfirm) {
        return (
            <div className="delete-confirm-modal">
                <div className="delete-confirm-content">
                    <h4>Delete Comment</h4>
                    <p>Are you sure you want to delete this comment?</p>
                    <p className="delete-warning">This action cannot be undone.</p>
                    
                    {error && <div className="error-text">{error}</div>}
                    
                    <div className="delete-confirm-actions">
                        <button 
                            onClick={handleCancelDelete} 
                            disabled={loading}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmDelete} 
                            disabled={loading}
                            className="btn-danger"
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="comment-edit-form">
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="3"
                    placeholder="Edit your comment..."
                    disabled={loading}
                    className="edit-textarea"
                />
                
                {error && <div className="error-text">{error}</div>}
                
                <div className="comment-edit-actions">
                    <button 
                        onClick={handleCancelEdit} 
                        disabled={loading}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpdate} 
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="comment-actions">
            <button 
                onClick={handleEdit} 
                className="action-btn edit-btn"
                title="Edit comment"
            >
                ✏️ Edit
            </button>
            <button 
                onClick={handleDeleteClick} 
                className="action-btn delete-btn"
                title="Delete comment"
            >
                 Delete
            </button>
        </div>
    );
};

export default CommentEditDelete;