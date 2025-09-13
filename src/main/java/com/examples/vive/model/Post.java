package com.example.vive.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "posts")
public class Post {
    @Id
    private String id;

    @Indexed
    private String authorId;
    private String authorName;
    private String content;
    private String imageUrl;
    private List<String> hashtags = new ArrayList<>();
    private int likeCount = 0;
    private List<String> likedBy = new ArrayList<>(); // User IDs who liked this post
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public Post() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Post(String authorId, String authorName, String content, String imageUrl) {
        this();
        this.authorId = authorId;
        this.authorName = authorName;
        this.content = content;
        this.imageUrl = imageUrl;
        this.hashtags = extractHashtags(content);
    }

    // Extract hashtags from content
    private List<String> extractHashtags(String content) {
        List<String> tags = new ArrayList<>();
        if (content != null) {
            String[] words = content.split("\\s+");
            for (String word : words) {
                if (word.startsWith("#") && word.length() > 1) {
                    String tag = word.substring(1).toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
                    if (!tag.isEmpty() && !tags.contains(tag)) {
                        tags.add(tag);
                    }
                }
            }
        }
        return tags;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        this.hashtags = extractHashtags(content);
        this.updatedAt = LocalDateTime.now();
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getHashtags() {
        return hashtags;
    }

    public void setHashtags(List<String> hashtags) {
        this.hashtags = hashtags;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = Math.max(0, likeCount); // Prevent negative counts
    }

    public List<String> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(List<String> likedBy) {
        this.likedBy = likedBy != null ? likedBy : new ArrayList<>();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper methods
    public boolean isLikedByUser(String userId) {
        return likedBy.contains(userId);
    }

    public void addLike(String userId) {
        if (!isLikedByUser(userId)) {
            likedBy.add(userId);
            likeCount++;
            updatedAt = LocalDateTime.now();
        }
    }

    public void removeLike(String userId) {
        if (isLikedByUser(userId)) {
            likedBy.remove(userId);
            likeCount = Math.max(0, likeCount - 1);
            updatedAt = LocalDateTime.now();
        }
    }
}
