package com.campus.orders.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("statistics")
public class Statistics {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("date")
    private LocalDate date;

    @TableField("total_tasks")
    private Integer totalTasks;

    @TableField("completed_tasks")
    private Integer completedTasks;

    @TableField("total_amount")
    private BigDecimal totalAmount;

    @TableField("active_users")
    private Integer activeUsers;

    @TableField("new_users")
    private Integer newUsers;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;
}
