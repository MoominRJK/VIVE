import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import CommentSection from './CommentSection';
import './PostCard.css';

const PostCard = ({ post, onLike, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleHashtagClick = (hashtag) => {
    navigate(`/hashtag/${hashtag}`);
  };

  const renderContentWithHashtags = (content) => {
    return content.split(' ').map((word, index) => {
      if (word.startsWith('#') && word.length > 1) {
        const hashtag = word.substring(1);
        return (
          <span
            key={index}
            className="hashtag"
            onClick={() => handleHashtagClick(hashtag)}
          >
            {word}
          </span>
        );
      }
      return word + ' ';
    });
  };

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onLike(post.id);
  };

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowComments(!showComments);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="author-info">
            <h4>{post.authorName}</h4>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="post-content">
        <p>{renderContentWithHashtags(post.content)}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="post-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
      </div>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="hashtag-chips">
          {post.hashtags.map((hashtag, index) => (
            <span
              key={index}
              className="hashtag-chip"
              onClick={() => handleHashtagClick(hashtag)}
            >
              #{hashtag}
            </span>
          ))}
        </div>
      )}

      <div className="post-actions">
        <button
          className={`action-btn like-btn ${post.likedByUser ? 'liked' : ''}`}
          onClick={handleLikeClick}
        >
          <span className="action-icon">❤️</span>
          <span className="action-count">{post.likeCount}</span>
        </button>

        <button
          className="action-btn comment-btn"
          onClick={handleCommentClick}
        >
          <span className="action-icon">💬</span>
          <span className="action-count">{post.commentCount}</span>
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentAdded={() => {
            // Refresh post to get updated comment count
            // This could be optimized to just increment the count
            if (onUpdate) {
              // For now, we'll just rely on the parent to refresh
            }
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
