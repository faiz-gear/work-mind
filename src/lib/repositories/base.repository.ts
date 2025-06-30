import { PrismaClient } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * 基础Repository类
 * 提供通用的CRUD操作和查询方法
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient
  protected modelName: string

  constructor(modelName: string) {
    this.prisma = prisma
    this.modelName = modelName
  }

  /**
   * 创建记录
   */
  abstract create(data: CreateInput): Promise<T>

  /**
   * 根据ID查找记录
   */
  abstract findById(id: string): Promise<T | null>

  /**
   * 查找所有记录
   */
  abstract findMany(options?: any): Promise<T[]>

  /**
   * 更新记录
   */
  abstract update(id: string, data: UpdateInput): Promise<T>

  /**
   * 删除记录
   */
  abstract delete(id: string): Promise<T>

  /**
   * 计算记录数量
   */
  abstract count(where?: any): Promise<number>

  /**
   * 检查记录是否存在
   */
  async exists(id: string): Promise<boolean> {
    const record = await this.findById(id)
    return record !== null
  }

  /**
   * 分页查询
   */
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    where?: any,
    orderBy?: any
  ): Promise<{
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      this.count(where)
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}
