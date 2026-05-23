package com.campus.orders.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.Evaluation;
import com.campus.orders.entity.User;
import com.campus.orders.mapper.UserMapper;
import com.campus.orders.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluation")
public class EvaluationController {

    @Resource
    private EvaluationService evaluationService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/submit")
    public ApiResponse<Evaluation> submitEvaluation(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        try {
            Long userId = getUserIdFromToken(token);
            Integer rating = (Integer) request.get("rating");
            String feedback = (String) request.get("feedback");
            
            if (rating == null || rating < 1 || rating > 5) {
                return ApiResponse.error("评分必须在1-5之间");
            }
            
            Evaluation evaluation = evaluationService.submitEvaluation(userId, rating, feedback);
            return ApiResponse.success(evaluation);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/admin/list")
    public ApiResponse<Page<Evaluation>> getEvaluationList(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        try {
            Page<Evaluation> page = new Page<>(current, size);
            QueryWrapper<Evaluation> queryWrapper = new QueryWrapper<>();
            
            if (status != null) {
                queryWrapper.eq("status", status);
            }
            
            queryWrapper.orderByDesc("create_time");
            Page<Evaluation> result = evaluationService.page(page, queryWrapper);
            
            for (Evaluation evaluation : result.getRecords()) {
                User user = userMapper.selectById(evaluation.getUserId());
                if (user != null) {
                    evaluation.setUserNickname(user.getNickname());
                    evaluation.setUserEmail(user.getEmail());
                }
            }
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/admin/updateStatus")
    public ApiResponse<Void> updateStatus(@RequestBody Map<String, Object> request) {
        try {
            Long id = Long.valueOf(request.get("id").toString());
            Integer status = (Integer) request.get("status");
            
            boolean success = evaluationService.updateStatus(id, status);
            if (success) {
                return ApiResponse.success("状态更新成功", null);
            } else {
                return ApiResponse.error("评价不存在");
            }
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    private Long getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7);
            return jwtTokenProvider.getUserIdFromToken(jwtToken);
        }
        throw new RuntimeException("Invalid token");
    }
}
