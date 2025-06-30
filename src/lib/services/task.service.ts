import { TaskStatus, Priority } from '@prisma/client'
import { BaseService } from './base.service'
import { 
  TaskRepository, 
  TaskWithRelations, 
  CreateTaskInput, 
  UpdateTaskInput, 
  TaskFilters 
} from '../repositories/task.repository'
import { ProjectRepository } from '../repositories/project.repository'
import { TagRepository } from '../repositories/tag.repository'

export class TaskService extends BaseService {
  private taskRepository: TaskRepository
  private projectRepository: ProjectRepository
  private tagRepository: TagRepository

  constructor() {
    super()
    this.taskRepository = new TaskRepository()
    this.projectRepository = new ProjectRepository()
    this.tagRepository = new TagRepository()
  }

  async createTask(data: CreateTaskInput): Promise<TaskWithRelations> {
    try {
      this.validateRequiredFields(data, ['title', 'userId'])
      
      const sanitizedData = this.sanitizeInput(data) as CreateTaskInput

      // 验证项目是否存在且属于用户
      if (sanitizedData.projectId) {
        const project = await this.projectRepository.findById(sanitizedData.projectId)
        if (!project) {
          throw new Error('Project not found')
        }
        this.validateUserAccess(project.userId, sanitizedData.userId)
      }

      // 验证标签是否存在且属于用户
      if (sanitizedData.tagIds && sanitizedData.tagIds.length > 0) {
        for (const tagId of sanitizedData.tagIds) {
          const tag = await this.tagRepository.findById(tagId)
          if (!tag) {
            throw new Error(`Tag with id ${tagId} not found`)
          }
          this.validateUserAccess(tag.userId, sanitizedData.userId)
        }
      }

      // 如果设置了开始和结束时间，计算持续时间
      if (sanitizedData.startTime && sanitizedData.endTime) {
        const duration = Math.round(
          (sanitizedData.endTime.getTime() - sanitizedData.startTime.getTime()) / (1000 * 60)
        )
        sanitizedData.duration = duration
      }

      return await this.taskRepository.create(sanitizedData)
    } catch (error) {
      this.handleError(error, 'TaskService.createTask')
    }
  }

  async getTaskById(id: string, userId: string): Promise<TaskWithRelations> {
    try {
      const task = await this.taskRepository.findById(id)
      if (!task) {
        throw new Error('Task not found')
      }
      
      this.validateUserAccess(task.userId, userId)
      return task
    } catch (error) {
      this.handleError(error, 'TaskService.getTaskById')
    }
  }

  async updateTask(id: string, data: UpdateTaskInput, userId: string): Promise<TaskWithRelations> {
    try {
      const existingTask = await this.taskRepository.findById(id)
      if (!existingTask) {
        throw new Error('Task not found')
      }
      
      this.validateUserAccess(existingTask.userId, userId)
      
      const sanitizedData = this.sanitizeInput(data) as UpdateTaskInput

      // 验证项目是否存在且属于用户
      if (sanitizedData.projectId) {
        const project = await this.projectRepository.findById(sanitizedData.projectId)
        if (!project) {
          throw new Error('Project not found')
        }
        this.validateUserAccess(project.userId, userId)
      }

      // 验证标签是否存在且属于用户
      if (sanitizedData.tagIds && sanitizedData.tagIds.length > 0) {
        for (const tagId of sanitizedData.tagIds) {
          const tag = await this.tagRepository.findById(tagId)
          if (!tag) {
            throw new Error(`Tag with id ${tagId} not found`)
          }
          this.validateUserAccess(tag.userId, userId)
        }
      }

      // 如果设置了开始和结束时间，计算持续时间
      if (sanitizedData.startTime && sanitizedData.endTime) {
        const duration = Math.round(
          (sanitizedData.endTime.getTime() - sanitizedData.startTime.getTime()) / (1000 * 60)
        )
        sanitizedData.duration = duration
      }

      return await this.taskRepository.update(id, sanitizedData)
    } catch (error) {
      this.handleError(error, 'TaskService.updateTask')
    }
  }

  async deleteTask(id: string, userId: string): Promise<TaskWithRelations> {
    try {
      const existingTask = await this.taskRepository.findById(id)
      if (!existingTask) {
        throw new Error('Task not found')
      }
      
      this.validateUserAccess(existingTask.userId, userId)
      
      return await this.taskRepository.delete(id)
    } catch (error) {
      this.handleError(error, 'TaskService.deleteTask')
    }
  }

  async getTasksByFilters(filters: TaskFilters, page?: number, limit?: number) {
    try {
      const { page: validatedPage, limit: validatedLimit } = this.validatePaginationParams(page, limit)
      
      const tasks = await this.taskRepository.findByFilters(filters)
      
      // 手动分页（因为过滤逻辑复杂）
      const startIndex = (validatedPage - 1) * validatedLimit
      const endIndex = startIndex + validatedLimit
      const paginatedTasks = tasks.slice(startIndex, endIndex)
      
      return {
        data: paginatedTasks,
        total: tasks.length,
        page: validatedPage,
        limit: validatedLimit,
        totalPages: Math.ceil(tasks.length / validatedLimit)
      }
    } catch (error) {
      this.handleError(error, 'TaskService.getTasksByFilters')
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, userId: string): Promise<TaskWithRelations> {
    try {
      const updateData: UpdateTaskInput = { status }
      
      // 如果状态变为进行中，设置开始时间
      if (status === TaskStatus.IN_PROGRESS) {
        updateData.startTime = new Date()
      }
      
      // 如果状态变为已完成，设置结束时间和计算持续时间
      if (status === TaskStatus.COMPLETED) {
        const existingTask = await this.taskRepository.findById(id)
        if (existingTask && existingTask.startTime) {
          updateData.endTime = new Date()
          updateData.duration = Math.round(
            (updateData.endTime.getTime() - existingTask.startTime.getTime()) / (1000 * 60)
          )
        }
      }
      
      return await this.updateTask(id, updateData, userId)
    } catch (error) {
      this.handleError(error, 'TaskService.updateTaskStatus')
    }
  }

  async getTaskStats(userId: string, startDate?: Date, endDate?: Date) {
    try {
      const filters: TaskFilters = { userId }
      if (startDate && endDate) {
        filters.startDate = startDate
        filters.endDate = endDate
      }
      
      const tasks = await this.taskRepository.findByFilters(filters)
      
      const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
        inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
        pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
        canceled: tasks.filter(t => t.status === TaskStatus.CANCELED).length,
        totalDuration: tasks.reduce((sum, task) => sum + (task.duration || 0), 0),
        averageDuration: 0
      }
      
      const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED && t.duration)
      if (completedTasks.length > 0) {
        stats.averageDuration = Math.round(
          completedTasks.reduce((sum, task) => sum + (task.duration || 0), 0) / completedTasks.length
        )
      }
      
      return stats
    } catch (error) {
      this.handleError(error, 'TaskService.getTaskStats')
    }
  }
}
