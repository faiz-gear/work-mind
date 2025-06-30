import { NextRequest } from 'next/server'
import { ProjectService } from '@/lib/services/project.service'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'

const projectService = new ProjectService()

// GET /api/projects/[id] - 获取单个项目
export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const project = await projectService.getProjectById(params.id, userId)
  
  return ApiResponseHelper.success(project)
})

// PUT /api/projects/[id] - 更新项目
export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const body = await request.json()
  
  const {
    name,
    description,
    color,
    isActive,
    userId
  } = body

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const updateData = {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(color !== undefined && { color }),
    ...(isActive !== undefined && { isActive })
  }

  const project = await projectService.updateProject(params.id, updateData, userId)
  
  return ApiResponseHelper.success(project, 'Project updated successfully')
})

// DELETE /api/projects/[id] - 删除项目
export const DELETE = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const project = await projectService.deleteProject(params.id, userId)
  
  return ApiResponseHelper.success(project, 'Project deleted successfully')
})
