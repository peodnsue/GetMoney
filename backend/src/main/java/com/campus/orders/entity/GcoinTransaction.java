package com.campus.orders.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("gcoin_transaction")
public class GcoinTransaction {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("type")
    private Integer type;

    @TableField("amount")
    private BigDecimal amount;

    @TableField("balance_before")
    private BigDecimal balanceBefore;

    @TableField("balance_after")
    private BigDecimal balanceAfter;

    @TableField("description")
    private String description;

    @TableField("related_user_id")
    private Long relatedUserId;

    @TableField("fee")
    private BigDecimal fee;

    @TableField("treasury_operation")
    private Integer treasuryOperation;

    @TableField("created_at")
    private LocalDateTime createdAt;
}