# 3. Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.0+ | 类型安全的JavaScript开发 | 提供静态类型检查，提高代码质量和开发效率，与React完美集成 |
| Frontend Framework | Next.js | 14+ | React全栈框架 | App Router提供最佳性能和SEO，支持SSR/SSG，与Vercel部署无缝集成 |
| UI Component Library | Chakra UI | 2.8+ | 可访问的UI组件库 | 提供开箱即用的可访问组件，支持主题定制，与Tailwind CSS兼容 |
| State Management | React Query (TanStack Query) | 5.0+ | 服务器状态管理 | 优化数据获取、缓存和同步，简化API调用逻辑，提供自动重试和缓存策略 |
| Backend Language | TypeScript | 5.0+ | 类型安全的后端开发 | 与前端共享类型定义，确保API接口类型安全 |
| Backend Framework | Next.js API Routes | 14+ | 无服务器API服务 | 与前端共享代码库，简化部署，自动扩展，支持边缘函数 |
| API Style | RESTful API | - | 标准化API接口 | 简单直观，广泛支持，易于理解和实现，适合CRUD操作 |
| Database | Supabase (PostgreSQL) | 15+ | 关系型数据库服务 | 提供完整的PostgreSQL功能，实时功能，自动扩展，内置认证和存储 |
| Cache | Redis (via Supabase) | 7+ | 内存数据缓存 | 提高性能，减少数据库负载，支持会话存储和实时数据 |
| File Storage | Supabase Storage | - | 文件存储服务 | 与数据库集成，提供安全的文件上传、下载和CDN加速 |
| Authentication | Supabase Auth | - | 用户认证和授权 | 开箱即用的认证功能，支持多种提供商，JWT令牌管理 |
| Frontend Testing | Jest + React Testing Library | 29+ | 前端单元和集成测试 | Jest提供测试框架，RTL提供React组件测试，确保UI组件质量 |
| Backend Testing | Jest + Supertest | 29+ | 后端API测试 | Jest提供测试框架，Supertest简化HTTP请求测试 |
| E2E Testing | Playwright | 1.40+ | 端到端测试 | 跨浏览器测试，支持现代Web应用，提供可靠的用户流程测试 |
| Build Tool | Turborepo | 1.11+ | Monorepo构建工具 | 高效的并行构建，智能缓存，简化monorepo管理 |
| Bundler | Next.js (Webpack) | 内置 | 模块打包和代码分割 | Next.js内置优化的Webpack配置，支持代码分割和Tree Shaking |
| IaC Tool | Terraform | 1.6+ | 基础设施即代码 | 管理云资源，版本控制基础设施，支持多云部署 |
| CI/CD | GitHub Actions | - | 持续集成和部署 | 与GitHub深度集成，支持自动化测试和部署，免费额度充足 |
| Monitoring | Vercel Analytics + Sentry | - | 应用性能监控和错误跟踪 | Vercel提供内置分析，Sentry提供详细的错误报告和性能监控 |
| Logging | Winston + Supabase Logs | 3.11+ | 应用日志管理 | Winston提供结构化日志，Supabase提供集中式日志存储和查询 |
| CSS Framework | Tailwind CSS | 3.4+ | 实用优先的CSS框架 | 与Chakra UI完美集成，提供快速样式开发，统一sm尺寸规范 |
