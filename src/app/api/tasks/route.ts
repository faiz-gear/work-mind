import { NextRequest } from 'next/server'
import { TaskService } from '@/lib/services/task.service'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'
import { TaskStatus, Priority } from '@prisma/client'

const taskService = new TaskService()

// GET /api/tasks - 获取任务列表
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  
  // 从查询参数获取过滤条件
  const userId = searchParams.get('userId')
  const status = searchParams.get('status') as TaskStatus | null
  const priority = searchParams.get('priority') as Priority | null
  const projectId = searchParams.get('projectId')
  const tagIds = searchParams.get('tagIds')?.split(',').filter(Boolean)
  const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
  const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const filters = {
    userId,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(projectId && { projectId }),
    ...(tagIds && { tagIds }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(search && { search })
  }

  const result = await taskService.getTasksByFilters(filters, page, limit)
  
  return ApiResponseHelper.successWithPagination(
    result.data,
    {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  )
})

// POST /api/tasks - 创建新任务
export const POST = withErrorHandling(async (request: NextRequest) => {
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

  const taskData = {
    title,
    description,
    status: status || TaskStatus.PENDING,
    priority: priority || Priority.MEDIUM,
    startTime: startTime ? new Date(startTime) : undefined,
    endTime: endTime ? new Date(endTime) : undefined,
    duration,
    userId,
    projectId,
    tagIds
  }

  const task = await taskService.createTask(taskData)
  
  return ApiResponseHelper.success(task, 'Task created successfully')
})
