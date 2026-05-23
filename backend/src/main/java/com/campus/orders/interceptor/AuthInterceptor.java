package com.campus.orders.interceptor;

import com.campus.orders.config.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Resource
    private JwtTokenProvider jwtTokenProvider;

    private static final String[] WHITE_LIST = {
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/sendCode",
            "/api/auth/token/refresh",
            "/api/task-type/list",
            "/api/task/list",
            "/api/task/{id}",
            "/api/statistics/"
    };

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();

        for (String white : WHITE_LIST) {
            if (uri.contains(white.replace("{id}", ""))) {
                return true;
            }
        }

        String token = request.getHeader("Authorization");

        if (!StringUtils.hasText(token)) {
            sendUnauthorizedResponse(response, "未提供认证令牌");
            return false;
        }

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            if (!jwtTokenProvider.validateAccessToken(token)) {
                sendUnauthorizedResponse(response, "令牌无效或已过期");
                return false;
            }

            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            request.setAttribute("userId", userId);

            return true;
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null && message.contains("已过期")) {
                sendUnauthorizedResponse(response, "令牌已过期，请刷新");
            } else {
                sendUnauthorizedResponse(response, "认证失败");
            }
            return false;
        }
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> result = new HashMap<>();
        result.put("code", 401);
        result.put("message", message);
        result.put("data", null);

        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(result));
    }
}
