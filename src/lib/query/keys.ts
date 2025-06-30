/**
 * 查询键管理
 * 统一管理所有查询的键，确保类型安全和一致性
 */

export const queryKeys = {
  // 任务相关查询
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },

  // 项目相关查询
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },

  // 标签相关查询
  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.tags.lists(), filters] as const,
  },

  // 用户相关查询
  users: {
    all: ['users'] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
  },

  // 总结相关查询
  summaries: {
    all: ['summaries'] as const,
    daily: (date: string) => [...queryKeys.summaries.all, 'daily', date] as const,
    weekly: (date: string) => [...queryKeys.summaries.all, 'weekly', date] as const,
    monthly: (date: string) => [...queryKeys.summaries.all, 'monthly', date] as const,
  },

  // AI助手相关查询
  agent: {
    all: ['agent'] as const,
    suggestions: (context?: Record<string, any>) => [...queryKeys.agent.all, 'suggestions', context] as const,
    chat: (sessionId: string) => [...queryKeys.agent.all, 'chat', sessionId] as const,
  },
} as const

// 类型辅助函数
export type QueryKey = typeof queryKeys[keyof typeof queryKeys]
