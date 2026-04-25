import React, { useState } from 'react';
import { addComment } from '../../services/commentService';

const CommentForm = ({ ticketId, onCommentAdded }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!text.trim()) {
            setError('Comment text is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const newComment = await addComment(ticketId, text.trim());
            onCommentAdded?.(newComment);
            setText('');
        } catch (requestError) {
            setError(requestError?.response?.data?.message || 'Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                rows="3"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Add a comment..."
            />
            {error ? <div className="alert alert-error">{error}</div> : null}
            <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
};

export default CommentForm;
