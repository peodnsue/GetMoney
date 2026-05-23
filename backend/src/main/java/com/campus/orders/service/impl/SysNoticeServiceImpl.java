package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.entity.SysNotice;
import com.campus.orders.mapper.SysNoticeMapper;
import com.campus.orders.mapper.UserNoticeReadMapper;
import com.campus.orders.service.SysNoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SysNoticeServiceImpl extends ServiceImpl<SysNoticeMapper, SysNotice> implements SysNoticeService {

    @Autowired
    private UserNoticeReadMapper userNoticeReadMapper;

    @Override
    public SysNotice publishNotice(SysNotice notice, Long adminId) {
        notice.setAdminId(adminId);
        notice.setPublishTime(LocalDateTime.now());
        notice.setStatus(1);
        this.save(notice);
        return notice;
    }

    @Override
    public int getUnreadCount(Long userId) {
        return userNoticeReadMapper.countUnreadNotices(userId);
    }
}
