package com.campus.orders.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String code;
    private String nickname;
    private String password;
}
