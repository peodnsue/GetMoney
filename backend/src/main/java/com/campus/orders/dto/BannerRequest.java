package com.campus.orders.dto;

import lombok.Data;

@Data
public class BannerRequest {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String linkUrl;
    private Integer sort;
    private Integer status;
}
