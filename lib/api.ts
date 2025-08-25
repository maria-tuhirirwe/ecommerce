
import type { Category, Product } from "./types"

// Mock data for categories - Electronics focused
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Phones",
    slug: "phones",
    description: "Latest smartphones and mobile devices",
  },
  {
    id: "2",
    name: "Tablets",
    slug: "tablets", 
    description: "iPads, Android tablets and tablet accessories",
  },
  {
    id: "3",
    name: "Accessories",
    slug: "accessories",
    description: "Phone cases, chargers, headphones and more",
  },
  {
    id: "4",
    name: "Laptops",
    slug: "laptops",
    description: "MacBooks, Windows laptops and ultrabooks",
  },
]

// Mock data for products - Electronics with UGX pricing
const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    price_cents: 4500000,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "1",
    categoryName: "Phones",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    price_cents: 4200000,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "1",
    categoryName: "Phones",
  },
  {
    id: "3",
    name: "AirPods Pro (3rd Gen)",
    slug: "airpods-pro-3rd-gen",
    price_cents: 850000,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "3",
    categoryName: "Accessories",
  },
  {
    id: "4",
    name: 'iPad Pro 12.9"',
    slug: "ipad-pro-12-9",
    price_cents: 3800000,
    stock: 6,
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "2",
    categoryName: "Tablets",
  },
  {
    id: "5",
    name: 'MacBook Pro 14"',
    slug: "macbook-pro-14",
    price_cents: 7500000,
    stock: 4,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "4",
    categoryName: "Laptops",
  },
  {
    id: "6",
    name: "Samsung Galaxy Tab S9",
    slug: "samsung-galaxy-tab-s9",
    price_cents: 2800000,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "2",
    categoryName: "Tablets",
  },
  {
    id: "7",
    name: "iPhone 14",
    slug: "iphone-14",
    price_cents: 3200000,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "1",
    categoryName: "Phones",
  },
  {
    id: "8",
    name: "Wireless Charging Pad",
    slug: "wireless-charging-pad",
    price_cents: 180000,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1609592806955-d3c1b508d0e5?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "3",
    categoryName: "Accessories",
  },
  {
    id: "9",
    name: "Phone Case & Screen Protector Set",
    slug: "phone-case-screen-protector-set",
    price_cents: 120000,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "3",
    categoryName: "Accessories",
  },
  {
    id: "10",
    name: "Dell XPS 13",
    slug: "dell-xps-13",
    price_cents: 5500000,
    stock: 7,
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "4",
    categoryName: "Laptops",
  },
  {
    id: "11",
    name: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5-headphones",
    price_cents: 1200000,
    stock: 18,
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop&crop=center"],
    active: true,
    categoryId: "3",
    categoryName: "Accessories",
  },
  {
    id: "12",
    name: "Google Pixel 8 Pro",
    slug: "google-pixel-8-pro",
    price_cents: 3800000,
    stock: 9,
    images: ["https://res.cloudinary.com/dmfrd6tts/image/upload/v1748336121/Pixel_8_in_Rose.max-936x936.format-webp_yublx4.webp"],
    active: true,
    categoryId: "1",
    categoryName: "Phones",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to format UGX currency
export function formatUGX(amount: number): string {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// API functions using mock data
export async function getCategories(): Promise<Category[]> {
  await delay(500)
  return getMockCategories()
}

export async function getCategoriesWithImages(): Promise<Category[]> {
  return getCategories()
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  await delay(800)
  return getMockProducts(categoryId)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay(500)
  return getMockProducts().find((p) => p.id === id)
}

export async function getRecentProducts(limitCount = 4): Promise<Product[]> {
  await delay(700)
  return getMockProducts().slice(0, limitCount)
}

export async function getRelatedProducts(categoryId: string, limitCount = 4): Promise<Product[]> {
  await delay(600)
  return getMockProducts()
    .filter((p) => p.categoryId === categoryId)
    .slice(0, limitCount)
}

// Bargain offer functions
export async function createBargainOffer(offer: {
  productId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  offeredPrice: number
  quantity: number
  message?: string
}) {
  console.log("Bargain offer:", offer)
  return `mock_${Date.now()}`
}

// Order functions
export async function createOrder(order: {
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: any[]
  total: number
}) {
  const mockOrderNumber = `TH${Date.now()}`
  console.log("Order:", { ...order, orderNumber: mockOrderNumber })
  return { id: `mock_${Date.now()}`, orderNumber: mockOrderNumber }
}

// Mock data fallbacks
function getMockCategories(): Category[] {
  return mockCategories
}

function getMockProducts(categoryId?: string): Product[] {
  const products = mockProducts

  if (categoryId) {
    return products.filter((product) => product.categoryId === categoryId)
  }
  return products
}
