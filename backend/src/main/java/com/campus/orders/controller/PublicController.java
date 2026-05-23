package com.campus.orders.controller;

import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.Banner;
import com.campus.orders.service.BannerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Resource
    private BannerService bannerService;

    @GetMapping("/banners")
    public ApiResponse<List<Banner>> getBanners() {
        List<Banner> banners = bannerService.getActiveBanners();
        return ApiResponse.success(banners);
    }
}
