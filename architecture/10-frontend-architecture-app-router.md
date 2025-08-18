# 10. Frontend Architecture (App Router)

## Component Architecture

### Component Organization
```
src/
├── app/                    # Next.js App Router目录
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── (auth)/             # 认证路由组
│   │   ├── layout.tsx      # 认证布局
│   │   ├── login/
│   │   │   └── page.tsx    # 登录页面
│   │   └── register/
│   │       └── page.tsx    # 注册页面
│   ├── (dashboard)/        # 仪表板路由组
│   │   ├── layout.tsx      # 仪表板布局
│   │   ├── page.tsx        # 仪表板首页
│   │   ├── work-records/
│   │   │   ├── page.tsx    # 工作记录列表
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx # 工作记录详情
│   │   │   └── new/
│   │   │       └── page.tsx # 新建工作记录
│   │   ├── summaries/
│   │   │   ├── page.tsx    # 总结列表
│   │   │   └── [id]/
│   │   │       └── page.tsx # 总结详情
│   │   ├── analytics/
│   │   │   ├── page.tsx    # 分析仪表板
│   │   │   ├── trends/
│   │   │   │   └── page.tsx # 趋势分析
│   │   │   └── time-distribution/
│   │   │       └── page.tsx # 时间分布
│   │   └── settings/
│   │       ├── layout.tsx  # 设置布局
│   │       ├── page.tsx    # 设置首页
│   │       ├── profile/
│   │       │   └── page.tsx # 个人设置
│   │       ├── ai-services/
│   │       │   └── page.tsx # AI服务设置
│   │       └── appearance/
│   │           └── page.tsx # 外观设置
│   └── api/                # API路由
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts
│       │   ├── register/
│       │   │   └── route.ts
│       │   └── logout/
│       │       └── route.ts
│       ├── work-records/
│       │   ├── route.ts    # GET / POST
│       │   └── [id]/
│       │       ├── route.ts # GET / PUT / DELETE
│       │       └── summary/
│       │           └── route.ts # POST 生成总结
│       ├── summaries/
│       │   ├── route.ts    # GET
│       │   └── [id]/
│       │       └── route.ts # GET
│       ├── tags/
│       │   └── route.ts    # GET / POST
│       ├── analytics/
│       │   ├── trends/
│       │   │   └── route.ts # GET
│       │   └── time-distribution/
│       │       └── route.ts # GET
│       └── exports/
│           └── route.ts    # POST
├── components/             # 组件目录
│   ├── ui/                # 基础UI组件
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── modal.tsx
│   ├── layout/            # 布局组件
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   ├── forms/             # 表单组件
│   │   ├── work-record-form.tsx
│   │   ├── auth-form.tsx
│   │   └── settings-form.tsx
│   ├── features/          # 功能组件
│   │   ├── work-record/
│   │   │   ├── work-record-list.tsx
│   │   │   ├── work-record-item.tsx
│   │   │   ├── work-record-editor.tsx
│   │   │   └── quick-record-modal.tsx
│   │   ├── summary/
│   │   │   ├── summary-list.tsx
│   │   │   ├── summary-item.tsx
│   │   │   └── summary-generator.tsx
│   │   ├── analytics/
│   │   │   ├── dashboard.tsx
│   │   │   ├── charts/
│   │   │   │   ├── trends-chart.tsx
│   │   │   │   ├── time-distribution-chart.tsx
│   │   │   │   └── tag-cloud.tsx
│   │   │   └── analytics-filters.tsx
│   │   └── common/
│   │       ├── tag-selector.tsx
│   │       ├── search-input.tsx
│   │       └── date-range-picker.tsx
│   └── providers/         # React Providers
│       ├── auth-provider.tsx
│       ├── query-provider.tsx
│       ├── theme-provider.tsx
│       └── realtime-provider.tsx
├── lib/                   # 工具库
│   ├── auth.ts            # 认证工具
│   ├── db.ts              # 数据库连接
│   ├── utils.ts           # 通用工具
│   ├── validations.ts     # 数据验证
│   └── constants.ts       # 常量定义
├── hooks/                 # 自定义Hooks
│   ├── use-work-records.ts
│   ├── use-summaries.ts
│   ├── use-tags.ts
│   ├── use-auth.ts
│   └── use-debounce.ts
├── services/              # API服务
│   ├── auth.service.ts
│   ├── work-record.service.ts
│   ├── summary.service.ts
│   ├── tag.service.ts
│   └── analytics.service.ts
├── stores/                # 状态管理
│   ├── auth.store.ts
│   ├── ui.store.ts
│   ├── work-record.store.ts
│   └── analytics.store.ts
├── types/                 # TypeScript类型
│   ├── api.types.ts
│   ├── ui.types.ts
│   └── app.types.ts
└── styles/                # 样式文件
    └── theme.ts           # 主题配置
```

### Component Template
```typescript
// src/components/features/work-record/work-record-item.tsx
'use client';

import React from 'react';
import { Card, CardBody, HStack, VStack, Text, IconButton } from '@chakra-ui/react';
import { WorkRecord } from '@/types/api.types';
import { useWorkRecordStore } from '@/stores/work-record.store';
import { formatDistanceToNow } from '@/lib/utils';

interface WorkRecordItemProps {
  workRecord: WorkRecord;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const WorkRecordItem: React.FC<WorkRecordItemProps> = ({
  workRecord,
  onView,
  onEdit,
  onDelete
}) => {
  const { deleteWorkRecord } = useWorkRecordStore();

  const handleDelete = async () => {
    try {
      await deleteWorkRecord(workRecord.id);
      onDelete?.(workRecord.id);
    } catch (error) {
      console.error('Failed to delete work record:', error);
    }
  };

  return (
    <Card variant="outline" size="sm">
      <CardBody>
        <VStack align="start" spacing={2}>
          <HStack justify="space-between" w="full">
            <Text fontWeight="semibold" noOfLines={1}>
              {workRecord.title}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {formatDistanceToNow(new Date(workRecord.created_at))}
            </Text>
          </HStack>
          
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {workRecord.content}
          </Text>
          
          {workRecord.tags.length > 0 && (
            <HStack spacing={1} flexWrap="wrap">
              {workRecord.tags.map((tag, index) => (
                <Text
                  key={index}
                  fontSize="xs"
                  bg="gray.100"
                  px={2}
                  py={1}
                  rounded="full"
                >
                  {tag}
                </Text>
              ))}
            </HStack>
          )}
          
          <HStack spacing={2}>
            {onView && (
              <IconButton
                aria-label="View"
                icon={<ViewIcon />}
                size="sm"
                variant="ghost"
                onClick={() => onView(workRecord.id)}
              />
            )}
            {onEdit && (
              <IconButton
                aria-label="Edit"
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                onClick={() => onEdit(workRecord.id)}
              />
            )}
            {onDelete && (
              <IconButton
                aria-label="Delete"
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={handleDelete}
              />
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
```

## State Management Architecture

### State Structure
```typescript
// src/stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthSession } from '@/types/api.types';

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          set({
            user: response.user,
            session: response.session,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register({ email, password, name });
          set({
            user: response.user,
            session: response.session,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      refreshSession: async () => {
        try {
          const response = await authApi.refreshSession();
          set({
            user: response.user,
            session: response.session,
            isAuthenticated: true
          });
        } catch (error) {
          set({
            user: null,
            session: null,
            isAuthenticated: false
          });
        }
      },

      updateUser: async (userData: Partial<User>) => {
        try {
          const updatedUser = await authApi.updateUser(userData);
          set({ user: updatedUser });
        } catch (error) {
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

### State Management Patterns
- **Zustand for Client State:** 轻量级状态管理，支持持久化和中间件
- **React Query for Server State:** 处理API数据获取、缓存和同步
- **Local State for Component State:** 使用useState和useContext管理组件内部状态
- **Optimistic Updates:** 使用React Query的乐观更新提升用户体验
- **State Normalization:** 对列表数据使用规范化存储，避免重复

## Routing Architecture (App Router)

### Route Organization
```typescript
// src/app/layout.tsx (根布局)
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '智能工作记录与总结小工具',
  description: '高效记录工作，AI智能总结，提升工作效率'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// src/app/(auth)/layout.tsx (认证布局)
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {children}
      </div>
    </div>
  );
}

// src/app/(dashboard)/layout.tsx (仪表板布局)
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

// src/app/(dashboard)/settings/layout.tsx (设置布局)
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1">
      <div className="max-w-4xl mx-auto py-6">
        {children}
      </div>
    </div>
  );
}
```

### Protected Route Pattern (App Router)
```typescript
// src/components/auth/protected-route.tsx
'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = <div>Loading...</div>
}) => {
  const { isAuthenticated, user, isLoading, refreshSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && !isLoading) {
        await refreshSession();
      }
    };
    
    checkAuth();
  }, [isAuthenticated, isLoading, refreshSession]);

  if (isLoading) {
    return fallback;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <div>Access denied</div>;
  }

  return <>{children}</>;
};

// 使用示例
// src/app/(dashboard)/page.tsx
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardHome } from '@/components/features/dashboard/dashboard-home';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardHome />
    </ProtectedRoute>
  );
}
```

## Frontend Services Layer

### API Client Setup
```typescript
// src/services/api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = useAuthStore.getState().session?.access_token;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await useAuthStore.getState().refreshSession();
            const newToken = useAuthStore.getState().session?.access_token;
            
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            useAuthStore.getState().logout();
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config).then(response => response.data);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config).then(response => response.data);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config).then(response => response.data);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config).then(response => response.data);
  }
}

export const apiClient = new ApiClient();
```

### Service Example
```typescript
// src/services/work-record.service.ts
import { apiClient } from './api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkRecord, CreateWorkRecord, UpdateWorkRecord } from '@/types/api.types';

export const workRecordKeys = {
  all: ['work-records'] as const,
  lists: () => [...workRecordKeys.all, 'list'] as const,
  list: (filters: any) => [...workRecordKeys.lists(), { filters }] as const,
  details: () => [...workRecordKeys.all, 'detail'] as const,
  detail: (id: string) => [...workRecordKeys.details(), id] as const,
};

export const workRecordApi = {
  getWorkRecords: (params?: {
    page?: number;
    limit?: number;
    tags?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }) => apiClient.get<WorkRecord[]>('/work-records', { params }),
  
  getWorkRecord: (id: string) => apiClient.get<WorkRecord>(`/work-records/${id}`),
  
  createWorkRecord: (data: CreateWorkRecord) => apiClient.post<WorkRecord>('/work-records', data),
  
  updateWorkRecord: (id: string, data: UpdateWorkRecord) => apiClient.put<WorkRecord>(`/work-records/${id}`, data),
  
  deleteWorkRecord: (id: string) => apiClient.delete(`/work-records/${id}`),
};

export const useWorkRecords = (params?: any) => {
  return useQuery({
    queryKey: workRecordKeys.list(params),
    queryFn: () => workRecordApi.getWorkRecords(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkRecord = (id: string) => {
  return useQuery({
    queryKey: workRecordKeys.detail(id),
    queryFn: () => workRecordApi.getWorkRecord(id),
    enabled: !!id,
  });
};

export const useCreateWorkRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workRecordApi.createWorkRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workRecordKeys.lists() });
      queryClient.setQueryData(workRecordKeys.detail(data.id), data);
    },
  });
};

export const useUpdateWorkRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkRecord }) => 
      workRecordApi.updateWorkRecord(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workRecordKeys.lists() });
      queryClient.setQueryData(workRecordKeys.detail(data.id), data);
    },
  });
};

export const useDeleteWorkRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workRecordApi.deleteWorkRecord,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: workRecordKeys.lists() });
      queryClient.removeQueries({ queryKey: workRecordKeys.detail(id) });
    },
  });
};
```

## Providers Setup (App Router)
```typescript
// src/components/providers/index.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';
import { RealtimeProvider } from './realtime-provider';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <RealtimeProvider>
              {children}
              <Toaster />
            </RealtimeProvider>
          </ThemeProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
```
