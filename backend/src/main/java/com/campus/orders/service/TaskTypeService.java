package com.campus.orders.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.campus.orders.entity.TaskType;
import java.util.List;

public interface TaskTypeService extends IService<TaskType> {
    List<TaskType> getAllTaskTypes();
    TaskType getTaskTypeById(Long id);
}
