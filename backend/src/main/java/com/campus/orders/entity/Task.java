package com.campus.orders.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("task")
public class Task {
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("publisher_id")
    private Long publisherId;

    @TableField("type_id")
    private Long typeId;

    @TableField("title")
    private String title;

    @TableField("description")
    private String description;

    @TableField("commission")
    private BigDecimal commission;

    @TableField("deposit")
    private BigDecimal deposit;

    @TableField("deadline")
    private LocalDateTime deadline;

    @TableField("building")
    private String building;

    @TableField("address")
    private String address;

    @TableField("images")
    private String images;

    @TableField(exist = false)
    private java.util.List<String> imageList;

    @TableField("status")
    private Integer status;

    @TableField("acceptor_id")
    private Long acceptorId;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;

    @TableField(exist = false)
    private String typeName;

    @TableField(exist = false)
    private String publisherName;

    @TableField(exist = false)
    private String publisherAvatar;

    @TableField(exist = false)
    private String acceptorName;

    @TableField(exist = false)
    @JsonProperty("acceptTime")
    private LocalDateTime acceptTime;

    @TableField(exist = false)
    @JsonProperty("completeTime")
    private LocalDateTime completeTime;
}
