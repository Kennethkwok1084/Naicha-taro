import { create } from 'zustand'
import type {
  CouponSchema,
  CouponsResponseSchema,
  MenuResponseSchema,
  ShopProfileSchema,
  ShopStatusSchema
} from '../../types/api'
import { get } from '@/utils/request'

const MENU_CACHE_TTL = 5 * 60 * 1000

interface ShopState {
  status: ShopStatusSchema | null
  profile: ShopProfileSchema | null
  menu: MenuResponseSchema | null
  menuFetchedAt: number | null
  coupons: CouponSchema[]
  setStatus: (status: ShopStatusSchema) => void
  setProfile: (profile: ShopProfileSchema) => void
  setMenu: (menu: MenuResponseSchema) => void
  setCoupons: (coupons: CouponSchema[]) => void
  fetchStatus: () => Promise<ShopStatusSchema>
  fetchProfile: () => Promise<ShopProfileSchema>
  fetchMenu: (force?: boolean) => Promise<MenuResponseSchema>
  fetchCoupons: (status?: string) => Promise<CouponSchema[]>
  invalidateMenu: () => void
}

export const useShopStore = create<ShopState>()((set, getState) => ({
  status: null,
  profile: null,
  menu: null,
  menuFetchedAt: null,
  coupons: [],
  setStatus: (status) => set({ status }),
  setProfile: (profile) => set({ profile }),
  setMenu: (menu) => set({ menu, menuFetchedAt: Date.now() }),
  setCoupons: (coupons) => set({ coupons }),
  fetchStatus: async () => {
    const data = await get<ShopStatusSchema>('/api/v1/shop/status')
    set({ status: data })
    return data
  },
  fetchProfile: async () => {
    const data = await get<ShopProfileSchema>('/api/v1/shop/profile')
    set({ profile: data })
    return data
  },
  fetchMenu: async (force = false) => {
    const { menu, menuFetchedAt } = getState()
    const now = Date.now()
    if (!force && menu && menuFetchedAt && now - menuFetchedAt < MENU_CACHE_TTL) {
      return menu
    }
    const data = await get<MenuResponseSchema>('/api/v1/menu')
    set({ menu: data, menuFetchedAt: Date.now() })
    return data
  },
  fetchCoupons: async (status) => {
    const params = status ? { status } : undefined
    const response = await get<CouponsResponseSchema>('/api/v1/me/coupons', params)
    set({ coupons: response.coupons })
      return response.coupons
  },
  invalidateMenu: () => set({ menu: null, menuFetchedAt: null })
}))
