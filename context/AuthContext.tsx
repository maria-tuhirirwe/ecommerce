"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase, isSupabaseConfigured } from "@/app/supabaseClient"
import { signInWithEmail, signOut } from "@/app/services/auth"
import { getRedirectUrlByRole } from "@/lib/auth-utils"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAdmin: boolean
  userRole: string | null
  getRedirectPath: () => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  const isAdmin = userRole === 'admin' || user?.email === "admin@vitalelectronics.ug" || user?.email?.endsWith("@vitalelectronics.ug") || false

  // Cache for user roles to prevent repeated fetches
  const roleCache = React.useRef<Record<string, string>>({})

  // Function to fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    // Check cache first
    if (roleCache.current[userId]) {
      setUserRole(roleCache.current[userId])
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        const defaultRole = 'customer'
        roleCache.current[userId] = defaultRole
        setUserRole(defaultRole)
        return
      }

      const role = data?.role || 'customer'
      roleCache.current[userId] = role
      setUserRole(role)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      const defaultRole = 'customer'
      roleCache.current[userId] = defaultRole
      setUserRole(defaultRole)
    }
  }

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setUser(null)
      setLoading(false)
      return
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserRole(null)
      }
      
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserRole(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmail(email, password)
  }

  const logout = async () => {
    await signOut()
  }

  const getRedirectPath = () => {
    return getRedirectUrlByRole(userRole)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin,
    userRole,
    getRedirectPath,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
