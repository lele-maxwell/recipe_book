'use client'

import { useSession } from 'next-auth/react'
import { useTranslateWithFallback } from '../../lib/translations'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Recipe {
  id: string
  title: string
  chef: string
  category: string
  difficulty: string
  image: string
}

interface TopRecipesSectionProps {
  recipes?: Recipe[]
  className?: string
  isVisible?: boolean
}

const defaultRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Pain au Chocolat',
    chef: 'Chef Isabella Rivera',
    category: 'Pastry',
    difficulty: 'Challenge',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=500&fit=crop'
  },
  {
    id: '2',
    title: 'Bone-in Ribeye',
    chef: 'Chef Marco Bianchi',
    category: 'Meat',
    difficulty: 'Quick',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=500&fit=crop'
  },
  {
    id: '3',
    title: 'Tagliatelle',
    chef: 'Chef Sofia Martinez',
    category: 'Pasta',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=500&fit=crop'
  },
  {
    id: '4',
    title: 'Dipped Ice Cream Sandwich',
    chef: 'Chef Alex Chen',
    category: 'Desserts',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=500&fit=crop'
  }
]

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'pastry':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'meat':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    case 'pasta':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    case 'desserts':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    default:
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
  }
}

const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'challenge':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'quick':
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    default:
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
  }
}

export default function TopRecipesSection({ 
  recipes = defaultRecipes, 
  className = '',
  isVisible = true
}: TopRecipesSectionProps) {
  const { data: session } = useSession()
  const { t } = useTranslateWithFallback()
  const [animatedCards, setAnimatedCards] = useState<number[]>([])

  useEffect(() => {
    if (isVisible) {
      // Animate cards one by one with a delay
      recipes.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedCards(prev => [...prev, index])
        }, index * 200) // 200ms delay between each card
      })
    } else {
      setAnimatedCards([])
    }
  }, [isVisible, recipes.length])

  const handleRecipeClick = (recipeId: string) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }
    window.location.href = `/recipes/${recipeId}`
  }

  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-8">
        Preference and Skill Level
      </h2>
      
      {/* Responsive grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6">
        {recipes.map((recipe, index) => (
          <div 
            key={recipe.id} 
            className={`w-full max-w-sm mx-auto h-80 relative group cursor-pointer transition-all duration-700 ease-out ${
              animatedCards.includes(index) 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
            onClick={() => handleRecipeClick(recipe.id)}
          >
            {/* Recipe Card */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-transparent to-black/60 group-hover:shadow-2xl group-hover:shadow-orange-500/20 transition-all duration-500">
              {/* Background Image */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-black/90 transition-all duration-500" />
              
              {/* Tags */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg group-hover:bg-orange-600/80 group-hover:scale-105 transition-all duration-300">
                  {getCategoryIcon(recipe.category)}
                  <span>{recipe.category}</span>
                </div>
                {recipe.difficulty && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg group-hover:bg-orange-600/80 group-hover:scale-105 transition-all duration-300">
                    {getDifficultyIcon(recipe.difficulty)}
                    <span>{recipe.difficulty}</span>
                  </div>
                )}
              </div>
              
              {/* Recipe Title */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-orange-300 transition-colors duration-300">
                  {recipe.title}
                </h3>
                <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  by {recipe.chef}
                </p>
              </div>

              {/* Hover Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20 blur-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 