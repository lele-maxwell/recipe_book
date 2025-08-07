'use client'

import { useState, useEffect, useCallback } from 'react'
import { RecipeWithDetails } from '@/types/recipe'

interface UseRecipesOptions {
  initialRecipes?: RecipeWithDetails[]
  autoFetch?: boolean
  filters?: {
    search?: string
    category?: string
    difficulty?: string
    maxTime?: number
  }
}

interface UseRecipesReturn {
  recipes: RecipeWithDetails[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateRecipe: (id: string, updates: Partial<RecipeWithDetails>) => void
  addRecipe: (recipe: RecipeWithDetails) => void
  removeRecipe: (id: string) => void
  filteredRecipes: RecipeWithDetails[]
  setFilters: (filters: UseRecipesOptions['filters']) => void
}

export function useRecipes(options: UseRecipesOptions = {}): UseRecipesReturn {
  const { initialRecipes = [], autoFetch = true, filters: initialFilters } = options
  
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>(initialRecipes)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState(initialFilters || {})

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/recipes')
      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }
      
      const data = await response.json()
      setRecipes(data.recipes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRecipe = useCallback((id: string, updates: Partial<RecipeWithDetails>) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    ))
  }, [])

  const addRecipe = useCallback((recipe: RecipeWithDetails) => {
    setRecipes(prev => [recipe, ...prev])
  }, [])

  const removeRecipe = useCallback((id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id))
  }, [])

  // Apply filters to recipes
  const filteredRecipes = recipes.filter(recipe => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch = 
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower) ||
        recipe.user.name.toLowerCase().includes(searchLower)
      
      if (!matchesSearch) return false
    }

    if (filters.category) {
      // Add category filtering logic when categories are implemented
    }

    if (filters.difficulty) {
      // Add difficulty filtering logic when difficulty is implemented
    }

    if (filters.maxTime) {
      const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
      if (totalTime > filters.maxTime) return false
    }

    return true
  })

  useEffect(() => {
    if (autoFetch) {
      fetchRecipes()
    }
  }, [autoFetch, fetchRecipes])

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
    updateRecipe,
    addRecipe,
    removeRecipe,
    filteredRecipes,
    setFilters
  }
} 