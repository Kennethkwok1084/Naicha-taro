import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import type { UserProfileSchema } from '../../types/api'
import { TOKEN_STORAGE_KEY } from '@/utils/request'
import { createTaroStorage } from './storage'

interface UserState {
  token: string | null
  profile: UserProfileSchema | null
  setToken: (token: string | null) => void
  setProfile: (profile: UserProfileSchema | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: Taro.getStorageSync<string>(TOKEN_STORAGE_KEY) || null,
      profile: null,
      setToken: (token) => {
        if (token) {
          Taro.setStorageSync(TOKEN_STORAGE_KEY, token)
        } else {
          Taro.removeStorageSync(TOKEN_STORAGE_KEY)
        }
        set({ token })
      },
      setProfile: (profile) => {
        set({ profile })
      },
      logout: () => {
        Taro.removeStorageSync(TOKEN_STORAGE_KEY)
        set({ token: null, profile: null })
      }
    }),
    {
      name: 'naicha-user-store',
      storage: createTaroStorage<UserState>(),
      partialize: (state) => ({
        token: state.token,
        profile: state.profile
      })
    }
  )
)

Taro.eventCenter.on('naicha:unauthorized', () => {
  const { logout } = useUserStore.getState()
  logout()
})
