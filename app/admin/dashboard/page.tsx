"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getCategories, addCategory, deleteCategory, getProducts, addProduct, deleteProduct, updateCategory, updateProduct } from "@/app/api/apis"
import { Plus, Edit, Trash2, Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react"
import { formatUGX } from "@/lib/api"
import { supabase } from "@/app/supabaseClient"

import type { Category, Product } from "@/lib/types"

export default function AdminDashboard() {
  const { user, userRole, isAdmin, loading } = useAuth()
  const router = useRouter()
  
  // States for data
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  
  // States for forms
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
    description: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Check if user is admin and load data
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }
      
      if (userRole === null) {
        // Still determining user role, wait a bit more
        return
      }
      
      if (!isAdmin) {
        // Redirect non-admin users to cart
        router.push('/cart')
        return
      }
      
      // User is admin, load data
      loadData()
    }
  }, [user, isAdmin, userRole, loading, router])

  const loadData = async () => {
    try {
      setLoadingData(true)
      
      // Load categories and products using our API functions
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ])

      setCategories(categoriesData || [])
      setProducts(productsData || [])
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to load data")
    } finally {
      setLoadingData(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      setSubmitting(true)
      
      await addCategory(newCategoryName.trim())

      setNewCategoryName("")
      await loadData() // Reload data
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to add category")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.category_id || !newProduct.stock) return

    try {
      setSubmitting(true)
      
      await addProduct({
        name: newProduct.name.trim(),
        slug: newProduct.name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: newProduct.description.trim() || undefined,
        price_cents: Number(newProduct.price),
        stock: Number(newProduct.stock),
        images: newProduct.image_url.trim() ? [newProduct.image_url.trim()] : undefined,
        category_id: Number(newProduct.category_id)
      })

      setNewProduct({
        name: "",
        price: "",
        stock: "",
        image_url: "",
        category_id: "",
        description: ""
      })
      await loadData() // Reload data
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to add product")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      await deleteCategory(Number(id))
      await loadData()
    } catch (err: any) {
      setError(err.message || "Failed to delete category")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      await deleteProduct(Number(id))
      await loadData()
    } catch (err: any) {
      setError(err.message || "Failed to delete product")
    }
  }

  // Helper function to get public URL from storage path
  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }

  // Upload images function from error.md
  const uploadProductImages = async (files: File[]) => {
    const uploadedPaths: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      uploadedPaths.push(data.path);
    }

    return uploadedPaths;
  }

  const handleImageUpload = async (file: File, isEdit = false) => {
    if (!file) return

    try {
      setUploadingImage(true)
      
      // Upload the file using the function from error.md
      const uploadedPaths = await uploadProductImages([file])
      
      if (uploadedPaths.length === 0) {
        throw new Error("Failed to upload image")
      }

      // Get public URL for the uploaded image
      const publicUrl = getPublicUrl(uploadedPaths[0])

      if (isEdit && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          images: [publicUrl]
        })
      } else {
        setNewProduct({
          ...newProduct,
          image_url: publicUrl
        })
      }

      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct({
      ...product,
      price_cents: product.price_cents,
      images: product.images || []
    })
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      setSubmitting(true)
      
      await updateProduct(Number(editingProduct.id), {
        name: editingProduct.name,
        slug: editingProduct.name.toLowerCase().replace(/\s+/g, '-'),
        description: editingProduct.description || undefined,
        price_cents: editingProduct.price_cents,
        stock: editingProduct.stock,
        images: editingProduct.images,
        category_id: Number(editingProduct.categoryId)
      })

      setEditingProduct(null)
      await loadData()
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to update product")
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate totals
  const totalProducts = products.length
  const totalCategories = categories.length
  const totalValue = products.reduce((sum, product) => sum + product.price_cents, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (userRole === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect to cart
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your e-commerce platform</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loadingData && (
          <div className="mb-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCategories}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatUGX(totalValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Product Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalProducts > 0 ? formatUGX(totalValue / totalProducts) : formatUGX(0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Create a new product category</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" disabled={submitting || !newCategoryName.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        {submitting ? "Adding..." : "Add Category"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories ({categories.length})</CardTitle>
                <CardDescription>Manage your product categories</CardDescription>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No categories found. Add your first category above.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div key={category.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{category.name}</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          ID: {category.id} • Products: {products.filter(p => p.categoryId === category.id).length}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Add a new product to your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productPrice">Price (UGX)</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="Enter price in UGX"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productStock">Stock Quantity</Label>
                      <Input
                        id="productStock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        placeholder="Enter stock quantity"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productCategory">Category</Label>
                      <select
                        id="productCategory"
                        value={newProduct.category_id}
                        onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
                        required
                        disabled={submitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="productImage">Product Image</Label>
                      <div className="space-y-2">
                        <input
                          id="productImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, false)
                          }}
                          disabled={submitting || uploadingImage}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {uploadingImage && (
                          <p className="text-sm text-blue-600">Uploading image...</p>
                        )}
                        {newProduct.image_url && (
                          <div className="mt-2">
                            <img 
                              src={newProduct.image_url} 
                              alt="Product preview" 
                              className="w-20 h-20 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Enter product description (optional)"
                      disabled={submitting}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" disabled={submitting || !newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category_id}>
                    <Plus className="h-4 w-4 mr-2" />
                    {submitting ? "Adding..." : "Add Product"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {editingProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Product</CardTitle>
                  <CardDescription>Update product information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="editProductName">Product Name</Label>
                        <Input
                          id="editProductName"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                          placeholder="Enter product name"
                          required
                          disabled={submitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editProductPrice">Price (UGX)</Label>
                        <Input
                          id="editProductPrice"
                          type="number"
                          value={editingProduct.price_cents}
                          onChange={(e) => setEditingProduct({...editingProduct, price_cents: Number(e.target.value)})}
                          placeholder="Enter price in UGX"
                          required
                          disabled={submitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editProductStock">Stock Quantity</Label>
                        <Input
                          id="editProductStock"
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                          placeholder="Enter stock quantity"
                          required
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="editProductCategory">Category</Label>
                        <select
                          id="editProductCategory"
                          value={editingProduct.categoryId}
                          onChange={(e) => setEditingProduct({...editingProduct, categoryId: e.target.value})}
                          required
                          disabled={submitting}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="editProductImage">Product Image</Label>
                        <div className="space-y-2">
                          <input
                            id="editProductImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file, true)
                            }}
                            disabled={submitting || uploadingImage}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {uploadingImage && (
                            <p className="text-sm text-blue-600">Uploading image...</p>
                          )}
                          {editingProduct.images && editingProduct.images[0] && (
                            <div className="mt-2">
                              <img 
                                src={editingProduct.images[0]} 
                                alt="Product preview" 
                                className="w-20 h-20 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="editProductDescription">Description</Label>
                      <Textarea
                        id="editProductDescription"
                        value={editingProduct.description || ""}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        placeholder="Enter product description (optional)"
                        disabled={submitting}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Updating..." : "Update Product"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingProduct(null)}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Products ({products.length})</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products found. Add your first product above.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => {
                      const category = categories.find(c => c.id === product.categoryId)
                      return (
                        <div key={product.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold truncate pr-2">{product.name}</h3>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditProduct(product)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {product.images && product.images[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-32 object-cover rounded mb-2"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          )}
                          
                          <div className="space-y-1">
                            <p className="text-lg font-semibold text-green-600">{formatUGX(product.price_cents)}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {category?.name || 'Unknown Category'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Stock: {product.stock} • Status: {product.active ? 'Active' : 'Inactive'}</p>
                            <p className="text-xs text-gray-400">ID: {product.id}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}