'use client'

import { TolgeeProvider, DevTools, Tolgee, FormatSimple } from '@tolgee/react'

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    language: 'en',
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    availableLanguages: ['en', 'fr', 'es', 'de'],
    staticData: {
      en: () => import('../locales/en.json').then(m => m.default),
      fr: () => import('../locales/fr.json').then(m => m.default),
      es: () => import('../locales/es.json').then(m => m.default),
      de: () => import('../locales/de.json').then(m => m.default),
    },
  })

export { tolgee, TolgeeProvider }