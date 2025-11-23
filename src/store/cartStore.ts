import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createTaroStorage } from './storage'

export interface CartItem {
  productId: number
  productName: string
  productImage: string
  quantity: number
  specOptionIds: number[]
  specText: string
  unitPrice: number
  totalPrice: number
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
  addOrUpdateItem: (item: CartItem) => void
  removeItem: (productId: number, specOptionIds: number[]) => void
  updateItemQuantity: (productId: number, specOptionIds: number[], quantity: number) => void
  clear: () => void
}

const normalizeSpecOptionIds = (ids: number[]) => [...ids].sort((a, b) => a - b)

const isSameItem = (
  target: Pick<CartItem, 'productId' | 'specOptionIds'>,
  compare: Pick<CartItem, 'productId' | 'specOptionIds'>
) => {
  if (target.productId !== compare.productId) {
    return false
  }
  const a = normalizeSpecOptionIds(target.specOptionIds)
  const b = normalizeSpecOptionIds(compare.specOptionIds)
  return a.length === b.length && a.every((value, index) => value === b[index])
}

const recalcTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = Number(
    items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
  )
  return { totalQuantity, totalPrice }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      addOrUpdateItem: (incoming) => {
        const normalizedSpecIds = normalizeSpecOptionIds(incoming.specOptionIds)
        const nextItem: CartItem = {
          ...incoming,
          specOptionIds: normalizedSpecIds,
          totalPrice: Number((incoming.unitPrice * incoming.quantity).toFixed(2))
        }
        let merged = false
        const nextItems = get().items.map((item) => {
          if (isSameItem(item, nextItem)) {
            merged = true
            const quantity = item.quantity + nextItem.quantity
            const totalPrice = Number((item.unitPrice * quantity).toFixed(2))
            return { ...item, quantity, totalPrice }
          }
          return item
        })

        if (!merged) {
          nextItems.push(nextItem)
        }

        const totals = recalcTotals(nextItems)
        set({ items: nextItems, ...totals })
      },
      removeItem: (productId, specOptionIds) => {
        const filtered = get().items.filter(
          (item) => !isSameItem(item, { productId, specOptionIds })
        )
        const totals = recalcTotals(filtered)
        set({ items: filtered, ...totals })
      },
      updateItemQuantity: (productId, specOptionIds, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, specOptionIds)
          return
        }

        const nextItems = get().items.map((item) => {
          if (isSameItem(item, { productId, specOptionIds })) {
            const totalPrice = Number((item.unitPrice * quantity).toFixed(2))
            return { ...item, quantity, totalPrice }
          }
          return item
        })
        const totals = recalcTotals(nextItems)
        set({ items: nextItems, ...totals })
      },
      clear: () => {
        set({ items: [], totalQuantity: 0, totalPrice: 0 })
      }
    }),
    {
      name: 'naicha-cart-store',
      storage: createTaroStorage<CartState>(),
      partialize: (state) => ({
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalPrice: state.totalPrice
      })
    }
  )
)
