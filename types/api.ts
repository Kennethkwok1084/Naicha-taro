export interface UserProfileSchema {
  user_id: number
  nickname: string | null
  avatar_url: string | null
  loyalty_points: number
}

export interface ShopFeaturesSchema {
  multi_category_enabled: boolean
  reservation_enabled: boolean
  want_enabled: boolean
}

export interface ShopLocationSchema {
  lat: number
  lng: number
}

export interface ShopStatusSchema {
  is_open: boolean
  delivery_radius_m: number
  timezone: string
  open_hours?: Record<string, unknown>[] | null
  location?: ShopLocationSchema | null
  features: ShopFeaturesSchema
  business_hours_today?: string | null
}

export interface ShopProfileSchema {
  name: string
  address: string
  phone: string
  announcement?: string | null
  logo_url?: string | null
  updated_at?: string | null
  delivery_notes?: string[]
  supports_pickup: boolean
  supports_delivery: boolean
  min_delivery_amount?: string | null
  delivery_fee?: string | null
  free_delivery_amount?: string | null
}

export interface MenuSpecOptionSchema {
  option_id: number
  name: string
  price_modifier: number
  inventory_status: string
  sort_order: number
}

export interface MenuSpecGroupSchema {
  group_id: number
  name: string
  sort_order: number
  options: MenuSpecOptionSchema[]
}

export interface MenuProductSchema {
  product_id: number
  name: string
  description: string | null
  image_url: string | null
  base_price: number
  status: string
  inventory_status: string
  spec_groups: MenuSpecGroupSchema[]
}

export interface MenuCategorySchema {
  category_id: number
  name: string
  sort_order: number
  products: MenuProductSchema[]
}

export interface MenuResponseSchema {
  categories: MenuCategorySchema[]
  uncategorized_products: MenuProductSchema[]
  multi_category_enabled: boolean
}

export interface CouponSchema {
  coupon_id: number
  user_id: number
  type: string
  status: string
  meta_json: Record<string, unknown> | null
  issued_at: string | null
  used_at: string | null
  used_in_order_id: number | null
  created_at: string
}

export interface CouponsResponseSchema {
  coupons: CouponSchema[]
  stats: {
    total_count: number
    active_count: number
    used_count: number
    expired_count: number
    void_count: number
  }
}
