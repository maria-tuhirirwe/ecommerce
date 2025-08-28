"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CategoryCard from "@/components/CategoryCard"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"

interface CategoryCarouselProps {
  categories: Category[]
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)
  
  // Show 4 categories per page (2 rows × 2 columns)
  const itemsPerPage = 4
  const totalPages = Math.ceil(categories.length / itemsPerPage)
  
  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage
    return categories.slice(startIndex, startIndex + itemsPerPage)
  }

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No categories available at the moment.</p>
      </div>
    )
  }

  // If there are 4 or fewer categories, show them all without carousel
  if (categories.length <= itemsPerPage) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={totalPages <= 1}
          className="rounded-full p-2 h-10 w-10 shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={totalPages <= 1}
          className="rounded-full p-2 h-10 w-10 shadow-md hover:shadow-lg transition-shadow"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Category Cards in 2 Rows */}
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          <div className="flex">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-2 gap-6">
                  {categories
                    .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                    .map((category) => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Indicator */}
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          {currentPage + 1} of {totalPages}
        </div>
      )}
    </div>
  )
}