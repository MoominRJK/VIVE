import axios from 'axios';

const API_BASE_URL = 'http://localhost:8282/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const postService = {
  // Posts
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  getAllPosts: async (page = 0, size = 10) => {
    const response = await api.get(`/posts?page=${page}&size=${size}`);
    return response.data;
  },

  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  getPostsByHashtag: async (hashtag, page = 0, size = 10) => {
    const response = await api.get(`/posts/hashtag/${hashtag}?page=${page}&size=${size}`);
    return response.data;
  },

  getTrendingHashtags: async (limit = 10) => {
    const response = await api.get(`/posts/trending/hashtags?limit=${limit}`);
    return response.data;
  },

  // Comments
  createComment: async (postId, commentData) => {
    const response = await api.post(`/comments/post/${postId}`, commentData);
    return response.data;
  },

  getCommentsByPost: async (postId) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  },

  deleteComment: async (commentId) => {
    await api.delete(`/comments/${commentId}`);
  }
};

export default postService;
