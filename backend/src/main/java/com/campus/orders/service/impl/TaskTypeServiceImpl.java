package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.entity.TaskType;
import com.campus.orders.mapper.TaskTypeMapper;
import com.campus.orders.service.TaskTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskTypeServiceImpl extends ServiceImpl<TaskTypeMapper, TaskType> implements TaskTypeService {

    @Override
    public List<TaskType> getAllTaskTypes() {
        LambdaQueryWrapper<TaskType> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaskType::getStatus, 1);
        wrapper.orderByAsc(TaskType::getSortOrder);
        return this.list(wrapper);
    }

    @Override
    public TaskType getTaskTypeById(Long id) {
        return this.getById(id);
    }
}
