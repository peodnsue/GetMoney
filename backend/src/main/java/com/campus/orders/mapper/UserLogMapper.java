package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.orders.entity.UserLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserLogMapper extends BaseMapper<UserLog> {

    @Select("SELECT ul.* FROM user_log ul " +
            "WHERE (ul.action = #{action} OR #{action} IS NULL) " +
            "AND (ul.status = #{status} OR #{status} IS NULL) " +
            "AND (#{keyword} IS NULL OR #{keyword} = '' OR ul.username LIKE CONCAT('%', #{keyword}, '%')) " +
            "ORDER BY ul.create_time DESC")
    Page<UserLog> selectPageWithUser(
            Page<UserLog> page,
            @Param("action") Integer action,
            @Param("status") Integer status,
            @Param("keyword") String keyword);
}
