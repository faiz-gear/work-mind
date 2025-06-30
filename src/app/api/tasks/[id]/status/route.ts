import { NextRequest } from 'next/server'
import { TaskService } from '@/lib/services/task.service'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'
import { TaskStatus } from '@prisma/client'

const taskService = new TaskService()

// PATCH /api/tasks/[id]/status - 更新任务状态
export const PATCH = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await request.json()
  const { status, userId } = body

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  if (!status || !Object.values(TaskStatus).includes(status)) {
    return ApiResponseHelper.badRequest('Valid status is required')
  }

  const task = await taskService.updateTaskStatus(params.id, status, userId)
  
  return ApiResponseHelper.success(task, 'Task status updated successfully')
})
