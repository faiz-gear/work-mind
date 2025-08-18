# 8. Core Workflows

## Workflow 1: User Registration and Login
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant A as Auth Service
    participant D as Database

    U->>F: 输入注册信息（邮箱、密码、姓名）
    F->>B: POST /auth/register
    B->>A: 验证输入数据
    A->>D: 检查邮箱是否已存在
    D-->>A: 返回检查结果
    A->>D: 创建新用户记录
    D-->>A: 用户创建成功
    A->>A: 生成JWT令牌
    A-->>B: 返回用户信息和令牌
    B-->>F: 返回注册成功响应
    F->>F: 存储令牌，更新UI状态
    F-->>U: 显示注册成功，跳转到仪表板

    Note over U,D: === 用户登录流程 ===

    U->>F: 输入登录信息（邮箱、密码）
    F->>B: POST /auth/login
    B->>A: 验证用户凭据
    A->>D: 查询用户信息
    D-->>A: 返回用户数据
    A->>A: 验证密码，生成JWT令牌
    A-->>B: 返回用户信息和令牌
    B-->>F: 返回登录成功响应
    F->>F: 存储令牌，更新UI状态
    F-->>U: 显示登录成功，跳转到仪表板
```

## Workflow 2: Creating a Work Record
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant D as Database
    participant R as Realtime Service

    U->>F: 点击"新建记录"或使用快捷键
    F->>F: 显示记录编辑器界面
    U->>F: 输入标题、内容和标签
    F->>F: 自动保存草稿（本地）
    U->>F: 点击"保存"按钮
    F->>B: POST /work-records
    B->>B: 验证用户权限
    B->>D: 创建工作记录
    D-->>B: 返回创建的记录ID
    B->>D: 更新标签使用计数
    D-->>B: 更新完成
    B->>R: 触发实时事件
    R->>R: 广播记录创建事件
    R-->>F: 推送实时更新
    F->>F: 更新UI，显示成功提示
    F-->>U: 显示保存成功，更新记录列表

    Note over U,R: === 快速记录流程 ===

    U->>F: 触发快捷键（Ctrl+Shift+R）
    F->>F: 显示快速记录弹窗
    U->>F: 输入标题和内容
    F->>B: POST /work-records (标记为quick)
    B->>D: 创建快速记录
    D-->>B: 返回记录ID
    B-->>F: 返回创建成功
    F->>F: 自动关闭弹窗，显示提示
    F-->>U: 显示快速记录成功
```

## Workflow 3: Generating AI Summary
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant AI as AI Service
    participant D as Database
    participant R as Realtime Service

    U->>F: 选择工作记录，点击"生成总结"
    F->>F: 显示AI服务选择和参数设置
    U->>F: 选择AI提供商和参数
    F->>B: POST /summaries
    B->>B: 验证用户权限和AI服务配置
    B->>D: 获取工作记录内容
    D-->>B: 返回记录内容
    B->>B: 准备提示词和参数
    B->>AI: 发送AI请求
    AI-->>B: 返回生成结果
    B->>B: 计算质量评分，处理元数据
    B->>D: 保存总结结果
    D-->>B: 保存成功
    B->>R: 触发总结创建事件
    R->>R: 广播总结更新
    R-->>F: 推送实时更新
    B-->>F: 返回总结结果
    F->>F: 更新UI，显示总结内容
    F-->>U: 显示总结结果和质量评分

    Note over U,R: === 批量总结流程 ===

    U->>F: 选择多个记录，点击"批量总结"
    F->>B: POST /summaries (多个记录ID)
    B->>D: 批量获取记录内容
    D-->>B: 返回所有记录内容
    B->>AI: 发送批量AI请求
    AI-->>B: 返回批量结果
    B->>D: 批量保存总结
    D-->>B: 保存完成
    B-->>F: 返回批量总结结果
    F-->>U: 显示批量总结完成
```

## Workflow 4: Real-time Data Synchronization
```mermaid
sequenceDiagram
    participant F1 as Frontend Device 1
    participant F2 as Frontend Device 2
    participant R as Realtime Service
    participant D as Database
    participant B as Backend API

    Note over F1,F2: === 设备间实时同步 ===

    F1->>B: 更新工作记录
    B->>D: 更新数据库
    D-->>B: 更新成功
    B->>R: 发送变更事件
    R->>R: 广播到所有订阅的客户端
    R-->>F2: 推送数据变更
    F2->>F2: 更新本地状态和UI

    Note over F1,F2: === 离线同步流程 ===

    F1->>F1: 检测网络断开，进入离线模式
    F1->>F1: 本地存储操作（IndexedDB）
    F1->>F1: 网络恢复，检测离线操作
    F1->>B: 批量同步离线操作
    B->>D: 应用离线变更
    D-->>B: 同步完成
    B->>R: 发送同步事件
    R-->>F1: 推送同步确认
    R-->>F2: 推送数据更新
```

## Workflow 5: Data Export
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant E as Export Service
    participant D as Database
    participant S as Storage Service

    U->>F: 进入导出中心，选择导出格式和筛选条件
    F->>B: POST /exports
    B->>E: 创建导出任务
    E->>D: 查询符合条件的数据
    D-->>E: 返回查询结果
    E->>E: 处理数据，生成目标格式文件
    E->>S: 上传生成的文件
    S-->>E: 返回文件URL
    E->>D: 更新导出任务状态和文件信息
    D-->>E: 更新完成
    E-->>B: 返回导出完成
    B->>R: 触发导出完成事件
    R-->>F: 推送导出状态更新
    F->>F: 更新UI，显示下载链接
    F-->>U: 显示导出完成，提供文件下载

    Note over U,S: === 大数据量导出流程 ===

    E->>E: 检测数据量过大
    E->>E: 分批次处理数据
    E->>E: 生成临时文件
    E->>S: 分片上传文件
    S-->>E: 确认上传完成
    E->>E: 合并文件分片
    E->>S: 上传最终文件
    S-->>E: 返回完整文件URL
```
