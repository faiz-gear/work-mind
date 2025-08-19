# 17. Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** 始终在 `packages/shared` 中定义类型并从那里导入
- **API Calls:** 绝不直接进行HTTP调用 - 使用服务层
- **Environment Variables:** 只通过配置对象访问，绝不直接使用 process.env
- **Error Handling:** 所有API路由必须使用标准错误处理器
- **State Updates:** 绝不直接改变状态 - 使用适当的状态管理模式
- **Database Access:** 绝不在API路由中直接使用原始SQL - 使用Repository模式
- **Authentication:** 绝不在客户端存储敏感信息 - 使用HttpOnly cookies
- **Validation:** 绝不信任用户输入 - 使用Zod进行服务端验证
- **File Upload:** 绝不直接处理文件上传 - 使用专用服务

## Naming Conventions

| Element         | Frontend             | Backend              | Example                  |
| --------------- | -------------------- | -------------------- | ------------------------ |
| Components      | PascalCase           | -                    | `UserProfile.tsx`        |
| Hooks           | camelCase with 'use' | -                    | `useAuth.ts`             |
| API Routes      | -                    | kebab-case           | `/api/user-profile`      |
| Database Tables | -                    | snake_case           | `user_profiles`          |
| Functions       | camelCase            | camelCase            | `getUserProfile()`       |
| Variables       | camelCase            | snake_case           | `userName` / `user_name` |
| Constants       | SCREAMING_SNAKE_CASE | SCREAMING_SNAKE_CASE | `API_BASE_URL`           |
| Interfaces      | PascalCase           | PascalCase           | `UserProfile`            |
| Types           | PascalCase           | PascalCase           | `WorkRecord`             |
