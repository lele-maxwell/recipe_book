'use client'

import { TolgeeProvider, DevTools, Tolgee, FormatSimple } from '@tolgee/react'

// Static data as fallback
const staticData = {
  en: () => import('../locales/en.json').then(m => m.default),
  fr: () => import('../locales/fr.json').then(m => m.default),
  es: () => import('../locales/es.json').then(m => m.default),
  de: () => import('../locales/de.json').then(m => m.default),
}

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    language: 'en',
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    availableLanguages: ['en', 'fr', 'es', 'de'],
    
    // Try Tolgee API first, fallback to static data
    apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
    apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL,
    
    // Static data as fallback when API fails
    staticData: staticData,
    
    // Enable language persistence
    observerOptions: {
      fullKeyEncode: true,
    },
  })

export { tolgee, TolgeeProvider }