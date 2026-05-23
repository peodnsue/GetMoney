package com.campus.orders.dto;

import com.campus.orders.entity.User;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private User user;
}
