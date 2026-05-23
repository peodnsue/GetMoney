package com.campus.orders.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.SysNotice;
import com.campus.orders.entity.UserNoticeRead;
import com.campus.orders.mapper.UserNoticeReadMapper;
import com.campus.orders.service.SysNoticeService;
import com.campus.orders.service.UserNoticeReadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {

    @Autowired
    private SysNoticeService sysNoticeService;

    @Autowired
    private UserNoticeReadService userNoticeReadService;

    @Autowired
    private UserNoticeReadMapper userNoticeReadMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/unread/count")
    public ApiResponse<Map<String, Integer>> getUnreadCount(@RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            int count = sysNoticeService.getUnreadCount(userId);
            Map<String, Integer> result = new HashMap<>();
            result.put("count", count);
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/list")
    public ApiResponse<Page<SysNotice>> getNoticeList(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Long userId = getUserIdFromToken(token);
            
            Page<SysNotice> page = new Page<>(current, size);
            QueryWrapper<SysNotice> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("status", 1);
            queryWrapper.orderByDesc("publish_time");
            
            Page<SysNotice> result = sysNoticeService.page(page, queryWrapper);
            
            for (SysNotice notice : result.getRecords()) {
                UserNoticeRead readRecord = userNoticeReadMapper.selectByUserIdAndNoticeId(userId, notice.getId());
                notice.setIsRead(readRecord != null && readRecord.getIsRead() == 1);
            }
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<SysNotice> getNoticeDetail(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {
            Long userId = getUserIdFromToken(token);
            
            SysNotice notice = sysNoticeService.getById(id);
            if (notice == null || notice.getStatus() != 1) {
                return ApiResponse.error("公告不存在或已下架");
            }
            
            userNoticeReadService.markAsRead(userId, id);
            notice.setIsRead(true);
            
            return ApiResponse.success(notice);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/read/all")
    public ApiResponse<Void> markAllAsRead(@RequestHeader("Authorization") String token) {
        try {
            Long userId = getUserIdFromToken(token);
            userNoticeReadService.markAllAsRead(userId);
            return ApiResponse.success("全部已读", null);
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
