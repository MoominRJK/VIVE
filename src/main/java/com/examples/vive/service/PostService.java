package com.example.vive.service;

import com.example.vive.dto.*;
import com.example.vive.model.Post;
import com.example.vive.model.User;
import com.example.vive.repository.PostRepository;
import com.example.vive.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    public PostResponse createPost(CreatePostRequest request, User currentUser) {
        Post post = new Post(
            currentUser.getId(),
            currentUser.getDisplayName(),
            request.getContent(),
            request.getImageUrl()
        );

        Post savedPost = postRepository.save(post);
        int commentCount = (int) commentRepository.countByPostId(savedPost.getId());

        return new PostResponse(savedPost, false, commentCount);
    }

    public Page<PostResponse> getAllPosts(int page, int size, String currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);

        return posts.map(post -> {
            boolean likedByUser = currentUserId != null && post.isLikedByUser(currentUserId);
            int commentCount = (int) commentRepository.countByPostId(post.getId());
            return new PostResponse(post, likedByUser, commentCount);
        });
    }

    public PostResponse getPostById(String postId, String currentUserId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean likedByUser = currentUserId != null && post.isLikedByUser(currentUserId);
        int commentCount = (int) commentRepository.countByPostId(post.getId());

        return new PostResponse(post, likedByUser, commentCount);
    }

    public PostResponse toggleLike(String postId, String currentUserId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.isLikedByUser(currentUserId)) {
            post.removeLike(currentUserId);
        } else {
            post.addLike(currentUserId);
        }

        Post savedPost = postRepository.save(post);
        int commentCount = (int) commentRepository.countByPostId(savedPost.getId());

        return new PostResponse(savedPost, savedPost.isLikedByUser(currentUserId), commentCount);
    }

    public Page<PostResponse> getPostsByHashtag(String hashtag, int page, int size, String currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByHashtagsContainingOrderByCreatedAtDesc(hashtag.toLowerCase(), pageable);

        return posts.map(post -> {
            boolean likedByUser = currentUserId != null && post.isLikedByUser(currentUserId);
            int commentCount = (int) commentRepository.countByPostId(post.getId());
            return new PostResponse(post, likedByUser, commentCount);
        });
    }

    public List<String> getTrendingHashtags(int limit) {
        List<Post> postsWithHashtags = postRepository.findPostsWithHashtags();

        // Count hashtag frequency
        Map<String, Integer> hashtagCounts = new HashMap<>();
        for (Post post : postsWithHashtags) {
            for (String hashtag : post.getHashtags()) {
                hashtagCounts.put(hashtag, hashtagCounts.getOrDefault(hashtag, 0) + 1);
            }
        }

        // Sort by frequency and return top N
        return hashtagCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(limit)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }
}
