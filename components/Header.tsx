"use client"

import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Menu, X, Smartphone } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white">
            <Smartphone size={32} className="text-blue-200" />
            <span className="text-2xl font-bold">TechHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white font-medium hover:text-blue-200 transition-colors duration-200">
              Home
            </Link>
            <Link href="/shop" className="text-white font-medium hover:text-blue-200 transition-colors duration-200">
              Shop
            </Link>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center">
            <Link href="/cart" className="relative p-2 text-white hover:text-blue-200 transition-colors duration-200">
              <ShoppingCart size={28} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="ml-4 md:hidden text-white hover:text-blue-200 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-4 py-4 border-t border-blue-500">
              <Link
                href="/"
                className="text-white font-medium hover:text-blue-200 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-white font-medium hover:text-blue-200 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
