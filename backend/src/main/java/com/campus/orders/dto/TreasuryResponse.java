package com.campus.orders.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TreasuryResponse {
    private BigDecimal balance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal lockedBalance;
}