package com.campus.orders.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.orders.entity.UserNoticeRead;

public interface UserNoticeReadService extends IService<UserNoticeRead> {
    void markAsRead(Long userId, Long noticeId);
    void markAllAsRead(Long userId);
}
