package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.entity.AccountOperationLog;
import com.campus.orders.mapper.AccountOperationLogMapper;
import com.campus.orders.service.AccountOperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AccountOperationLogServiceImpl implements AccountOperationLogService {

    @Autowired
    private AccountOperationLogMapper accountOperationLogMapper;

    @Override
    public void logOperation(Long adminId, Integer operationType, Long targetUserId, BigDecimal amount,
                          String description, BigDecimal beforeBalance, BigDecimal afterBalance,
                          String ipAddress, String userAgent) {
        AccountOperationLog log = new AccountOperationLog();
        log.setAdminId(adminId);
        log.setOperationType(operationType);
        log.setTargetUserId(targetUserId);
        log.setAmount(amount);
        log.setDescription(description);
        log.setBeforeBalance(beforeBalance);
        log.setAfterBalance(afterBalance);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setCreateTime(LocalDateTime.now());
        
        accountOperationLogMapper.insert(log);
    }

    @Override
    public IPage<AccountOperationLog> getOperationLogs(Long adminId, Integer operationType, Long targetUserId, int page, int size) {
        Page<AccountOperationLog> pageRequest = new Page<>(page, size);
        return accountOperationLogMapper.selectByConditions(pageRequest, adminId, operationType, targetUserId);
    }
}
