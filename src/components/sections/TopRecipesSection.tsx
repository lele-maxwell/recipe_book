'use client'

import { useSession } from 'next-auth/react'
import { useTranslateWithFallback } from '../../lib/translations'
import RecipeCard from '../RecipeCard'

interface Recipe {
  id: string
  title: string
  chef: string
  rating: number
  image: string
}

interface TopRecipesSectionProps {
  recipes?: Recipe[]
  className?: string
}

const defaultRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spicy Thai Green Curry',
    chef: 'Chef Isabella Rivera',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Classic Italian Lasagna',
    chef: 'Chef Marco Bianchi',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Authentic Mexican Tacos',
    chef: 'Chef Sofia Martinez',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop'
  }
]

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
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        {t('home.top_recipes_title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="flex justify-center">
            <RecipeCard
              id={recipe.id}
              title={recipe.title}
              imageUrl={recipe.image}
              rating={recipe.rating}
              chefName={recipe.chef}
              // Remove variant or set to 'default' for consistency
              className="w-full"
              onClick={() => handleRecipeClick(recipe.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
} 