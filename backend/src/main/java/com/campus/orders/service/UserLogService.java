package com.campus.orders.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.entity.UserLog;

public interface UserLogService {

    void saveLog(Long userId, String username, Integer action, String ipAddress, String userAgent, Integer status, String message);

    Page<UserLog> getLogList(Integer current, Integer size, Integer action, Integer status, String keyword);
}
