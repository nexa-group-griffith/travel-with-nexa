export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
  statusCode?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ErrorResponse {
  success: false
  message: string
  error?: string
  statusCode: number
}
