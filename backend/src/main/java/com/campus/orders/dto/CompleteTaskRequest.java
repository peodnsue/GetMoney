package com.campus.orders.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CompleteTaskRequest {
    private Long taskId;
    private String completionProof;
}
