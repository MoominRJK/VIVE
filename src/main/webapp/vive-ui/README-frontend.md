# Vive Frontend - React Social Media Application

## Overview

Vive Frontend is a modern, responsive social media web application built with **React 19** and vanilla CSS. It provides a complete user interface for social networking features including user authentication, post creation, social interactions (likes, comments), and hashtag-based content discovery.

## 🎯 Features

### 🔐 Authentication & User Management
- User registration and login with form validation
- JWT-based session management
- Protected routes and guest access
- User profile information display
- Secure logout functionality

### 📱 Social Media Core Features
- **Posts Management**: Create, view, and interact with posts
- **Rich Content**: Support for text posts with optional image URLs
- **Social Interactions**: Like/unlike posts with real-time feedback
- **Comments System**: Add, edit, and delete comments on posts
- **Hashtag Support**: Automatic hashtag parsing and clickable navigation

### 🏷️ Content Discovery
- **Feed Page**: Browse latest posts from all users (newest first)
- **Hashtag Feeds**: Filter posts by specific hashtags
- **Trending Hashtags**: Sidebar showing popular hashtags
- **Infinite Scroll**: Load more content as you scroll

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, polished interface with smooth animations
- **Guest Access**: Browse content without authentication
- **Real-time Updates**: Immediate UI feedback for interactions

## 🏗️ Architecture

- **Framework**: React 19.1.1
- **Routing**: React Router DOM for single-page application navigation
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios for API communication
- **Styling**: Vanilla CSS with modern design patterns
- **Authentication**: JWT tokens stored in localStorage

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)
- Backend API running on port 8080 or 8282

### 📦 Installation

1. **Navigate to the React application directory**
   ```bash
   cd C:\vive\src\main\webapp\vive-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

The application will automatically reload when you make changes to the code.

## 🎮 How to Use

### For Guest Users (Not Logged In)
1. **Browse Feed**: Visit `http://localhost:3000` to see the latest 5 posts
2. **View Content**: Read posts, see likes/comments counts
3. **Explore Hashtags**: Click on hashtags to see related posts
4. **Join Community**: Click "Login to Create Posts" to register or sign in

### For Registered Users
1. **Create Account**: Click "Sign up here" from the login page
2. **Login**: Use your email and password to sign in
3. **Create Posts**: Click "Create Post" and share your thoughts with hashtags
4. **Interact**: Like posts and add comments to join conversations
5. **Discover**: Click on hashtags to find posts on topics you're interested in
6. **Profile**: Access your dashboard and manage your account

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth.css              # Shared authentication styles
│   ├── Login.js              # User login form
│   ├── Register.js           # User registration form
│   ├── Dashboard.js          # User dashboard after login
│   ├── Feed.js               # Main social media feed
│   ├── Feed.css              # Feed page styles
│   ├── PostCard.js           # Individual post display component
│   ├── PostCard.css          # Post card styles
│   ├── CreatePost.js         # Post creation form
│   ├── CreatePost.css        # Create post form styles
│   ├── CommentSection.js     # Comments display and management
│   ├── CommentSection.css    # Comment section styles
│   ├── HashtagFeed.js        # Hashtag-filtered posts page
│   ├── HashtagFeed.css       # Hashtag feed styles
│   ├── TrendingHashtags.js   # Trending hashtags sidebar
│   └── TrendingHashtags.css  # Trending hashtags styles
├── services/
│   ├── authService.js        # Authentication API calls
│   └── postService.js        # Posts and comments API calls
├── App.js                    # Main application component with routing
├── App.css                   # Global application styles
├── index.js                  # Application entry point
└── index.css                 # Global CSS styles
```

## 🛣️ Application Routes

- `/` - Main feed (public access, shows top 5 posts for guests)
- `/login` - User login page
- `/register` - User registration page
- `/dashboard` - User dashboard (protected route)
- `/hashtag/:hashtag` - Posts filtered by specific hashtag

## 🔧 Configuration

### API Endpoints
The frontend communicates with the backend API. Update these URLs in the service files if needed:

**Authentication Service** (`src/services/authService.js`):
```javascript
const API_BASE_URL = 'http://localhost:8282/api';
```

**Post Service** (`src/services/postService.js`):
```javascript
const API_BASE_URL = 'http://localhost:8282/api';
```

### Environment Setup
Make sure your backend Spring Boot application is running on the configured port (8080 or 8282) before starting the React application.

## 🎨 Styling & Design

### Design System
- **Color Palette**: Blue gradient theme (#667eea to #764ba2)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Layout**: Card-based design with consistent spacing
- **Animations**: Smooth hover effects and transitions

### Responsive Breakpoints
- **Desktop**: Full feature layout with sidebar
- **Tablet**: Stacked layout, sidebar moves to top
- **Mobile**: Single column, optimized for touch

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📱 Key Components

### Feed Component
- Displays posts in chronological order (newest first)
- Shows top 5 posts for guests, unlimited for authenticated users
- Infinite scroll pagination
- Real-time like/comment interactions

### PostCard Component
- Individual post display with author info
- Clickable hashtags that navigate to hashtag feeds
- Like button with heart animation
- Comment toggle with inline comment section

### CreatePost Component
- Rich text input with hashtag support
- Optional image URL field with preview
- Character counter and validation
- Real-time hashtag parsing

### CommentSection Component
- Threaded comments display
- Inline editing for own comments
- "Edited" markers for modified comments
- Real-time comment adding

## 🔒 Security Features

- **JWT Token Management**: Automatic token inclusion in API requests
- **Route Protection**: Authenticated routes redirect to login if needed
- **Input Validation**: Form validation and error handling
- **XSS Protection**: Proper content sanitization

## 🚀 Deployment

### Development
```bash
npm start  # Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm install -g serve
serve -s build -l 3000
```

### Docker Support
The application can be containerized with the provided Docker configuration in the parent directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Ensure responsive design works on all devices
5. Submit a pull request

## 📄 Available Scripts

### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000).
The page will reload when you make changes and show lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.
Optimizes the build for best performance with minification and hashing.

### `npm run eject`
**Note: This is a one-way operation!**
Removes the single build dependency and gives you full control over configuration files.

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Errors**
- Ensure Spring Boot backend is running on the correct port
- Check API base URL configuration in service files
- Verify CORS settings allow frontend origin

**Authentication Issues**
- Clear browser localStorage if experiencing login problems
- Check JWT token expiration (24 hours default)
- Ensure backend authentication endpoints are accessible

**Styling Issues**
- Check browser compatibility for CSS Grid and Flexbox
- Clear browser cache for updated styles
- Verify all CSS files are properly imported

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure backend API is running and accessible
4. Check network requests in browser developer tools

---

**Built with ❤️ using React, modern CSS, and responsive design principles.**
