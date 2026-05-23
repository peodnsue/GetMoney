package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.entity.UserLog;
import com.campus.orders.mapper.UserLogMapper;
import com.campus.orders.service.UserLogService;
import org.springframework.stereotype.Service;

@Service
public class UserLogServiceImpl extends ServiceImpl<UserLogMapper, UserLog> implements UserLogService {

    @Override
    public void saveLog(Long userId, String username, Integer action, String ipAddress, String userAgent, Integer status, String message) {
        UserLog log = new UserLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setAction(action);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setStatus(status);
        log.setMessage(message);
        this.save(log);
    }

    @Override
    public Page<UserLog> getLogList(Integer current, Integer size, Integer action, Integer status, String keyword) {
        Page<UserLog> page = new Page<>(current, size);
        return baseMapper.selectPageWithUser(page, action, status, keyword);
    }
}
