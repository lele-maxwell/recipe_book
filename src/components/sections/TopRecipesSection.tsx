'use client'

import { useSession } from 'next-auth/react'
import { useTranslateWithFallback } from '../../lib/translations'
import Link from 'next/link'

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
  className = '' 
}: TopRecipesSectionProps) {
  const { data: session } = useSession()
  const { t } = useTranslateWithFallback()

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
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="flex-shrink-0 w-80 h-96 relative group cursor-pointer"
            onClick={() => handleRecipeClick(recipe.id)}
          >
            {/* Recipe Card */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-transparent to-black/60">
              {/* Background Image */}
              <img
                src={recipe.image}
                alt={recipe.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Tags */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                  {getCategoryIcon(recipe.category)}
                  <span>{recipe.category}</span>
                </div>
                {recipe.difficulty && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                    {getDifficultyIcon(recipe.difficulty)}
                    <span>{recipe.difficulty}</span>
                  </div>
                )}
              </div>
              
              {/* Recipe Title */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg leading-tight">
                  {recipe.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 