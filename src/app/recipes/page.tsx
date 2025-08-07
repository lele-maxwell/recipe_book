'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslateWithFallback } from '../../lib/translations'
import { RecipeWithDetails } from '@/types/recipe'
import { useRecipeContext } from '../../contexts/RecipeContext'
import { useAuth } from '../../hooks/useAuth'
import SearchAndFilters from '../../components/SearchAndFilters'
import RecipeList from '../../components/RecipeList'
import LoadingSpinner from '../../components/LoadingSpinner'
import OptimizedImage from '../../components/OptimizedImage'
import { RecommendationSection } from '../../components/RecommendationSection'

export default function RecipesPage() {
  const { t } = useTranslateWithFallback()
  const { isAuthenticated, requireAuth } = useAuth()
  const router = useRouter()
  const { state, dispatch, filteredRecipes } = useRecipeContext()
  const { recipes, loading, error } = state

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

  const handleFilterChange = useCallback((filters: any) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [dispatch])

  const handleRecipeClick = useCallback((recipeId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    router.push(`/recipes/${recipeId}`)
  }, [isAuthenticated, router])

  const handleCreateRecipe = useCallback(() => {
    if (!requireAuth()) {
      return
    }
    router.push('/recipes/create')
  }, [requireAuth, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight leading-tight">{t('recipes.title')}</h1>
            <p className="text-lg text-gray-500 mb-8">{t('recipes.subtitle')}</p>
          </div>
          <button
            onClick={handleCreateRecipe}
            className="mt-4 md:mt-0 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <span>+</span>
            {t('recipes.create_recipe')}
          </button>
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

        {/* Recommendations */}
        <div className="mt-12">
            <RecommendationSection
            excludeIds={filteredRecipes.slice(0, 6).map(r => r.id)}
            />
          </div>
      </div>
    </div>
  )
}