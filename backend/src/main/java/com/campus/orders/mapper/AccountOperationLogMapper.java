package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.entity.AccountOperationLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AccountOperationLogMapper extends BaseMapper<AccountOperationLog> {

    @Select("<script>" +
            "SELECT id, admin_id, operation_type, target_user_id, amount, description, before_balance, after_balance, ip_address, user_agent, create_time " +
            "FROM account_operation_log WHERE 1=1 " +
            "<if test='adminId != null'>AND admin_id = #{adminId}</if> " +
            "<if test='operationType != null'>AND operation_type = #{operationType}</if> " +
            "<if test='targetUserId != null'>AND target_user_id = #{targetUserId}</if> " +
            "ORDER BY create_time DESC" +
            "</script>")
    IPage<AccountOperationLog> selectByConditions(Page<AccountOperationLog> page,
                                                   @Param("adminId") Long adminId,
                                                   @Param("operationType") Integer operationType,
                                                   @Param("targetUserId") Long targetUserId);
}
