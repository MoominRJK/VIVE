package com.example.vive.service;

import com.example.vive.dto.*;
import com.example.vive.model.Comment;
import com.example.vive.model.User;
import com.example.vive.repository.CommentRepository;
import com.example.vive.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public CommentResponse createComment(String postId, CreateCommentRequest request, User currentUser) {
        // Verify post exists
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }

        Comment comment = new Comment(
            postId,
            currentUser.getId(),
            currentUser.getDisplayName(),
            request.getContent()
        );

        Comment savedComment = commentRepository.save(comment);
        return new CommentResponse(savedComment, true); // User can edit their own comment
    }

    public List<CommentResponse> getCommentsByPostId(String postId, String currentUserId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);

        return comments.stream()
            .map(comment -> {
                boolean canEdit = currentUserId != null && currentUserId.equals(comment.getAuthorId());
                return new CommentResponse(comment, canEdit);
            })
            .collect(Collectors.toList());
    }

    public CommentResponse updateComment(String commentId, CreateCommentRequest request, String currentUserId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check if user can edit this comment
        if (!comment.getAuthorId().equals(currentUserId)) {
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        // The setContent method in Comment model automatically sets edited=true and updates timestamp

        Comment savedComment = commentRepository.save(comment);
        return new CommentResponse(savedComment, true);
    }

    public void deleteComment(String commentId, String currentUserId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check if user can delete this comment
        if (!comment.getAuthorId().equals(currentUserId)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }
}
