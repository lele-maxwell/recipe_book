import { Recipe, User, Ingredient, RecipeIngredient, Rating, IngredientTranslation } from '@prisma/client'

// Safe user type without password for public use
export type SafeUser = Omit<User, 'password'>

// Extended types with relations
export type RecipeWithDetails = Recipe & {
  user: SafeUser
  ingredients: (RecipeIngredient & {
    ingredient: Ingredient & {
      translations: IngredientTranslation[]
    }
  })[]
  ratings: Rating[]
  _count: {
    ratings: number
  }
  averageRating?: number
}

export type RecipeWithUser = Recipe & {
  user: SafeUser
}

export type IngredientWithTranslations = Ingredient & {
  translations: IngredientTranslation[]
}

// Form data types
export interface RecipeFormData {
  title: string
  description?: string
  instructions: string // Markdown content
  prepTime?: number
  cookTime?: number
  servings?: number
  imageUrl?: string
  ingredients: RecipeIngredientInput[]
}

export interface RecipeIngredientInput {
  ingredientId?: string
  ingredientName: string
  quantity: number
  unit: string
}

export interface CreateRecipeData extends Omit<RecipeFormData, 'ingredients'> {
  userId: string
  ingredients: {
    ingredient: {
      connectOrCreate: {
        where: { name: string }
        create: { name: string }
      }
    }
    quantity: number
    unit: string
  }[]
}

// Rating types
export interface RatingData {
  value: number // 1-5
  recipeId: string
  userId: string
}

// Search and filter types
export interface RecipeFilters {
  search?: string
  userId?: string
  ingredients?: string[]
  minRating?: number
  sortBy?: 'createdAt' | 'title' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

// Translation types
export interface TranslationData {
  locale: string
  name: string
}

// Common measurement units (can be extended)
export const MEASUREMENT_UNITS = [
  'cups',
  'tablespoons',
  'teaspoons',
  'grams',
  'kilograms',
  'ounces',
  'pounds',
  'milliliters',
  'liters',
  'pieces',
  'cloves',
  'slices',
  'pinch',
  'dash'
] as const

export type MeasurementUnit = typeof MEASUREMENT_UNITS[number]