package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.orders.entity.TreasuryAccount;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;

@Mapper
public interface TreasuryAccountMapper extends BaseMapper<TreasuryAccount> {
    @Update("UPDATE treasury_account SET balance = balance + #{amount}, total_income = total_income + #{amount}")
    int addBalance(@Param("amount") BigDecimal amount);

    @Update("UPDATE treasury_account SET balance = balance - #{amount}, total_expense = total_expense + #{amount} WHERE balance >= #{amount}")
    int subtractBalance(@Param("amount") BigDecimal amount);

    @Update("UPDATE treasury_account SET balance = balance - #{amount}, locked_balance = locked_balance + #{amount} WHERE balance >= #{amount}")
    int lockBalance(@Param("amount") BigDecimal amount);

    @Update("UPDATE treasury_account SET balance = balance + #{amount}, locked_balance = locked_balance - #{amount} WHERE locked_balance >= #{amount}")
    int unlockBalance(@Param("amount") BigDecimal amount);
}