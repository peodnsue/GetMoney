package com.campus.orders.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("account_operation_log")
public class AccountOperationLog {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("admin_id")
    private Long adminId;

    @TableField("operation_type")
    private Integer operationType;

    @TableField("target_user_id")
    private Long targetUserId;

    @TableField("amount")
    private BigDecimal amount;

    @TableField("description")
    private String description;

    @TableField("before_balance")
    private BigDecimal beforeBalance;

    @TableField("after_balance")
    private BigDecimal afterBalance;

    @TableField("ip_address")
    private String ipAddress;

    @TableField("user_agent")
    private String userAgent;

    @TableField("create_time")
    private LocalDateTime createTime;
}
