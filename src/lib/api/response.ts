import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ApiResponseHelper {
  static success<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
      success: true,
      data,
      message
    })
  }

  static successWithPagination<T>(
    data: T[], 
    pagination: { page: number; limit: number; total: number; totalPages: number },
    message?: string
  ): NextResponse<ApiResponse<T[]>> {
    return NextResponse.json({
      success: true,
      data,
      pagination,
      message
    })
  }

  static error(error: string, status: number = 400): NextResponse<ApiResponse> {
    return NextResponse.json({
      success: false,
      error
    }, { status })
  }

  static notFound(message: string = 'Resource not found'): NextResponse<ApiResponse> {
    return this.error(message, 404)
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
    return this.error(message, 401)
  }

  static forbidden(message: string = 'Forbidden'): NextResponse<ApiResponse> {
    return this.error(message, 403)
  }

  static badRequest(message: string = 'Bad request'): NextResponse<ApiResponse> {
    return this.error(message, 400)
  }

  static internalError(message: string = 'Internal server error'): NextResponse<ApiResponse> {
    return this.error(message, 500)
  }
}

export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse<ApiResponse>> => {
    try {
      return await handler(...args)
    } catch (error: any) {
      console.error('API Error:', error)
      
      if (error.message.includes('not found')) {
        return ApiResponseHelper.notFound(error.message)
      }
      
      if (error.message.includes('Access denied')) {
        return ApiResponseHelper.forbidden(error.message)
      }
      
      if (error.message.includes('Missing required fields')) {
        return ApiResponseHelper.badRequest(error.message)
      }
      
      return ApiResponseHelper.internalError(error.message)
    }
  }
}
