import Taro, { getCurrentPages } from '@tarojs/taro'
import * as Sentry from '@sentry/react'
import { post } from '@/utils/request'
import { getEnvName, getSentryDsn } from '@/config/env'

type AnalyticsEventType = 'event' | 'page' | 'user'

interface AnalyticsEvent {
  id: string
  type: AnalyticsEventType
  name: string
  timestamp: number
  payload?: Record<string, unknown>
}

const STORAGE_KEY = 'NAICHA_ANALYTICS_QUEUE'
const ANALYTICS_ENDPOINT = '/api/v1/analytics/events'
const BATCH_SIZE = 10
const FLUSH_INTERVAL = 15_000

let queue: AnalyticsEvent[] = []
let initialized = false
let flushing = false
let sentryInitialized = false
let flushTimer: ReturnType<typeof setInterval> | null = null

const loadQueueFromStorage = (): AnalyticsEvent[] => {
  try {
    const cached = Taro.getStorageSync<AnalyticsEvent[]>(STORAGE_KEY)
    return Array.isArray(cached) ? cached : []
  } catch {
    return []
  }
}

const persistQueue = () => {
  try {
    Taro.setStorageSync(STORAGE_KEY, queue)
  } catch (err) {
    console.warn('[analytics] persist queue failed', err)
  }
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const enqueue = (event: AnalyticsEvent) => {
  queue.push(event)
  persistQueue()
  if (queue.length >= BATCH_SIZE) {
    flushAnalyticsQueue()
  }
}

const getCurrentPageInfo = () => {
  const pagesGetter = typeof getCurrentPages === 'function' ? getCurrentPages : undefined
  const pages = pagesGetter ? pagesGetter() : []
  if (!pages || pages.length === 0) {
    return {}
  }
  const current = pages[pages.length - 1]
  return {
    route: current?.route,
    options: current?.options
  }
}

const loadQueueOnBoot = () => {
  if (queue.length === 0) {
    queue = loadQueueFromStorage()
  }
}

export const maskPhoneNumber = (phone?: string | null) => {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  const lastFour = digits.slice(-4)
  return lastFour.padStart(digits.length, '*')
}

export const track = (eventName: string, payload?: Record<string, unknown>) => {
  loadQueueOnBoot()
  enqueue({
    id: generateId(),
    type: 'event',
    name: eventName,
    timestamp: Date.now(),
    payload
  })
}

export const trackPage = (pageName: string, payload?: Record<string, unknown>) => {
  loadQueueOnBoot()
  enqueue({
    id: generateId(),
    type: 'page',
    name: pageName,
    timestamp: Date.now(),
    payload: {
      ...getCurrentPageInfo(),
      ...payload
    }
  })
}

export const trackUser = (userId: string | number, traits?: Record<string, unknown>) => {
  loadQueueOnBoot()
  const sanitized = { ...(traits || {}) }
  if (sanitized.phone) {
    sanitized.phone = maskPhoneNumber(String(sanitized.phone))
  }

  enqueue({
    id: generateId(),
    type: 'user',
    name: 'identify',
    timestamp: Date.now(),
    payload: {
      userId,
      ...sanitized
    }
  })
}

export const flushAnalyticsQueue = async () => {
  loadQueueOnBoot()
  if (flushing || queue.length === 0) {
    return
  }
  flushing = true
  
  try {
    // 批量上报事件到后端 (每批最多10条)
    while (queue.length) {
      const batch = queue.slice(0, BATCH_SIZE)
      console.log('[analytics] 上报', batch.length, '条事件')
      
      await post(ANALYTICS_ENDPOINT, { events: batch }, { showErrorToast: false })
      
      // 上报成功后移除已发送事件
      queue = queue.slice(batch.length)
      persistQueue()
    }
    
    console.log('[analytics] 队列刷新完成')
  } catch (err) {
    console.warn('[analytics] 上报失败,将在下次重试', err)
    // 失败不清空队列,下次会继续尝试
  } finally {
    flushing = false
  }
}

const setupFlushHooks = () => {
  if (flushTimer) {
    return
  }
  flushTimer = setInterval(() => {
    flushAnalyticsQueue()
  }, FLUSH_INTERVAL)

  Taro.onAppShow?.(() => {
    flushAnalyticsQueue()
  })

  Taro.onAppHide?.(() => {
    flushAnalyticsQueue()
  })
}

export const initAnalytics = () => {
  if (initialized) {
    return
  }
  initialized = true
  queue = loadQueueFromStorage()
  setupFlushHooks()
  flushAnalyticsQueue()
}

export const initSentry = () => {
  if (sentryInitialized) {
    return
  }
  const dsn = getSentryDsn()
  if (!dsn) {
    return
  }
  Sentry.init({
    dsn,
    environment: getEnvName(),
    tracesSampleRate: 0.1
  })
  sentryInitialized = true
}

export const captureError = (error: Error, context?: Record<string, unknown>) => {
  if (!sentryInitialized) {
    return
  }
  Sentry.captureException(error, {
    extra: context
  })
}
