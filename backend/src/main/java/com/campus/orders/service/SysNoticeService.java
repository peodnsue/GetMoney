package com.campus.orders.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.orders.entity.SysNotice;

public interface SysNoticeService extends IService<SysNotice> {
    SysNotice publishNotice(SysNotice notice, Long adminId);
    int getUnreadCount(Long userId);
}
