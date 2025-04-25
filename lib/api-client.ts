import type { ApiResponse, ErrorResponse } from '@/types/api';
import { getUserDataFromLocalStorage } from './localstorage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const userData = await getUserDataFromLocalStorage();
  const {
    method = 'GET',
    headers = {
      Authorization: `Bearer ${userData?.uid || ''}`,
    },
    body,
    cache,
    next,
  } = options;

  try {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth-token') || '';
    }

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
      Authorization: `Bearer ${userData?.uid || ''}`,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
      next,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, requestOptions);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return { success: true } as ApiResponse<T>;
    }

    const data = await response.json();

    if (!response.ok) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: data.message || 'An error occurred',
        error: data.error,
        statusCode: response.status,
      };
      throw errorResponse;
    }

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    if ((error as ErrorResponse).statusCode) {
      throw error;
    }

    return {
      success: false,
      message: (error as Error).message || 'An unexpected error occurred',
      error: (error as Error).toString(),
    };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(
    endpoint: string,
    body: any,
    options?: Omit<FetchOptions, 'method'>
  ) => fetchApi<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(
    endpoint: string,
    body: any,
    options?: Omit<FetchOptions, 'method'>
  ) => fetchApi<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(
    endpoint: string,
    body: any,
    options?: Omit<FetchOptions, 'method'>
  ) => fetchApi<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
