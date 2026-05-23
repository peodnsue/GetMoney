-- 创建轮播图表
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
