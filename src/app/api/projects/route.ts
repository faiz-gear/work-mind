import { NextRequest } from 'next/server'
import { ProjectService } from '@/lib/services/project.service'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'

const projectService = new ProjectService()

// GET /api/projects - 获取项目列表
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  
  const userId = searchParams.get('userId')
  const includeInactive = searchParams.get('includeInactive') === 'true'

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  const projects = await projectService.getUserProjects(userId, includeInactive)
  
  return ApiResponseHelper.success(projects)
})

// POST /api/projects - 创建新项目
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  
  const {
    name,
    description,
    color,
    userId
  } = body

  const projectData = {
    name,
    description,
    color,
    userId
  }

  const project = await projectService.createProject(projectData)
  
  return ApiResponseHelper.success(project, 'Project created successfully')
})
