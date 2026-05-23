package com.campus.orders.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.campus.orders.entity.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface TaskMapper extends BaseMapper<Task> {

    @Select("SELECT * FROM task WHERE status = #{status} ORDER BY create_time DESC")
    List<Task> findByStatus(@Param("status") Integer status);

    @Select("SELECT * FROM task WHERE publisher_id = #{publisherId} ORDER BY create_time DESC")
    List<Task> findByPublisherId(@Param("publisherId") Long publisherId);

    @Select("SELECT * FROM task WHERE acceptor_id = #{acceptorId} ORDER BY create_time DESC")
    List<Task> findByAcceptorId(@Param("acceptorId") Long acceptorId);

    @Select("SELECT * FROM task WHERE deadline < #{now} AND status = 1 ORDER BY create_time DESC")
    List<Task> findExpiredTasks(@Param("now") LocalDateTime now);

    @Select("SELECT * FROM task WHERE type_id = #{typeId} AND status = 1 ORDER BY create_time DESC")
    List<Task> findByTypeId(@Param("typeId") Long typeId);

    @Select("SELECT * FROM task WHERE building = #{building} AND status = 1 ORDER BY create_time DESC")
    List<Task> findByBuilding(@Param("building") String building);
}
