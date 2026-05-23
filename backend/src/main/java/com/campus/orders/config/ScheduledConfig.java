package com.campus.orders.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import javax.annotation.Resource;

@Configuration
@EnableScheduling
public class ScheduledConfig {

    @Resource
    private com.campus.orders.service.TaskService taskService;

    @Scheduled(cron = "0 */5 * * * ?")
    public void updateExpiredTasks() {
        taskService.updateExpiredTasks();
    }
}
