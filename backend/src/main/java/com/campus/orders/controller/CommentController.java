package com.campus.orders.controller;

import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.dto.CommentRequest;
import com.campus.orders.entity.Comment;
import com.campus.orders.service.CommentService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Resource
    private CommentService commentService;

    @Resource
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/create")
    public ApiResponse<Comment> createComment(
            @RequestHeader("Authorization") String token,
            @RequestBody CommentRequest request) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            Comment comment = commentService.createComment(userId, request);
            return ApiResponse.success(comment);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public ApiResponse<List<Comment>> getCommentsByUserId(
            @RequestParam(required = false) Long userId) {
        List<Comment> comments = commentService.getCommentsByUserId(userId);
        return ApiResponse.success(comments);
    }

    @GetMapping("/score/{userId}")
    public ApiResponse<Double> getAverageScore(@PathVariable Long userId) {
        Double avgScore = commentService.getAverageScore(userId);
        return ApiResponse.success(avgScore);
    }
}
