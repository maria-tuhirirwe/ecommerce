import { getCategories, getProducts } from "@/lib/api"
import ProductGrid from "@/components/ProductGrid"
import CategoryFilter from "@/components/CategoryFilter"
import { Suspense } from "react"
import ProductsLoading from "@/components/ProductsLoading"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const categories = await getCategories()
  const categoryId = searchParams.category

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Shop All Electronics
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <CategoryFilter categories={categories} selectedCategory={categoryId} />
          </div>

          <div className="w-full md:w-3/4">
            <Suspense fallback={<ProductsLoading />}>
              <ProductList categoryId={categoryId} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

async function ProductList({ categoryId }: { categoryId?: string }) {
  const products = await getProducts(categoryId)

  return <ProductGrid products={products} />
}
