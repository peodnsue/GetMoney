package com.campus.orders.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.orders.entity.AccountOperationLog;

import java.math.BigDecimal;

public interface AccountOperationLogService {
    void logOperation(Long adminId, Integer operationType, Long targetUserId, BigDecimal amount,
                     String description, BigDecimal beforeBalance, BigDecimal afterBalance,
                     String ipAddress, String userAgent);

    IPage<AccountOperationLog> getOperationLogs(Long adminId, Integer operationType, Long targetUserId, int page, int size);
}
