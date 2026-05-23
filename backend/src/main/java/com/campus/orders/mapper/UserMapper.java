package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.orders.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    @Select("SELECT id, student_id, email, nickname, password, avatar, role, balance, status, create_time, update_time FROM user WHERE email = #{email} AND status = #{status}")
    User selectByEmail(String email, Integer status);

    @Select("SELECT id, student_id, email, nickname, password, avatar, role, balance, status, create_time, update_time FROM user WHERE email = #{email}")
    User selectByEmailOnly(String email);

    @Select("SELECT id, student_id, email, nickname, password, avatar, role, balance, status, create_time, update_time FROM user WHERE id = #{id}")
    User selectById(Long id);
}
