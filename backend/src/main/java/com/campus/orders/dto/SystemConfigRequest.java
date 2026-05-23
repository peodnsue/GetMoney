package com.campus.orders.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class SystemConfigRequest {
    @NotBlank(message = "配置键不能为空")
    private String configKey;

    @NotBlank(message = "配置值不能为空")
    private String configValue;

    private String configDesc;
}