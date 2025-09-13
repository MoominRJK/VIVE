# Vive Backend - Spring Boot Social Media API

## Overview

Vive is a modern social media platform backend built with **Spring Boot** and **MongoDB**. It provides a complete REST API for social media functionality including user authentication, posts management, likes, comments, and hashtag features.

## 🏗️ Architecture

- **Framework**: Spring Boot 3.5.5
- **Database**: MongoDB (Local or Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security with BCrypt password encryption
- **API Style**: RESTful APIs with JSON responses

## 📋 Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Password encryption with BCrypt
- Protected routes for authenticated users
- Guest access for viewing public content

### 📝 Posts Management
- Create posts with text content and optional image URLs
- View all posts (paginated, newest first)
- Hashtag parsing and extraction from post content
- Like/unlike posts with atomic operations
- Real-time like count management

### 💬 Comments System
- Add comments to posts
- Edit own comments (marked as "edited")
- Delete own comments
- View all comments for a post

### 🏷️ Hashtags & Trending
- Automatic hashtag detection in posts
- Hashtag-based post filtering
- Trending hashtags calculation
- Clickable hashtag navigation

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- MongoDB (Local installation or Atlas account)
- Gradle (included via wrapper)

### 📦 Installation

1. **Clone the repository**
   ```bash
   cd C:\vive
   ```

2. **Configure MongoDB**
   
   **Option A: Local MongoDB**
   ```properties
   # In src/main/resources/application.properties
   spring.data.mongodb.uri=mongodb://localhost:27017/vive
   ```
   
   **Option B: MongoDB Atlas**
   ```properties
   # In src/main/resources/application.properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/vive
   ```

3. **Build the application**
   ```bash
   ./gradlew build -x test
   ```

4. **Run the application**
   ```bash
   ./gradlew bootRun
   ```

The server will start on `http://localhost:8080` (or `8282` if port 8080 is occupied).

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### 🔐 Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "displayName": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "displayName": "John Doe"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "displayName": "John Doe"
}
```

### 📝 Posts Endpoints

#### Get All Posts (Public - No Auth Required)
```http
GET /posts?page=0&size=10
```

**Response:**
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439011",
      "authorId": "507f1f77bcf86cd799439012",
      "authorName": "John Doe",
      "content": "Hello world! #introduction #socialmedia",
      "imageUrl": "https://example.com/image.jpg",
      "hashtags": ["introduction", "socialmedia"],
      "likeCount": 5,
      "likedByUser": false,
      "commentCount": 3,
      "createdAt": "2025-09-10T12:00:00",
      "updatedAt": "2025-09-10T12:00:00"
    }
  ],
  "pageable": {...},
  "totalElements": 50,
  "last": false
}
```

#### Create Post (Auth Required)
```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "My first post! #hello #world",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Get Post by ID
```http
GET /posts/{postId}
```

#### Toggle Like on Post (Auth Required)
```http
POST /posts/{postId}/like
Authorization: Bearer <token>
```

#### Get Posts by Hashtag
```http
GET /posts/hashtag/{hashtag}?page=0&size=10
```

#### Get Trending Hashtags
```http
GET /posts/trending/hashtags?limit=10
```

**Response:**
```json
["socialmedia", "technology", "introduction", "hello", "world"]
```

### 💬 Comments Endpoints

#### Get Comments for Post
```http
GET /comments/post/{postId}
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "postId": "507f1f77bcf86cd799439011",
    "authorId": "507f1f77bcf86cd799439012",
    "authorName": "Jane Smith",
    "content": "Great post!",
    "edited": false,
    "canEdit": false,
    "createdAt": "2025-09-10T12:15:00",
    "updatedAt": "2025-09-10T12:15:00"
  }
]
```

#### Create Comment (Auth Required)
```http
POST /comments/post/{postId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a great post!"
}
```

#### Update Comment (Auth Required - Own Comments Only)
```http
PUT /comments/{commentId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

#### Delete Comment (Auth Required - Own Comments Only)
```http
DELETE /comments/{commentId}
Authorization: Bearer <token>
```

## 🛡️ Security Features

### Authentication
- JWT tokens with configurable expiration (24 hours default)
- Secure password hashing with BCrypt
- Token-based API access

### Authorization Rules
- **Public Access**: View posts, comments, hashtags (GET requests)
- **Authenticated Users**: Create posts, like/unlike, add comments
- **Owner Only**: Edit/delete own comments
- **Server-side Validation**: Prevent negative like counts, validate input

### CORS Configuration
- Configured for React frontend (`http://localhost:3000`)
- Supports all HTTP methods needed for the API
- Credentials support for authenticated requests

## 🗃️ Database Schema

### User Collection
```javascript
{
  "_id": ObjectId,
  "email": String (unique, indexed),
  "password": String (encrypted),
  "displayName": String,
  "enabled": Boolean,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

### Posts Collection
```javascript
{
  "_id": ObjectId,
  "authorId": String (indexed),
  "authorName": String,
  "content": String,
  "imageUrl": String,
  "hashtags": [String],
  "likeCount": Number,
  "likedBy": [String], // User IDs
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

### Comments Collection
```javascript
{
  "_id": ObjectId,
  "postId": String (indexed),
  "authorId": String (indexed),
  "authorName": String,
  "content": String,
  "edited": Boolean,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

## 🔧 Configuration

### Application Properties
```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/vive
spring.data.mongodb.database=vive
spring.data.mongodb.auto-index-creation=true

# JWT Configuration
jwt.secret=mySecretKey123456789012345678901234567890
jwt.expiration=86400000

# Server Configuration
server.port=8080

# CORS Configuration
management.endpoints.web.cors.allowed-origins=http://localhost:3000
management.endpoints.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
management.endpoints.web.cors.allowed-headers=*
```

## 🧪 Testing

### Run Tests
```bash
./gradlew test
```

### Run Without Tests
```bash
./gradlew bootRun -x test
```

## 📈 Performance Features

- **Pagination**: All list endpoints support pagination
- **Indexing**: MongoDB indexes on frequently queried fields
- **Atomic Operations**: Like/unlike operations are atomic
- **Optimized Queries**: Efficient hashtag and trending calculations

## 🐛 Error Handling

The API returns standard HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses include descriptive messages:
```json
{
  "error": "Email already exists",
  "status": 400
}
```

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Use environment variables for sensitive configuration
2. **Database**: Use MongoDB Atlas for production
3. **Security**: Update JWT secret and enable HTTPS
4. **Monitoring**: Add application monitoring and logging
5. **Scaling**: Consider MongoDB replica sets for high availability

### Docker Support
A `docker-compose.yml` is provided for local MongoDB setup:
```bash
docker-compose up -d mongodb
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Spring Boot, MongoDB, and modern web technologies.**
