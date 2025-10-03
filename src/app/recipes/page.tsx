'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslateWithFallback } from '@/lib/translations'
import { useRecipeContext } from '@/contexts/RecipeContext'
import { useAuth } from '@/hooks/useAuth'
import SearchAndFilters from '@/components/SearchAndFilters'
import RecipeList from '@/components/RecipeList'
import LoadingSpinner from '@/components/LoadingSpinner'

interface FilterOptions {
  cuisine: string
  difficulty: string
  maxTime: string
  rating: string
}

export default function RecipesPage() {
  const { t } = useTranslateWithFallback()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { state, dispatch, filteredRecipes } = useRecipeContext()
  const { loading, error } = state

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const response = await fetch('/api/recipes')
        if (!response.ok) {
          throw new Error('Failed to fetch recipes')
        }
        const data = await response.json()
        dispatch({ type: 'SET_RECIPES', payload: data.recipes || [] })
      } catch (err) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err instanceof Error ? err.message : 'An error occurred' 
        })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    fetchRecipes()
  }, [dispatch])

  const handleSearchChange = useCallback((search: string) => {
    dispatch({ type: 'SET_FILTERS', payload: { search } })
  }, [dispatch])

  const handleFilterChange = useCallback((filters: FilterOptions) => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: {
        ...filters,
        maxTime: filters.maxTime ? parseInt(filters.maxTime) : null
      }
    })
  }, [dispatch])

  const handleRecipeClick = useCallback((recipeId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    router.push(`/recipes/${recipeId}`)
  }, [isAuthenticated, router])

  const handleCreateRecipe = useCallback(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    router.push('/recipes/create')
  }, [isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1c]">
        <div className="container mx-auto px-6 py-12">
          <LoadingSpinner 
            size="lg" 
            text={t('recipes.loading_recipes')}
            variant="dots"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0f1c]">
      <div className="container mx-auto px-6 py-16 pb-32">
        {/* Header */}
        <div className="relative mb-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Recipes
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Discover, create, and share amazing recipes from around the world. Explore culinary excellence with our community of passionate food lovers.
            </p>
          </div>
          
          {/* Create Recipe Button - Top Right */}
          <div className="absolute top-0 right-0">
            <button
              onClick={handleCreateRecipe}
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-orange-500/25"
            >
              <span>+</span>
              {t('recipes.create_recipe')}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        {/* Recipe List */}
        <RecipeList
          recipes={filteredRecipes}
          loading={loading}
          error={error}
          onRecipeClick={handleRecipeClick}
          variant="grid"
        />
      </div>
    </div>
  )
}