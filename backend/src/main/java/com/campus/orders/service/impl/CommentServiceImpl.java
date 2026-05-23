package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.dto.CommentRequest;
import com.campus.orders.entity.Comment;
import com.campus.orders.entity.Task;
import com.campus.orders.mapper.CommentMapper;
import com.campus.orders.service.CommentService;
import com.campus.orders.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {

    @Resource
    private TaskService taskService;

    @Override
    @Transactional
    public Comment createComment(Long fromUserId, CommentRequest request) {
        Task task = taskService.getById(request.getTaskId());
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }

        Comment comment = new Comment();
        comment.setTaskId(request.getTaskId());
        comment.setPublisherId(task.getPublisherId());
        comment.setAcceptorId(task.getAcceptorId());
        comment.setFromUserId(fromUserId);
        comment.setToUserId(request.getToUserId());
        comment.setScore(request.getScore());
        comment.setContent(request.getContent());
        comment.setType(request.getType());
        comment.setCreateTime(LocalDateTime.now());
        comment.setUpdateTime(LocalDateTime.now());

        this.save(comment);
        return comment;
    }

    @Override
    public List<Comment> getCommentsByUserId(Long userId) {
        return this.baseMapper.findByToUserId(userId);
    }

    @Override
    public Double getAverageScore(Long userId) {
        Double avg = this.baseMapper.getAverageScoreByUserId(userId);
        return avg != null ? avg : 0.0;
    }
}
