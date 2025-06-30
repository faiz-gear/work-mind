'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskStatus, Priority } from '@prisma/client'
import { queryKeys } from '@/lib/query/keys'

// 类型定义
export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  startTime?: Date
  endTime?: Date
  duration?: number
  project?: {
    id: string
    name: string
    color?: string
  }
  tags: {
    id: string
    name: string
    color?: string
  }[]
}

export interface TaskFilters {
  userId: string
  status?: TaskStatus
  priority?: Priority
  projectId?: string
  tagIds?: string[]
  startDate?: Date
  endDate?: Date
  search?: string
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  startTime?: Date
  endTime?: Date
  duration?: number
  userId: string
  projectId?: string
  tagIds?: string[]
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  startTime?: Date
  endTime?: Date
  duration?: number
  projectId?: string
  tagIds?: string[]
}

// API 函数
const fetchTasks = async (filters: TaskFilters, page = 1, limit = 10) => {
  const params = new URLSearchParams({
    userId: filters.userId,
    page: page.toString(),
    limit: limit.toString(),
    ...(filters.status && { status: filters.status }),
    ...(filters.priority && { priority: filters.priority }),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.tagIds && { tagIds: filters.tagIds.join(',') }),
    ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
    ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
    ...(filters.search && { search: filters.search }),
  })

  const response = await fetch(`/api/tasks?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }
  return response.json()
}

const fetchTask = async (id: string, userId: string) => {
  const response = await fetch(`/api/tasks/${id}?userId=${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch task')
  }
  return response.json()
}

const createTask = async (data: CreateTaskData) => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create task')
  }
  return response.json()
}

const updateTask = async ({ id, data, userId }: { id: string; data: UpdateTaskData; userId: string }) => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, userId }),
  })
  if (!response.ok) {
    throw new Error('Failed to update task')
  }
  return response.json()
}

const deleteTask = async ({ id, userId }: { id: string; userId: string }) => {
  const response = await fetch(`/api/tasks/${id}?userId=${userId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete task')
  }
  return response.json()
}

const updateTaskStatus = async ({ id, status, userId }: { id: string; status: TaskStatus; userId: string }) => {
  const response = await fetch(`/api/tasks/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, userId }),
  })
  if (!response.ok) {
    throw new Error('Failed to update task status')
  }
  return response.json()
}

const fetchTaskStats = async (userId: string, startDate?: Date, endDate?: Date) => {
  const params = new URLSearchParams({
    userId,
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() }),
  })

  const response = await fetch(`/api/tasks/stats?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch task stats')
  }
  return response.json()
}

// React Query Hooks
export const useTasks = (filters: TaskFilters, page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.tasks.list({ ...filters, page, limit }),
    queryFn: () => fetchTasks(filters, page, limit),
    enabled: !!filters.userId,
  })
}

export const useTask = (id: string, userId: string) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => fetchTask(id, userId),
    enabled: !!id && !!userId,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
  })
}

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
    },
  })
}

export const useTaskStats = (userId: string, startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: queryKeys.summaries.daily(startDate?.toISOString() || 'all'),
    queryFn: () => fetchTaskStats(userId, startDate, endDate),
    enabled: !!userId,
  })
}
