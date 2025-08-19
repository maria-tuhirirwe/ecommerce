"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setIsAdded(true)

    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
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
        disabled={isAdded}
      >
        {isAdded ? (
          <>
            <Check size={24} className="mr-2" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={24} className="mr-2" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
