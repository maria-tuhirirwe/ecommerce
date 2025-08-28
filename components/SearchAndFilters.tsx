"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { formatUGX } from "@/lib/api"
import type { Product } from "@/lib/types"

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  sortBy: string
  onSortChange: (sort: string) => void
  products: Product[]
  resultCount: number
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  products,
  resultCount
}: SearchAndFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [localMinPrice, setLocalMinPrice] = useState(priceRange[0])
  const [localMaxPrice, setLocalMaxPrice] = useState(priceRange[1])

  // Calculate price bounds from products
  const productPrices = products.map(p => p.price_cents)
  const minAvailablePrice = productPrices.length > 0 ? Math.min(...productPrices) : 0
  const maxAvailablePrice = productPrices.length > 0 ? Math.max(...productPrices) : 1000000

  const handlePriceFilter = () => {
    onPriceRangeChange([localMinPrice, localMaxPrice])
  }

  const clearFilters = () => {
    onSearchChange("")
    onPriceRangeChange([minAvailablePrice, maxAvailablePrice])
    setLocalMinPrice(minAvailablePrice)
    setLocalMaxPrice(maxAvailablePrice)
    onSortChange("name")
  }

  const hasActiveFilters = searchTerm || 
    priceRange[0] !== minAvailablePrice || 
    priceRange[1] !== maxAvailablePrice ||
    sortBy !== "name"

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {resultCount} products found
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Sort */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>

          {showAdvanced && (
            <>
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Min</label>
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(Number(e.target.value) || 0)}
                        min={minAvailablePrice}
                        max={maxAvailablePrice}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Max</label>
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(Number(e.target.value) || maxAvailablePrice)}
                        min={minAvailablePrice}
                        max={maxAvailablePrice}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Range: {formatUGX(minAvailablePrice)} - {formatUGX(maxAvailablePrice)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePriceFilter}
                    className="w-full"
                  >
                    Apply Price Filter
                  </Button>
                  {(priceRange[0] !== minAvailablePrice || priceRange[1] !== maxAvailablePrice) && (
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {formatUGX(priceRange[0])} - {formatUGX(priceRange[1])}
                        <button
                          onClick={() => {
                            onPriceRangeChange([minAvailablePrice, maxAvailablePrice])
                            setLocalMinPrice(minAvailablePrice)
                            setLocalMaxPrice(maxAvailablePrice)
                          }}
                          className="ml-1 text-muted-foreground hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Active Filters */}
          {(searchTerm || sortBy !== "name") && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Active Filters:</div>
              <div className="flex gap-1 flex-wrap">
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => onSearchChange("")}
                      className="ml-1 text-muted-foreground hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {sortBy !== "name" && (
                  <Badge variant="secondary" className="text-xs">
                    Sort: {sortBy === "price-low" ? "Price Low-High" : sortBy === "price-high" ? "Price High-Low" : sortBy}
                    <button
                      onClick={() => onSortChange("name")}
                      className="ml-1 text-muted-foreground hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}