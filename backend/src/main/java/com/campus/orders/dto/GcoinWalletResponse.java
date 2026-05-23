package com.campus.orders.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GcoinWalletResponse {
    private BigDecimal balance;
    private BigDecimal totalEarned;
    private BigDecimal totalSpent;
    private BigDecimal holdLimit;
}