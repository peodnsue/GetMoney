package com.campus.orders.controller;

import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.LoginRequest;
import com.campus.orders.dto.RegisterRequest;
import com.campus.orders.dto.SendCodeRequest;
import com.campus.orders.entity.User;
import com.campus.orders.service.UserLogService;
import com.campus.orders.service.UserService;
import com.campus.orders.service.VerifyCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private VerifyCodeService verifyCodeService;

    @Autowired
    private UserLogService userLogService;

    @Resource
    private JwtTokenProvider jwtTokenProvider;

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        Map<String, Object> result = new HashMap<>();
        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        try {
            User user;
            if (request.getCode() != null && !request.getCode().isEmpty()) {
                user = userService.loginByEmailCode(request.getEmail(), request.getCode());
            } else {
                user = userService.loginByEmail(request.getEmail(), request.getPassword());
            }

            String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

            userLogService.saveLog(user.getId(), user.getEmail(), 1, ipAddress, userAgent, 1, "登录成功");

            result.put("code", 200);
            result.put("message", "登录成功");
            Map<String, Object> data = new HashMap<>();
            data.put("accessToken", accessToken);
            data.put("refreshToken", refreshToken);
            data.put("user", user);
            data.put("accessTokenExpireTime", System.currentTimeMillis() + jwtTokenProvider.getExpirationTime());
            data.put("refreshTokenExpireTime", System.currentTimeMillis() + jwtTokenProvider.getRefreshExpirationTime());
            result.put("data", data);
        } catch (Exception e) {
            userLogService.saveLog(0L, request.getEmail(), 1, ipAddress, userAgent, 0, e.getMessage());
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        Map<String, Object> result = new HashMap<>();
        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        try {
            User user = userService.register(
                request.getEmail(),
                request.getCode(),
                request.getNickname(),
                request.getPassword()
            );

            String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

            userLogService.saveLog(user.getId(), user.getEmail(), 2, ipAddress, userAgent, 1, "注册成功");

            result.put("code", 200);
            result.put("message", "注册成功");
            Map<String, Object> data = new HashMap<>();
            data.put("accessToken", accessToken);
            data.put("refreshToken", refreshToken);
            data.put("user", user);
            data.put("accessTokenExpireTime", System.currentTimeMillis() + jwtTokenProvider.getExpirationTime());
            data.put("refreshTokenExpireTime", System.currentTimeMillis() + jwtTokenProvider.getRefreshExpirationTime());
            result.put("data", data);
        } catch (Exception e) {
            userLogService.saveLog(0L, request.getEmail(), 2, ipAddress, userAgent, 0, e.getMessage());
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping("/token/refresh")
    public Map<String, Object> refreshToken(@RequestBody Map<String, String> request) {
        Map<String, Object> result = new HashMap<>();
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isEmpty()) {
                result.put("code", 400);
                result.put("message", "缺少refreshToken");
                return result;
            }

            if (!jwtTokenProvider.validateRefreshToken(refreshToken)) {
                result.put("code", 401);
                result.put("message", "refreshToken无效或已过期");
                return result;
            }

            Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
            User user = userService.getUserInfo(userId);

            jwtTokenProvider.invalidateToken(refreshToken);

            String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
            String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

            result.put("code", 200);
            result.put("message", "刷新成功");
            Map<String, Object> data = new HashMap<>();
            data.put("accessToken", newAccessToken);
            data.put("refreshToken", newRefreshToken);
            data.put("user", user);
            data.put("accessTokenExpireTime", System.currentTimeMillis() + jwtTokenProvider.getExpirationTime());
            data.put("refreshTokenExpireTime", System.currentTimeMillis() + jwtTokenProvider.getRefreshExpirationTime());
            result.put("data", data);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        Map<String, Object> result = new HashMap<>();
        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        try {
            String refreshToken = request.get("refreshToken");
            Long userId = 0L;
            String username = "未知用户";
            if (refreshToken != null && !refreshToken.isEmpty()) {
                try {
                    userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
                    User user = userService.getUserInfo(userId);
                    username = user.getEmail();
                } catch (Exception ignored) {}
                jwtTokenProvider.invalidateToken(refreshToken);
            }
            userLogService.saveLog(userId, username, 3, ipAddress, userAgent, 1, "注销成功");
            result.put("code", 200);
            result.put("message", "退出成功");
        } catch (Exception e) {
            userLogService.saveLog(0L, "未知用户", 3, ipAddress, userAgent, 0, e.getMessage());
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PostMapping("/sendCode")
    public Map<String, Object> sendCode(@RequestBody SendCodeRequest request) {
        Map<String, Object> result = new HashMap<>();
        try {
            userService.sendCode(request.getEmail(), request.getType());
            result.put("code", 200);
            result.put("message", "验证码已发送");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/cooldown")
    public Map<String, Object> getCooldown(@RequestParam String email) {
        Map<String, Object> result = new HashMap<>();
        long remaining = verifyCodeService.getRemainingCooldown(email);
        result.put("code", 200);
        result.put("message", "获取成功");
        result.put("data", remaining);
        return result;
    }

    @GetMapping("/profile")
    public Map<String, Object> getProfile(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long userId = jwtTokenProvider.getUserIdFromToken(authHeader.replace("Bearer ", ""));
            User user = userService.getUserInfo(userId);
            result.put("code", 200);
            result.put("message", "获取成功");
            result.put("data", user);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
