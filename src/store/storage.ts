import Taro from '@tarojs/taro'
import { createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

const taroStateStorage: StateStorage = {
  getItem: (name) => {
    try {
      const value = Taro.getStorageSync(name)
      return value ?? null
    } catch (err) {
      console.warn('[storage] getItem error', err)
      return null
    }
  },
  setItem: (name, value) => {
    try {
      Taro.setStorageSync(name, value)
    } catch (err) {
      console.warn('[storage] setItem error', err)
    }
  },
  removeItem: (name) => {
    try {
      Taro.removeStorageSync(name)
    } catch (err) {
      console.warn('[storage] removeItem error', err)
    }
  }
}

export const createTaroStorage = <T>() => createJSONStorage<T>(() => taroStateStorage)
