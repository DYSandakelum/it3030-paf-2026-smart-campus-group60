import React, { useState } from 'react';
import { updateComment, deleteComment } from '../../services/commentService';

const CommentItem = ({ comment, currentUserEmail, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [loading, setLoading] = useState(false);
    
    const canEdit = Boolean(currentUserEmail) && comment.authorEmail === currentUserEmail;
    
    const handleUpdate = async () => {
        if (!editText.trim()) return;
        
        setLoading(true);
        try {
            const updated = await updateComment(comment.id, editText);
            onUpdate(updated);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update:', error);
            alert(error.response?.data?.message || 'Failed to update comment');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        
        setLoading(true);
        try {
            await deleteComment(comment.id);
            onDelete(comment.id);
        } catch (error) {
            console.error('Failed to delete:', error);
            alert(error.response?.data?.message || 'Failed to delete comment');
        } finally {
            setLoading(false);
        }
    };
    
    if (isEditing) {
        return (
            <div className="comment-item editing">
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="3"
                />
                <div className="comment-actions">
                    <button onClick={() => setIsEditing(false)} disabled={loading}>
                        Cancel
                    </button>
                    <button onClick={handleUpdate} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="comment-item">
            <div className="comment-header">
                <div className="comment-author">
                    <strong>{comment.authorName}</strong>
                    <span className="comment-email">{comment.authorEmail}</span>
                </div>
                <div className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                    {comment.updatedAt !== comment.createdAt && (
                        <span className="edited"> (edited)</span>
                    )}
                </div>
            </div>
            <div className="comment-text">{comment.text}</div>
            {canEdit && (
                <div className="comment-actions">
                    <button onClick={() => setIsEditing(true)} disabled={loading}>
                        Edit
                    </button>
                    <button onClick={handleDelete} disabled={loading} className="delete-btn">
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentItem;