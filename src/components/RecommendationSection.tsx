'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import OptimizedImage from './OptimizedImage'
import { StarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface Recipe {
  id: string
  title: string
  description: string | null
  image: string | null
  prepTime: number | null
  cookTime: number | null
  servings: number | null
  averageRating: number
  ratingsCount: number
  author: {
    id: string
    name: string | null
    image: string | null
  }
  createdAt: string
}

interface RecommendationSectionProps {
  type: 'personalized' | 'trending' | 'similar' | 'occasion'
  title: string
  subtitle?: string
  baseRecipeId?: string
  occasion?: string
  excludeIds?: string[]
  limit?: number
  className?: string
}

export function RecommendationSection({
  type,
  title,
  subtitle,
  baseRecipeId,
  occasion,
  excludeIds = [],
  limit = 6,
  className = ''
}: RecommendationSectionProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize excludeIds to prevent infinite re-renders
  const memoizedExcludeIds = useMemo(() => excludeIds, [excludeIds.join(',')])

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        type,
        limit: limit.toString()
      })

      if (baseRecipeId) params.append('baseRecipeId', baseRecipeId)
      if (occasion) params.append('occasion', occasion)
      if (memoizedExcludeIds.length > 0) params.append('exclude', memoizedExcludeIds.join(','))

      const response = await fetch(`/api/recommendations?${params}`)
      const data = await response.json()

      if (data.success) {
        setRecipes(data.recommendations)
      } else {
        setError(data.error || 'Failed to fetch recommendations')
      }
    } catch (err) {
      setError('Failed to fetch recommendations')
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoading(false)
    }
  }, [type, baseRecipeId, occasion, memoizedExcludeIds, limit])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarOutlineIcon className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
        )
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
        )
      }
    }

    return stars
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="mt-2 text-red-700 hover:text-red-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No recommendations available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => {
          const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

          return (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative h-48">
                {recipe.image ? (
                  <OptimizedImage
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
                
                {/* Rating overlay */}
                {recipe.averageRating > 0 && (
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
                    <StarIcon className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-900">
                      {recipe.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {recipe.title}
                </h3>
                
                {recipe.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  {totalTime > 0 && (
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{totalTime} min</span>
                    </div>
                  )}
                  
                  {recipe.servings && (
                    <div className="flex items-center space-x-1">
                      <UsersIcon className="h-4 w-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {recipe.author.image ? (
                      <OptimizedImage
                        src={recipe.author.image}
                        alt={recipe.author.name || 'Chef'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    )}
                    <span className="text-sm text-gray-600">
                      {recipe.author.name || 'Anonymous Chef'}
                    </span>
                  </div>

                  {recipe.averageRating > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {renderStars(recipe.averageRating)}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({recipe.ratingsCount})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}