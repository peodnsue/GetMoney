package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.orders.entity.UserNoticeRead;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserNoticeReadMapper extends BaseMapper<UserNoticeRead> {

    @Select("SELECT * FROM user_notice_read WHERE user_id = #{userId} AND notice_id = #{noticeId}")
    UserNoticeRead selectByUserIdAndNoticeId(@Param("userId") Long userId, @Param("noticeId") Long noticeId);

    @Select("SELECT COUNT(*) FROM sys_notice sn LEFT JOIN user_notice_read unr " +
            "ON sn.id = unr.notice_id AND unr.user_id = #{userId} " +
            "WHERE sn.status = 1 AND (unr.is_read = 0 OR unr.id IS NULL)")
    int countUnreadNotices(@Param("userId") Long userId);

    @org.apache.ibatis.annotations.Delete("DELETE FROM user_notice_read WHERE notice_id = #{noticeId}")
    void deleteByNoticeId(@Param("noticeId") Long noticeId);
}
