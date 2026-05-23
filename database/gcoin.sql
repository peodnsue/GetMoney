CREATE TABLE IF NOT EXISTS `gcoin_account` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `balance` DECIMAL(18,2) NOT NULL DEFAULT '0.00' COMMENT 'G豆余额',
    `total_earned` DECIMAL(18,2) NOT NULL DEFAULT '0.00' COMMENT '累计获得',
    `total_spent` DECIMAL(18,2) NOT NULL DEFAULT '0.00' COMMENT '累计消耗',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='G豆账户表';

CREATE TABLE IF NOT EXISTS `treasury_account` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `balance` DECIMAL(18,2) NOT NULL DEFAULT '0.00' COMMENT '国库余额',
    `total_income` DECIMAL(18,2) NOT NULL DEFAULT '0.00' COMMENT '累计收入',
    `total_expense` DECIMAL(18,2) NOT NULL DEFAULT '0.00' COMMENT '累计支出',
    `locked_balance` DECIMAL(18,2) NOT NULL DEFAULT '0.00' COMMENT '封存锁定金额',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='国库账户表';

CREATE TABLE IF NOT EXISTS `gcoin_transaction` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `user_id` BIGINT COMMENT '用户ID（可为空，国库操作时为空）',
    `type` TINYINT NOT NULL COMMENT '交易类型：1-签到奖励 2-任务奖励 3-活动奖励 4-转账支出 5-转账收入 6-商城消费 7-手续费 8-后台调整 9-系统投放',
    `amount` DECIMAL(18,2) NOT NULL COMMENT '变动金额',
    `balance_before` DECIMAL(18,2) NOT NULL COMMENT '变动前余额',
    `balance_after` DECIMAL(18,2) NOT NULL COMMENT '变动后余额',
    `description` VARCHAR(255) COMMENT '操作说明',
    `related_user_id` BIGINT COMMENT '关联用户ID（转账时记录对方）',
    `fee` DECIMAL(18,2) DEFAULT '0.00' COMMENT '手续费金额',
    `treasury_operation` TINYINT DEFAULT '0' COMMENT '是否国库操作：0-否 1-是',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='G豆流水记录表';

CREATE TABLE IF NOT EXISTS `system_config` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `config_key` VARCHAR(64) NOT NULL COMMENT '配置键',
    `config_value` VARCHAR(500) NOT NULL COMMENT '配置值',
    `config_desc` VARCHAR(255) COMMENT '配置描述',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

INSERT INTO `system_config` (`config_key`, `config_value`, `config_desc`) VALUES 
('daily_production_limit', '100000.00', '全网单日最大产出上限'),
('user_hold_limit', '10000.00', '单用户持有上限'),
('transfer_fee_rate', '0.02', '转账手续费比例(0.01-0.05)'),
('transfer_enabled', '1', '转账功能开关：0-关闭 1-开启'),
('total_circulation', '0.00', '全网总流通量');

INSERT INTO `treasury_account` (`balance`, `total_income`, `total_expense`, `locked_balance`) VALUES 
('0.00', '0.00', '0.00', '0.00');