package com.campus.orders.service;

import com.campus.orders.dto.CirculationStatsResponse;
import com.campus.orders.dto.GcoinTransferRequest;
import com.campus.orders.dto.GcoinTransferResponse;
import com.campus.orders.dto.GcoinWalletResponse;
import com.campus.orders.dto.SystemConfigRequest;
import com.campus.orders.dto.TreasuryResponse;
import com.campus.orders.entity.GcoinAccount;
import com.campus.orders.entity.GcoinTransaction;
import com.campus.orders.entity.SystemConfig;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.math.BigDecimal;
import java.util.List;

public interface GcoinService {
    void createAccount(Long userId);

    GcoinWalletResponse getWallet(Long userId);

    void addGcoin(Long userId, BigDecimal amount, Integer type, String description);

    void deductGcoin(Long userId, BigDecimal amount, Integer type, String description);

    GcoinTransferResponse transfer(Long userId, GcoinTransferRequest request);

    IPage<GcoinTransaction> getTransactionHistory(Long userId, int page, int size);

    IPage<GcoinTransaction> getTransactionHistoryByConditions(Long userId, Integer type, Integer treasuryOperation, int page, int size);

    TreasuryResponse getTreasury();

    BigDecimal[] treasuryTransferOut(BigDecimal amount, String description);

    BigDecimal[] treasuryTransferIn(BigDecimal amount, String description);

    BigDecimal[] lockTreasuryBalance(BigDecimal amount);

    BigDecimal[] unlockTreasuryBalance(BigDecimal amount);

    void updateSystemConfig(SystemConfigRequest request);

    SystemConfig getSystemConfig(String key);

    List<SystemConfig> getAllConfigs();

    BigDecimal[] adjustCirculation(BigDecimal amount, String reason);

    CirculationStatsResponse getCirculationStats();

    BigDecimal getDailyProduction();

    BigDecimal getDailyConsumption();

    BigDecimal[] deductUserGcoinAdmin(Long userId, BigDecimal amount, String reason);

    BigDecimal[] addUserGcoinAdmin(Long userId, BigDecimal amount, String reason);

    IPage<GcoinAccount> getUserBalances(int page, int size, String keyword);

    GcoinAccount getUserBalance(Long userId);
}