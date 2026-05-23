package com.campus.orders.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.AccountOperationLog;
import com.campus.orders.service.AccountOperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/account-operation-logs")
public class AccountOperationLogController {

    @Autowired
    private AccountOperationLogService accountOperationLogService;

    @GetMapping
    public ApiResponse<IPage<AccountOperationLog>> getOperationLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long adminId,
            @RequestParam(required = false) Integer operationType,
            @RequestParam(required = false) Long targetUserId) {
        IPage<AccountOperationLog> logs = accountOperationLogService.getOperationLogs(adminId, operationType, targetUserId, page, size);
        return ApiResponse.success(logs);
    }
}
