package com.campus.orders.controller;

import com.campus.orders.dto.ApiResponse;
import com.campus.orders.dto.UserLocationStat;
import com.campus.orders.entity.Statistics;
import com.campus.orders.service.StatisticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Resource
    private StatisticsService statisticsService;

    @GetMapping("/today")
    public ApiResponse<Statistics> getTodayStatistics() {
        Statistics statistics = statisticsService.getStatisticsByDate(LocalDate.now());
        if (statistics == null) {
            statisticsService.updateDailyStatistics(LocalDate.now());
            statistics = statisticsService.getStatisticsByDate(LocalDate.now());
        }
        return ApiResponse.success(statistics);
    }

    @GetMapping("/date/{date}")
    public ApiResponse<Statistics> getStatisticsByDate(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        Statistics statistics = statisticsService.getStatisticsByDate(date);
        if (statistics == null) {
            return ApiResponse.error("该日期统计数据不存在");
        }
        return ApiResponse.success(statistics);
    }

    @GetMapping("/range")
    public ApiResponse<List<Statistics>> getStatisticsByDateRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        List<Statistics> statistics = statisticsService.getStatisticsByDateRange(startDate, endDate);
        return ApiResponse.success(statistics);
    }

    @PostMapping("/refresh/{date}")
    public ApiResponse<Void> refreshStatistics(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        try {
            statisticsService.updateDailyStatistics(date);
            return ApiResponse.success("统计数据已更新", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/user-location")
    public ApiResponse<List<UserLocationStat>> getUserLocationStatistics() {
        List<UserLocationStat> statistics = statisticsService.getUserLocationStatistics();
        return ApiResponse.success(statistics);
    }
}
