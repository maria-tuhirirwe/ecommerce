import { supabase, isSupabaseConfigured } from "@/app/supabaseClient"
import type { Category, Product } from "./types"

// Cart item interface
interface CartItem {
  id: number
  user_id: string
  product_id: number
  qty: number
  price_cents_at_add: number
  products?: {
    name: string
    images?: string[]
    price_cents: number
  }
}

// Supabase-specific types
interface SupabaseCategory {
  id: number
  name: string
  created_at: string
}

interface SupabaseProduct {
  id: number
  name: string
  slug: string
  description?: string
  price_cents: number
  stock: number
  images?: string[]
  active: boolean
  category_id: number
  created_at: string
  updated_at: string
}

// Category operations
export async function getSupabaseCategories(): Promise<Category[]> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (categories || []).map(category => ({
    id: category.id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    created_at: category.created_at
  }))
}

export async function addSupabaseCategory(name: string): Promise<SupabaseCategory> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSupabaseCategory(id: number): Promise<void> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Product operations
export async function getSupabaseProducts(categoryId?: string): Promise<Product[]> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  let query = supabase
    .from('products')
    .select('id, name, slug, description, price_cents, stock, images, active, category_id, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (categoryId) {
    query = query.eq('category_id', parseInt(categoryId))
  }

  const { data: products, error: productsError } = await query

  if (productsError) throw productsError

  // Get categories to map category names
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')

  const categoryMap = new Map(categories?.map(cat => [cat.id, cat.name]) || [])

  return (products || []).map(product => ({
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price_cents: product.price_cents,
    stock: product.stock,
    images: product.images,
    active: product.active,
    categoryId: product.category_id?.toString() || 'uncategorized',
    categoryName: categoryMap.get(product.category_id) || 'Uncategorized',
    created_at: product.created_at,
    updated_at: product.updated_at
  }))
}

export async function addSupabaseProduct(productData: {
  name: string
  slug: string
  description?: string
  price_cents: number
  stock?: number
  images?: string[]
  active?: boolean
  category_id: number
}): Promise<SupabaseProduct> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: productData.name,
      slug: productData.slug,
      description: productData.description || null,
      price_cents: productData.price_cents,
      stock: productData.stock || 0,
      images: productData.images || null,
      active: productData.active !== undefined ? productData.active : true,
      category_id: productData.category_id
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSupabaseProduct(id: number): Promise<void> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getSupabaseProductById(id: string): Promise<Product | null> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('id, name, slug, description, price_cents, stock, images, active, category_id, created_at, updated_at')
    .eq('id', parseInt(id))
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }

  // Get category name
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('id', product.category_id)
    .single()

  return {
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price_cents: product.price_cents,
    stock: product.stock,
    images: product.images,
    active: product.active,
    categoryId: product.category_id?.toString() || 'uncategorized',
    categoryName: category?.name || 'Unknown',
    created_at: product.created_at,
    updated_at: product.updated_at
  }
}

// Statistics
export async function getSupabaseStats() {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from('categories').select('id', { count: 'exact' }),
    supabase.from('products').select('id, price_cents', { count: 'exact' })
  ])

  if (categoriesResult.error) throw categoriesResult.error
  if (productsResult.error) throw productsResult.error

  const totalValue = productsResult.data?.reduce((sum, product) => sum + product.price_cents, 0) || 0

  return {
    totalCategories: categoriesResult.count || 0,
    totalProducts: productsResult.count || 0,
    totalValue,
    averagePrice: productsResult.count ? totalValue / productsResult.count : 0
  }
}

// Cart operations
export async function addToCart(userId: string, productId: number, qty: number, priceCents: number) {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  // Try to insert first, if it fails due to duplicate, then update
  const { data: insertData, error: insertError } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      product_id: productId,
      qty,
      price_cents_at_add: priceCents
    })
    .select();

  if (insertError) {
    // Check if it's a duplicate key error (item already exists)
    if (insertError.code === '23505' || insertError.message?.includes('duplicate') || insertError.message?.includes('unique constraint')) {
      console.log('Item exists in cart, updating quantity');
      
      // Item already exists, update quantity by adding to existing
      const { data: updateData, error: updateError } = await supabase
        .from('cart_items')
        .update({ qty: supabase.rpc('increment', { x: qty }) })
        .eq('user_id', userId)
        .eq('product_id', productId)
        .select();

      if (updateError) {
        // If RPC doesn't work, try manual approach
        console.log('RPC failed, trying manual update');
        
        const { data: existingItem, error: checkError } = await supabase
          .from('cart_items')
          .select('id, qty')
          .eq('user_id', userId)
          .eq('product_id', productId)
          .single();

        if (checkError) {
          console.error('Error checking existing cart item:', checkError);
          return null;
        }

        const { data: manualUpdateData, error: manualUpdateError } = await supabase
          .from('cart_items')
          .update({ qty: existingItem.qty + qty })
          .eq('id', existingItem.id)
          .select();

        if (manualUpdateError) {
          console.error('Cart manual update error:', manualUpdateError);
          return null;
        }
        return manualUpdateData;
      }
      return updateData;
    } else {
      console.error('Cart insert error:', insertError);
      return null;
    }
  }

  return insertData;
}

export async function removeFromCart(userId: string, productId: number) {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) console.error('Cart remove error:', error);
}

export async function getCartItems(userId: string): Promise<CartItem[]> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  // First get cart items
  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('id, user_id, product_id, qty, price_cents_at_add')
    .eq('user_id', userId);

  if (cartError) {
    console.error('Fetch cart items error:', cartError);
    return [];
  }

  if (!cartItems || cartItems.length === 0) {
    return [];
  }

  // Get product IDs from cart items
  const productIds = cartItems.map(item => item.product_id);

  // Fetch product details separately
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, images, price_cents')
    .in('id', productIds);

  if (productsError) {
    console.error('Fetch products error:', productsError);
    return [];
  }

  // Combine cart items with product data
  const combinedData = cartItems.map(cartItem => {
    const product = products?.find(p => p.id === cartItem.product_id);
    return {
      id: cartItem.id,
      user_id: cartItem.user_id,
      product_id: cartItem.product_id,
      qty: cartItem.qty,
      price_cents_at_add: cartItem.price_cents_at_add,
      products: product
    };
  });

  return combinedData;
}