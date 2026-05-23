package com.campus.orders.dto;

import lombok.Data;

@Data
public class PageRequest {
    private Integer page = 1;
    private Integer pageSize = 10;
}
