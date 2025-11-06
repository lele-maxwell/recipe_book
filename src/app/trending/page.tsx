'use client'

import { useState, useEffect } from 'react'
import { RecommendationSection } from '@/components/RecommendationSection'

interface TrendingPeriod {
  id: string
  label: string
  period: 'daily' | 'weekly' | 'monthly'
}

interface TrendingCategory {
  id: string
  label: string
  category: string
  description: string
}

const trendingPeriods: TrendingPeriod[] = [
  { id: 'daily', label: 'Today', period: 'daily' },
  { id: 'weekly', label: 'This Week', period: 'weekly' },
  { id: 'monthly', label: 'This Month', period: 'monthly' }
]

const trendingCategories: TrendingCategory[] = [
  { id: 'african', label: 'African Cuisine', category: 'african', description: 'Traditional African dishes' },
  { id: 'comfort', label: 'Comfort Food', category: 'comfort', description: 'Hearty and satisfying meals' },
  { id: 'quick', label: 'Quick Meals', category: 'quick', description: 'Fast and easy recipes' },
  { id: 'healthy', label: 'Healthy Options', category: 'healthy', description: 'Nutritious and light dishes' },
  { id: 'desserts', label: 'Sweet Treats', category: 'desserts', description: 'Delicious desserts' },
  { id: 'main_dishes', label: 'Main Courses', category: 'main_dishes', description: 'Hearty main dishes' }
]

export default function TrendingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [selectedPeriod])

  const selectedPeriodData = trendingPeriods.find(p => p.period === selectedPeriod)

  return (
    <div className="min-h-screen bg-[#0b0f1c]">
      {/* Hero Section */}
      <div className="bg-[#0b0f1c] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-white">Trending Recipes</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover the most popular and highly-rated recipes that are taking the culinary world by storm
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Time Period Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
          <div className="flex flex-wrap gap-3">
            {trendingPeriods.map((period) => (
              <button
                key={period.id}
                onClick={() => {
                  setSelectedPeriod(period.period)
                  setIsLoading(true)
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedPeriod === period.period
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white/5 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Trending Section */}
        <div className="mb-12">
          {isLoading ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-6 w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-white/5 rounded-lg h-64"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Hottest Recipes - {selectedPeriodData?.label}
              </h3>
              <p className="text-white/70 mb-6">
                Most popular recipes {selectedPeriod === 'daily' ? 'today' : selectedPeriod === 'weekly' ? 'this week' : 'this month'} based on ratings and engagement
              </p>
              <RecommendationSection
                type="trending"
                title=""
                subtitle=""
                limit={8}
                className=""
              />
            </div>
          )}
        </div>

        {/* Trending Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Trending by Category</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trendingCategories.map((category) => (
              <div key={category.id} className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">{category.label}</h3>
                  <p className="text-white/70 text-sm">{category.description}</p>
                </div>
                
                <div className="p-6">
                  <RecommendationSection
                    type="occasion"
                    occasion={category.category}
                    title=""
                    limit={4}
                    className=""
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New User Recommendations */}
        <div className="mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white mb-2">Perfect for New Cooks</h3>
            <p className="text-white/70 mb-6">
              Highly-rated, accessible recipes that are perfect for beginners and guaranteed to impress
            </p>
            <RecommendationSection
              type="trending"
              title=""
              subtitle=""
              limit={6}
              className=""
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Trending Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">150+</div>
              <div className="text-white/70">Recipes Trending</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">4.8★</div>
              <div className="text-white/70">Average Rating</div>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">25k+</div>
              <div className="text-white/70">Recipe Views</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}