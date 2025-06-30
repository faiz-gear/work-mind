import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据被认为是新鲜的时间（5分钟）
      staleTime: 1000 * 60 * 5,
      // 缓存时间（30分钟）
      gcTime: 1000 * 60 * 30,
      // 失败重试次数
      retry: 3,
      // 重试延迟
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 窗口重新获得焦点时重新获取数据
      refetchOnWindowFocus: false,
      // 网络重连时重新获取数据
      refetchOnReconnect: true,
    },
    mutations: {
      // 失败重试次数
      retry: 1,
      // 重试延迟
      retryDelay: 1000,
    },
  },
})
