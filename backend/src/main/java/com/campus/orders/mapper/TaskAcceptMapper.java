package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.orders.entity.TaskAccept;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TaskAcceptMapper extends BaseMapper<TaskAccept> {

    @Select("SELECT * FROM task_accept WHERE task_id = #{taskId}")
    TaskAccept findByTaskId(@Param("taskId") Long taskId);

    @Select("SELECT * FROM task_accept WHERE acceptor_id = #{acceptorId} ORDER BY accept_time DESC")
    List<TaskAccept> findByAcceptorId(@Param("acceptorId") Long acceptorId);
}
