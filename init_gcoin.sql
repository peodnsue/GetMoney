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

-- 初始化系统配置（忽略重复键错误）
INSERT IGNORE INTO `system_config` (`config_key`, `config_value`, `config_desc`) VALUES
('total_circulation', '1000000.0000', '全网G豆总流通量'),
('daily_production_limit', '10000.0000', '每日G豆产出上限'),
('user_hold_limit', '50000.0000', '单个用户持有上限'),
('transfer_enabled', '1', '是否启用转账功能：0-禁用 1-启用'),
('transfer_fee_rate', '0.01', '转账手续费率（1%）');

-- 初始化国库账户（忽略重复键错误）
INSERT IGNORE INTO `treasury_account` (`id`, `balance`, `total_income`, `total_expense`, `locked_balance`) VALUES
(1, 500000.0000, 0.0000, 0.0000, 0.0000);