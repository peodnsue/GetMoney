package com.campus.orders.dto;

import lombok.Data;

@Data
public class UserLocationStat {
    private String location;
    private Long count;
    private Double percentage;
}
