import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, addDoc, Timestamp } from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { Category, Product } from "./types"

// Mock data for categories - Electronics focused
const mockCategories: Category[] = [
  {
    id: "phones",
    name: "Phones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "tablets",
    name: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "laptops",
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&crop=center",
  },
]

// Mock data for products - Electronics with UGX pricing
const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description:
      "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography and gaming.",
    price: 4500000, // UGX
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center",
    categoryId: "phones",
    categoryName: "Phones",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features.",
    price: 4200000, // UGX
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center",
    categoryId: "phones",
    categoryName: "Phones",
  },
  {
    id: "3",
    name: "AirPods Pro (3rd Gen)",
    description: "Active noise cancellation, spatial audio, and all-day battery life. Perfect for music and calls.",
    price: 850000, // UGX
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop&crop=center",
    categoryId: "accessories",
    categoryName: "Accessories",
  },
  {
    id: "4",
    name: 'iPad Pro 12.9"',
    description: "Powerful tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.",
    price: 3800000, // UGX
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center",
    categoryId: "tablets",
    categoryName: "Tablets",
  },
  {
    id: "5",
    name: 'MacBook Pro 14"',
    description: "Professional laptop with M3 Pro chip, stunning Retina display, and all-day battery life.",
    price: 7500000, // UGX
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center",
    categoryId: "laptops",
    categoryName: "Laptops",
  },
  {
    id: "6",
    name: "Samsung Galaxy Tab S9",
    description: "Premium Android tablet with S Pen included, perfect for productivity and creativity.",
    price: 2800000, // UGX
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center",
    categoryId: "tablets",
    categoryName: "Tablets",
  },
  {
    id: "7",
    name: "iPhone 14",
    description: "Reliable iPhone with great camera system, all-day battery, and durable design.",
    price: 3200000, // UGX
    image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=400&h=400&fit=crop&crop=center",
    categoryId: "phones",
    categoryName: "Phones",
  },
  {
    id: "8",
    name: "Wireless Charging Pad",
    description: "Fast wireless charging for all Qi-enabled devices. Sleek design with LED indicator.",
    price: 180000, // UGX
    image: "https://images.unsplash.com/photo-1609592806955-d3c1b508d0e5?w=400&h=400&fit=crop&crop=center",
    categoryId: "accessories",
    categoryName: "Accessories",
  },
  {
    id: "9",
    name: "Phone Case & Screen Protector Set",
    description: "Premium protection bundle with tempered glass screen protector and shock-resistant case.",
    price: 120000, // UGX
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop&crop=center",
    categoryId: "accessories",
    categoryName: "Accessories",
  },
  {
    id: "10",
    name: "Dell XPS 13",
    description: "Ultra-portable laptop with Intel Core i7, stunning display, and premium build quality.",
    price: 5500000, // UGX
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&crop=center",
    categoryId: "laptops",
    categoryName: "Laptops",
  },
  {
    id: "11",
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling headphones with exceptional sound quality.",
    price: 1200000, // UGX
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop&crop=center",
    categoryId: "accessories",
    categoryName: "Accessories",
  },
  {
    id: "12",
    name: "Google Pixel 8 Pro",
    description: "AI-powered Android phone with exceptional camera and pure Google experience.",
    price: 3800000, // UGX
    image:
      "https://res.cloudinary.com/dmfrd6tts/image/upload/v1748336121/Pixel_8_in_Rose.max-936x936.format-webp_yublx4.webp",
    categoryId: "phones",
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

// API functions with Firebase fallback to mock data
export async function getCategories(): Promise<Category[]> {
  // If Firebase is not configured, use mock data
  if (!isFirebaseConfigured() || !db) {
    await delay(500)
    return getMockCategories()
  }

  try {
    const categoriesRef = collection(db, "categories")
    const q = query(categoriesRef, where("isActive", "==", true), orderBy("sortOrder", "asc"))
    const querySnapshot = await getDocs(q)

    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      image: doc.data().imageUrl,
    })) as Category[]

    return categories.length > 0 ? categories : getMockCategories()
  } catch (error) {
    console.error("Error fetching categories from Firebase:", error)
    // Fallback to mock data if Firebase fails
    await delay(500)
    return getMockCategories()
  }
}

export async function getCategoriesWithImages(): Promise<Category[]> {
  return getCategories()
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  // If Firebase is not configured, use mock data
  if (!isFirebaseConfigured() || !db) {
    await delay(800)
    return getMockProducts(categoryId)
  }

  try {
    const productsRef = collection(db, "products")
    let q = query(productsRef, where("isActive", "==", true), orderBy("createdAt", "desc"))

    if (categoryId) {
      q = query(productsRef, where("categoryId", "==", categoryId), where("isActive", "==", true))
    }

    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.imageUrl,
        categoryId: data.categoryId,
        categoryName: "Loading...", // Will be filled below
      }
    }) as Product[]

    // Get category names for products
    if (products.length > 0) {
      const categoriesMap = new Map()
      const categories = await getCategories()
      categories.forEach((cat) => categoriesMap.set(cat.id, cat.name))

      return products.map((product) => ({
        ...product,
        categoryName: categoriesMap.get(product.categoryId) || "Unknown",
      }))
    }

    return getMockProducts(categoryId)
  } catch (error) {
    console.error("Error fetching products from Firebase:", error)
    // Fallback to mock data if Firebase fails
    await delay(800)
    return getMockProducts(categoryId)
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  // If Firebase is not configured, use mock data
  if (!isFirebaseConfigured() || !db) {
    await delay(500)
    return getMockProducts().find((p) => p.id === id)
  }

  try {
    const productRef = doc(db, "products", id)
    const productSnap = await getDoc(productRef)

    if (productSnap.exists()) {
      const data = productSnap.data()
      const product = {
        id: productSnap.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.imageUrl,
        categoryId: data.categoryId,
        categoryName: "Loading...",
      } as Product

      // Get category name
      try {
        const categoryRef = doc(db, "categories", product.categoryId)
        const categorySnap = await getDoc(categoryRef)
        const categoryName = categorySnap.exists() ? categorySnap.data().name : "Unknown"

        return {
          ...product,
          categoryName,
        }
      } catch (error) {
        return {
          ...product,
          categoryName: "Unknown",
        }
      }
    }
    return undefined
  } catch (error) {
    console.error("Error fetching product from Firebase:", error)
    // Fallback to mock data if Firebase fails
    await delay(500)
    return getMockProducts().find((p) => p.id === id)
  }
}

export async function getRecentProducts(limitCount = 4): Promise<Product[]> {
  // If Firebase is not configured, use mock data
  if (!isFirebaseConfigured() || !db) {
    await delay(700)
    return getMockProducts().slice(0, limitCount)
  }

  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("isActive", "==", true), orderBy("createdAt", "desc"), limit(limitCount))
    const querySnapshot = await getDocs(q)

    const products = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.imageUrl,
        categoryId: data.categoryId,
        categoryName: "Loading...",
      }
    }) as Product[]

    // Get category names
    if (products.length > 0) {
      const categoriesMap = new Map()
      const categories = await getCategories()
      categories.forEach((cat) => categoriesMap.set(cat.id, cat.name))

      return products.map((product) => ({
        ...product,
        categoryName: categoriesMap.get(product.categoryId) || "Unknown",
      }))
    }

    return getMockProducts().slice(0, limitCount)
  } catch (error) {
    console.error("Error fetching recent products from Firebase:", error)
    // Fallback to mock data if Firebase fails
    await delay(700)
    return getMockProducts().slice(0, limitCount)
  }
}

export async function getRelatedProducts(categoryId: string, limitCount = 4): Promise<Product[]> {
  // If Firebase is not configured, use mock data
  if (!isFirebaseConfigured() || !db) {
    await delay(600)
    return getMockProducts()
      .filter((p) => p.categoryId === categoryId)
      .slice(0, limitCount)
  }

  try {
    const productsRef = collection(db, "products")
    const q = query(
      productsRef,
      where("categoryId", "==", categoryId),
      where("isActive", "==", true),
      limit(limitCount),
    )
    const querySnapshot = await getDocs(q)

    const products = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.imageUrl,
        categoryId: data.categoryId,
        categoryName: "Loading...",
      }
    }) as Product[]

    // Get category name
    if (products.length > 0) {
      try {
        const categoryRef = doc(db, "categories", categoryId)
        const categorySnap = await getDoc(categoryRef)
        const categoryName = categorySnap.exists() ? categorySnap.data().name : "Unknown"

        return products.map((product) => ({
          ...product,
          categoryName,
        }))
      } catch (error) {
        return products.map((product) => ({
          ...product,
          categoryName: "Unknown",
        }))
      }
    }

    return getMockProducts()
      .filter((p) => p.categoryId === categoryId)
      .slice(0, limitCount)
  } catch (error) {
    console.error("Error fetching related products from Firebase:", error)
    // Fallback to mock data if Firebase fails
    await delay(600)
    return getMockProducts()
      .filter((p) => p.categoryId === categoryId)
      .slice(0, limitCount)
  }
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
  // If Firebase is not configured, just return a mock ID
  if (!isFirebaseConfigured() || !db) {
    console.log("Bargain offer (mock):", offer)
    return `mock_${Date.now()}`
  }

  try {
    const bargainOffersRef = collection(db, "bargain_offers")
    const docRef = await addDoc(bargainOffersRef, {
      ...offer,
      totalOffer: offer.offeredPrice * offer.quantity,
      status: "pending",
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating bargain offer:", error)
    throw error
  }
}

// Order functions
export async function createOrder(order: {
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: any[]
  total: number
}) {
  // If Firebase is not configured, just return a mock order
  if (!isFirebaseConfigured() || !db) {
    const mockOrderNumber = `TH${Date.now()}`
    console.log("Order (mock):", { ...order, orderNumber: mockOrderNumber })
    return { id: `mock_${Date.now()}`, orderNumber: mockOrderNumber }
  }

  try {
    const ordersRef = collection(db, "orders")
    const orderNumber = `TH${Date.now()}`

    const docRef = await addDoc(ordersRef, {
      ...order,
      orderNumber,
      subtotal: order.total,
      discount: 0,
      status: "pending",
      paymentMethod: "whatsapp",
      deliveryMethod: "delivery",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return { id: docRef.id, orderNumber }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
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
