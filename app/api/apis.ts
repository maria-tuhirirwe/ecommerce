
import { supabase, isSupabaseConfigured } from "@/app/supabaseClient";
import { 
  getSupabaseCategories as getCategories, 
  addSupabaseCategory,
  deleteSupabaseCategory,
  getSupabaseProducts,
  addSupabaseProduct,
  deleteSupabaseProduct,
  addToCart,
  removeFromCart,
  getCartItems
} from "@/lib/supabase-api";

// Re-export main API functions
export { getCategories, getSupabaseProducts as getProducts, addToCart, removeFromCart, getCartItems };

export async function addCategory(name: string) {
  return await addSupabaseCategory(name);
}

export async function addProduct(product: { name: string; slug: string; description?: string; price_cents: number; stock?: number; images?: string[]; active?: boolean; category_id: number }) {
  return await addSupabaseProduct(product);
}

export async function updateCategory(id: number, name: string) {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }
  
  const { error } = await supabase.from("categories").update({ name }).eq("id", id);
  if (error) throw error;
}

export async function updateProduct(
  id: number,
  updates: { name?: string; slug?: string; description?: string; price_cents?: number; stock?: number; images?: string[]; active?: boolean; category_id?: number }
) {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }
  
  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: number) {
  return await deleteSupabaseCategory(id);
}

export async function deleteProduct(id: number) {
  return await deleteSupabaseProduct(id);
}

export async function getProductById(id: string) {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }
  
  const { data, error } = await supabase
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
    .eq('id', data.category_id)
    .single()
  
  return {
    id: data.id.toString(),
    name: data.name,
    slug: data.slug,
    price_cents: data.price_cents,
    stock: data.stock,
    images: data.images,
    description: data.description,
    active: data.active,
    categoryId: data.category_id.toString(),
    categoryName: category?.name || 'Unknown',
    created_at: data.created_at,
    updated_at: data.updated_at
  }
}

export async function getRelatedProducts(categoryId: string, excludeId?: string) {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }
  
  let query = supabase
    .from('products')
    .select('id, name, slug, description, price_cents, stock, images, active, category_id, created_at, updated_at')
    .eq('category_id', parseInt(categoryId))
    .order('created_at', { ascending: false })
    .limit(4)
  
  if (excludeId) {
    query = query.neq('id', parseInt(excludeId))
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  // Get category names
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
  
  const categoryMap = new Map(categories?.map(cat => [cat.id, cat.name]) || [])
  
  return (data || []).map(product => ({
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    price_cents: product.price_cents,
    stock: product.stock,
    images: product.images,
    description: product.description,
    active: product.active,
    categoryId: product.category_id.toString(),
    categoryName: categoryMap.get(product.category_id) || 'Unknown',
    created_at: product.created_at,
    updated_at: product.updated_at
  }))
}
