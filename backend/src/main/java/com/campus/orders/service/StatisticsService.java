package com.campus.orders.service;

import com.campus.orders.dto.UserLocationStat;
import com.campus.orders.entity.Statistics;
import com.baomidou.mybatisplus.extension.service.IService;
import java.time.LocalDate;
import java.util.List;

public interface StatisticsService extends IService<Statistics> {
    Statistics getStatisticsByDate(LocalDate date);
    List<Statistics> getStatisticsByDateRange(LocalDate startDate, LocalDate endDate);
    void updateDailyStatistics(LocalDate date);
    List<UserLocationStat> getUserLocationStatistics();
}
