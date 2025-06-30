import { NextRequest } from 'next/server'
import { createChatCompletion } from '@/lib/ai/openai'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'

// POST /api/ai/chat - AI聊天
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  const { messages, userId } = body

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return ApiResponseHelper.badRequest('Messages array is required')
  }

  // 验证消息格式
  const validMessages = messages.every(msg => 
    msg.role && msg.content && 
    ['user', 'assistant', 'system'].includes(msg.role)
  )

  if (!validMessages) {
    return ApiResponseHelper.badRequest('Invalid message format')
  }

  // 创建聊天完成
  const response = await createChatCompletion(messages)
  
  return response
})
