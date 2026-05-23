package com.campus.orders.dto;

import lombok.Data;

@Data
public class SendCodeRequest {
    private String email;
    private String type;
}
