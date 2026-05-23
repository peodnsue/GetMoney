
# 校园互助任务接单平台 - GetMoney

一个面向在校学生的任务互助平台，支持任务发布、抢单、完成、评价全流程闭环，并内置 G 豆生态虚拟货币系统。

## 项目简介

本项目是一个全栈校园任务互助平台，主要解决学生代取快递、代买物资、占座排队、兼职互助等高频校园场景需求。项目采用前后端分离架构，后端使用 Spring Boot，前端使用 React + TypeScript + Tailwind CSS，移动端使用 UniApp 开发，支持 Android/iOS/微信小程序多端。

## 项目结构

```
GetMoney/
├── backend/                # 后端服务
│   ├── src/
│   │   └── main/java/com/campus/orders/
│   │       ├── controller/       # 控制器层
│   │       ├── service/          # 业务逻辑层
│   │       ├── mapper/           # 数据访问层
│   │       ├── entity/           # 实体类
│   │       ├── dto/              # 数据传输对象
│   │       ├── config/           # 配置类
│   │       ├── interceptor/      # 拦截器
│   │       ├── exception/        # 异常处理
│   │       └── util/             # 工具类
│   └── pom.xml
├── frontend-user/          # 用户端 Web 应用
│   └── src/
│       ├── pages/              # 页面组件
│       ├── components/         # 通用组件
│       ├── api/                # API 调用
│       └── store/              # 状态管理
├── frontend-admin/         # 管理后台
│   └── src/
│       ├── pages/              # 管理页面
│       └── api/                # 管理接口
├── app/                    # 移动端应用（UniApp）
│   └── pages/
├── database/               # 数据库脚本
└── 素材/                   # 项目素材
```

## 技术栈

### 后端技术

| 技术 | 版本 | 说明 |
|-----|------|-----|
| Java | 1.8+ | 后端开发语言 |
| Spring Boot | 2.7.18 | 后端应用框架 |
| MyBatis Plus | 3.5.3.1 | ORM 数据库访问框架 |
| MySQL | 8.0+ | 关系型数据库 |
| JWT | 0.9.1 | Token 认证 |
| Lombok | - | 简化 Java 代码 |
| FastJSON | 1.2.83 | JSON 序列化 |
| Spring Mail | - | 邮件验证码发送 |

### 前端技术

| 技术 | 说明 |
|-----|------|
| React 18 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Tailwind CSS | CSS 工具类框架 |
| Zustand | 状态管理 |
| React Router | 路由管理 |
| Chart.js | 数据可视化 |

### 移动端

- UniApp (Vue 3)
- 支持 Android / iOS / 微信小程序

## 已实现功能

### 用户端功能

#### 1. 用户认证
- ✅ 邮箱验证码注册/登录
- ✅ 密码登录
- ✅ Token 双机制认证（AccessToken 2小时，RefreshToken 15天）
- ✅ Token 自动刷新
- ✅ 退出登录
- ✅ 用户登录/操作日志记录

#### 2. 任务管理
- ✅ 任务列表查询（支持分类、楼栋、状态筛选）
- ✅ 任务详情查看
- ✅ 发布任务（上传配图、设置佣金、截止时间等）
- ✅ 接单抢单
- ✅ 提交任务完成凭证
- ✅ 发布者确认完成
- ✅ 任务取消
- ✅ 查看我发布的任务
- ✅ 查看我接单的任务

#### 3. 消息通知
- ✅ 系统公告列表
- ✅ 公告详情查看
- ✅ 未读消息计数
- ✅ 消息标记已读/全部已读

#### 4. G 豆生态
- ✅ G 豆钱包查询
- ✅ G 豆转账（支持手续费、国库归集）
- ✅ G 豆交易流水查询
- ✅ 用户持有上限控制
- ✅ 日产出上限控制

#### 5. 用户中心
- ✅ 个人信息查看
- ✅ 修改昵称、邮箱、密码
- ✅ 头像上传
- ✅ 系统评价/反馈
- ✅ 帮助中心
- ✅ 联系我们
- ✅ 用户协议、隐私政策

#### 6. 评价功能
- ✅ 查看用户评价
- ✅ 发布评价

### 管理后台功能

#### 1. 用户管理
- ✅ 用户列表查询
- ✅ 用户状态封禁/解封
- ✅ 用户角色修改
- ✅ 用户操作日志查看

#### 2. 任务管理
- ✅ 任务列表查询
- ✅ 任务详情查看
- ✅ 任务状态管理

#### 3. G 豆管理
- ✅ 全网流通数据统计
- ✅ 国库账户管理
- ✅ 国库资金投放/封存/解封
- ✅ 流通量手动调整
- ✅ 用户 G 豆手动增减
- ✅ G 豆交易流水查询
- ✅ 账户操作日志
- ✅ 用户 G 豆账户查询

#### 4. 公告管理
- ✅ 公告发布
- ✅ 公告编辑
- ✅ 公告状态管理（上架/下架）
- ✅ 公告列表

#### 5. 轮播图管理
- ✅ 轮播图列表
- ✅ 新增/编辑/删除轮播图

#### 6. 数据统计
- ✅ 今日数据概览
- ✅ 时间范围统计
- ✅ 用户地理位置统计
- ✅ 数据可视化图表

#### 7. 评价管理
- ✅ 用户反馈查看
- ✅ 反馈状态处理

#### 8. 纠纷管理
- ✅ 纠纷列表
- ✅ 纠纷处理（Mock 数据）

### 后端核心功能

#### 1. 定时任务
- ✅ 超时任务自动检查（每5分钟）
- ✅ 自动更新任务过期状态

#### 2. 系统配置
- ✅ 全网 G 豆流通总量配置
- ✅ 日产出上限配置
- ✅ 用户持有上限配置
- ✅ 转账手续费比例配置
- ✅ 转账功能开关

#### 3. 全局异常处理
- ✅ 统一异常捕获和响应

#### 4. 跨域配置
- ✅ 全局跨域支持

## 设计文档中提及但暂未实现的功能

### 1. 高级用户认证
- ❌ 手机号/学号登录（当前仅支持邮箱）
- ❌ 实名认证
- ❌ 人脸识别认证
- ❌ 短信验证码（当前仅支持邮箱验证码）
- ❌ Spring Security 整合

### 2. 任务交易模块
- ❌ 任务押金机制
- ❌ 真实支付集成（微信支付）
- ❌ 资金托管与自动结算
- ❌ 退款流程
- ❌ 任务超时自动退款
- ❌ 纠纷仲裁流程（当前仅 Mock 数据）

### 3. 实时通讯
- ❌ WebSocket 实时消息推送
- ❌ 任务状态实时通知
- ❌ 在线用户消息交互
- ❌ 站内聊天功能

### 4. 性能优化
- ❌ Redis 缓存（用户信息、热门任务等）
- ❌ Redis 分布式锁（防重复抢单）
- ❌ 任务推荐算法
- ❌ 附近任务（基于地理位置）

### 5. 文件存储
- ❌ 阿里云 OSS 集成
- ❌ 图片上传功能
- ❌ 任务配图上传
- ❌ 完成凭证图片上传

### 6. 数据导出
- ❌ Apache POI Excel 导出
- ❌ 批量数据导入
- ❌ 统计报表导出

### 7. G 豆生态扩展
- ❌ 日常任务奖励（签到、任务完成）
- ❌ G 豆商城兑换
- ❌ G 豆抽奖/竞拍
- ❌ 活动奖励机制
- ❌ G 豆消费场景

### 8. 用户激励
- ❌ 用户等级/积分系统
- ❌ 成就体系
- ❌ 活跃度统计

### 9. AOP 功能
- ❌ 公共字段自动填充
- ❌ 日志切面
- ❌ 性能监控切面

### 10. 审核机制
- ❌ 任务发布审核
- ❌ 违规内容封禁
- ❌ 用户违规惩罚

### 11. 移动端功能
- ❌ UniApp 完整实现（当前仅有基础框架）
- ❌ 移动端原生能力集成

## 数据库设计

### 核心数据表

| 表名 | 说明 |
|-----|------|
| user | 用户表 |
| task | 任务表 |
| task_type | 任务类型表 |
| task_accept | 接单记录表 |
| payment | 支付记录表 |
| comment | 评价表 |
| message | 消息表 |
| statistics | 统计数据表 |
| banner | 轮播图表 |
| evaluation | 系统评价表 |
| sys_notice | 系统公告表 |
| user_notice_read | 用户公告阅读表 |
| user_log | 用户操作日志表 |
| gcoin_account | G豆用户账户表 |
| gcoin_transaction | G豆交易记录表 |
| treasury_account | G豆国库账户表 |
| system_config | 系统配置表 |
| account_operation_log | 账户操作日志表 |

详细数据库初始化脚本：[init.sql](init.sql)

## 快速开始

### 环境要求

- JDK 1.8+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### 1. 数据库初始化

```bash
# 创建数据库
CREATE DATABASE getmoney CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 执行初始化脚本
mysql -u your_username -p getmoney &lt; init.sql
```

### 2. 后端启动

```bash
cd backend

# 修改数据库配置
# 编辑 src/main/resources/application.yml
# 配置数据库连接信息、邮件配置等

# 编译并运行
mvn clean package
java -jar target/campus-orders-1.0.0.jar

# 或使用 IDE 直接运行 CampusOrdersApplication.java
```

后端服务默认运行在 `http://localhost:8080`

### 3. 管理后台启动

```bash
cd frontend-admin

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

### 4. 用户端启动

```bash
cd frontend-user

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

### 5. 移动端开发

使用 HBuilderX 打开 `app` 目录，运行到浏览器/真机/模拟器。

## 默认账号

| 角色 | 邮箱 | 密码 |
|-----|------|------|
| 管理员 | admin@campus.com | admin123 |

## API 文档

### 认证相关

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/api/auth/login` | POST | 登录 |
| `/api/auth/register` | POST | 注册 |
| `/api/auth/sendCode` | POST | 发送验证码 |
| `/api/auth/token/refresh` | POST | 刷新 Token |
| `/api/auth/logout` | POST | 退出登录 |
| `/api/auth/profile` | GET | 获取用户信息 |

### 任务相关

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/api/task/list` | GET | 任务列表 |
| `/api/task/detail/{id}` | GET | 任务详情 |
| `/api/task/create` | POST | 发布任务 |
| `/api/task/accept/{id}` | POST | 接单 |
| `/api/task/complete` | POST | 提交完成凭证 |
| `/api/task/confirm/{id}` | POST | 确认完成 |
| `/api/task/cancel/{id}` | POST | 取消任务 |
| `/api/task/my/published` | GET | 我发布的任务 |
| `/api/task/my/accepted` | GET | 我接单的任务 |

### G 豆相关

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/api/gcoin/wallet` | GET | 获取钱包 |
| `/api/gcoin/transfer` | POST | G 豆转账 |
| `/api/gcoin/transactions` | GET | 交易流水 |

### 管理后台接口

管理后台接口均以 `/api/admin` 或 `/api/admin/gcoin` 开头。

## 开发规范

### 分支管理

- `main` - 主分支，稳定版本
- `dev` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支

### 提交规范

```
<type>(<scope>): <subject>

类型：
- feat: 新功能
- fix: 修复
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试
- chore: 构建/工具
```

## 相关文档

- [设计文档](设计文档.md)
- [G豆生态流通货币系统设计文档（正式可开发版）](G豆生态流通货币系统设计文档（正式可开发版）.md)
- [消息通知功能设计](消息通知功能设计.md)
- [优化功能点](优化功能点.md)
- [Token 登录鉴权设计](Token登录鉴权与自动刷新功能实现文档.md)

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

本项目仅供学习和交流使用。

## 联系方式

如有问题，欢迎联系或提交 Issue。

