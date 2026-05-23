package com.campus.orders.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private Long taskId;
    private Long toUserId;
    private Integer score;
    private String content;
    private Integer type;
}
