# 4. Data Models

## User
**Purpose:** 存储用户账户信息、认证数据和用户偏好设置

**Key Attributes:**
- id: UUID - 用户唯一标识符
- email: string - 用户邮箱地址
- name: string - 用户显示名称
- avatar_url: string - 用户头像URL
- created_at: timestamp - 账户创建时间
- updated_at: timestamp - 最后更新时间
- preferences: jsonb - 用户偏好设置（主题、语言、通知等）

### TypeScript Interface
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    ai_settings: {
      default_provider: string;
      summary_length: 'short' | 'medium' | 'long';
    };
  };
}
```

### Relationships
- 一个用户可以有多个工作记录（一对多）
- 一个用户可以有多个总结（一对多）
- 一个用户可以配置多个AI服务（一对多）
- 一个用户可以创建多个提示模板（一对多）

## WorkRecord
**Purpose:** 存储用户的工作记录内容，包括标题、正文、标签和时间信息

**Key Attributes:**
- id: UUID - 工作记录唯一标识符
- user_id: UUID - 关联用户ID
- title: string - 工作记录标题
- content: text - 工作记录内容（支持Markdown）
- tags: string[] - 标签数组
- created_at: timestamp - 创建时间
- updated_at: timestamp - 最后更新时间
- is_pinned: boolean - 是否置顶
- metadata: jsonb - 元数据（字数、阅读时间等）

### TypeScript Interface
```typescript
interface WorkRecord {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  metadata: {
    word_count: number;
    reading_time: number;
    source: 'manual' | 'import' | 'quick';
  };
}
```

### Relationships
- 属于一个用户（多对一）
- 一个工作记录可以有多个总结（一对多）
- 关联多个标签（多对多，通过标签关联表）

## Tag
**Purpose:** 存储标签信息，用于分类和组织工作记录

**Key Attributes:**
- id: UUID - 标签唯一标识符
- user_id: UUID - 创建用户ID
- name: string - 标签名称
- color: string - 标签颜色
- created_at: timestamp - 创建时间
- usage_count: integer - 使用次数

### TypeScript Interface
```typescript
interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  usage_count: number;
}
```

### Relationships
- 属于一个用户（多对一）
- 可以关联多个工作记录（多对多）

## Summary
**Purpose:** 存储AI生成的工作总结，包括原始内容、总结结果和质量评估

**Key Attributes:**
- id: UUID - 总结唯一标识符
- user_id: UUID - 用户ID
- work_record_ids: UUID[] - 关联的工作记录ID数组
- content: text - 总结内容
- ai_provider: string - AI服务提供商
- model: string - 使用的AI模型
- prompt_template_id: UUID - 使用的提示模板ID
- quality_score: number - 质量评分（0-100）
- created_at: timestamp - 创建时间
- metadata: jsonb - 元数据（token使用、生成时间等）

### TypeScript Interface
```typescript
interface Summary {
  id: string;
  user_id: string;
  work_record_ids: string[];
  content: string;
  ai_provider: 'openai' | 'gemini' | 'deepseek' | 'custom';
  model: string;
  prompt_template_id?: string;
  quality_score: number;
  created_at: string;
  metadata: {
    tokens_used: number;
    generation_time: number;
    cost: number;
  };
}
```

### Relationships
- 属于一个用户（多对一）
- 关联多个工作记录（多对多）
- 可能使用一个提示模板（多对一）

## AIService
**Purpose:** 存储用户配置的AI服务提供商信息

**Key Attributes:**
- id: UUID - 服务配置唯一标识符
- user_id: UUID - 用户ID
- provider: string - 服务提供商名称
- api_key: string - 加密的API密钥
- base_url: string - 自定义API基础URL（可选）
- model: string - 默认模型
- is_active: boolean - 是否启用
- created_at: timestamp - 创建时间
- updated_at: timestamp - 最后更新时间

### TypeScript Interface
```typescript
interface AIService {
  id: string;
  user_id: string;
  provider: 'openai' | 'gemini' | 'deepseek' | 'custom';
  api_key: string; // 加密存储
  base_url?: string;
  model: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Relationships
- 属于一个用户（多对一）

## PromptTemplate
**Purpose:** 存储用户创建的AI提示模板

**Key Attributes:**
- id: UUID - 模板唯一标识符
- user_id: UUID - 创建用户ID
- name: string - 模板名称
- description: string - 模板描述
- template: text - 提示模板内容
- variables: jsonb - 模板变量定义
- is_public: boolean - 是否公开分享
- created_at: timestamp - 创建时间
- updated_at: timestamp - 最后更新时间

### TypeScript Interface
```typescript
interface PromptTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string;
  template: string;
  variables: {
    name: string;
    type: string;
    required: boolean;
    default?: string;
  }[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
```

### Relationships
- 属于一个用户（多对一）
- 被多个总结使用（一对多）

## Export
**Purpose:** 存储导出历史记录

**Key Attributes:**
- id: UUID - 导出记录唯一标识符
- user_id: UUID - 用户ID
- type: string - 导出类型（PDF、CSV、JSON等）
- filter: jsonb - 导出筛选条件
- file_url: string - 导出文件URL
- file_size: integer - 文件大小（字节）
- status: string - 导出状态
- created_at: timestamp - 创建时间
- completed_at: timestamp - 完成时间

### TypeScript Interface
```typescript
interface Export {
  id: string;
  user_id: string;
  type: 'pdf' | 'csv' | 'json' | 'markdown';
  filter: {
    date_range: {
      start: string;
      end: string;
    };
    tags?: string[];
    include_summaries: boolean;
  };
  file_url?: string;
  file_size?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}
```

### Relationships
- 属于一个用户（多对一）
