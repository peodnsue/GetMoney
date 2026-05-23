package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.orders.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {

    @Select("SELECT * FROM comment WHERE to_user_id = #{userId} ORDER BY create_time DESC")
    List<Comment> findByToUserId(@Param("userId") Long userId);

    @Select("SELECT AVG(score) FROM comment WHERE to_user_id = #{userId}")
    Double getAverageScoreByUserId(@Param("userId") Long userId);
}
