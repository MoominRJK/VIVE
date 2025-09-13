package com.example.vive.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {
    @NotBlank(message = "Content is required")
    @Size(max = 500, message = "Comment must be less than 500 characters")
    private String content;

    // Constructors
    public CreateCommentRequest() {}

    public CreateCommentRequest(String content) {
        this.content = content;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
