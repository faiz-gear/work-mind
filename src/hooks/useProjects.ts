'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'

// 类型定义
export interface Project {
  id: string
  name: string
  description?: string
  color?: string
  isActive: boolean
  _count: {
    tasks: number
  }
  taskStats?: {
    total: number
    completed: number
    inProgress: number
    pending: number
  }
}

export interface CreateProjectData {
  name: string
  description?: string
  color?: string
  userId: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  color?: string
  isActive?: boolean
}

// API 函数
const fetchProjects = async (userId: string, includeInactive = false) => {
  const params = new URLSearchParams({
    userId,
    includeInactive: includeInactive.toString(),
  })

  const response = await fetch(`/api/projects?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }
  return response.json()
}

const fetchProject = async (id: string, userId: string) => {
  const response = await fetch(`/api/projects/${id}?userId=${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch project')
  }
  return response.json()
}

const createProject = async (data: CreateProjectData) => {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create project')
  }
  return response.json()
}

const updateProject = async ({ id, data, userId }: { id: string; data: UpdateProjectData; userId: string }) => {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, userId }),
  })
  if (!response.ok) {
    throw new Error('Failed to update project')
  }
  return response.json()
}

const deleteProject = async ({ id, userId }: { id: string; userId: string }) => {
  const response = await fetch(`/api/projects/${id}?userId=${userId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete project')
  }
  return response.json()
}

// React Query Hooks
export const useProjects = (userId: string, includeInactive = false) => {
  return useQuery({
    queryKey: queryKeys.projects.list({ userId, includeInactive }),
    queryFn: () => fetchProjects(userId, includeInactive),
    enabled: !!userId,
  })
}

export const useProject = (id: string, userId: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => fetchProject(id, userId),
    enabled: !!id && !!userId,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProject,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(variables.id) })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}
