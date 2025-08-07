'use client'

import { useSession } from 'next-auth/react'

interface ExtendedSession {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function useAuth() {
  const { data: session, status } = useSession() as { 
    data: ExtendedSession | null
    status: 'loading' | 'authenticated' | 'unauthenticated'
  }

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user
  }
} 