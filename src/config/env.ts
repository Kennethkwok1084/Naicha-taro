type EnvName = 'development' | 'staging' | 'production'

interface EnvConfig {
  name: EnvName
  baseUrl: string
  sentryDsn?: string
}

const ENV_MAP: Record<EnvName, EnvConfig> = {
  development: {
    name: 'development',
    baseUrl: process.env.TARO_APP_API_BASE_URL_DEV || 'http://localhost:8000',
    sentryDsn: process.env.SENTRY_DSN_DEV || process.env.SENTRY_DSN
  },
  staging: {
    name: 'staging',
    baseUrl: process.env.TARO_APP_API_BASE_URL_STAGING || 'https://staging.guajunyan.top',
    sentryDsn: process.env.SENTRY_DSN_STAGING || process.env.SENTRY_DSN
  },
  production: {
    name: 'production',
    baseUrl: process.env.TARO_APP_API_BASE_URL_PROD || 'https://guajunyan.top',
    sentryDsn: process.env.SENTRY_DSN_PROD || process.env.SENTRY_DSN
  }
}

const ENV_KEY = 'NAICHA_RUNTIME_ENV'

const readRuntimeEnv = (): EnvName => {
  const envFromProcess = (process.env.NAICHA_ENV ||
    process.env.APP_ENV ||
    process.env.NODE_ENV) as EnvName | undefined
  if (envFromProcess && ENV_MAP[envFromProcess]) {
    return envFromProcess
  }
  const envFromStorage = process.env[ENV_KEY] as EnvName | undefined
  if (envFromStorage && ENV_MAP[envFromStorage]) {
    return envFromStorage
  }
  return 'development'
}

let currentEnv: EnvName = readRuntimeEnv()

export const getEnv = (): EnvConfig => ENV_MAP[currentEnv]

export const getEnvName = (): EnvName => currentEnv

export const getBaseUrl = (): string => ENV_MAP[currentEnv].baseUrl

export const isDev = (): boolean => currentEnv === 'development'
export const isStaging = (): boolean => currentEnv === 'staging'
export const isProd = (): boolean => currentEnv === 'production'

export const AVAILABLE_ENVS = ENV_MAP

export const setRuntimeEnv = (env: EnvName) => {
  if (ENV_MAP[env]) {
    currentEnv = env
  }
}

export const getSentryDsn = (): string | undefined =>
  ENV_MAP[currentEnv].sentryDsn || process.env.SENTRY_DSN
