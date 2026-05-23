package com.campus.orders.service;

import com.campus.orders.dto.CommentRequest;
import com.campus.orders.entity.Comment;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

public interface CommentService extends IService<Comment> {
    Comment createComment(Long fromUserId, CommentRequest request);
    List<Comment> getCommentsByUserId(Long userId);
    Double getAverageScore(Long userId);
}
