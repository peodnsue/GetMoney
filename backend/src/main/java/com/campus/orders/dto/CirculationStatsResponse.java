package com.campus.orders.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CirculationStatsResponse {
    private BigDecimal totalCirculation;
    private BigDecimal dailyProduction;
    private BigDecimal dailyConsumption;
    private BigDecimal treasuryBalance;
    private BigDecimal avgUserHold;
    private Long userCount;
}