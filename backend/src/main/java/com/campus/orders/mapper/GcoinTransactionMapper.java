package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.entity.GcoinTransaction;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface GcoinTransactionMapper extends BaseMapper<GcoinTransaction> {
    
    @Select("SELECT id, user_id, type, amount, balance_before, balance_after, description, related_user_id, fee, treasury_operation, created_at FROM gcoin_transaction WHERE user_id = #{userId} ORDER BY created_at DESC")
    IPage<GcoinTransaction> selectByUserId(Page<GcoinTransaction> page, @Param("userId") Long userId);

    @Select("SELECT id, user_id, type, amount, balance_before, balance_after, description, related_user_id, fee, treasury_operation, created_at FROM gcoin_transaction WHERE treasury_operation = 1 ORDER BY created_at DESC")
    List<GcoinTransaction> selectTreasuryTransactions();

    @Select("SELECT id, user_id, type, amount, balance_before, balance_after, description, related_user_id, fee, treasury_operation, created_at FROM gcoin_transaction ORDER BY created_at DESC")
    IPage<GcoinTransaction> selectAll(Page<GcoinTransaction> page);

    @Select("<script>" +
            "SELECT id, user_id, type, amount, balance_before, balance_after, description, related_user_id, fee, treasury_operation, created_at FROM gcoin_transaction WHERE 1=1 " +
            "<if test='userId != null'>AND user_id = #{userId}</if> " +
            "<if test='type != null'>AND type = #{type}</if> " +
            "<if test='treasuryOperation != null'>AND treasury_operation = #{treasuryOperation}</if> " +
            "ORDER BY created_at DESC" +
            "</script>")
    IPage<GcoinTransaction> selectByConditions(Page<GcoinTransaction> page, 
            @Param("userId") Long userId,
            @Param("type") Integer type,
            @Param("treasuryOperation") Integer treasuryOperation);
}