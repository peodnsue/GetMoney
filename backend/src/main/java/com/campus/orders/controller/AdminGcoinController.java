package com.campus.orders.controller;

import com.campus.orders.config.JwtTokenProvider;
import com.campus.orders.dto.ApiResponse;
import com.campus.orders.dto.CirculationStatsResponse;
import com.campus.orders.dto.SystemConfigRequest;
import com.campus.orders.dto.TreasuryResponse;
import com.campus.orders.entity.AccountOperationLog;
import com.campus.orders.entity.GcoinAccount;
import com.campus.orders.entity.GcoinTransaction;
import com.campus.orders.entity.SystemConfig;
import com.campus.orders.service.AccountOperationLogService;
import com.campus.orders.service.GcoinService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/gcoin")
public class AdminGcoinController {

    @Autowired
    private GcoinService gcoinService;

    @Autowired
    private AccountOperationLogService accountOperationLogService;

    @Autowired
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
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private Long getAdminIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return jwtTokenProvider.getUserIdFromToken(token);
            } catch (Exception e) {
                return 0L;
            }
        }
        return 0L;
    }

    @GetMapping("/circulation/stats")
    public ApiResponse<CirculationStatsResponse> getCirculationStats() {
        CirculationStatsResponse stats = gcoinService.getCirculationStats();
        return ApiResponse.success(stats);
    }

    @GetMapping("/treasury")
    public ApiResponse<TreasuryResponse> getTreasury() {
        TreasuryResponse treasury = gcoinService.getTreasury();
        return ApiResponse.success(treasury);
    }

    @PostMapping("/treasury/transfer-out")
    public ApiResponse<Void> treasuryTransferOut(
            @RequestParam BigDecimal amount,
            @RequestParam String description,
            HttpServletRequest request) {
        Long adminId = getAdminIdFromToken(request);
        BigDecimal[] balances = gcoinService.treasuryTransferOut(amount, description);
        accountOperationLogService.logOperation(adminId, 1, null, amount, description, 
                balances[0], balances[1], getClientIp(request), request.getHeader("User-Agent"));
        return ApiResponse.success("国库资金投放成功", null);
    }

    @PostMapping("/treasury/lock")
    public ApiResponse<Void> lockTreasuryBalance(@RequestParam BigDecimal amount, HttpServletRequest request) {
        Long adminId = getAdminIdFromToken(request);
        BigDecimal[] balances = gcoinService.lockTreasuryBalance(amount);
        accountOperationLogService.logOperation(adminId, 2, null, amount, "国库资金封存", 
                balances[0], balances[1], getClientIp(request), request.getHeader("User-Agent"));
        return ApiResponse.success("国库资金封存成功", null);
    }

    @PostMapping("/treasury/unlock")
    public ApiResponse<Void> unlockTreasuryBalance(@RequestParam BigDecimal amount, HttpServletRequest request) {
        Long adminId = getAdminIdFromToken(request);
        BigDecimal[] balances = gcoinService.unlockTreasuryBalance(amount);
        accountOperationLogService.logOperation(adminId, 3, null, amount, "国库资金解封", 
                balances[0], balances[1], getClientIp(request), request.getHeader("User-Agent"));
        return ApiResponse.success("国库资金解封成功", null);
    }

    @GetMapping("/configs")
    public ApiResponse<List<SystemConfig>> getAllConfigs() {
        List<SystemConfig> configs = gcoinService.getAllConfigs();
        return ApiResponse.success(configs);
    }

    @PutMapping("/config")
    public ApiResponse<Void> updateConfig(@Valid @RequestBody SystemConfigRequest request) {
        gcoinService.updateSystemConfig(request);
        return ApiResponse.success("配置更新成功", null);
    }

    @PostMapping("/circulation/adjust")
    public ApiResponse<Void> adjustCirculation(
            @RequestParam BigDecimal amount,
            @RequestParam String reason,
            HttpServletRequest request) {
        Long adminId = getAdminIdFromToken(request);
        BigDecimal[] balances = gcoinService.adjustCirculation(amount, reason);
        accountOperationLogService.logOperation(adminId, 4, null, amount, reason, 
                balances[0], balances[1], getClientIp(request), request.getHeader("User-Agent"));
        return ApiResponse.success("流通量调整成功", null);
    }

    @PostMapping("/user/deduct")
    public ApiResponse<Void> deductUserGcoin(
            @RequestParam Long userId,
            @RequestParam BigDecimal amount,
            @RequestParam String reason,
            HttpServletRequest request) {
        Long adminId = getAdminIdFromToken(request);
        BigDecimal[] balances = gcoinService.deductUserGcoinAdmin(userId, amount, reason);
        accountOperationLogService.logOperation(adminId, 5, userId, amount, reason, 
                balances[0], balances[1], getClientIp(request), request.getHeader("User-Agent"));
        return ApiResponse.success("扣减成功", null);
    }

    @PostMapping("/user/add")
    public ApiResponse<Void> addUserGcoin(
            @RequestParam Long userId,
            @RequestParam BigDecimal amount,
            @RequestParam String reason,
            HttpServletRequest request) {
        Long adminId = getAdminIdFromToken(request);
        BigDecimal[] balances = gcoinService.addUserGcoinAdmin(userId, amount, reason);
        accountOperationLogService.logOperation(adminId, 6, userId, amount, reason, 
                balances[0], balances[1], getClientIp(request), request.getHeader("User-Agent"));
        return ApiResponse.success("补发成功", null);
    }

    @GetMapping("/transactions")
    public ApiResponse<IPage<GcoinTransaction>> getAllTransactions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer treasuryOperation) {
        if (userId != null || type != null || treasuryOperation != null) {
            IPage<GcoinTransaction> transactions = gcoinService.getTransactionHistoryByConditions(userId, type, treasuryOperation, page, size);
            return ApiResponse.success(transactions);
        }
        IPage<GcoinTransaction> transactions = gcoinService.getTransactionHistory(null, page, size);
        return ApiResponse.success(transactions);
    }

    @GetMapping("/user/balances")
    public ApiResponse<IPage<GcoinAccount>> getUserBalances(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword) {
        IPage<GcoinAccount> balances = gcoinService.getUserBalances(page, size, keyword);
        return ApiResponse.success(balances);
    }

    @GetMapping("/user/balance/{userId}")
    public ApiResponse<GcoinAccount> getUserBalance(@PathVariable Long userId) {
        GcoinAccount account = gcoinService.getUserBalance(userId);
        if (account == null) {
            return ApiResponse.error("用户账户不存在");
        }
        return ApiResponse.success(account);
    }

    @GetMapping("/operation-logs")
    public ApiResponse<IPage<AccountOperationLog>> getOperationLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long adminId,
            @RequestParam(required = false) Integer operationType,
            @RequestParam(required = false) Long targetUserId) {
        IPage<AccountOperationLog> logs = accountOperationLogService.getOperationLogs(adminId, operationType, targetUserId, page, size);
        return ApiResponse.success(logs);
    }
}