import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import PostCard from './PostCard';
import './HashtagFeed.css';

const HashtagFeed = () => {
  const { hashtag } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (hashtag) {
      loadHashtagPosts();
    }
  }, [hashtag]);

  const loadHashtagPosts = async (pageNum = 0, reset = true) => {
    try {
      setLoading(true);
      const response = await postService.getPostsByHashtag(hashtag, pageNum, 10);

      if (reset) {
        setPosts(response.content);
      } else {
        setPosts(prev => [...prev, ...response.content]);
      }

      setHasMore(!response.last);
      setPage(pageNum);
      setError('');
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading hashtag posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      loadHashtagPosts(page + 1, false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handleLike = async (postId) => {
    try {
      const updatedPost = await postService.toggleLike(postId);
      handlePostUpdate(updatedPost);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return (
    <div className="hashtag-feed-container">
      <div className="hashtag-feed-header">
        <button
          className="back-btn"
          onClick={() => navigate('/')}
        >
          ← Back to Feed
        </button>
        <h1>#{hashtag}</h1>
        <p>Posts tagged with #{hashtag}</p>
      </div>

      <div className="hashtag-feed-content">
        {error && <div className="error-message">{error}</div>}

        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onUpdate={handlePostUpdate}
          />
        ))}

        {loading && page === 0 && (
          <div className="loading">Loading posts...</div>
        )}

        {hasMore && !loading && posts.length > 0 && (
          <button
            className="load-more-btn"
            onClick={loadMorePosts}
          >
            Load More Posts
          </button>
        )}

        {!loading && posts.length === 0 && (
          <div className="no-posts">
            <h3>No posts found for #{hashtag}</h3>
            <p>Be the first to create a post with this hashtag!</p>
            <button
              className="create-post-btn"
              onClick={() => navigate('/')}
            >
              Create Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HashtagFeed;
