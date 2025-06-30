'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'

// 类型定义
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

export interface SummaryRequest {
  userId: string
  period: 'daily' | 'weekly' | 'monthly'
  startDate?: Date
  endDate?: Date
}

// API 函数
const generateSummary = async (data: SummaryRequest) => {
  const response = await fetch('/api/ai/summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to generate summary')
  }
  return response.json()
}

const generateSuggestions = async (userId: string) => {
  const response = await fetch('/api/ai/suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  })
  if (!response.ok) {
    throw new Error('Failed to generate suggestions')
  }
  return response.json()
}

const sendChatMessage = async ({ messages, userId }: { messages: ChatMessage[]; userId: string }) => {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, userId }),
  })
  if (!response.ok) {
    throw new Error('Failed to send chat message')
  }
  return response
}

// React Query Hooks
export const useGenerateSummary = () => {
  return useMutation({
    mutationFn: generateSummary,
  })
}

export const useGenerateSuggestions = () => {
  return useMutation({
    mutationFn: generateSuggestions,
  })
}

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: sendChatMessage,
  })
}

// 获取缓存的建议
export const useCachedSuggestions = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.agent.suggestions({ userId }),
    queryFn: () => generateSuggestions(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 30, // 30分钟内不重新获取
    gcTime: 1000 * 60 * 60, // 1小时后清除缓存
  })
}
