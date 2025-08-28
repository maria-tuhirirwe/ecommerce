export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  created_at?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price?: number
  price_cents: number
  stock: number
  image?: string
  images?: string[]
  active: boolean
  categoryId: string
  categoryName: string
  created_at?: string
  updated_at?: string
}
