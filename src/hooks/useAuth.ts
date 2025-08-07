'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface UseAuthReturn {
  user: any
  isAuthenticated: boolean
  isLoading: boolean
  signInUser: (credentials: { email: string; password: string }) => Promise<void>
  signOutUser: () => Promise<void>
  requireAuth: (redirectTo?: string) => boolean
  isOwner: (userId: string) => boolean
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const user = session?.user

  const signInUser = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      throw error
    }
  }, [])

  const signOutUser = useCallback(async () => {
    try {
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [router])

  const requireAuth = useCallback((redirectTo = '/auth/signin') => {
    if (!isAuthenticated && !isLoading) {
      router.push(redirectTo)
      return false
    }
    return true
  }, [isAuthenticated, isLoading, router])

  const isOwner = useCallback((userId: string) => {
    return user?.id === userId
  }, [user])

  return {
    user,
    isAuthenticated,
    isLoading,
    signInUser,
    signOutUser,
    requireAuth,
    isOwner
  }
} 