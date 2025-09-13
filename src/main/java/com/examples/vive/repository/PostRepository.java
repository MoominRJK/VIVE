package com.example.vive.repository;

import com.example.vive.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    // Find posts by hashtag
    Page<Post> findByHashtagsContainingOrderByCreatedAtDesc(String hashtag, Pageable pageable);

    // Find posts by author
    Page<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId, Pageable pageable);

    // Find all posts ordered by creation date (newest first)
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Get trending hashtags
    @Query("{ 'hashtags': { $ne: [] } }")
    List<Post> findPostsWithHashtags();
}
