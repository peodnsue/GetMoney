package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.entity.GcoinAccount;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;

@Mapper
public interface GcoinAccountMapper extends BaseMapper<GcoinAccount> {
    @Update("UPDATE gcoin_account SET balance = balance + #{amount}, total_earned = total_earned + #{amount} WHERE user_id = #{userId}")
    int addBalance(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Update("UPDATE gcoin_account SET balance = balance - #{amount}, total_spent = total_spent + #{amount} WHERE user_id = #{userId} AND balance >= #{amount}")
    int subtractBalance(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Select("SELECT ga.*, u.nickname, u.email FROM gcoin_account ga " +
            "LEFT JOIN user u ON ga.user_id = u.id " +
            "WHERE (#{keyword} IS NULL OR #{keyword} = '' OR u.nickname LIKE CONCAT('%', #{keyword}, '%') OR u.email LIKE CONCAT('%', #{keyword}, '%')) " +
            "ORDER BY ga.balance DESC")
    Page<GcoinAccount> selectUserBalances(Page<GcoinAccount> page, @Param("keyword") String keyword);
}