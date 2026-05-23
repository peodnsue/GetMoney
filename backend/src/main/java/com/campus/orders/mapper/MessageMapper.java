package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.orders.entity.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface MessageMapper extends BaseMapper<Message> {

    @Select("SELECT COUNT(*) FROM message WHERE user_id = #{userId} AND read_status = 0")
    Integer countUnreadByUserId(@Param("userId") Long userId);

    @Update("UPDATE message SET read_status = 1 WHERE user_id = #{userId} AND read_status = 0")
    void markAllAsRead(@Param("userId") Long userId);
}
