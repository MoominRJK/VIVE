import React, { useState } from 'react';
import postService from '../services/postService';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Post content is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postData = {
        content: content.trim(),
        imageUrl: imageUrl.trim() || null
      };

      const newPost = await postService.createPost(postData);

      setContent('');
      setImageUrl('');

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h3>Create a New Post</h3>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <textarea
              placeholder="What's on your mind? Use #hashtags to categorize your post..."
              value={content}
              onChange={handleContentChange}
              rows="4"
              maxLength="1000"
              disabled={loading}
              className="post-textarea"
            />
            <div className="character-count">
              {content.length}/1000
            </div>
          </div>

          <div className="form-group">
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={loading}
              className="image-url-input"
            />
          </div>

          {imageUrl && (
            <div className="image-preview">
              <img
                src={imageUrl}
                alt="Preview"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="post-button"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
