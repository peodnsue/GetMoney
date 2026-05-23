package com.campus.orders.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerifyCodeService {

    private final Map<String, CodeInfo> codeMap = new ConcurrentHashMap<>();
    private static final long EXPIRE_TIME = 5 * 60 * 1000;
    private static final long COOL_DOWN_TIME = 60 * 1000;

    @Value("${app.dev.enable:false}")
    private boolean devMode;

    @Value("${app.dev.test-code:123456}")
    private String testCode;

    public void sendCode(String email, String code) {
        checkCoolDown(email);
        
        if (devMode) {
            code = testCode;
            System.out.println("【开发模式】使用固定测试验证码: email=" + email + ", code=" + code);
        }
        codeMap.put(email, new CodeInfo(code, System.currentTimeMillis()));
        System.out.println("发送验证码成功: email=" + email + ", code=" + code);
    }

    public long getRemainingCooldown(String email) {
        CodeInfo codeInfo = codeMap.get(email);
        if (codeInfo == null) {
            return 0;
        }
        long elapsed = System.currentTimeMillis() - codeInfo.timestamp;
        if (elapsed >= COOL_DOWN_TIME) {
            return 0;
        }
        return COOL_DOWN_TIME - elapsed;
    }

    private void checkCoolDown(String email) {
        CodeInfo codeInfo = codeMap.get(email);
        if (codeInfo != null) {
            long elapsed = System.currentTimeMillis() - codeInfo.timestamp;
            if (elapsed < COOL_DOWN_TIME) {
                throw new RuntimeException("请求过于频繁，请" + ((COOL_DOWN_TIME - elapsed) / 1000) + "秒后再试");
            }
        }
    }

    public boolean verifyCode(String email, String code) {
        if (devMode && testCode.equals(code)) {
            System.out.println("【开发模式】测试验证码验证成功: email=" + email);
            return true;
        }
        
        CodeInfo codeInfo = codeMap.get(email);
        System.out.println("验证验证码: email=" + email + ", input code=" + code + ", stored code=" + (codeInfo != null ? codeInfo.code : "null"));
        
        if (codeInfo == null) {
            return false;
        }

        if (System.currentTimeMillis() - codeInfo.timestamp > EXPIRE_TIME) {
            codeMap.remove(email);
            return false;
        }

        if (codeInfo.code.equals(code)) {
            codeMap.remove(email);
            return true;
        }

        return false;
    }

    private static class CodeInfo {
        String code;
        long timestamp;

        CodeInfo(String code, long timestamp) {
            this.code = code;
            this.timestamp = timestamp;
        }
    }
}
