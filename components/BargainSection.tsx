"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, DollarSign } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatUGX, createBargainOffer } from "@/lib/api"
import { isFirebaseConfigured } from "@/lib/firebase"

interface BargainSectionProps {
  product: Product
}

export default function BargainSection({ product }: BargainSectionProps) {
  const [bargainPrice, setBargainPrice] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBargainSubmit = async () => {
    if (!bargainPrice || Number.parseFloat(bargainPrice) <= 0) {
      alert("Please enter a valid price offer")
      return
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Please enter your name and phone number")
      return
    }

    setIsSubmitting(true)

    try {
      const offerPrice = Number.parseFloat(bargainPrice)
      const totalOffer = offerPrice * quantity

      // Save bargain offer to Firebase (or mock if not configured)
      if (isFirebaseConfigured()) {
        await createBargainOffer({
          productId: product.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          offeredPrice: offerPrice,
          quantity,
          message: message.trim(),
        })
      } else {
        // Mock save for demo purposes
        console.log("Bargain offer saved (demo mode):", {
          productId: product.id,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          offeredPrice: offerPrice,
          quantity,
          message: message.trim(),
        })
      }

      // Create WhatsApp message for bargaining
      let whatsappMessage = `Hi! I'm interested in bargaining for this product from TechHub:\n\n`
      whatsappMessage += `📱 Product: ${product.name}\n`
      whatsappMessage += `💰 Listed Price: ${formatUGX(product.price)}\n`
      whatsappMessage += `🤝 My Offer: ${formatUGX(offerPrice)} per item\n`
      whatsappMessage += `📦 Quantity: ${quantity} ${quantity === 1 ? "pc" : "pcs"}\n`
      whatsappMessage += `💵 Total Offer: ${formatUGX(totalOffer)}\n`
      whatsappMessage += `👤 Name: ${customerName}\n`
      whatsappMessage += `📞 Phone: ${customerPhone}\n\n`

      if (message.trim()) {
        whatsappMessage += `📝 Additional Message: ${message}\n\n`
      }

      whatsappMessage += `Please let me know if this price is acceptable. Thank you!`

      // Encode the message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage)

      // Replace with your actual WhatsApp number
      const whatsappNumber = "+256789230136"
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, "_blank")

      // Reset form
      setBargainPrice("")
      setQuantity(1)
      setMessage("")
      setCustomerName("")
      setCustomerPhone("")

      alert("Your bargain offer has been submitted successfully!")
    } catch (error) {
      console.error("Error submitting bargain offer:", error)
      alert("Failed to submit your offer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateSavings = () => {
    if (!bargainPrice) return 0
    const offerPrice = Number.parseFloat(bargainPrice)
    return product.price - offerPrice
  }

  const savingsAmount = calculateSavings()
  const savingsPercentage = bargainPrice ? ((savingsAmount / product.price) * 100).toFixed(1) : "0"

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
      <div className="flex items-center mb-4">
        <DollarSign className="text-orange-600 mr-2" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Make an Offer</h3>
        {!isFirebaseConfigured() && (
          <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Demo Mode</span>
        )}
      </div>

      <p className="text-gray-600 mb-6">Think the price is too high? Make us an offer! We're open to negotiations.</p>

      <div className="space-y-4">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <Input
              id="customer-name"
              type="text"
              placeholder="Enter your full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <Input
              id="customer-phone"
              type="tel"
              placeholder="+256 XXX XXX XXX"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
        </div>

        {/* Quantity Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <div className="flex items-center border border-gray-300 rounded-lg w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 transition-colors duration-200"
            >
              -
            </button>
            <span className="px-6 py-2 font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Price Offer */}
        <div>
          <label htmlFor="bargain-price" className="block text-sm font-medium text-gray-700 mb-2">
            Your Price Offer (UGX per item) *
          </label>
          <Input
            id="bargain-price"
            type="number"
            placeholder="Enter your offer price"
            value={bargainPrice}
            onChange={(e) => setBargainPrice(e.target.value)}
            className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        {/* Price Comparison */}
        {bargainPrice && Number.parseFloat(bargainPrice) > 0 && (
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Listed Price:</span>
                <p className="font-semibold text-gray-800">{formatUGX(product.price)}</p>
              </div>
              <div>
                <span className="text-gray-600">Your Offer:</span>
                <p className="font-semibold text-orange-600">{formatUGX(Number.parseFloat(bargainPrice))}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Offer:</span>
                <p className="font-semibold text-orange-600">{formatUGX(Number.parseFloat(bargainPrice) * quantity)}</p>
              </div>
              <div>
                <span className="text-gray-600">Potential Savings:</span>
                <p className={`font-semibold ${savingsAmount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {savingsAmount > 0 ? "-" : "+"}
                  {formatUGX(Math.abs(savingsAmount))} ({savingsPercentage}%)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Message */}
        <div>
          <label htmlFor="bargain-message" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Message (Optional)
          </label>
          <Textarea
            id="bargain-message"
            placeholder="Any additional details about your offer..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleBargainSubmit}
          disabled={isSubmitting || !bargainPrice || !customerName.trim() || !customerPhone.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-3 text-lg font-semibold rounded-xl shadow-lg"
        >
          {isSubmitting ? (
            "Sending Offer..."
          ) : (
            <>
              <MessageCircle size={20} className="mr-2" />
              Send Offer via WhatsApp
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        {isFirebaseConfigured()
          ? "Your offer will be saved and sent directly to our sales team via WhatsApp"
          : "Demo mode: Your offer will be sent via WhatsApp (not saved to database)"}
      </div>
    </div>
  )
}
