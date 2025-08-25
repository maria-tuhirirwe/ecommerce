"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/context/AuthContext"
import { addToCart as addToCartDB, removeFromCart as removeFromCartDB, getCartItems } from "@/app/api/apis"
import type { Product } from "@/lib/types"

type CartItem = {
  id?: number
  product: Product
  quantity: number
  price_cents_at_add?: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Load cart from database when user is authenticated
  useEffect(() => {
    if (user?.id) {
      loadCartFromDB()
    } else {
      setCart([])
    }
  }, [user?.id])

  const loadCartFromDB = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const cartItems = await getCartItems(user.id)
      const formattedCart: CartItem[] = cartItems.map(item => ({
        id: item.id,
        product: {
          id: item.product_id.toString(),
          name: item.products?.name || 'Unknown Product',
          slug: '',
          price_cents: item.products?.price_cents || item.price_cents_at_add,
          stock: 0,
          images: item.products?.images,
          active: true,
          categoryId: '',
          categoryName: ''
        },
        quantity: item.qty,
        price_cents_at_add: item.price_cents_at_add
      }))
      setCart(formattedCart)
    } catch (error) {
      console.error('Failed to load cart from database:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product: Product, quantity: number) => {
    if (!user?.id) {
      console.error('User not authenticated')
      return
    }

    try {
      setLoading(true)
      await addToCartDB(user.id, parseInt(product.id), quantity, product.price_cents)
      await loadCartFromDB() // Reload cart from database
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.id) {
      console.error('User not authenticated')
      return
    }

    try {
      setLoading(true)
      // First remove the existing item, then add with new quantity
      await removeFromCartDB(user.id, parseInt(productId))
      const product = cart.find(item => item.product.id === productId)?.product
      if (product && quantity > 0) {
        await addToCartDB(user.id, parseInt(productId), quantity, product.price_cents)
      }
      await loadCartFromDB() // Reload cart from database
    } catch (error) {
      console.error('Failed to update cart quantity:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!user?.id) {
      console.error('User not authenticated')
      return
    }

    try {
      setLoading(true)
      await removeFromCartDB(user.id, parseInt(productId))
      await loadCartFromDB() // Reload cart from database
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user?.id) {
      console.error('User not authenticated')
      return
    }

    try {
      setLoading(true)
      // Remove all items from cart
      for (const item of cart) {
        await removeFromCartDB(user.id, parseInt(item.product.id))
      }
      setCart([])
    } catch (error) {
      console.error('Failed to clear cart:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
