/**
 * 基础Service类
 * 提供通用的业务逻辑处理和错误处理
 */
export abstract class BaseService {
  /**
   * 处理服务错误
   */
  protected handleError(error: any, context: string): never {
    console.error(`[${context}] Service Error:`, error)
    
    if (error.code === 'P2002') {
      throw new Error('Record already exists')
    }
    
    if (error.code === 'P2025') {
      throw new Error('Record not found')
    }
    
    if (error.code === 'P2003') {
      throw new Error('Foreign key constraint failed')
    }
    
    throw new Error(error.message || 'An unexpected error occurred')
  }

  /**
   * 验证用户权限
   */
  protected validateUserAccess(resourceUserId: string, currentUserId: string): void {
    if (resourceUserId !== currentUserId) {
      throw new Error('Access denied: You do not have permission to access this resource')
    }
  }

  /**
   * 验证必需字段
   */
  protected validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
  }

  /**
   * 清理输入数据
   */
  protected sanitizeInput(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          sanitized[key] = value.trim()
        } else {
          sanitized[key] = value
        }
      }
    }
    
    return sanitized
  }

  /**
   * 分页参数验证
   */
  protected validatePaginationParams(page?: number, limit?: number): { page: number; limit: number } {
    const validatedPage = Math.max(1, page || 1)
    const validatedLimit = Math.min(100, Math.max(1, limit || 10))
    
    return {
      page: validatedPage,
      limit: validatedLimit
    }
  }
}
