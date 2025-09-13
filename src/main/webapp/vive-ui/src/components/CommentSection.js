import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import authService from '../services/authService';
import './CommentSection.css';

const CommentSection = ({ postId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await postService.getCommentsByPost(postId);
      setComments(commentsData);
      setError('');
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const commentData = { content: newComment.trim() };
      const createdComment = await postService.createComment(postId, commentData);

      setComments(prev => [...prev, createdComment]);
      setNewComment('');

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error creating comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) {
      return;
    }

    try {
      const updatedComment = await postService.updateComment(commentId, {
        content: editContent.trim()
      });

      setComments(prev => prev.map(comment =>
        comment.id === commentId ? updatedComment : comment
      ));

      setEditingComment(null);
      setEditContent('');
    } catch (err) {
      setError('Failed to update comment');
      console.error('Error updating comment:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await postService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h4>Comments ({comments.length})</h4>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="2"
          maxLength="500"
          disabled={submitting}
          className="comment-textarea"
        />
        <div className="comment-form-actions">
          <span className="character-count">{newComment.length}/500</span>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="comment-submit-btn"
          >
            {submitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>

      <div className="comments-list">
        {loading ? (
          <div className="loading">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.authorName}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                {comment.edited && <span className="edited-indicator">• Edited</span>}
              </div>

              {editingComment === comment.id ? (
                <div className="comment-edit-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="2"
                    maxLength="500"
                    className="comment-edit-textarea"
                  />
                  <div className="comment-edit-actions">
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="save-btn"
                      disabled={!editContent.trim()}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="comment-content">
                    {comment.content}
                  </div>

                  {comment.canEdit && (
                    <div className="comment-actions">
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="edit-comment-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="delete-comment-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
