'use client'

import { SessionProvider } from 'next-auth/react'
import { TolgeeProvider, tolgee } from '@/lib/tolgee'
import { RecipeProvider } from '../contexts/RecipeContext'
import ErrorBoundary from './ErrorBoundary'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <TolgeeProvider tolgee={tolgee}>
          <RecipeProvider>
            {children}
          </RecipeProvider>
        </TolgeeProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}