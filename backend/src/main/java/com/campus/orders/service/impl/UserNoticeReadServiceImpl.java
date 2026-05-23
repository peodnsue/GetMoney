package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.entity.SysNotice;
import com.campus.orders.entity.UserNoticeRead;
import com.campus.orders.mapper.SysNoticeMapper;
import com.campus.orders.mapper.UserNoticeReadMapper;
import com.campus.orders.service.UserNoticeReadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserNoticeReadServiceImpl extends ServiceImpl<UserNoticeReadMapper, UserNoticeRead> implements UserNoticeReadService {

    @Autowired
    private SysNoticeMapper sysNoticeMapper;

    @Override
    @Transactional
    public void markAsRead(Long userId, Long noticeId) {
        UserNoticeRead record = this.getBaseMapper().selectByUserIdAndNoticeId(userId, noticeId);
        if (record == null) {
            record = new UserNoticeRead();
            record.setUserId(userId);
            record.setNoticeId(noticeId);
            record.setIsRead(1);
            record.setReadTime(LocalDateTime.now());
            this.save(record);
        } else if (record.getIsRead() == 0) {
            record.setIsRead(1);
            record.setReadTime(LocalDateTime.now());
            this.updateById(record);
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        QueryWrapper<SysNotice> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", 1);
        java.util.List<SysNotice> notices = sysNoticeMapper.selectList(queryWrapper);

        for (SysNotice notice : notices) {
            markAsRead(userId, notice.getId());
        }
    }
}
