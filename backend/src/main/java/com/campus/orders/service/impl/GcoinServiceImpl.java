package com.campus.orders.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.dto.CirculationStatsResponse;
import com.campus.orders.dto.GcoinTransferRequest;
import com.campus.orders.dto.GcoinTransferResponse;
import com.campus.orders.dto.GcoinWalletResponse;
import com.campus.orders.dto.SystemConfigRequest;
import com.campus.orders.dto.TreasuryResponse;
import com.campus.orders.entity.GcoinAccount;
import com.campus.orders.entity.GcoinTransaction;
import com.campus.orders.entity.SystemConfig;
import com.campus.orders.entity.TreasuryAccount;
import com.campus.orders.entity.User;
import com.campus.orders.mapper.GcoinAccountMapper;
import com.campus.orders.mapper.GcoinTransactionMapper;
import com.campus.orders.mapper.SystemConfigMapper;
import com.campus.orders.mapper.TreasuryAccountMapper;
import com.campus.orders.mapper.UserMapper;
import com.campus.orders.service.AccountOperationLogService;
import com.campus.orders.service.GcoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class GcoinServiceImpl implements GcoinService {

    @Autowired
    private GcoinAccountMapper gcoinAccountMapper;

    @Autowired
    private GcoinTransactionMapper gcoinTransactionMapper;

    @Autowired
    private TreasuryAccountMapper treasuryAccountMapper;

    @Autowired
    private SystemConfigMapper systemConfigMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private AccountOperationLogService accountOperationLogService;

    @Override
    @Transactional
    public void createAccount(Long userId) {
        GcoinAccount existing = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
        if (existing == null) {
            GcoinAccount account = new GcoinAccount();
            account.setUserId(userId);
            account.setBalance(BigDecimal.ZERO);
            account.setTotalEarned(BigDecimal.ZERO);
            account.setTotalSpent(BigDecimal.ZERO);
            account.setCreatedAt(LocalDateTime.now());
            account.setUpdatedAt(LocalDateTime.now());
            gcoinAccountMapper.insert(account);
        }
    }

    @Override
    public GcoinWalletResponse getWallet(Long userId) {
        GcoinAccount account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
        
        if (account == null) {
            createAccount(userId);
            account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                    .eq(GcoinAccount::getUserId, userId));
        }

        String holdLimitStr = systemConfigMapper.getConfigValue("user_hold_limit");
        BigDecimal holdLimit = new BigDecimal(holdLimitStr);

        GcoinWalletResponse response = new GcoinWalletResponse();
        response.setBalance(account.getBalance());
        response.setTotalEarned(account.getTotalEarned());
        response.setTotalSpent(account.getTotalSpent());
        response.setHoldLimit(holdLimit);
        return response;
    }

    @Override
    @Transactional
    public void addGcoin(Long userId, BigDecimal amount, Integer type, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("金额必须大于0");
        }

        BigDecimal dailyLimit = new BigDecimal(systemConfigMapper.getConfigValue("daily_production_limit"));
        BigDecimal todayProduction = getDailyProduction();
        if (todayProduction.add(amount).compareTo(dailyLimit) > 0) {
            throw new RuntimeException("今日产出已达上限");
        }

        GcoinAccount account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
        
        if (account == null) {
            createAccount(userId);
            account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                    .eq(GcoinAccount::getUserId, userId));
        }

        BigDecimal holdLimit = new BigDecimal(systemConfigMapper.getConfigValue("user_hold_limit"));
        if (account.getBalance().add(amount).compareTo(holdLimit) > 0) {
            throw new RuntimeException("超出个人持有上限");
        }

        BigDecimal balanceBefore = account.getBalance();
        gcoinAccountMapper.addBalance(userId, amount);

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(userId);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceBefore.add(amount));
        transaction.setDescription(description);
        transaction.setTreasuryOperation(0);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);

        updateTotalCirculation(amount);
    }

    @Override
    @Transactional
    public void deductGcoin(Long userId, BigDecimal amount, Integer type, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("金额必须大于0");
        }

        GcoinAccount account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
        
        if (account == null) {
            createAccount(userId);
            account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                    .eq(GcoinAccount::getUserId, userId));
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("余额不足");
        }

        BigDecimal balanceBefore = account.getBalance();
        int result = gcoinAccountMapper.subtractBalance(userId, amount);
        if (result == 0) {
            throw new RuntimeException("扣除失败");
        }

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(userId);
        transaction.setType(type);
        transaction.setAmount(amount.negate());
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceBefore.subtract(amount));
        transaction.setDescription(description);
        transaction.setTreasuryOperation(0);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);

        updateTotalCirculation(amount.negate());
    }

    @Override
    @Transactional
    public GcoinTransferResponse transfer(Long userId, GcoinTransferRequest request) {
        String transferEnabled = systemConfigMapper.getConfigValue("transfer_enabled");
        if (!"1".equals(transferEnabled)) {
            throw new RuntimeException("转账功能暂未开放");
        }

        BigDecimal amount = request.getAmount();
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("转账金额必须大于0");
        }

        BigDecimal feeRate = new BigDecimal(systemConfigMapper.getConfigValue("transfer_fee_rate"));
        BigDecimal fee = amount.multiply(feeRate);
        BigDecimal totalDeduct = amount.add(fee);

        GcoinAccount senderAccount = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
        
        if (senderAccount == null) {
            throw new RuntimeException("发送方账户不存在");
        }

        if (senderAccount.getBalance().compareTo(totalDeduct) < 0) {
            throw new RuntimeException("余额不足");
        }

        User receiver = userMapper.selectByEmailOnly(request.getTargetAccount());
        if (receiver == null) {
            receiver = userMapper.selectById(Long.parseLong(request.getTargetAccount()));
        }
        if (receiver == null) {
            throw new RuntimeException("接收方不存在");
        }

        if (userId.equals(receiver.getId())) {
            throw new RuntimeException("不能向自己转账");
        }

        GcoinAccount receiverAccount = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, receiver.getId()));
        
        if (receiverAccount == null) {
            createAccount(receiver.getId());
            receiverAccount = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                    .eq(GcoinAccount::getUserId, receiver.getId()));
        }

        BigDecimal holdLimit = new BigDecimal(systemConfigMapper.getConfigValue("user_hold_limit"));
        if (receiverAccount.getBalance().add(amount).compareTo(holdLimit) > 0) {
            throw new RuntimeException("接收方超出个人持有上限");
        }

        BigDecimal senderBalanceBefore = senderAccount.getBalance();
        gcoinAccountMapper.subtractBalance(userId, totalDeduct);

        BigDecimal receiverBalanceBefore = receiverAccount.getBalance();
        gcoinAccountMapper.addBalance(receiver.getId(), amount);

        treasuryAccountMapper.addBalance(fee);

        String remark = request.getRemark() != null ? request.getRemark() : "转账";

        GcoinTransaction senderTransaction = new GcoinTransaction();
        senderTransaction.setUserId(userId);
        senderTransaction.setType(4);
        senderTransaction.setAmount(totalDeduct.negate());
        senderTransaction.setBalanceBefore(senderBalanceBefore);
        senderTransaction.setBalanceAfter(senderBalanceBefore.subtract(totalDeduct));
        senderTransaction.setDescription(remark + "给" + receiver.getNickname());
        senderTransaction.setRelatedUserId(receiver.getId());
        senderTransaction.setFee(fee);
        senderTransaction.setTreasuryOperation(0);
        senderTransaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(senderTransaction);

        GcoinTransaction receiverTransaction = new GcoinTransaction();
        receiverTransaction.setUserId(receiver.getId());
        receiverTransaction.setType(5);
        receiverTransaction.setAmount(amount);
        receiverTransaction.setBalanceBefore(receiverBalanceBefore);
        receiverTransaction.setBalanceAfter(receiverBalanceBefore.add(amount));
        receiverTransaction.setDescription("收到" + senderAccount.getUserId() + "的" + remark);
        receiverTransaction.setRelatedUserId(userId);
        receiverTransaction.setTreasuryOperation(0);
        receiverTransaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(receiverTransaction);

        GcoinTransaction feeTransaction = new GcoinTransaction();
        feeTransaction.setUserId(userId);
        feeTransaction.setType(7);
        feeTransaction.setAmount(fee.negate());
        feeTransaction.setBalanceBefore(senderBalanceBefore.subtract(amount));
        feeTransaction.setBalanceAfter(senderBalanceBefore.subtract(totalDeduct));
        feeTransaction.setDescription("转账手续费");
        feeTransaction.setFee(fee);
        feeTransaction.setTreasuryOperation(1);
        feeTransaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(feeTransaction);

        GcoinAccount updatedSender = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
        GcoinAccount updatedReceiver = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, receiver.getId()));

        GcoinTransferResponse response = new GcoinTransferResponse();
        response.setAmount(amount);
        response.setFee(fee);
        response.setActualReceived(amount);
        response.setSenderBalance(updatedSender.getBalance());
        response.setReceiverBalance(updatedReceiver.getBalance());
        response.setReceiverNickname(receiver.getNickname());
        return response;
    }

    @Override
    public IPage<GcoinTransaction> getTransactionHistory(Long userId, int page, int size) {
        Page<GcoinTransaction> pageRequest = new Page<>(page, size);
        return gcoinTransactionMapper.selectByUserId(pageRequest, userId);
    }

    @Override
    public TreasuryResponse getTreasury() {
        TreasuryAccount treasury = treasuryAccountMapper.selectById(1L);
        if (treasury == null) {
            treasury = new TreasuryAccount();
            treasury.setBalance(BigDecimal.ZERO);
            treasury.setTotalIncome(BigDecimal.ZERO);
            treasury.setTotalExpense(BigDecimal.ZERO);
            treasury.setLockedBalance(BigDecimal.ZERO);
        }

        TreasuryResponse response = new TreasuryResponse();
        response.setBalance(treasury.getBalance());
        response.setTotalIncome(treasury.getTotalIncome());
        response.setTotalExpense(treasury.getTotalExpense());
        response.setLockedBalance(treasury.getLockedBalance());
        return response;
    }

    @Override
    @Transactional
    public BigDecimal[] treasuryTransferOut(BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("金额必须大于0");
        }

        TreasuryAccount treasury = treasuryAccountMapper.selectById(1L);
        if (treasury == null) {
            throw new RuntimeException("国库账户不存在");
        }

        if (treasury.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("国库余额不足");
        }

        BigDecimal beforeBalance = treasury.getBalance();
        treasuryAccountMapper.subtractBalance(amount);
        BigDecimal afterBalance = beforeBalance.subtract(amount);

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(null);
        transaction.setType(9);
        transaction.setAmount(amount.negate());
        transaction.setBalanceBefore(beforeBalance);
        transaction.setBalanceAfter(afterBalance);
        transaction.setDescription(description);
        transaction.setTreasuryOperation(1);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);

        updateTotalCirculation(amount.negate());
        
        return new BigDecimal[]{beforeBalance, afterBalance};
    }

    @Override
    @Transactional
    public BigDecimal[] treasuryTransferIn(BigDecimal amount, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("金额必须大于0");
        }

        TreasuryAccount treasury = treasuryAccountMapper.selectById(1L);
        if (treasury == null) {
            throw new RuntimeException("国库账户不存在");
        }

        BigDecimal beforeBalance = treasury.getBalance();
        treasuryAccountMapper.addBalance(amount);
        BigDecimal afterBalance = beforeBalance.add(amount);

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(null);
        transaction.setType(9);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(beforeBalance);
        transaction.setBalanceAfter(afterBalance);
        transaction.setDescription(description);
        transaction.setTreasuryOperation(1);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);

        updateTotalCirculation(amount);
        
        return new BigDecimal[]{beforeBalance, afterBalance};
    }

    @Override
    @Transactional
    public BigDecimal[] lockTreasuryBalance(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("金额必须大于0");
        }

        TreasuryAccount treasury = treasuryAccountMapper.selectById(1L);
        if (treasury == null) {
            throw new RuntimeException("国库账户不存在");
        }
        
        BigDecimal beforeBalance = treasury.getBalance();
        int result = treasuryAccountMapper.lockBalance(amount);
        if (result == 0) {
            throw new RuntimeException("国库余额不足");
        }
        BigDecimal afterBalance = beforeBalance.subtract(amount);

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(null);
        transaction.setType(8);
        transaction.setAmount(amount.negate());
        transaction.setBalanceBefore(beforeBalance);
        transaction.setBalanceAfter(afterBalance);
        transaction.setDescription("国库资金封存");
        transaction.setTreasuryOperation(1);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);

        updateTotalCirculation(amount.negate());
        
        return new BigDecimal[]{beforeBalance, afterBalance};
    }

    @Override
    @Transactional
    public BigDecimal[] unlockTreasuryBalance(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("金额必须大于0");
        }

        TreasuryAccount treasury = treasuryAccountMapper.selectById(1L);
        if (treasury == null) {
            throw new RuntimeException("国库账户不存在");
        }
        
        BigDecimal beforeBalance = treasury.getBalance();
        int result = treasuryAccountMapper.unlockBalance(amount);
        if (result == 0) {
            throw new RuntimeException("封存余额不足");
        }
        BigDecimal afterBalance = beforeBalance.add(amount);

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(null);
        transaction.setType(8);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(beforeBalance);
        transaction.setBalanceAfter(afterBalance);
        transaction.setDescription("国库资金解封");
        transaction.setTreasuryOperation(1);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);

        updateTotalCirculation(amount);
        
        return new BigDecimal[]{beforeBalance, afterBalance};
    }

    @Override
    @Transactional
    public void updateSystemConfig(SystemConfigRequest request) {
        SystemConfig config = systemConfigMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SystemConfig>()
                .eq(SystemConfig::getConfigKey, request.getConfigKey()));

        if (config == null) {
            config = new SystemConfig();
            config.setConfigKey(request.getConfigKey());
        }

        config.setConfigValue(request.getConfigValue());
        if (request.getConfigDesc() != null) {
            config.setConfigDesc(request.getConfigDesc());
        }
        config.setUpdatedAt(LocalDateTime.now());

        if (config.getId() == null) {
            systemConfigMapper.insert(config);
        } else {
            systemConfigMapper.updateById(config);
        }
    }

    @Override
    public SystemConfig getSystemConfig(String key) {
        return systemConfigMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SystemConfig>()
                .eq(SystemConfig::getConfigKey, key));
    }

    @Override
    public List<SystemConfig> getAllConfigs() {
        return systemConfigMapper.selectList(null);
    }

    @Override
    @Transactional
    public BigDecimal[] adjustCirculation(BigDecimal amount, String reason) {
        String currentCirculation = systemConfigMapper.getConfigValue("total_circulation");
        BigDecimal beforeBalance = new BigDecimal(currentCirculation);
        BigDecimal afterBalance = beforeBalance.add(amount);
        
        SystemConfig config = new SystemConfig();
        config.setConfigKey("total_circulation");
        config.setConfigValue(afterBalance.toString());
        config.setConfigDesc("全网总流通量");
        config.setUpdatedAt(LocalDateTime.now());
        
        systemConfigMapper.update(config, new com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper<SystemConfig>()
                .eq(SystemConfig::getConfigKey, "total_circulation"));

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(null);
        transaction.setType(8);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(beforeBalance);
        transaction.setBalanceAfter(afterBalance);
        transaction.setDescription(reason);
        transaction.setTreasuryOperation(1);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);
        
        return new BigDecimal[]{beforeBalance, afterBalance};
    }

    @Override
    public CirculationStatsResponse getCirculationStats() {
        String totalCirculationStr = systemConfigMapper.getConfigValue("total_circulation");
        BigDecimal totalCirculation = new BigDecimal(totalCirculationStr);

        BigDecimal dailyProduction = getDailyProduction();
        BigDecimal dailyConsumption = getDailyConsumption();

        TreasuryResponse treasury = getTreasury();

        Long userCount = gcoinAccountMapper.selectCount(null);
        BigDecimal avgUserHold = userCount > 0 ? totalCirculation.divide(BigDecimal.valueOf(userCount), 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO;

        CirculationStatsResponse response = new CirculationStatsResponse();
        response.setTotalCirculation(totalCirculation);
        response.setDailyProduction(dailyProduction);
        response.setDailyConsumption(dailyConsumption);
        response.setTreasuryBalance(treasury.getBalance());
        response.setAvgUserHold(avgUserHold);
        response.setUserCount(userCount);
        return response;
    }

    @Override
    public BigDecimal getDailyProduction() {
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        List<GcoinTransaction> transactions = gcoinTransactionMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinTransaction>()
                        .between(GcoinTransaction::getCreatedAt, todayStart, todayEnd)
                        .in(GcoinTransaction::getType, 1, 2, 3, 9)
        );

        return transactions.stream()
                .map(GcoinTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal getDailyConsumption() {
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        List<GcoinTransaction> transactions = gcoinTransactionMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinTransaction>()
                        .between(GcoinTransaction::getCreatedAt, todayStart, todayEnd)
                        .in(GcoinTransaction::getType, 4, 6, 7)
        );

        return transactions.stream()
                .map(t -> t.getAmount().abs())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    @Transactional
    public BigDecimal[] deductUserGcoinAdmin(Long userId, BigDecimal amount, String reason) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (user.getStatus() != 1) {
            throw new RuntimeException("用户状态异常，无法操作");
        }

        GcoinAccount account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
        
        if (account == null) {
            throw new RuntimeException("用户账户不存在");
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("余额不足");
        }

        BigDecimal balanceBefore = account.getBalance();
        gcoinAccountMapper.subtractBalance(userId, amount);
        BigDecimal balanceAfter = balanceBefore.subtract(amount);

        treasuryAccountMapper.addBalance(amount);

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(userId);
        transaction.setType(8);
        transaction.setAmount(amount.negate());
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setDescription(reason);
        transaction.setTreasuryOperation(1);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);

        updateTotalCirculation(amount.negate());
        
        return new BigDecimal[]{balanceBefore, balanceAfter};
    }

    @Override
    @Transactional
    public BigDecimal[] addUserGcoinAdmin(Long userId, BigDecimal amount, String reason) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (user.getStatus() != 1) {
            throw new RuntimeException("用户状态异常，无法操作");
        }

        GcoinAccount account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
        
        if (account == null) {
            createAccount(userId);
            account = gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                    .eq(GcoinAccount::getUserId, userId));
        }

        BigDecimal holdLimit = new BigDecimal(systemConfigMapper.getConfigValue("user_hold_limit"));
        if (account.getBalance().add(amount).compareTo(holdLimit) > 0) {
            throw new RuntimeException("超出个人持有上限");
        }

        BigDecimal balanceBefore = account.getBalance();
        gcoinAccountMapper.addBalance(userId, amount);
        BigDecimal balanceAfter = balanceBefore.add(amount);

        GcoinTransaction transaction = new GcoinTransaction();
        transaction.setUserId(userId);
        transaction.setType(8);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setDescription(reason);
        transaction.setTreasuryOperation(0);
        transaction.setCreatedAt(LocalDateTime.now());
        gcoinTransactionMapper.insert(transaction);

        updateTotalCirculation(amount);
        
        return new BigDecimal[]{balanceBefore, balanceAfter};
    }

    private void updateTotalCirculation(BigDecimal amount) {
        String currentCirculation = systemConfigMapper.getConfigValue("total_circulation");
        BigDecimal newCirculation = new BigDecimal(currentCirculation).add(amount);
        
        SystemConfig config = new SystemConfig();
        config.setConfigKey("total_circulation");
        config.setConfigValue(newCirculation.toString());
        config.setUpdatedAt(LocalDateTime.now());
        
        systemConfigMapper.update(config, new com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper<SystemConfig>()
                .eq(SystemConfig::getConfigKey, "total_circulation"));
    }

    @Override
    public IPage<GcoinAccount> getUserBalances(int page, int size, String keyword) {
        Page<GcoinAccount> pageRequest = new Page<>(page, size);
        return gcoinAccountMapper.selectUserBalances(pageRequest, keyword);
    }

    @Override
    public GcoinAccount getUserBalance(Long userId) {
        return gcoinAccountMapper.selectOne(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<GcoinAccount>()
                .eq(GcoinAccount::getUserId, userId));
    }

    @Override
    public IPage<GcoinTransaction> getTransactionHistoryByConditions(Long userId, Integer type, Integer treasuryOperation, int page, int size) {
        Page<GcoinTransaction> pageRequest = new Page<>(page, size);
        return gcoinTransactionMapper.selectByConditions(pageRequest, userId, type, treasuryOperation);
    }
}