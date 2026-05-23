package com.campus.orders.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("treasury_account")
public class TreasuryAccount {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("balance")
    private BigDecimal balance;

    @TableField("total_income")
    private BigDecimal totalIncome;

    @TableField("total_expense")
    private BigDecimal totalExpense;

    @TableField("locked_balance")
    private BigDecimal lockedBalance;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;
}