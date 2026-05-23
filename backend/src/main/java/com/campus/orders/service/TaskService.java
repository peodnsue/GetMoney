package com.campus.orders.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.orders.dto.TaskRequest;
import com.campus.orders.dto.PageRequest;
import com.campus.orders.dto.PageResponse;
import com.campus.orders.entity.Task;
import java.util.List;

public interface TaskService extends IService<Task> {
    PageResponse<Task> getTaskList(PageRequest pageRequest, Long typeId, String building, Integer status);
    Task getTaskById(Long id);
    Task createTask(Long publisherId, TaskRequest request);
    Task acceptTask(Long taskId, Long acceptorId);
    Task submitCompletion(Long taskId, String completionProof);
    Task confirmCompletion(Long taskId);
    void cancelTask(Long taskId, Long userId);
    List<Task> getMyPublishedTasks(Long userId);
    List<Task> getMyAcceptedTasks(Long userId);
    void updateExpiredTasks();
}
