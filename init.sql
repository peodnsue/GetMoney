CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `student_id` VARCHAR(20) COMMENT '学号',
    `phone` VARCHAR(11) COMMENT '手机号',
    `email` VARCHAR(100) UNIQUE COMMENT '邮箱',
    `nickname` VARCHAR(50) NOT NULL COMMENT '昵称',
    `password` VARCHAR(64) NOT NULL COMMENT '登录密码(MD5加密)',
    `avatar` VARCHAR(255) COMMENT '头像URL',
    `role` TINYINT NOT NULL DEFAULT 1 COMMENT '角色：1-普通用户，2-任务发布者，3-任务接单者，4-管理员',
    `balance` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '余额',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-封禁，1-正常',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_email` (`email`),
    INDEX `idx_phone` (`phone`),
    INDEX `idx_role` (`role`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE `task_type` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '任务类型ID',
    `name` VARCHAR(50) NOT NULL UNIQUE COMMENT '任务类型名称',
    `description` VARCHAR(200) COMMENT '任务类型描述',
    `icon` VARCHAR(255) COMMENT '图标URL',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_name` (`name`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务类型表';

CREATE TABLE `task` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '任务ID',
    `publisher_id` BIGINT NOT NULL COMMENT '发布者ID',
    `type_id` BIGINT NOT NULL COMMENT '任务类型ID',
    `title` VARCHAR(100) NOT NULL COMMENT '任务标题',
    `description` TEXT COMMENT '任务描述',
    `commission` DECIMAL(10,2) NOT NULL COMMENT '佣金金额',
    `deposit` DECIMAL(10,2) DEFAULT 0 COMMENT '押金金额（可选）',
    `deadline` DATETIME NOT NULL COMMENT '截止时间',
    `building` VARCHAR(50) COMMENT '所在楼栋',
    `address` VARCHAR(200) COMMENT '详细地址',
    `images` TEXT COMMENT '任务配图（JSON格式，存储多个图片URL）',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-待接单，2-已接单，3-已完成，4-已取消，5-已过期',
    `acceptor_id` BIGINT COMMENT '接单者ID',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_publisher_id` (`publisher_id`),
    INDEX `idx_type_id` (`type_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_deadline` (`deadline`),
    INDEX `idx_building` (`building`),
    FOREIGN KEY (`publisher_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`type_id`) REFERENCES `task_type`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`acceptor_id`) REFERENCES `user`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务表';

CREATE TABLE `task_accept` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '接单记录ID',
    `task_id` BIGINT NOT NULL COMMENT '任务ID',
    `acceptor_id` BIGINT NOT NULL COMMENT '接单者ID',
    `accept_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '接单时间',
    `completion_proof` TEXT COMMENT '完成凭证（JSON格式，存储多个图片URL）',
    `complete_time` DATETIME COMMENT '完成时间',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-待完成，2-已提交凭证，3-已确认完成，4-已取消',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `uk_task_id` (`task_id`),
    INDEX `idx_acceptor_id` (`acceptor_id`),
    INDEX `idx_status` (`status`),
    FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`acceptor_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='接单记录表';

CREATE TABLE `payment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '支付记录ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `task_id` BIGINT NOT NULL COMMENT '任务ID',
    `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    `type` TINYINT NOT NULL COMMENT '支付类型：1-佣金支付，2-押金支付，3-佣金结算，4-退款',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-待支付，2-支付成功，3-支付失败，4-已退款',
    `transaction_id` VARCHAR(100) COMMENT '微信支付交易ID',
    `refund_id` VARCHAR(100) COMMENT '退款ID',
    `refund_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '退款金额',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_task_id` (`task_id`),
    INDEX `idx_type` (`type`),
    INDEX `idx_status` (`status`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';

CREATE TABLE `comment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '评价ID',
    `task_id` BIGINT NOT NULL COMMENT '任务ID',
    `publisher_id` BIGINT NOT NULL COMMENT '发布者ID（被评价对象）',
    `acceptor_id` BIGINT NOT NULL COMMENT '接单者ID（被评价对象）',
    `from_user_id` BIGINT NOT NULL COMMENT '评价者ID',
    `to_user_id` BIGINT NOT NULL COMMENT '被评价者ID',
    `score` TINYINT NOT NULL COMMENT '评分（1-5星）',
    `content` VARCHAR(500) COMMENT '评价内容',
    `type` TINYINT NOT NULL COMMENT '评价类型：1-发布者评价接单者，2-接单者评价发布者',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `uk_task_from_to` (`task_id`, `from_user_id`, `to_user_id`),
    INDEX `idx_publisher_id` (`publisher_id`),
    INDEX `idx_acceptor_id` (`acceptor_id`),
    INDEX `idx_from_user_id` (`from_user_id`),
    FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`publisher_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`acceptor_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`from_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`to_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

CREATE TABLE `message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '消息ID',
    `user_id` BIGINT NOT NULL COMMENT '接收用户ID',
    `task_id` BIGINT COMMENT '关联任务ID',
    `type` TINYINT NOT NULL COMMENT '消息类型：1-任务推送，2-订单状态变更，3-纠纷提醒，4-系统通知',
    `title` VARCHAR(100) NOT NULL COMMENT '消息标题',
    `content` VARCHAR(500) NOT NULL COMMENT '消息内容',
    `read_status` TINYINT NOT NULL DEFAULT 0 COMMENT '阅读状态：0-未读，1-已读',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_read_status` (`read_status`),
    INDEX `idx_create_time` (`create_time`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

CREATE TABLE `statistics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '统计ID',
    `date` DATE NOT NULL COMMENT '统计日期',
    `total_tasks` INT NOT NULL DEFAULT 0 COMMENT '当日任务总数',
    `completed_tasks` INT NOT NULL DEFAULT 0 COMMENT '当日完成任务数',
    `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT '当日成交金额',
    `active_users` INT NOT NULL DEFAULT 0 COMMENT '当日活跃用户数',
    `new_users` INT NOT NULL DEFAULT 0 COMMENT '当日新增用户数',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `uk_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统计数据表';

INSERT INTO `task_type` (`id`, `name`, `description`, `sort_order`, `status`) VALUES
(1, '代取快递', '代取校园快递、外卖等', 1, 1),
(2, '代买物资', '代买零食、日用品、文具等', 2, 1),
(3, '占座排队', '图书馆占座、食堂排队等', 3, 1),
(4, '兼职互助', '课程作业辅导、活动协助等', 4, 1),
(5, '其他', '其他类型任务', 5, 1);

CREATE TABLE `user_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `user_id` BIGINT COMMENT '用户ID（登录失败时可为0）',
    `username` VARCHAR(100) NOT NULL COMMENT '用户名/邮箱',
    `action` TINYINT NOT NULL COMMENT '操作类型：1-登录，2-注册，3-注销',
    `ip_address` VARCHAR(50) COMMENT 'IP地址',
    `user_agent` VARCHAR(500) COMMENT '用户代理',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '操作状态：1-成功，0-失败',
    `message` VARCHAR(200) COMMENT '操作消息',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_action` (`action`),
    INDEX `idx_create_time` (`create_time`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户操作日志表';

INSERT INTO `user` (`id`, `student_id`, `phone`, `email`, `nickname`, `password`, `role`, `balance`, `status`) VALUES
(1, 'admin', '13800138000', 'admin@campus.com', '管理员', '0192023a7bbd73250516f069df18b500', 4, 0, 1);

-- 轮播图表
CREATE TABLE IF NOT EXISTS `banner` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '轮播图标题',
  `description` varchar(500) DEFAULT NULL COMMENT '轮播图描述',
  `image_url` varchar(500) NOT NULL COMMENT '轮播图图片地址',
  `link_url` varchar(500) DEFAULT NULL COMMENT '轮播图点击跳转链接',
  `sort` int(11) DEFAULT 0 COMMENT '排序权重',
  `status` int(11) DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 插入示例数据
INSERT INTO `banner` (`title`, `description`, `image_url`, `link_url`, `sort`, `status`) VALUES
('新人专享', '首单立减5元', 'https://picsum.photos/1200/400?random=1', '/app/tasks', 1, 1),
('限时特惠', '周末任务享双倍积分', 'https://picsum.photos/1200/400?random=2', '/app/tasks', 2, 1),
('接单达人', '月接单30单送会员', 'https://picsum.photos/1200/400?random=3', '/app/profile', 3, 1);

-- 系统评价表
CREATE TABLE IF NOT EXISTS `evaluation` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `rating` INT NOT NULL COMMENT '评分 1-5',
  `feedback` TEXT COMMENT '问题反馈',
  `status` INT DEFAULT 0 COMMENT '状态 0-未处理 1-已处理',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` INT DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统评价表';

-- 系统公告主表
CREATE TABLE IF NOT EXISTS `sys_notice` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` VARCHAR(100) NOT NULL COMMENT '公告标题',
  `content` TEXT NOT NULL COMMENT '公告内容',
  `notice_type` TINYINT DEFAULT 1 COMMENT '1全员公告 2指定用户',
  `status` TINYINT DEFAULT 1 COMMENT '0下架 1正常',
  `publish_time` DATETIME COMMENT '发布时间',
  `admin_id` BIGINT COMMENT '发布管理员ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` INT DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统公告表';

-- 用户消息阅读记录表
CREATE TABLE IF NOT EXISTS `user_notice_read` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `notice_id` BIGINT NOT NULL COMMENT '关联公告ID',
  `is_read` TINYINT DEFAULT 0 COMMENT '0未读 1已读',
  `read_time` DATETIME NULL COMMENT '阅读时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_notice` (`user_id`, `notice_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_notice_id` (`notice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户消息阅读记录表';

-- G豆用户账户表
CREATE TABLE IF NOT EXISTS `gcoin_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '账户ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `balance` DECIMAL(18,4) NOT NULL DEFAULT 0 COMMENT 'G豆余额',
  `total_earned` DECIMAL(18,4) NOT NULL DEFAULT 0 COMMENT '累计获得',
  `total_spent` DECIMAL(18,4) NOT NULL DEFAULT 0 COMMENT '累计消耗',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='G豆用户账户表';

-- G豆交易记录表
CREATE TABLE IF NOT EXISTS `gcoin_transaction` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '交易ID',
  `user_id` BIGINT COMMENT '用户ID（国库操作时为NULL）',
  `type` TINYINT NOT NULL COMMENT '交易类型：1-接单奖励 2-任务完成奖励 3-系统奖励 4-转账支出 5-转账收入 6-消费支出 7-手续费 8-管理员操作 9-国库投放',
  `amount` DECIMAL(18,4) NOT NULL COMMENT '金额（正数为收入，负数为支出）',
  `balance_before` DECIMAL(18,4) NOT NULL COMMENT '交易前余额',
  `balance_after` DECIMAL(18,4) NOT NULL COMMENT '交易后余额',
  `description` VARCHAR(200) COMMENT '交易描述',
  `related_user_id` BIGINT COMMENT '关联用户ID（转账时使用）',
  `fee` DECIMAL(18,4) COMMENT '手续费',
  `treasury_operation` TINYINT DEFAULT 0 COMMENT '是否国库操作：0-否 1-是',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='G豆交易记录表';

-- G豆国库账户表
CREATE TABLE IF NOT EXISTS `treasury_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `balance` DECIMAL(20,4) NOT NULL DEFAULT 0 COMMENT '国库余额',
  `total_income` DECIMAL(20,4) NOT NULL DEFAULT 0 COMMENT '累计收入',
  `total_expense` DECIMAL(20,4) NOT NULL DEFAULT 0 COMMENT '累计支出',
  `locked_balance` DECIMAL(20,4) NOT NULL DEFAULT 0 COMMENT '封存余额',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='G豆国库账户表';

-- 系统配置表
CREATE TABLE IF NOT EXISTS `system_config` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
  `config_value` VARCHAR(500) COMMENT '配置值',
  `config_desc` VARCHAR(200) COMMENT '配置描述',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 初始化系统配置
INSERT INTO `system_config` (`config_key`, `config_value`, `config_desc`) VALUES
('total_circulation', '1000000.0000', '全网G豆总流通量'),
('daily_production_limit', '10000.0000', '每日G豆产出上限'),
('user_hold_limit', '50000.0000', '单个用户持有上限'),
('transfer_enabled', '1', '是否启用转账功能：0-禁用 1-启用'),
('transfer_fee_rate', '0.01', '转账手续费率（1%）');

-- 账户操作日志表
CREATE TABLE IF NOT EXISTS `account_operation_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `admin_id` BIGINT NOT NULL COMMENT '管理员ID',
  `operation_type` TINYINT NOT NULL COMMENT '操作类型：1-国库投放，2-国库封存，3-国库解封，4-调整流通，5-扣减G豆，6-补发G豆',
  `target_user_id` BIGINT COMMENT '目标用户ID（用户操作时）',
  `amount` DECIMAL(20,4) NOT NULL COMMENT '操作金额',
  `description` VARCHAR(500) COMMENT '操作描述',
  `before_balance` DECIMAL(20,4) COMMENT '操作前余额',
  `after_balance` DECIMAL(20,4) COMMENT '操作后余额',
  `ip_address` VARCHAR(50) COMMENT '管理员IP地址',
  `user_agent` VARCHAR(500) COMMENT '管理员User-Agent',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_admin_id` (`admin_id`),
  INDEX `idx_operation_type` (`operation_type`),
  INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账户操作日志表';

-- 初始化国库账户
INSERT INTO `treasury_account` (`id`, `balance`, `total_income`, `total_expense`, `locked_balance`) VALUES
(1, 500000.0000, 0.0000, 0.0000, 0.0000);