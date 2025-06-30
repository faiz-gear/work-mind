import { NextRequest } from 'next/server'
import { TaskService } from '@/lib/services/task.service'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'
import { TaskStatus, Priority } from '@prisma/client'

const taskService = new TaskService()

// GET /api/tasks/[id] - 获取单个任务
export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const task = await taskService.getTaskById(params.id, userId)
  
  return ApiResponseHelper.success(task)
})

// PUT /api/tasks/[id] - 更新任务
export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await request.json()
  
  const {
    title,
    description,
    status,
    priority,
    startTime,
    endTime,
    duration,
    userId,
    projectId,
    tagIds
  } = body

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const updateData = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
    ...(priority !== undefined && { priority }),
    ...(startTime !== undefined && { startTime: startTime ? new Date(startTime) : null }),
    ...(endTime !== undefined && { endTime: endTime ? new Date(endTime) : null }),
    ...(duration !== undefined && { duration }),
    ...(projectId !== undefined && { projectId }),
    ...(tagIds !== undefined && { tagIds })
  }

  const task = await taskService.updateTask(params.id, updateData, userId)
  
  return ApiResponseHelper.success(task, 'Task updated successfully')
})

// DELETE /api/tasks/[id] - 删除任务
export const DELETE = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const task = await taskService.deleteTask(params.id, userId)
  
  return ApiResponseHelper.success(task, 'Task deleted successfully')
})
