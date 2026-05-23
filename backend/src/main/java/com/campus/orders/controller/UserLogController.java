package com.campus.orders.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.UserLog;
import com.campus.orders.service.UserLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/user-log")
public class UserLogController {

    @Autowired
    private UserLogService userLogService;

    @GetMapping("/list")
    public ApiResponse<Page<UserLog>> getLogList(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer action,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {
        try {
            Page<UserLog> result = userLogService.getLogList(current, size, action, status, keyword);
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
