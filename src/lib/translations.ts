import { IngredientWithTranslations } from '@/types/recipe'

/**
 * Get the translated name of an ingredient based on the current locale
 */
export function getIngredientName(
  ingredient: IngredientWithTranslations,
  locale: string = 'en'
): string {
  // First, try to find a translation for the requested locale
  const translation = ingredient.translations?.find(t => t.locale === locale)
  if (translation) {
    return translation.name
  }

  // If no translation found, try English as fallback
  if (locale !== 'en') {
    const englishTranslation = ingredient.translations?.find(t => t.locale === 'en')
    if (englishTranslation) {
      return englishTranslation.name
    }
  }

  // If no translations available, return the original name
  return ingredient.name
}

/**
 * Get the translated unit name based on the current locale
 */
export function getUnitName(unit: string, locale: string = 'en'): string {
  // This would typically use the translation system
  // For now, we'll use a simple mapping
  const unitTranslations: Record<string, Record<string, string>> = {
    en: {
      cups: 'cups',
      tablespoons: 'tablespoons',
      teaspoons: 'teaspoons',
      grams: 'grams',
      kilograms: 'kilograms',
      ounces: 'ounces',
      pounds: 'pounds',
      milliliters: 'milliliters',
      liters: 'liters',
      pieces: 'pieces',
      cloves: 'cloves',
      slices: 'slices',
      pinch: 'pinch',
      dash: 'dash',
    },
    fr: {
      cups: 'tasses',
      tablespoons: 'cuillères à soupe',
      teaspoons: 'cuillères à café',
      grams: 'grammes',
      kilograms: 'kilogrammes',
      ounces: 'onces',
      pounds: 'livres',
      milliliters: 'millilitres',
      liters: 'litres',
      pieces: 'pièces',
      cloves: 'gousses',
      slices: 'tranches',
      pinch: 'pincée',
      dash: 'trait',
    },
    es: {
      cups: 'tazas',
      tablespoons: 'cucharadas',
      teaspoons: 'cucharaditas',
      grams: 'gramos',
      kilograms: 'kilogramos',
      ounces: 'onzas',
      pounds: 'libras',
      milliliters: 'mililitros',
      liters: 'litros',
      pieces: 'piezas',
      cloves: 'dientes',
      slices: 'rebanadas',
      pinch: 'pizca',
      dash: 'chorrito',
    },
    de: {
      cups: 'Tassen',
      tablespoons: 'Esslöffel',
      teaspoons: 'Teelöffel',
      grams: 'Gramm',
      kilograms: 'Kilogramm',
      ounces: 'Unzen',
      pounds: 'Pfund',
      milliliters: 'Milliliter',
      liters: 'Liter',
      pieces: 'Stücke',
      cloves: 'Zehen',
      slices: 'Scheiben',
      pinch: 'Prise',
      dash: 'Spritzer',
    },
  }

  return unitTranslations[locale]?.[unit] || unitTranslations.en[unit] || unit
}

/**
 * Seed some common ingredient translations
 */
export const commonIngredientTranslations = {
  flour: {
    en: 'Flour',
    fr: 'Farine',
    es: 'Harina',
    de: 'Mehl',
  },
  sugar: {
    en: 'Sugar',
    fr: 'Sucre',
    es: 'Azúcar',
    de: 'Zucker',
  },
  salt: {
    en: 'Salt',
    fr: 'Sel',
    es: 'Sal',
    de: 'Salz',
  },
  pepper: {
    en: 'Pepper',
    fr: 'Poivre',
    es: 'Pimienta',
    de: 'Pfeffer',
  },
  butter: {
    en: 'Butter',
    fr: 'Beurre',
    es: 'Mantequilla',
    de: 'Butter',
  },
  eggs: {
    en: 'Eggs',
    fr: 'Œufs',
    es: 'Huevos',
    de: 'Eier',
  },
  milk: {
    en: 'Milk',
    fr: 'Lait',
    es: 'Leche',
    de: 'Milch',
  },
  onion: {
    en: 'Onion',
    fr: 'Oignon',
    es: 'Cebolla',
    de: 'Zwiebel',
  },
  garlic: {
    en: 'Garlic',
    fr: 'Ail',
    es: 'Ajo',
    de: 'Knoblauch',
  },
  tomato: {
    en: 'Tomato',
    fr: 'Tomate',
    es: 'Tomate',
    de: 'Tomate',
  },
  chicken: {
    en: 'Chicken',
    fr: 'Poulet',
    es: 'Pollo',
    de: 'Hähnchen',
  },
  beef: {
    en: 'Beef',
    fr: 'Bœuf',
    es: 'Carne de res',
    de: 'Rindfleisch',
  },
  rice: {
    en: 'Rice',
    fr: 'Riz',
    es: 'Arroz',
    de: 'Reis',
  },
  pasta: {
    en: 'Pasta',
    fr: 'Pâtes',
    es: 'Pasta',
    de: 'Nudeln',
  },
  cheese: {
    en: 'Cheese',
    fr: 'Fromage',
    es: 'Queso',
    de: 'Käse',
  },
}