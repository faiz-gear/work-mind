import { NextRequest } from 'next/server'
import { TaskService } from '@/lib/services/task.service'
import { generateTaskSummary } from '@/lib/ai/openai'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'

const taskService = new TaskService()

// POST /api/ai/summary - 生成任务总结
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  const { userId, period, startDate, endDate } = body

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  if (!period || !['daily', 'weekly', 'monthly'].includes(period)) {
    return ApiResponseHelper.badRequest('Valid period is required (daily, weekly, monthly)')
  }

  // 获取指定时间段的任务
  const filters = {
    userId,
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) }),
  }

  const tasksResult = await taskService.getTasksByFilters(filters)
  
  if (tasksResult.data.length === 0) {
    return ApiResponseHelper.success({
      summary: 'No tasks found for the specified period. Consider creating some tasks to track your productivity!',
      period,
      taskCount: 0,
    })
  }

  // 生成AI总结
  const summary = await generateTaskSummary(tasksResult.data, period)

  return ApiResponseHelper.success({
    summary,
    period,
    taskCount: tasksResult.data.length,
    generatedAt: new Date().toISOString(),
  })
})
