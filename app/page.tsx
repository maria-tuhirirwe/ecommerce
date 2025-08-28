"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getCategories, getProducts } from "@/app/api/apis"
import CategoryCard from "@/components/CategoryCard"
import ProductCard from "@/components/ProductCard"
import type { Category, Product } from "@/lib/types"

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts()
        ])
        setCategories(categoriesData)
        setRecentProducts(productsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Set empty arrays as fallback
        setCategories([])
        setRecentProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative rounded-2xl overflow-hidden h-[500px] flex items-center bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
  
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Vital Electronics
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-center max-w-3xl text-blue-100">
                Your one-stop shop for the latest phones, tablets, laptops & accessories. Shop with ease, checkout via
                WhatsApp!
              </p>
              <Link
                href="/shop"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">Discover our wide range of electronics</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-600">
                <p>No categories available at the moment.</p>
                <Link
                  href="/shop"
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                >
                  Browse products →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Recent Products Section */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Latest Arrivals
            </h2>
            <p className="text-gray-600 text-lg">Check out our newest products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-600">
                <p>No products available at the moment.</p>
                <Link
                  href="/shop"
                  className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                >
                  Visit shop page →
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
