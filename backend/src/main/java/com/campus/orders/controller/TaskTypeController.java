package com.campus.orders.controller;

import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.TaskType;
import com.campus.orders.service.TaskTypeService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/task-type")
public class TaskTypeController {

    @Resource
    private TaskTypeService taskTypeService;

    @GetMapping("/list")
    public ApiResponse<List<TaskType>> getAllTaskTypes() {
        List<TaskType> taskTypes = taskTypeService.getAllTaskTypes();
        return ApiResponse.success(taskTypes);
    }

    @GetMapping("/{id}")
    public ApiResponse<TaskType> getTaskTypeById(@PathVariable Long id) {
        TaskType taskType = taskTypeService.getTaskTypeById(id);
        if (taskType == null) {
            return ApiResponse.error("任务类型不存在");
        }
        return ApiResponse.success(taskType);
    }
}
