package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.dto.PageRequest;
import com.campus.orders.dto.PageResponse;
import com.campus.orders.dto.TaskRequest;
import com.campus.orders.entity.Task;
import com.campus.orders.entity.TaskAccept;
import com.campus.orders.entity.TaskType;
import com.campus.orders.entity.User;
import com.campus.orders.mapper.TaskAcceptMapper;
import com.campus.orders.mapper.TaskMapper;
import com.campus.orders.mapper.UserMapper;
import com.campus.orders.service.GcoinService;
import com.campus.orders.service.TaskService;
import com.campus.orders.service.TaskTypeService;
import com.campus.orders.service.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements TaskService {

    @Resource
    private TaskTypeService taskTypeService;

    @Resource
    private UserService userService;

    @Resource
    private UserMapper userMapper;

    @Resource
    private GcoinService gcoinService;

    @Resource
    private TaskAcceptMapper taskAcceptMapper;

    @Override
    public PageResponse<Task> getTaskList(PageRequest pageRequest, Long typeId, String building, Integer status) {
        Page<Task> page = new Page<>(pageRequest.getPage(), pageRequest.getPageSize());
        LambdaQueryWrapper<Task> wrapper = new LambdaQueryWrapper<>();

        if (typeId != null) {
            wrapper.eq(Task::getTypeId, typeId);
        }
        if (building != null && !building.isEmpty()) {
            wrapper.like(Task::getBuilding, building);
        }
        if (status != null) {
            wrapper.eq(Task::getStatus, status);
        }

        wrapper.orderByDesc(Task::getCreateTime);
        IPage<Task> result = this.page(page, wrapper);

        List<Task> tasks = result.getRecords().stream().map(task -> {
            TaskType taskType = taskTypeService.getById(task.getTypeId());
            if (taskType != null) {
                task.setTypeName(taskType.getName());
            }
            User publisher = userMapper.selectById(task.getPublisherId());
            if (publisher != null) {
                task.setPublisherName(publisher.getNickname());
                task.setPublisherAvatar(publisher.getAvatar());
            }
            if (task.getAcceptorId() != null) {
                User acceptor = userMapper.selectById(task.getAcceptorId());
                if (acceptor != null) {
                    task.setAcceptorName(acceptor.getNickname());
                }
                TaskAccept taskAccept = taskAcceptMapper.selectOne(
                    new LambdaQueryWrapper<TaskAccept>()
                        .eq(TaskAccept::getTaskId, task.getId())
                        .orderByDesc(TaskAccept::getCreateTime)
                        .last("LIMIT 1")
                );
                if (taskAccept != null) {
                    task.setAcceptTime(taskAccept.getAcceptTime());
                    task.setCompleteTime(taskAccept.getCompleteTime());
                }
            }
            return task;
        }).collect(Collectors.toList());

        return new PageResponse<>(result.getTotal(), result.getCurrent(), result.getSize(), tasks);
    }

    @Override
    public Task getTaskById(Long id) {
        Task task = this.getById(id);
        if (task != null) {
            TaskType taskType = taskTypeService.getById(task.getTypeId());
            if (taskType != null) {
                task.setTypeName(taskType.getName());
            }
            User publisher = userMapper.selectById(task.getPublisherId());
            if (publisher != null) {
                task.setPublisherName(publisher.getNickname());
                task.setPublisherAvatar(publisher.getAvatar());
            }
            if (task.getAcceptorId() != null) {
                User acceptor = userMapper.selectById(task.getAcceptorId());
                if (acceptor != null) {
                    task.setAcceptorName(acceptor.getNickname());
                }
                TaskAccept taskAccept = taskAcceptMapper.selectOne(
                    new LambdaQueryWrapper<TaskAccept>()
                        .eq(TaskAccept::getTaskId, task.getId())
                        .orderByDesc(TaskAccept::getCreateTime)
                        .last("LIMIT 1")
                );
                if (taskAccept != null) {
                    task.setAcceptTime(taskAccept.getAcceptTime());
                    task.setCompleteTime(taskAccept.getCompleteTime());
                }
            }
        }
        return task;
    }

    @Override
    @Transactional
    public Task createTask(Long publisherId, TaskRequest request) {
        Task task = new Task();
        task.setPublisherId(publisherId);
        task.setTypeId(request.getTypeId());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCommission(request.getCommission());
        task.setDeposit(request.getDeposit());
        task.setDeadline(request.getDeadline());
        task.setBuilding(request.getBuilding());
        task.setAddress(request.getAddress());
        task.setStatus(1);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                task.setImages(mapper.writeValueAsString(request.getImages()));
            } catch (IOException e) {
                task.setImages("[]");
            }
        } else {
            task.setImages("[]");
        }

        this.save(task);

        gcoinService.deductGcoin(publisherId, task.getCommission(), 6, "发布任务佣金托管");
        gcoinService.treasuryTransferIn(task.getCommission(), "任务佣金托管-" + task.getId());

        return task;
    }

    @Override
    @Transactional
    public Task acceptTask(Long taskId, Long acceptorId) {
        Task task = this.getById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }
        if (task.getStatus() != 1) {
            throw new RuntimeException("任务状态不允许接单");
        }
        if (task.getPublisherId().equals(acceptorId)) {
            throw new RuntimeException("不允许接自己发布的任务");
        }

        task.setAcceptorId(acceptorId);
        task.setStatus(2);
        this.updateById(task);

        TaskAccept taskAccept = new TaskAccept();
        taskAccept.setTaskId(taskId);
        taskAccept.setAcceptorId(acceptorId);
        taskAccept.setAcceptTime(LocalDateTime.now());
        taskAccept.setCreateTime(LocalDateTime.now());
        taskAcceptMapper.insert(taskAccept);

        return task;
    }

    @Override
    @Transactional
    public Task submitCompletion(Long taskId, String completionProof) {
        Task task = this.getById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }
        if (task.getStatus() != 2) {
            throw new RuntimeException("任务状态不允许完成");
        }

        task.setStatus(3);
        this.updateById(task);

        TaskAccept taskAccept = taskAcceptMapper.selectOne(
            new LambdaQueryWrapper<TaskAccept>()
                .eq(TaskAccept::getTaskId, taskId)
                .orderByDesc(TaskAccept::getCreateTime)
                .last("LIMIT 1")
        );
        if (taskAccept != null) {
            taskAccept.setCompleteTime(LocalDateTime.now());
            taskAcceptMapper.updateById(taskAccept);
        }

        return task;
    }

    @Override
    @Transactional
    public Task confirmCompletion(Long taskId) {
        Task task = this.getById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }
        if (task.getStatus() != 3) {
            throw new RuntimeException("任务状态不允许确认完成");
        }

        task.setStatus(4);
        this.updateById(task);

        BigDecimal commission = task.getCommission();
        BigDecimal feeRate = new BigDecimal(gcoinService.getSystemConfig("transfer_fee_rate").getConfigValue());
        BigDecimal fee = commission.multiply(feeRate);
        BigDecimal actualReward = commission.subtract(fee);

        gcoinService.addGcoin(task.getAcceptorId(), actualReward, 2, "完成任务获得奖励");
        gcoinService.treasuryTransferOut(commission, "任务结算-" + task.getId());
        gcoinService.treasuryTransferIn(fee, "任务手续费-" + task.getId());

        return task;
    }

    @Override
    @Transactional
    public void cancelTask(Long taskId, Long userId) {
        Task task = this.getById(taskId);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }
        if (task.getStatus() != 1 && task.getStatus() != 2) {
            throw new RuntimeException("任务状态不允许取消");
        }
        if (!task.getPublisherId().equals(userId)) {
            throw new RuntimeException("只有发布者可以取消任务");
        }

        task.setStatus(5);
        this.updateById(task);

        gcoinService.addGcoin(task.getPublisherId(), task.getCommission(), 3, "任务取消佣金退还");
        gcoinService.treasuryTransferOut(task.getCommission().negate(), "任务取消退还-" + task.getId());
    }

    @Override
    public List<Task> getMyPublishedTasks(Long userId) {
        LambdaQueryWrapper<Task> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Task::getPublisherId, userId)
               .orderByDesc(Task::getCreateTime);
        
        List<Task> tasks = this.list(wrapper);
        return tasks.stream().map(task -> {
            TaskType taskType = taskTypeService.getById(task.getTypeId());
            if (taskType != null) {
                task.setTypeName(taskType.getName());
            }
            User publisher = userMapper.selectById(task.getPublisherId());
            if (publisher != null) {
                task.setPublisherName(publisher.getNickname());
                task.setPublisherAvatar(publisher.getAvatar());
            }
            if (task.getAcceptorId() != null) {
                User acceptor = userMapper.selectById(task.getAcceptorId());
                if (acceptor != null) {
                    task.setAcceptorName(acceptor.getNickname());
                }
            }
            return task;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Task> getMyAcceptedTasks(Long userId) {
        LambdaQueryWrapper<Task> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Task::getAcceptorId, userId)
               .orderByDesc(Task::getCreateTime);
        
        List<Task> tasks = this.list(wrapper);
        return tasks.stream().map(task -> {
            TaskType taskType = taskTypeService.getById(task.getTypeId());
            if (taskType != null) {
                task.setTypeName(taskType.getName());
            }
            User publisher = userMapper.selectById(task.getPublisherId());
            if (publisher != null) {
                task.setPublisherName(publisher.getNickname());
                task.setPublisherAvatar(publisher.getAvatar());
            }
            User acceptor = userMapper.selectById(task.getAcceptorId());
            if (acceptor != null) {
                task.setAcceptorName(acceptor.getNickname());
            }
            return task;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateExpiredTasks() {
        LambdaQueryWrapper<Task> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Task::getStatus, 1)
               .lt(Task::getDeadline, LocalDateTime.now());
        
        List<Task> expiredTasks = this.list(wrapper);
        for (Task task : expiredTasks) {
            task.setStatus(5);
            this.updateById(task);
        }
    }
}
