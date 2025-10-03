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

  const handleCardActivate = async (e: React.MouseEvent | React.KeyboardEvent) => {
    if (!onClick) return
    e.preventDefault()
    setButtonLoading(true)
    try {
      await onClick()
    } finally {
      setButtonLoading(false)
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
    <div
      className={`bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl max-w-xs min-h-[380px] flex flex-col border border-white/10 hover:shadow-orange-500/20 hover:border-orange-500/30 transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''} ${className}`}
      style={{width: '100%'}}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick ? handleCardActivate : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { handleCardActivate(e) } } : undefined}
      aria-label={onClick ? `Open recipe ${title}` : undefined}
    >
      {/* Image at the top */}
      <div className="relative h-48 w-full rounded-t-2xl overflow-hidden bg-gray-900">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {imageUrl && !imageError ? (
          <OptimizedImage
            src={imageUrl}
            alt={title}
            fill
            className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
            onError={handleImageError}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Card content */}
      <div className="flex-1 flex flex-col px-4 py-3">
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight">{title}</h3>
        {description && (
          <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">{description}</p>
        )}
        
        {/* Rating section */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={rating || 0} />
          <span className="text-sm text-orange-400 font-medium">{rating?.toFixed(1) || '0.0'}</span>
          {ratingsCount !== undefined && (
            <span className="text-xs text-gray-400 ml-1">({ratingsCount})</span>
          )}
        </div>
        
        {/* Recipe details */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>{formatTime(totalTime)}</span>
            </div>
          )}
          {servings && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>{formatServings(servings)}</span>
            </div>
          )}
        </div>
        
        {/* Chef attribution */}
        {chefName && (
          <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{chefName.charAt(0).toUpperCase()}</span>
            </div>
            <span>By {chefName}</span>
          </div>
        )}
      </div>
    </div>
  )
}