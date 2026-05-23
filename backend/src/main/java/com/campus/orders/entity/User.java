package com.campus.orders.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("student_id")
    private String studentId;

    @TableField("email")
    private String email;

    @TableField("nickname")
    private String nickname;

    @TableField("password")
    private String password;

    @TableField("avatar")
    private String avatar;

    @TableField("role")
    private Integer role;

    @TableField("balance")
    private BigDecimal balance;

    @TableField("status")
    private Integer status;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;
}
