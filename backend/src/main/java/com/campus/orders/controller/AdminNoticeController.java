package com.campus.orders.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.SysNotice;
import com.campus.orders.mapper.UserNoticeReadMapper;
import com.campus.orders.service.SysNoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/notice")
public class AdminNoticeController {

    @Autowired
    private SysNoticeService sysNoticeService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserNoticeReadMapper userNoticeReadMapper;

    @GetMapping("/list")
    public ApiResponse<Page<SysNotice>> getNoticeList(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        try {
            Page<SysNotice> page = new Page<>(current, size);
            com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<SysNotice> queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<SysNotice>();
            
            if (status != null) {
                queryWrapper.eq("status", status);
            }
            
            queryWrapper.orderByDesc("create_time");
            Page<SysNotice> result = sysNoticeService.page(page, queryWrapper);
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<SysNotice> getNoticeById(@PathVariable Long id) {
        try {
            SysNotice notice = sysNoticeService.getById(id);
            if (notice == null) {
                return ApiResponse.error("公告不存在");
            }
            return ApiResponse.success(notice);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/publish")
    public ApiResponse<SysNotice> publishNotice(
            @RequestHeader("Authorization") String token,
            @RequestBody SysNotice notice) {
        try {
            Long adminId = getUserIdFromToken(token);
            SysNotice published = sysNoticeService.publishNotice(notice, adminId);
            return ApiResponse.success(published);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ApiResponse<Void> updateNotice(
            @PathVariable Long id,
            @RequestBody SysNotice notice) {
        try {
            SysNotice existing = sysNoticeService.getById(id);
            if (existing == null) {
                return ApiResponse.error("公告不存在");
            }
            existing.setTitle(notice.getTitle());
            existing.setContent(notice.getContent());
            existing.setNoticeType(notice.getNoticeType());
            
            if (existing.getStatus() == 1) {
                existing.setPublishTime(LocalDateTime.now());
                userNoticeReadMapper.deleteByNoticeId(id);
            }
            
            sysNoticeService.updateById(existing);
            return ApiResponse.success("更新成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/status/{id}")
    public ApiResponse<Void> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer status = request.get("status");
            SysNotice notice = sysNoticeService.getById(id);
            if (notice == null) {
                return ApiResponse.error("公告不存在");
            }
            
            if (status == 1) {
                notice.setPublishTime(LocalDateTime.now());
                userNoticeReadMapper.deleteByNoticeId(id);
            }
            
            notice.setStatus(status);
            sysNoticeService.updateById(notice);
            return ApiResponse.success("状态更新成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNotice(@PathVariable Long id) {
        try {
            sysNoticeService.removeById(id);
            return ApiResponse.success("删除成功", null);
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
