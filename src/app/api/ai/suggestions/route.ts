import { NextRequest } from 'next/server'
import { TaskService } from '@/lib/services/task.service'
import { ProjectService } from '@/lib/services/project.service'
import { generateTaskSuggestions } from '@/lib/ai/openai'
import { ApiResponseHelper, withErrorHandling } from '@/lib/api/response'

const taskService = new TaskService()
const projectService = new ProjectService()

// POST /api/ai/suggestions - 生成任务建议
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json()
  const { userId } = body

  if (!userId) {
    return ApiResponseHelper.badRequest('userId is required')
  }

  // 获取最近的任务
  const recentTasksResult = await taskService.getTasksByFilters(
    { userId },
    1,
    20
  )

  // 获取活跃项目
  const projects = await projectService.getActiveUserProjects(userId)

  // 生成建议
  const suggestions = await generateTaskSuggestions({
    recentTasks: recentTasksResult.data,
    projects,
  })

  return ApiResponseHelper.success({
    suggestions,
    generatedAt: new Date().toISOString(),
    context: {
      recentTaskCount: recentTasksResult.data.length,
      activeProjectCount: projects.length,
    },
  })
})
