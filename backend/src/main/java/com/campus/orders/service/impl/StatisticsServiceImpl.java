package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.orders.dto.UserLocationStat;
import com.campus.orders.entity.Statistics;
import com.campus.orders.entity.Task;
import com.campus.orders.entity.User;
import com.campus.orders.mapper.StatisticsMapper;
import com.campus.orders.mapper.TaskMapper;
import com.campus.orders.mapper.UserMapper;
import com.campus.orders.service.StatisticsService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsServiceImpl extends ServiceImpl<StatisticsMapper, Statistics> implements StatisticsService {

    @Resource
    private TaskMapper taskMapper;

    @Resource
    private UserMapper userMapper;
    
    private static final String[] LOCATIONS = {
        "北京市", "上海市", "广州市", "深圳市", "杭州市",
        "南京市", "武汉市", "成都市", "西安市", "重庆市",
        "天津市", "苏州市", "郑州市", "长沙市", "沈阳市"
    };

    @Override
    public Statistics getStatisticsByDate(LocalDate date) {
        return this.baseMapper.findByDate(date);
    }

    @Override
    public List<Statistics> getStatisticsByDateRange(LocalDate startDate, LocalDate endDate) {
        LambdaQueryWrapper<Statistics> wrapper = new LambdaQueryWrapper<>();
        wrapper.ge(Statistics::getDate, startDate);
        wrapper.le(Statistics::getDate, endDate);
        wrapper.orderByAsc(Statistics::getDate);
        return this.list(wrapper);
    }

    @Override
    public void updateDailyStatistics(LocalDate date) {
        Statistics existing = this.baseMapper.findByDate(date);
        if (existing == null) {
            existing = new Statistics();
            existing.setDate(date);
        }

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        LambdaQueryWrapper<Task> taskWrapper = new LambdaQueryWrapper<>();
        taskWrapper.ge(Task::getCreateTime, startOfDay);
        taskWrapper.lt(Task::getCreateTime, endOfDay);
        existing.setTotalTasks(taskMapper.selectCount(taskWrapper).intValue());

        LambdaQueryWrapper<Task> completedWrapper = new LambdaQueryWrapper<>();
        completedWrapper.ge(Task::getCreateTime, startOfDay);
        completedWrapper.lt(Task::getCreateTime, endOfDay);
        completedWrapper.eq(Task::getStatus, 4);
        List<Task> completedTasks = taskMapper.selectList(completedWrapper);
        existing.setCompletedTasks(completedTasks.size());

        BigDecimal totalAmount = completedTasks.stream()
                .map(Task::getCommission)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        existing.setTotalAmount(totalAmount);

        LambdaQueryWrapper<User> activeWrapper = new LambdaQueryWrapper<>();
        activeWrapper.ge(User::getUpdateTime, startOfDay);
        activeWrapper.lt(User::getUpdateTime, endOfDay);
        existing.setActiveUsers(userMapper.selectCount(activeWrapper).intValue());

        LambdaQueryWrapper<User> newWrapper = new LambdaQueryWrapper<>();
        newWrapper.ge(User::getCreateTime, startOfDay);
        newWrapper.lt(User::getCreateTime, endOfDay);
        existing.setNewUsers(userMapper.selectCount(newWrapper).intValue());

        existing.setCreateTime(LocalDateTime.now());
        existing.setUpdateTime(LocalDateTime.now());

        this.saveOrUpdate(existing);
    }

    @Override
    public List<UserLocationStat> getUserLocationStatistics() {
        long totalUsers = userMapper.selectCount(null);
        
        Map<String, Long> locationCounts = new HashMap<>();
        for (String location : LOCATIONS) {
            locationCounts.put(location, 0L);
        }
        
        List<User> users = userMapper.selectList(null);
        for (User user : users) {
            int index = Math.abs(user.getId().intValue() % LOCATIONS.length);
            String location = LOCATIONS[index];
            locationCounts.merge(location, 1L, Long::sum);
        }
        
        List<UserLocationStat> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : locationCounts.entrySet()) {
            if (entry.getValue() > 0) {
                UserLocationStat stat = new UserLocationStat();
                stat.setLocation(entry.getKey());
                stat.setCount(entry.getValue());
                stat.setPercentage(totalUsers > 0 ? (entry.getValue() * 100.0 / totalUsers) : 0.0);
                result.add(stat);
            }
        }
        
        result.sort((a, b) -> Long.compare(b.getCount(), a.getCount()));
        
        return result;
    }
}
