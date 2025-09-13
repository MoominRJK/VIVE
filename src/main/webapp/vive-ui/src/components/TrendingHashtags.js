import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import './TrendingHashtags.css';

const TrendingHashtags = () => {
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTrendingHashtags();
  }, []);

  const loadTrendingHashtags = async () => {
    try {
      setLoading(true);
      const trendingData = await postService.getTrendingHashtags(10);
      setHashtags(trendingData);
      setError('');
    } catch (err) {
      setError('Failed to load trending hashtags');
      console.error('Error loading trending hashtags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHashtagClick = (hashtag) => {
    navigate(`/hashtag/${hashtag}`);
  };

  return (
    <div className="trending-hashtags">
      <div className="trending-header">
        <h3>🔥 Trending Hashtags</h3>
        <button
          className="refresh-btn"
          onClick={loadTrendingHashtags}
          disabled={loading}
        >
          ↻
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : hashtags.length === 0 ? (
        <div className="no-hashtags">
          <p>No trending hashtags yet</p>
          <small>Start using hashtags in your posts!</small>
        </div>
      ) : (
        <div className="hashtags-list">
          {hashtags.map((hashtag, index) => (
            <div
              key={hashtag}
              className="trending-hashtag-item"
              onClick={() => handleHashtagClick(hashtag)}
            >
              <span className="hashtag-rank">#{index + 1}</span>
              <span className="hashtag-name">#{hashtag}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingHashtags;
