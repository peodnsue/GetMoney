package com.campus.orders.controller;

import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.entity.User;
import com.campus.orders.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Resource
    private UserService userService;

    @Resource
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserInfo(id);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/update")
    public ApiResponse<User> updateUser(
            @RequestHeader("Authorization") String token,
            @RequestBody User user) {
        try {
            Long userId = getUserIdFromToken(token);
            User updatedUser = userService.updateUser(userId, user);
            return ApiResponse.success(updatedUser);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/changePassword")
    public ApiResponse<Void> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            Long userId = getUserIdFromToken(token);
            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");
            String code = request.get("code");
            
            userService.changePassword(userId, oldPassword, newPassword, code);
            return ApiResponse.success("密码修改成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/changeEmail")
    public ApiResponse<Void> changeEmail(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            Long userId = getUserIdFromToken(token);
            String email = request.get("email");
            String code = request.get("code");
            
            userService.changeEmail(userId, email, code);
            return ApiResponse.success("邮箱修改成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/uploadAvatar")
    public ApiResponse<Void> uploadAvatar(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            Long userId = getUserIdFromToken(token);
            String avatar = request.get("avatar");
            
            userService.uploadAvatar(userId, avatar);
            return ApiResponse.success("头像上传成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    private Long getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7);
            return jwtTokenProvider.getUserIdFromToken(jwtToken);
        }
        throw new RuntimeException("Invalid token");
    }
}
