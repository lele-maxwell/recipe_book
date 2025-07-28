'use client'

import { SessionProvider } from 'next-auth/react'
import { TolgeeProvider, tolgee } from '@/lib/tolgee'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <TolgeeProvider tolgee={tolgee}>
        {children}
      </TolgeeProvider>
    </SessionProvider>
  )
}