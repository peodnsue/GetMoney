package com.campus.orders.controller;

import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.Message;
import com.campus.orders.service.MessageService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    @Resource
    private MessageService messageService;

    @Resource
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/list")
    public ApiResponse<List<Message>> getMessages(
            @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            List<Message> messages = messageService.getMessagesByUserId(userId);
            return ApiResponse.success(messages);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/unread/count")
    public ApiResponse<Map<String, Integer>> getUnreadCount(
            @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            Integer count = messageService.getUnreadCount(userId);
            Map<String, Integer> result = new HashMap<>();
            result.put("count", count);
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/mark/{id}")
    public ApiResponse<Void> markAsRead(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {
            messageService.markAsRead(id);
            return ApiResponse.success("标记已读成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/markAll")
    public ApiResponse<Void> markAllAsRead(
            @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            messageService.markAllAsRead(userId);
            return ApiResponse.success("全部标记已读成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
