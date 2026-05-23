package com.campus.orders.controller;

import com.campus.orders.dto.ApiResponse;
import com.campus.orders.dto.BannerRequest;
import com.campus.orders.dto.PageRequest;
import com.campus.orders.dto.PageResponse;
import com.campus.orders.entity.Banner;
import com.campus.orders.entity.User;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.service.BannerService;
import com.campus.orders.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Resource
    private UserService userService;

    @Resource
    private BannerService bannerService;

    @GetMapping("/users")
    public ApiResponse<PageResponse<User>> getUsers(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Integer role,
            @RequestParam(required = false) Integer status) {

        Page<User> pageObj = new Page<>(page, pageSize);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

        if (role != null) {
            wrapper.eq(User::getRole, role);
        }
        if (status != null) {
            wrapper.eq(User::getStatus, status);
        }

        Page<User> result = userService.page(pageObj, wrapper);
        PageResponse<User> response = new PageResponse<>(
                result.getTotal(),
                result.getCurrent(),
                result.getSize(),
                result.getRecords()
        );

        return ApiResponse.success(response);
    }

    @PutMapping("/users/{id}/status")
    public ApiResponse<Void> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        try {
            User user = userService.getById(id);
            if (user == null) {
                return ApiResponse.error("用户不存在");
            }
            user.setStatus(status);
            userService.updateById(user);
            return ApiResponse.success("状态更新成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public ApiResponse<Void> updateUserRole(
            @PathVariable Long id,
            @RequestParam Integer role) {
        try {
            User user = userService.getById(id);
            if (user == null) {
                return ApiResponse.error("用户不存在");
            }
            user.setRole(role);
            userService.updateById(user);
            return ApiResponse.success("角色更新成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/banners")
    public ApiResponse<List<Banner>> getBanners() {
        List<Banner> banners = bannerService.list(
            new LambdaQueryWrapper<Banner>()
                .orderByAsc(Banner::getSort)
                .orderByDesc(Banner::getCreateTime)
        );
        return ApiResponse.success(banners);
    }

    @PostMapping("/banners")
    public ApiResponse<Banner> createBanner(@RequestBody BannerRequest request) {
        try {
            Banner banner = new Banner();
            banner.setTitle(request.getTitle());
            banner.setDescription(request.getDescription());
            banner.setImageUrl(request.getImageUrl());
            banner.setLinkUrl(request.getLinkUrl());
            banner.setSort(request.getSort() != null ? request.getSort() : 0);
            banner.setStatus(request.getStatus() != null ? request.getStatus() : 1);
            banner.setCreateTime(LocalDateTime.now());
            banner.setUpdateTime(LocalDateTime.now());
            bannerService.save(banner);
            return ApiResponse.success(banner);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/banners/{id}")
    public ApiResponse<Banner> updateBanner(
            @PathVariable Long id,
            @RequestBody BannerRequest request) {
        try {
            Banner banner = bannerService.getById(id);
            if (banner == null) {
                return ApiResponse.error("轮播图不存在");
            }
            if (request.getTitle() != null) banner.setTitle(request.getTitle());
            if (request.getDescription() != null) banner.setDescription(request.getDescription());
            if (request.getImageUrl() != null) banner.setImageUrl(request.getImageUrl());
            if (request.getLinkUrl() != null) banner.setLinkUrl(request.getLinkUrl());
            if (request.getSort() != null) banner.setSort(request.getSort());
            if (request.getStatus() != null) banner.setStatus(request.getStatus());
            banner.setUpdateTime(LocalDateTime.now());
            bannerService.updateById(banner);
            return ApiResponse.success(banner);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/banners/{id}")
    public ApiResponse<Void> deleteBanner(@PathVariable Long id) {
        try {
            bannerService.removeById(id);
            return ApiResponse.success("删除成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
