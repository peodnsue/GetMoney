package com.campus.orders.service;

import com.campus.orders.entity.Message;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

public interface MessageService extends IService<Message> {
    List<Message> getMessagesByUserId(Long userId);
    void sendMessage(Long userId, Long taskId, Integer type, String title, String content);
    void markAsRead(Long messageId);
    void markAllAsRead(Long userId);
    Integer getUnreadCount(Long userId);
}
