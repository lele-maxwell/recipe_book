'use client'

import { useState, useEffect } from 'react'
import { RecommendationSection } from '@/components/RecommendationSection'
import { FireIcon, ClockIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/solid'

interface TrendingPeriod {
  id: string
  label: string
  period: 'daily' | 'weekly' | 'monthly'
  icon: React.ComponentType<{ className?: string }>
}

interface TrendingCategory {
  id: string
  label: string
  category: string
  description: string
  icon: string
}

const trendingPeriods: TrendingPeriod[] = [
  { id: 'daily', label: 'Today', period: 'daily', icon: ClockIcon },
  { id: 'weekly', label: 'This Week', period: 'weekly', icon: FireIcon },
  { id: 'monthly', label: 'This Month', period: 'monthly', icon: ChartBarIcon }
]

const trendingCategories: TrendingCategory[] = [
  { id: 'african', label: 'African Cuisine', category: 'african', description: 'Traditional African dishes', icon: '🌍' },
  { id: 'comfort', label: 'Comfort Food', category: 'comfort', description: 'Hearty and satisfying meals', icon: '🍲' },
  { id: 'quick', label: 'Quick Meals', category: 'quick', description: 'Fast and easy recipes', icon: '⚡' },
  { id: 'healthy', label: 'Healthy Options', category: 'healthy', description: 'Nutritious and light dishes', icon: '🥗' },
  { id: 'desserts', label: 'Sweet Treats', category: 'desserts', description: 'Delicious desserts', icon: '🍰' },
  { id: 'main_dishes', label: 'Main Courses', category: 'main_dishes', description: 'Hearty main dishes', icon: '🍽️' }
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FireIcon className="h-16 w-16 text-orange-200" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Trending Recipes</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Discover the most popular and highly-rated recipes that are taking the culinary world by storm
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Period Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trending Now</h2>
          <div className="flex flex-wrap gap-2">
            {trendingPeriods.map((period) => {
              const Icon = period.icon
              return (
                <button
                  key={period.id}
                  onClick={() => {
                    setSelectedPeriod(period.period)
                    setIsLoading(true)
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period.period
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{period.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Trending Section */}
        <div className="mb-12">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-gray-200 rounded-lg h-64"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <RecommendationSection
              type="trending"
              title={`🔥 Hottest Recipes - ${selectedPeriodData?.label}`}
              subtitle={`Most popular recipes ${selectedPeriod === 'daily' ? 'today' : selectedPeriod === 'weekly' ? 'this week' : 'this month'} based on ratings, engagement, and recent activity`}
              limit={8}
              className="bg-white rounded-lg shadow-md p-6"
            />
          )}
        </div>

        {/* Trending Categories */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <SparklesIcon className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Trending by Category</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {trendingCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{category.label}</h3>
                      <p className="text-orange-100 text-sm">{category.description}</p>
                    </div>
                  </div>
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
          <RecommendationSection
            type="trending"
            title="🌟 Perfect for New Cooks"
            subtitle="Highly-rated, accessible recipes that are perfect for beginners and guaranteed to impress"
            limit={6}
            className="bg-white rounded-lg shadow-md p-6"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FireIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">150+</div>
              <div className="text-gray-600">Recipes Trending</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <SparklesIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">25k+</div>
              <div className="text-gray-600">Recipe Views</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}