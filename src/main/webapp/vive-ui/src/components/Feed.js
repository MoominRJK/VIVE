import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import authService from '../services/authService';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import TrendingHashtags from './TrendingHashtags';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (pageNum = 0, reset = true) => {
    try {
      setLoading(true);
      // For guest users, load top 5 posts initially, then paginate with 10
      const pageSize = !isAuthenticated && pageNum === 0 ? 5 : 10;
      const response = await postService.getAllPosts(pageNum, pageSize);

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
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      loadPosts(page + 1, false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const updatedPost = await postService.toggleLike(postId);
      handlePostUpdate(updatedPost);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return (
    <div className="feed-container">
      {/* Navigation Header */}
      {isAuthenticated && (
        <div className="nav-header">
          <div className="user-info">
            <span>Welcome, {authService.getCurrentUser()?.displayName}</span>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              authService.logout();
              window.location.reload(); // Refresh to update auth status
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      <div className="feed-header">
        <h1>Vive Feed</h1>

        {isAuthenticated ? (
          <button
            className="create-post-btn"
            onClick={() => setShowCreatePost(!showCreatePost)}
          >
            {showCreatePost ? 'Cancel' : 'Create Post'}
          </button>
        ) : (
          <button
            className="create-post-btn"
            onClick={() => navigate('/login')}
            style={{ background: '#28a745' }}
          >
            Login to Create Posts
          </button>
        )}
      </div>

      {showCreatePost && (
        <CreatePost onPostCreated={handlePostCreated} />
      )}

      <div className="feed-content">
        <div className="posts-section">
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
              <h3>No posts yet</h3>
              <p>Be the first to create a post!</p>
            </div>
          )}
        </div>

        <div className="sidebar">
          <TrendingHashtags />
        </div>
      </div>
    </div>
  );
};

export default Feed;
