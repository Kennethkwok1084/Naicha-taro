import Taro from '@tarojs/taro'
import { getBaseUrl, getEnvName } from '../config/env'

export const TOKEN_STORAGE_KEY = 'NAICHA_TOKEN'
const DEFAULT_TIMEOUT = 10_000
const MUTATING_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH'])

export class ApiError<T = unknown> extends Error {
  status: number
  payload?: T

  constructor(message: string, status: number, payload?: T) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

type RequestMethod = Taro.request.Option['method']

interface RequestOptions<TData = unknown>
  extends Omit<Taro.request.Option<TData>, 'url' | 'method' | 'success' | 'fail' | 'complete'> {
  url: string
  method?: RequestMethod
  showErrorToast?: boolean
  skipAuth?: boolean
  raw?: boolean
}

type Envelope<T> = {
  code?: number
  message?: string
  data?: T
  result?: T
  payload?: T
}

const buildUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  return `${getBaseUrl()}${url}`
}

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return template.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const shouldAttachIdempotency = (method?: RequestMethod) =>
  method ? MUTATING_METHODS.has(method.toUpperCase()) : false

const normalizeEnvelope = <T>(data: T | Envelope<T>): T => {
  if (data && typeof data === 'object' && ('code' in data || 'data' in data)) {
    const envelope = data as Envelope<T>
    const code = envelope.code ?? 0
    if (code === 0 || code === 200) {
      return (envelope.data ?? envelope.result ?? envelope.payload) as T
    }
    throw new ApiError(envelope.message || '请求失败', code, data)
  }
  return data as T
}

const toastError = (msg: string) => {
  Taro.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}

const handleUnauthorized = () => {
  Taro.removeStorage({ key: TOKEN_STORAGE_KEY })
  Taro.eventCenter.trigger('naicha:unauthorized')
}

export const request = async <TResponse = unknown, TData = unknown>(
  options: RequestOptions<TData>
): Promise<TResponse> => {
  const {
    url,
    data,
    method = 'GET',
    header = {},
    showErrorToast = true,
    skipAuth = false,
    raw = false,
    timeout = DEFAULT_TIMEOUT,
    ...rest
  } = options

  const finalHeader: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-App-Env': getEnvName()
  }

  Object.entries(header).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      finalHeader[key] = String(value)
    }
  })

  const token = skipAuth ? '' : Taro.getStorageSync<string>(TOKEN_STORAGE_KEY)
  if (token) {
    finalHeader.Authorization = `Bearer ${token}`
  }

  if (shouldAttachIdempotency(method)) {
    finalHeader['X-Idempotency-Key'] = generateUUID()
  }

  try {
    const response = await Taro.request({
      url: buildUrl(url),
      method,
      data,
      timeout,
      header: finalHeader,
      dataType: 'json',
      ...rest
    })

    if (response.statusCode === 401) {
      handleUnauthorized()
      throw new ApiError('登录状态已失效，请重新登录', response.statusCode, response.data)
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      const errMsg =
        (response.data && (response.data.message || response.data.msg)) ||
        `请求失败(${response.statusCode})`
      throw new ApiError(errMsg, response.statusCode, response.data)
    }

    const payload = raw
      ? (response.data as TResponse)
      : normalizeEnvelope<TResponse>(response.data as TResponse)
    return payload
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : '网络异常，请稍后重试'
    if (showErrorToast) {
      toastError(message)
    }
    throw error
  }
}

export const get = <TResponse = unknown, TData = Record<string, unknown>>(
  url: string,
  params?: TData,
  options?: Omit<RequestOptions<TData>, 'url' | 'method' | 'data'>
) => request<TResponse, TData>({ url, method: 'GET', data: params, ...options })

export const post = <TResponse = unknown, TData = unknown>(
  url: string,
  data?: TData,
  options?: Omit<RequestOptions<TData>, 'url' | 'method' | 'data'>
) => request<TResponse, TData>({ url, method: 'POST', data, ...options })

export const put = <TResponse = unknown, TData = unknown>(
  url: string,
  data?: TData,
  options?: Omit<RequestOptions<TData>, 'url' | 'method' | 'data'>
) => request<TResponse, TData>({ url, method: 'PUT', data, ...options })

export const del = <TResponse = unknown, TData = unknown>(
  url: string,
  data?: TData,
  options?: Omit<RequestOptions<TData>, 'url' | 'method' | 'data'>
) => request<TResponse, TData>({ url, method: 'DELETE', data, ...options })
