import { Project, Prisma } from '@prisma/client'
import { BaseRepository } from './base.repository'

export type ProjectWithStats = Project & {
  _count: {
    tasks: number
  }
  taskStats?: {
    total: number
    completed: number
    inProgress: number
    pending: number
  }
}

export type CreateProjectInput = {
  name: string
  description?: string
  color?: string
  userId: string
}

export type UpdateProjectInput = {
  name?: string
  description?: string
  color?: string
  isActive?: boolean
}

export class ProjectRepository extends BaseRepository<ProjectWithStats, CreateProjectInput, UpdateProjectInput> {
  constructor() {
    super('project')
  }

  async create(data: CreateProjectInput): Promise<ProjectWithStats> {
    const project = await this.prisma.project.create({
      data,
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return project
  }

  async findById(id: string): Promise<ProjectWithStats | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    if (!project) return null

    const taskStats = await this.getTaskStats(id)
    return {
      ...project,
      taskStats
    }
  }

  async findMany(options: {
    where?: any
    orderBy?: any
    skip?: number
    take?: number
  } = {}): Promise<ProjectWithStats[]> {
    const projects = await this.prisma.project.findMany({
      ...options,
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return projects
  }

  async update(id: string, data: UpdateProjectInput): Promise<ProjectWithStats> {
    const project = await this.prisma.project.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return project
  }

  async delete(id: string): Promise<ProjectWithStats> {
    const project = await this.prisma.project.delete({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return project
  }

  async count(where?: any): Promise<number> {
    return this.prisma.project.count({ where })
  }

  async findByUserId(userId: string, includeInactive: boolean = false): Promise<ProjectWithStats[]> {
    const where: Prisma.ProjectWhereInput = {
      userId,
      ...(includeInactive ? {} : { isActive: true })
    }

    return this.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    })
  }

  async findActiveByUserId(userId: string): Promise<ProjectWithStats[]> {
    return this.findByUserId(userId, false)
  }

  private async getTaskStats(projectId: string) {
    const [total, completed, inProgress, pending] = await Promise.all([
      this.prisma.task.count({
        where: { projectId }
      }),
      this.prisma.task.count({
        where: { projectId, status: 'COMPLETED' }
      }),
      this.prisma.task.count({
        where: { projectId, status: 'IN_PROGRESS' }
      }),
      this.prisma.task.count({
        where: { projectId, status: 'PENDING' }
      })
    ])

    return {
      total,
      completed,
      inProgress,
      pending
    }
  }
}
