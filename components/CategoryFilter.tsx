"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import type { Category } from "@/lib/types"

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  categories: Category[]
  selectedCategory?: string | null
  onCategoryChange?: (categoryId: string | null) => void
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handleCategoryClick = (categoryId: string | null) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Categories</h2>
      <ul className="space-y-3">
        <li>
          {onCategoryChange ? (
            <button
              onClick={() => handleCategoryClick(null)}
              className={`block w-full text-left p-3 rounded-xl transition-all duration-200 ${
                !selectedCategory
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : "hover:bg-blue-50 text-gray-700"
              }`}
            >
              All Products
            </button>
          ) : (
            <Link
              href={pathname}
              className={`block p-3 rounded-xl transition-all duration-200 ${
                !selectedCategory
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : "hover:bg-blue-50 text-gray-700"
              }`}
            >
              All Products
            </Link>
          )}
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            {onCategoryChange ? (
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`block w-full text-left p-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                {category.name}
              </button>
            ) : (
              <Link
                href={`${pathname}?${createQueryString("category", category.id)}`}
                className={`block p-3 rounded-xl transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                {category.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
