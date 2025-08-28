"use client"

import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { ShoppingCart, Menu, X, Smartphone, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()
  const { user, logout, userRole } = useAuth()

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white">
            <Smartphone size={32} className="text-blue-200" />
            <span className="text-2xl font-bold">Vital Electronics</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white font-medium hover:text-blue-200 transition-colors duration-200">
              Home
            </Link>
            <Link href="/shop" className="text-white font-medium hover:text-blue-200 transition-colors duration-200">
              Shop
            </Link>
            {userRole === 'admin' && (
              <Link href="/admin/dashboard" className="text-white font-medium hover:text-blue-200 transition-colors duration-200">
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Authentication */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <User size={20} />
                  <div className="flex flex-col">
                    <span className="text-sm">{user.email}</span>
                    {userRole && <span className="text-xs text-blue-200 capitalize">{userRole}</span>}
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-blue-200 hover:bg-blue-700"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-blue-200 hover:bg-blue-700"
                  >
                    <User size={16} className="mr-1" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Cart Icon */}
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
              {userRole === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="text-white font-medium hover:text-blue-200 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              {/* Mobile Authentication */}
              <div className="border-t border-blue-500 pt-4 mt-4">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-white">
                      <User size={16} />
                      <div className="flex flex-col">
                        <span className="text-sm">{user.email}</span>
                        {userRole && <span className="text-xs text-blue-200 capitalize">{userRole}</span>}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full text-white hover:text-blue-200 hover:bg-blue-700 justify-start"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-white hover:text-blue-200 hover:bg-blue-700 justify-start"
                      >
                        <User size={16} className="mr-2" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-white text-blue-600 hover:bg-blue-50"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
