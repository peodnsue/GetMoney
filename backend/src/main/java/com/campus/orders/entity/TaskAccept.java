package com.campus.orders.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("task_accept")
public class TaskAccept {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("task_id")
    private Long taskId;

    @TableField("acceptor_id")
    private Long acceptorId;

    @TableField("accept_time")
    private LocalDateTime acceptTime;

    @TableField("completion_proof")
    private String completionProof;

    @TableField("complete_time")
    private LocalDateTime completeTime;

    @TableField("status")
    private Integer status;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;

    @TableField(exist = false)
    private Task task;

    @TableField(exist = false)
    private User acceptor;
}
