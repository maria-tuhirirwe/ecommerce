export interface Category {
  id: string
  name: string
  image?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  categoryId: string
  categoryName: string
}
