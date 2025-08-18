# 12. Unified Project Structure

```plaintext
work-logger/
├── .github/                    # GitHub Actions CI/CD
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── app/                        # Next.js App Router
│   ├── api/                    # API路由
│   │   ├── auth/
│   │   ├── work-records/
│   │   ├── summaries/
│   │   ├── tags/
│   │   ├── ai-services/
│   │   ├── analytics/
│   │   └── exports/
│   ├── (auth)/                # 认证路由组
│   ├── (dashboard)/           # 仪表板路由组
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 首页
├── components/                # React组件
│   ├── ui/                   # 基础UI组件
│   ├── layout/               # 布局组件
│   ├── forms/                # 表单组件
│   ├── features/             # 功能组件
│   └── providers/           # React Providers
├── lib/                      # 工具库
│   ├── db/                   # 数据库相关
│   │   ├── schema.ts         # Drizzle schema
│   │   ├── migrations/       # 数据库迁移
│   │   └── index.ts          # 数据库连接
│   ├── auth.ts               # 认证工具
│   ├── utils.ts              # 通用工具
│   ├── validations.ts        # 数据验证
│   └── constants.ts          # 常量定义
├── services/                 # API服务
│   ├── auth.service.ts
│   ├── work-record.service.ts
│   ├── summary.service.ts
│   ├── tag.service.ts
│   └── analytics.service.ts
├── repositories/             # 数据访问层
│   ├── work-record.repository.ts
│   ├── user.repository.ts
│   ├── summary.repository.ts
│   └── tag.repository.ts
├── stores/                   # 状态管理
│   ├── auth.store.ts
│   ├── ui.store.ts
│   ├── work-record.store.ts
│   └── analytics.store.ts
├── hooks/                    # 自定义Hooks
│   ├── use-work-records.ts
│   ├── use-summaries.ts
│   ├── use-tags.ts
│   ├── use-auth.ts
│   └── use-debounce.ts
├── types/                    # TypeScript类型
│   ├── api.types.ts
│   ├── ui.types.ts
│   └── app.types.ts
├── styles/                   # 样式文件
│   └── theme.ts              # 主题配置
├── scripts/                  # 构建和部署脚本
│   ├── build.sh
│   ├── deploy.sh
│   └── migrate.sh
├── infrastructure/            # 基础设施即代码
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── docker/
│       └── Dockerfile
├── docs/                     # 文档
│   ├── prd.md
│   ├── front-end-spec.md
│   └── fullstack-architecture.md
├── tests/                    # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example              # 环境变量模板
├── .eslintrc.json           # ESLint配置
├── .prettierrc              # Prettier配置
├── tailwind.config.ts       # Tailwind配置
├── tsconfig.json            # TypeScript配置
├── package.json             # 依赖和脚本
├── turbo.json               # Turborepo配置
└── README.md                # 项目说明
```
