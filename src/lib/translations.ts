'use client'

import { useTranslate as useTolgeeTranslate, useTolgee } from '@tolgee/react'
import { useEffect, useState } from 'react'

// Import static translations as fallback
import enTranslations from '../locales/en.json'
import frTranslations from '../locales/fr.json'
import esTranslations from '../locales/es.json'
import deTranslations from '../locales/de.json'

const staticTranslations = {
  en: enTranslations,
  fr: frTranslations,
  es: esTranslations,
  de: deTranslations,
}

type TranslationKey = string
type TranslationParams = Record<string, string | number>

export function useTranslateWithFallback() {
  const { t: tolgeeTranslate } = useTolgeeTranslate()
  const tolgee = useTolgee()
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isApiAvailable, setIsApiAvailable] = useState(true)

  useEffect(() => {
    // Get current language
    setCurrentLanguage(tolgee.getLanguage() || 'en')

    // Check if API is available by testing a translation
    const checkApiAvailability = async () => {
      try {
        // Try to get a simple translation from API
        const testTranslation = tolgeeTranslate('common.loading')
        if (!testTranslation || testTranslation === 'common.loading') {
          // If translation is not found or returns the key, API might not be working
          setIsApiAvailable(false)
        }
      } catch (error) {
        console.warn('Tolgee API not available, using static fallback:', error)
        setIsApiAvailable(false)
      }
    }

    checkApiAvailability()

    // Listen for language changes if available
    const handleLanguageChange = () => {
      setCurrentLanguage(tolgee.getLanguage() || 'en')
    }

    // Add event listener for language changes
    if (typeof window !== 'undefined') {
      window.addEventListener('tolgee:languageChanged', handleLanguageChange)
      return () => {
        window.removeEventListener('tolgee:languageChanged', handleLanguageChange)
      }
    }
  }, [tolgee, tolgeeTranslate])

  const translate = (key: TranslationKey, params?: TranslationParams): string => {
    try {
      // First, try to get translation from Tolgee API
      if (isApiAvailable) {
        const apiTranslation = tolgeeTranslate(key, params)
        
        // If we get a valid translation (not just the key back), use it
        if (apiTranslation && apiTranslation !== key) {
          return apiTranslation
        }
      }

      // Fallback to static translations
      const staticData = staticTranslations[currentLanguage as keyof typeof staticTranslations] || staticTranslations.en
      const translation = getNestedTranslation(staticData, key)
      
      if (translation) {
        // Simple parameter replacement for static translations
        if (params) {
          return Object.keys(params).reduce((text, paramKey) => {
            return text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(params[paramKey]))
          }, translation)
        }
        return translation
      }

      // If no translation found anywhere, return the key
      console.warn(`Translation not found for key: ${key}`)
      return key
    } catch (error) {
      console.error('Translation error:', error)
      return key
    }
  }

  return { t: translate, language: currentLanguage, isApiAvailable }
}

// Helper function to get nested translation from static data
function getNestedTranslation(obj: Record<string, unknown>, key: string): string | null {
  const keys = key.split('.')
  let current: unknown = obj

  for (const k of keys) {
    if (current && typeof current === 'object' && current !== null && k in current) {
      current = (current as Record<string, unknown>)[k]
    } else {
      return null
    }
  }

  return typeof current === 'string' ? current : null
}

// Export the original hook as well for backward compatibility
export { useTolgeeTranslate as useTranslate }