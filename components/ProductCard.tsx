import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { formatUGX } from "@/lib/api"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={(product.images && product.images[0]) || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.categoryName}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-bold text-xl text-blue-600">{formatUGX(product.price_cents)}</p>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
