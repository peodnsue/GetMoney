package com.campus.orders.controller;

import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.*;
import com.campus.orders.entity.Task;
import com.campus.orders.service.TaskService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    @Resource
    private TaskService taskService;

    @Resource
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/list")
    public ApiResponse<PageResponse<Task>> getTaskList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Long typeId,
            @RequestParam(required = false) String building,
            @RequestParam(required = false) Integer status) {

        PageRequest pageRequest = new PageRequest();
        pageRequest.setPage(page);
        pageRequest.setPageSize(pageSize);

        PageResponse<Task> result = taskService.getTaskList(pageRequest, typeId, building, status);
        return ApiResponse.success(result);
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        if (task == null) {
            return ApiResponse.error("任务不存在");
        }
        return ApiResponse.success(task);
    }

    @PostMapping("/create")
    public ApiResponse<Task> createTask(
            @RequestHeader("Authorization") String token,
            @RequestBody TaskRequest request) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            Task task = taskService.createTask(userId, request);
            return ApiResponse.success(task);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/accept/{id}")
    public ApiResponse<Task> acceptTask(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            Task task = taskService.acceptTask(id, userId);
            return ApiResponse.success(task);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/complete")
    public ApiResponse<Task> submitCompletion(
            @RequestHeader("Authorization") String token,
            @RequestBody CompleteTaskRequest request) {
        try {
            Task task = taskService.submitCompletion(request.getTaskId(), request.getCompletionProof());
            return ApiResponse.success(task);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/confirm/{id}")
    public ApiResponse<Task> confirmCompletion(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {
            Task task = taskService.confirmCompletion(id);
            return ApiResponse.success(task);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/cancel/{id}")
    public ApiResponse<Void> cancelTask(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            taskService.cancelTask(id, userId);
            return ApiResponse.success("任务已取消", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/my/published")
    public ApiResponse<List<Task>> getMyPublishedTasks(
            @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            List<Task> tasks = taskService.getMyPublishedTasks(userId);
            return ApiResponse.success(tasks);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/my/accepted")
    public ApiResponse<List<Task>> getMyAcceptedTasks(
            @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(token.replace("Bearer ", ""));
            List<Task> tasks = taskService.getMyAcceptedTasks(userId);
            return ApiResponse.success(tasks);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
