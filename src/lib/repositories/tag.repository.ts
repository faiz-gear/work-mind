import { Tag, Prisma } from '@prisma/client'
import { BaseRepository } from './base.repository'

export type TagWithStats = Tag & {
  _count: {
    tasks: number
  }
}

export type CreateTagInput = {
  name: string
  color?: string
  userId: string
}

export type UpdateTagInput = {
  name?: string
  color?: string
}

export class TagRepository extends BaseRepository<TagWithStats, CreateTagInput, UpdateTagInput> {
  constructor() {
    super('tag')
  }

  async create(data: CreateTagInput): Promise<TagWithStats> {
    const tag = await this.prisma.tag.create({
      data,
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return tag
  }

  async findById(id: string): Promise<TagWithStats | null> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return tag
  }

  async findMany(options: {
    where?: any
    orderBy?: any
    skip?: number
    take?: number
  } = {}): Promise<TagWithStats[]> {
    const tags = await this.prisma.tag.findMany({
      ...options,
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return tags
  }

  async update(id: string, data: UpdateTagInput): Promise<TagWithStats> {
    const tag = await this.prisma.tag.update({
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

    return tag
  }

  async delete(id: string): Promise<TagWithStats> {
    const tag = await this.prisma.tag.delete({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return tag
  }

  async count(where?: any): Promise<number> {
    return this.prisma.tag.count({ where })
  }

  async findByUserId(userId: string): Promise<TagWithStats[]> {
    return this.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    })
  }

  async findByName(userId: string, name: string): Promise<TagWithStats | null> {
    const tag = await this.prisma.tag.findUnique({
      where: {
        userId_name: {
          userId,
          name
        }
      },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return tag
  }

  async findOrCreate(userId: string, name: string, color?: string): Promise<TagWithStats> {
    const existingTag = await this.findByName(userId, name)
    
    if (existingTag) {
      return existingTag
    }

    return this.create({
      name,
      color,
      userId
    })
  }

  async findPopularTags(userId: string, limit: number = 10): Promise<TagWithStats[]> {
    return this.findMany({
      where: { userId },
      orderBy: {
        tasks: {
          _count: 'desc'
        }
      },
      take: limit
    })
  }
}
