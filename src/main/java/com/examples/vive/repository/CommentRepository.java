package com.example.vive.repository;

import com.example.vive.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    // Find comments by post ID, ordered by creation date
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);

    // Find comments by author
    Page<Comment> findByAuthorIdOrderByCreatedAtDesc(String authorId, Pageable pageable);

    // Count comments for a post
    long countByPostId(String postId);
}
