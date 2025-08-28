"use client"

import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatUGX } from "@/lib/api"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, loading: cartLoading } = useCart()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalAmount = cart.reduce((total, item) => {
    return total + item.product.price_cents * item.quantity
  }, 0)

  const handleCheckout = () => {
    setIsCheckingOut(true)

    // Create WhatsApp message
    let message = "Hi! I'm interested in purchasing the following items from Vital Electronics:\n\n"

    cart.forEach((item) => {
      message += `📱 ${item.product.name}\n`
      message += `   Quantity: ${item.quantity} ${item.quantity === 1 ? "pc" : "pcs"}\n`
      message += `   Price: ${formatUGX(item.product.price_cents * item.quantity)}\n\n`
    })

    message += `💰 Total Amount: ${formatUGX(totalAmount)}\n\n`
    message += "Please confirm availability and delivery details. Thank you!"

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)

    // Replace with your actual WhatsApp number (Ugandan format)
    const whatsappNumber = "+256789230136" // Update this with your actual number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")
    setIsCheckingOut(false)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8">
          <ShoppingBag size={80} className="mx-auto mb-6 text-blue-300" />
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
          <p className="text-lg mb-8 text-gray-600">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/shop">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 text-lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col sm:flex-row items-center py-6 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0 mb-4 sm:mb-0 rounded-xl overflow-hidden">
                      <Image
                        src={(item.product.images && item.product.images[0]) || "/placeholder.svg?height=100&width=100"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-grow sm:ml-6 text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.product.name}</h3>
                      <p className="text-blue-600 font-medium">{formatUGX(item.product.price_cents)}</p>
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mt-1">
                        {item.product.categoryName}
                      </span>
                    </div>

                    <div className="flex items-center mt-4 sm:mt-0 space-x-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={async () => {
                            setActionLoading(`decrease-${item.product.id}`)
                            await updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                            setActionLoading(null)
                          }}
                          disabled={actionLoading === `decrease-${item.product.id}` || cartLoading}
                          className="px-3 py-2 text-blue-600 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={async () => {
                            setActionLoading(`increase-${item.product.id}`)
                            await updateQuantity(item.product.id, item.quantity + 1)
                            setActionLoading(null)
                          }}
                          disabled={actionLoading === `increase-${item.product.id}` || cartLoading}
                          className="px-3 py-2 text-blue-600 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={async () => {
                          setActionLoading(`remove-${item.product.id}`)
                          await removeFromCart(item.product.id)
                          setActionLoading(null)
                        }}
                        disabled={actionLoading === `remove-${item.product.id}` || cartLoading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
              <Link href="/shop">
                <Button variant="outline" className="w-full sm:w-auto border-blue-300 text-blue-600 hover:bg-blue-50">
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={async () => {
                  setActionLoading('clear')
                  await clearCart()
                  setActionLoading(null)
                }}
                disabled={actionLoading === 'clear' || cartLoading}
                className="w-full sm:w-auto border-red-300 text-red-600 hover:bg-red-50"
              >
                {actionLoading === 'clear' ? 'Clearing...' : 'Clear Cart'}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatUGX(item.product.price_cents * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-blue-600">{formatUGX(totalAmount)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg"
              >
                {isCheckingOut ? "Processing..." : "Checkout with WhatsApp"}
              </Button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                You'll be redirected to WhatsApp to complete your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
