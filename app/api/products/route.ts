import { NextResponse } from "next/server"
import { getProducts, addProduct } from "@/app/api/apis"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category")

    const products = await getProducts(categoryId || undefined)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json()
    
    if (!productData.name || !productData.price_cents || !productData.category_id) {
      return NextResponse.json({ 
        error: "Name, price_cents, and category_id are required" 
      }, { status: 400 })
    }
    
    const product = await addProduct(productData)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
