import { supabase } from "@/app/supabaseClient"

// Function to get redirect URL based on user role
export function getRedirectUrlByRole(userRole: string | null): string {
  switch (userRole) {
    case 'admin':
      return '/admin/dashboard'
    case 'vendor':
      // Could add vendor dashboard later
      return '/cart'
    case 'customer':
    default:
      return '/cart'
  }
}

// Function to fetch user role from profiles table
async function getUserRoleFromDatabase(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return 'customer' // Default to customer role
    }

    return data?.role || 'customer'
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return 'customer'
  }
}

// Function to wait for user role to be loaded and then redirect
export async function redirectBasedOnRole(router: any, maxWaitTime = 3000) {
  const startTime = Date.now()
  
  const checkUserRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const userRole = await getUserRoleFromDatabase(session.user.id)
        const redirectUrl = getRedirectUrlByRole(userRole)
        router.push(redirectUrl)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error checking user role:', error)
      router.push('/cart') // Fallback to cart
      return true
    }
  }

  // Try to get user role immediately
  if (await checkUserRole()) {
    return
  }

  // If no session found, wait a bit for auth state to update
  const intervalId = setInterval(async () => {
    if (Date.now() - startTime > maxWaitTime) {
      clearInterval(intervalId)
      router.push('/cart') // Timeout fallback
      return
    }

    if (await checkUserRole()) {
      clearInterval(intervalId)
    }
  }, 100)
}