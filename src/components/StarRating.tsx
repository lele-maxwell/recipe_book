'use client'

import { useState } from 'react'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRate?: (rating: number) => void
  disabled?: boolean
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRate,
  disabled = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }
  
  const handleMouseEnter = (ratingValue: number) => {
    if (interactive && !disabled) {
      setHoverRating(ratingValue)
    }
  }
  
  const handleMouseLeave = () => {
    if (interactive && !disabled) {
      setHoverRating(0)
    }
  }
  
  const handleClick = (ratingValue: number) => {
    if (interactive && !disabled && onRate) {
      onRate(ratingValue)
    }
  }
  
  const displayRating = hoverRating || rating
  
  return (
    <div className="flex items-center">
      <div 
        className={`flex ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            className={`${sizeClasses[size]} ${star <= displayRating ? 'text-yellow-400' : 'text-gray-300'} ${interactive && !disabled ? 'hover:text-yellow-400' : ''} transition-colors`}
            onMouseEnter={() => handleMouseEnter(star)}
            onClick={() => handleClick(star)}
            disabled={!interactive || disabled}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}