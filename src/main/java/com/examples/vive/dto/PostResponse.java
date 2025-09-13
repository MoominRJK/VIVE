package com.example.vive.dto;

import com.example.vive.model.Post;
import java.time.LocalDateTime;
import java.util.List;

public class PostResponse {
    private String id;
    private String authorId;
    private String authorName;
    private String content;
    private String imageUrl;
    private List<String> hashtags;
    private int likeCount;
    private boolean likedByUser;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor from Post model
    public PostResponse(Post post, boolean likedByUser, int commentCount) {
        this.id = post.getId();
        this.authorId = post.getAuthorId();
        this.authorName = post.getAuthorName();
        this.content = post.getContent();
        this.imageUrl = post.getImageUrl();
        this.hashtags = post.getHashtags();
        this.likeCount = post.getLikeCount();
        this.likedByUser = likedByUser;
        this.commentCount = commentCount;
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<String> getHashtags() { return hashtags; }
    public void setHashtags(List<String> hashtags) { this.hashtags = hashtags; }

    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }

    public boolean isLikedByUser() { return likedByUser; }
    public void setLikedByUser(boolean likedByUser) { this.likedByUser = likedByUser; }

    public int getCommentCount() { return commentCount; }
    public void setCommentCount(int commentCount) { this.commentCount = commentCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
