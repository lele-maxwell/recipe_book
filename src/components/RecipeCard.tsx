'use client'

import Link from 'next/link'
import { useState } from 'react'
import OptimizedImage from './OptimizedImage'
import StarRating from './StarRating'

interface RecipeCardProps {
  id: string
  title: string
  description?: string | null
  imageUrl?: string | null
  rating?: number
  ratingsCount?: number
  prepTime?: number | null
  cookTime?: number | null
  servings?: number | null
  chefName?: string | null
  chefId?: string | null
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
  onClick?: () => void
}

export default function RecipeCard({
  id,
  title,
  description,
  imageUrl,
  rating,
  ratingsCount,
  prepTime,
  cookTime,
  servings,
  chefName,
  chefId,
  variant = 'default',
  className = '',
  onClick
}: RecipeCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  
  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }
  
  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleButtonClick = async (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      setButtonLoading(true)
      try {
        await onClick()
      } finally {
        setButtonLoading(false)
      }
    }
  }
  
  const totalTime = (prepTime || 0) + (cookTime || 0)
  
  // Format time display
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  
  // Format servings display
  const formatServings = (servings: number | null) => {
    if (!servings) return ''
    return servings === 1 ? '1 serving' : `${servings} servings`
  }
  
  // Card content based on variant
  const renderCardContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <>
            <div className="p-3">
              <h3 className="font-bold text-gray-900 line-clamp-1">{title}</h3>
              {rating !== undefined && (
                <div className="flex items-center mt-2">
                  <StarRating rating={rating} />
                </div>
              )}
              {description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
              )}
              {totalTime > 0 && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className="mr-2">🕒 {formatTime(totalTime)}</span>
                  {servings && (
                    <span>🍽️ {formatServings(servings)}</span>
                  )}
                </div>
              )}
            </div>
          </>
        )
      case 'detailed':
        return (
          <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden rounded-t-xl">
            {imageUrl && !imageError ? (
              <OptimizedImage
                src={imageUrl}
                alt={title}
                fill
                className="w-full h-full object-cover"
                onError={handleImageError}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <span className="text-4xl">🍽️</span>
              </div>
            )}
          </div>
        )
    }
  }
  
  return (
    <div className={`bg-white rounded-2xl shadow-lg max-w-xs min-h-[420px] flex flex-col border border-gray-100 hover:shadow-2xl transition-shadow duration-200 ${className}`} style={{width: '100%'}}>
      {/* Image at the top */}
      <div className="relative h-48 w-full rounded-t-2xl overflow-hidden bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {imageUrl && !imageError ? (
          <OptimizedImage
            src={imageUrl}
            alt={title}
            fill
            className="object-cover w-full h-full transition-opacity duration-300"
            onError={handleImageError}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
      </div>
      {/* Card content */}
      <div className="flex-1 flex flex-col px-5 py-4">
        <h3 className="font-extrabold text-xl text-gray-900 mb-2 line-clamp-2">{title}</h3>
        {description && (
          <p className="text-base text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={rating || 0} />
          <span className="text-xs text-gray-500">{rating?.toFixed(1) || '0.0'}</span>
          {ratingsCount !== undefined && (
            <span className="text-xs text-gray-400 ml-1">({ratingsCount})</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          {totalTime > 0 && <span>🕒 {formatTime(totalTime)}</span>}
          {servings && <span>🍽️ {formatServings(servings)}</span>}
        </div>
        {chefName && (
          <div className="text-xs text-gray-300 mb-2">By {chefName}</div>
        )}
        <div className="mt-auto pt-2">
          {onClick && (
            <button
              onClick={handleButtonClick}
              disabled={buttonLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {buttonLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                'View Recipe'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}