package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.orders.entity.Statistics;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;

@Mapper
public interface StatisticsMapper extends BaseMapper<Statistics> {

    @Select("SELECT * FROM statistics WHERE date = #{date}")
    Statistics findByDate(@Param("date") LocalDate date);
}
