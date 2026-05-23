package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.entity.Message;
import com.campus.orders.mapper.MessageMapper;
import com.campus.orders.service.MessageService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {

    @Override
    public List<Message> getMessagesByUserId(Long userId) {
        LambdaQueryWrapper<Message> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Message::getUserId, userId);
        wrapper.orderByDesc(Message::getCreateTime);
        return this.list(wrapper);
    }

    @Override
    public void sendMessage(Long userId, Long taskId, Integer type, String title, String content) {
        Message message = new Message();
        message.setUserId(userId);
        message.setTaskId(taskId);
        message.setType(type);
        message.setTitle(title);
        message.setContent(content);
        message.setReadStatus(0);
        message.setCreateTime(LocalDateTime.now());
        message.setUpdateTime(LocalDateTime.now());

        this.save(message);
    }

    @Override
    public void markAsRead(Long messageId) {
        Message message = this.getById(messageId);
        if (message != null) {
            message.setReadStatus(1);
            message.setUpdateTime(LocalDateTime.now());
            this.updateById(message);
        }
    }

    @Override
    public void markAllAsRead(Long userId) {
        this.baseMapper.markAllAsRead(userId);
    }

    @Override
    public Integer getUnreadCount(Long userId) {
        return this.baseMapper.countUnreadByUserId(userId);
    }
}
