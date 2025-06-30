import { NextRequest } from 'next/server'
import { TaskService } from '@/lib/services/task.service'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'

const taskService = new TaskService()

// GET /api/tasks/stats - 获取任务统计
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  
  const userId = searchParams.get('userId')
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const stats = await taskService.getTaskStats(userId, startDate, endDate)
  
  return ApiResponseHelper.success(stats)
})
