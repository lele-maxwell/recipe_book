'use client'

import { useTranslateWithFallback } from '../../lib/translations'
import StarRating from '../StarRating'

interface RatingData {
  stars: number
  percentage: number
  count: number
}

interface RatingsSectionProps {
  averageRating?: number
  totalReviews?: number
  ratingBreakdown?: RatingData[]
  className?: string
}

const defaultRatingBreakdown: RatingData[] = [
  { stars: 5, percentage: 40, count: 60 },
  { stars: 4, percentage: 30, count: 45 },
  { stars: 3, percentage: 15, count: 23 },
  { stars: 2, percentage: 10, count: 15 },
  { stars: 1, percentage: 5, count: 7 }
]

export default function RatingsSection({
  averageRating = 4.5,
  totalReviews = 150,
  ratingBreakdown = defaultRatingBreakdown,
  className = ''
}: RatingsSectionProps) {
  const { t } = useTranslateWithFallback()

  return (
    <div className={`bg-white rounded-xl p-8 shadow-lg ${className}`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {t('home.ratings_title')}
      </h2>
      <div className="flex items-start gap-8">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating}
          </div>
          <div className="flex items-center justify-center mb-2">
            <StarRating rating={averageRating} size="lg" />
          </div>
          <div className="text-gray-600 text-sm">
            {totalReviews} {t('home.reviews')}
          </div>
        </div>
        
        <div className="flex-1 max-w-md">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-600 w-2">{item.stars}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 