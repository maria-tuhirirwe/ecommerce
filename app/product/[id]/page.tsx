import { getProductById, getRelatedProducts } from "@/app/api/apis"
import { formatUGX } from "@/lib/api"
import { notFound } from "next/navigation"
import Image from "next/image"
import AddToCartButton from "@/components/AddToCartButton"
import BargainSection from "@/components/BargainSection"
import ProductCard from "@/components/ProductCard"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-[500px] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={(product.images && product.images[0]) || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {product.categoryName}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
              <p className="text-3xl font-bold mb-6 text-blue-600">{formatUGX(product.price_cents)}</p>

              {/* {product.description && ( */}
                <div className="mb-8">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              {/* )} */}

              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">Stock: {product.stock} available</p>
              </div>

              {/* Add to Cart Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Buy at Listed Price</h3>
                <AddToCartButton product={product} />
              </div>

              {/* Bargain Section */}
              <div className="border-t border-gray-200 pt-6">
                <BargainSection product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
