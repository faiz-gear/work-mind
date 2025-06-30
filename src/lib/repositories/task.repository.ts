import { Task, TaskStatus, Priority, Prisma } from '@prisma/client'
import { BaseRepository } from './base.repository'

export type TaskWithRelations = Task & {
  project?: {
    id: string
    name: string
    color?: string
  } | null
  tags: {
    id: string
    name: string
    color?: string
  }[]
}

export type CreateTaskInput = {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  startTime?: Date
  endTime?: Date
  duration?: number
  userId: string
  projectId?: string
  tagIds?: string[]
}

export type UpdateTaskInput = {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  startTime?: Date
  endTime?: Date
  duration?: number
  projectId?: string
  tagIds?: string[]
}

export type TaskFilters = {
  userId: string
  status?: TaskStatus
  priority?: Priority
  projectId?: string
  tagIds?: string[]
  startDate?: Date
  endDate?: Date
  search?: string
}

export class TaskRepository extends BaseRepository<TaskWithRelations, CreateTaskInput, UpdateTaskInput> {
  constructor() {
    super('task')
  }

  async create(data: CreateTaskInput): Promise<TaskWithRelations> {
    const { tagIds, ...taskData } = data
    
    const task = await this.prisma.task.create({
      data: {
        ...taskData,
        tags: tagIds ? {
          create: tagIds.map(tagId => ({
            tagId
          }))
        } : undefined
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      }
    })

    return this.transformTask(task)
  }

  async findById(id: string): Promise<TaskWithRelations | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      }
    })

    return task ? this.transformTask(task) : null
  }

  async findMany(options: {
    where?: any
    orderBy?: any
    skip?: number
    take?: number
  } = {}): Promise<TaskWithRelations[]> {
    const tasks = await this.prisma.task.findMany({
      ...options,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      }
    })

    return tasks.map(task => this.transformTask(task))
  }

  async update(id: string, data: UpdateTaskInput): Promise<TaskWithRelations> {
    const { tagIds, ...taskData } = data
    
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        tags: tagIds ? {
          deleteMany: {},
          create: tagIds.map(tagId => ({
            tagId
          }))
        } : undefined
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      }
    })

    return this.transformTask(task)
  }

  async delete(id: string): Promise<TaskWithRelations> {
    const task = await this.prisma.task.delete({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true
              }
            }
          }
        }
      }
    })

    return this.transformTask(task)
  }

  async count(where?: any): Promise<number> {
    return this.prisma.task.count({ where })
  }

  async findByFilters(filters: TaskFilters): Promise<TaskWithRelations[]> {
    const { userId, status, priority, projectId, tagIds, startDate, endDate, search } = filters
    
    const where: Prisma.TaskWhereInput = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(projectId && { projectId }),
      ...(tagIds && tagIds.length > 0 && {
        tags: {
          some: {
            tagId: {
              in: tagIds
            }
          }
        }
      }),
      ...(startDate && endDate && {
        OR: [
          {
            startTime: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            endTime: {
              gte: startDate,
              lte: endDate
            }
          }
        ]
      }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      })
    }

    return this.findMany({ where, orderBy: { createdAt: 'desc' } })
  }

  private transformTask(task: any): TaskWithRelations {
    return {
      ...task,
      tags: task.tags.map((taskTag: any) => taskTag.tag)
    }
  }
}
