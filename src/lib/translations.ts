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
        const testTranslation = tolgeeTranslate('navigation.home')
        console.log('Tolgee API test translation:', testTranslation)
        
        // Only mark API as unavailable if we get an error or undefined
        // Don't mark as unavailable just because it returns the key
        if (testTranslation === undefined || testTranslation === null) {
          console.warn('Tolgee API test returned null/undefined, using static fallback')
          setIsApiAvailable(false)
        } else {
          console.log('Tolgee API is available')
          setIsApiAvailable(true)
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
      // Always try static translations first for reliability
      const staticData = staticTranslations[currentLanguage as keyof typeof staticTranslations] || staticTranslations.en
      const staticTranslation = getNestedTranslation(staticData, key)
      
      if (staticTranslation) {
        // Simple parameter replacement for static translations
        if (params) {
          return Object.keys(params).reduce((text, paramKey) => {
            return text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(params[paramKey]))
          }, staticTranslation)
        }
        return staticTranslation
      }

      // If static translation not found, try Tolgee API as fallback
      if (isApiAvailable) {
        const apiTranslation = tolgeeTranslate(key, params)
        
        // If we get a valid translation (not just the key back), use it
        if (apiTranslation && apiTranslation !== key) {
          return apiTranslation
        }
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

// Helper function to get unit names with translation support
export function getUnitName(unit: string, language: string = 'en'): string {
  if (!unit) return ''
  
  // Unit translation mapping
  const unitTranslations: Record<string, Record<string, string>> = {
    // Weight units
    'g': { en: 'g', fr: 'g', es: 'g', de: 'g' },
    'kg': { en: 'kg', fr: 'kg', es: 'kg', de: 'kg' },
    'lb': { en: 'lb', fr: 'lb', es: 'lb', de: 'Pfund' },
    'oz': { en: 'oz', fr: 'oz', es: 'oz', de: 'Unze' },
    
    // Volume units
    'ml': { en: 'ml', fr: 'ml', es: 'ml', de: 'ml' },
    'l': { en: 'l', fr: 'l', es: 'l', de: 'l' },
    'liter': { en: 'liter', fr: 'litre', es: 'litro', de: 'Liter' },
    'cup': { en: 'cup', fr: 'tasse', es: 'taza', de: 'Tasse' },
    'cups': { en: 'cups', fr: 'tasses', es: 'tazas', de: 'Tassen' },
    'tbsp': { en: 'tbsp', fr: 'c. à s.', es: 'cda', de: 'EL' },
    'tsp': { en: 'tsp', fr: 'c. à c.', es: 'cdta', de: 'TL' },
    
    // Count units
    'piece': { en: 'piece', fr: 'pièce', es: 'pieza', de: 'Stück' },
    'pieces': { en: 'pieces', fr: 'pièces', es: 'piezas', de: 'Stück' },
    'clove': { en: 'clove', fr: 'gousse', es: 'diente', de: 'Zehe' },
    'cloves': { en: 'cloves', fr: 'gousses', es: 'dientes', de: 'Zehen' },
  }
  
  const normalizedUnit = unit.toLowerCase().trim()
  const translations = unitTranslations[normalizedUnit]
  
  if (translations && translations[language]) {
    return translations[language]
  }
  
  // Return original unit if no translation found
  return unit
}

// Export the original hook as well for backward compatibility
export { useTolgeeTranslate as useTranslate }