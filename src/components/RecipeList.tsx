'use client'

import React, { useMemo } from 'react'
import { RecipeWithDetails } from '@/types/recipe'
import RecipeCard from './RecipeCard'
import LoadingSpinner from './LoadingSpinner'

interface RecipeListProps {
  recipes: RecipeWithDetails[]
  loading?: boolean
  error?: string | null
  variant?: 'grid' | 'list'
  onRecipeClick?: (recipeId: string) => void
  className?: string
}

const RecipeList = React.memo<RecipeListProps>(({
  recipes,
  loading = false,
  error = null,
  variant = 'grid',
  onRecipeClick,
  className = ''
}) => {
  // Memoize the grid classes to prevent recalculation on every render
  const gridClasses = useMemo(() => {
    return variant === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      : 'space-y-4'
  }, [variant])

  // Memoize the filtered and sorted recipes
  const sortedRecipes = useMemo(() => {
    return [...recipes].sort((a, b) => {
      // Sort by rating first, then by creation date
      const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0)
      if (ratingDiff !== 0) return ratingDiff
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [recipes])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner 
          size="lg" 
          text="Loading recipes..." 
          variant="dots"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <div className="text-4xl mb-2">😞</div>
          <p className="text-lg font-medium">Failed to load recipes</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (sortedRecipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="text-6xl mb-2">��️</div>
          <h2 className="text-2xl font-extrabold mb-2 text-gray-700">No recipes found</h2>
          <p className="text-base text-gray-400 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${gridClasses} ${className}`}>
      {sortedRecipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          id={recipe.id}
          title={recipe.title}
          description={recipe.description}
          imageUrl={recipe.imageUrl}
          rating={recipe.averageRating}
          ratingsCount={recipe._count?.ratings || 0}
          prepTime={recipe.prepTime}
          cookTime={recipe.cookTime}
          servings={recipe.servings}
          chefName={recipe.user.name}
          chefId={recipe.userId}
          variant={variant === 'list' ? 'detailed' : 'default'}
          onClick={() => onRecipeClick?.(recipe.id)}
        />
      ))}
    </div>
  )
})

RecipeList.displayName = 'RecipeList'

export default RecipeList 