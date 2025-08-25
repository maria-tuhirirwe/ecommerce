"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Loader2 } from "lucide-react"

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to cart')
      return
    }

    try {
      setIsLoading(true)
      await addToCart(product, quantity)
      setIsAdded(true)

      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <span className="mr-4 font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            -
          </button>
          <span className="px-6 py-2 font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            +
          </button>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
          isAdded
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        }`}
        disabled={isAdded || isLoading || !user}
      >
        {isLoading ? (
          <>
            <Loader2 size={24} className="mr-2 animate-spin" />
            Adding...
          </>
        ) : isAdded ? (
          <>
            <Check size={24} className="mr-2" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={24} className="mr-2" />
            {!user ? 'Login to Add to Cart' : 'Add to Cart'}
          </>
        )}
      </Button>
    </div>
  )
}
