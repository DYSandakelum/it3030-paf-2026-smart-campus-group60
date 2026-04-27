import React, { useState, useEffect } from 'react';
import { getCommentsByTicket } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentSection = ({ ticketId, currentUserEmail }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    useEffect(() => {
        loadComments();
    }, [ticketId, page]);
    
    const loadComments = async () => {
        setLoading(true);
        try {
            const response = await getCommentsByTicket(ticketId, page);
            setComments(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleCommentAdded = (newComment) => {
        setComments(prev => [newComment, ...prev]);
    };
    
    const handleCommentUpdated = (updatedComment) => {
        setComments(prev => prev.map(comment => 
            comment.id === updatedComment.id ? updatedComment : comment
        ));
    };
    
    const handleCommentDeleted = (commentId) => {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
    };
    
    return (
        <div className="comment-section">
            <h3>Comments ({comments.length})</h3>
            
            <CommentForm 
                ticketId={ticketId}
                onCommentAdded={handleCommentAdded}
            />
            
            {loading && <div className="loading-comments">Loading comments...</div>}
            
            <div className="comments-list">
                {comments.map(comment => (
                    <CommentItem 
                        key={comment.id}
                        comment={comment}
                        currentUserEmail={currentUserEmail}
                        onUpdate={handleCommentUpdated}
                        onDelete={handleCommentDeleted}
                    />
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 0}
                    >
                        Previous
                    </button>
                    <span>Page {page + 1} of {totalPages}</span>
                    <button 
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;