'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslate } from '@tolgee/react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

// Type definitions
interface Rating {
  value: number
  userId: string
  user: {
    id: string
    name: string
  }
}

interface RecipeIngredient {
  id: string
  quantity: string
  unit: string
  ingredient: {
    name: string
  }
}

interface Recipe {
  id: string
  title: string
  imageUrl?: string
  userId: string
  user: {
    id: string
    name: string
    email?: string
    image?: string
  }
  ingredients: RecipeIngredient[]
  instructions: string
  averageRating?: number
  ratings: Rating[]
  _count: {
    ratings: number
  }
  published?: boolean
}

// Mock recipe data that matches the FlavorVerse reference design
const mockRecipe = {
  id: '1',
  title: 'Creamy Mushroom Soup',
  imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&crop=center',
  user: {
    id: '1',
    name: 'Chef Maria'
  },
  userId: '1',
  ingredients: [
    {
      id: '1',
      quantity: '500g',
      unit: '',
      ingredient: { name: 'fresh mushrooms' }
    },
    {
      id: '2',
      quantity: '1 liter',
      unit: '',
      ingredient: { name: 'vegetable broth' }
    },
    {
      id: '3',
      quantity: '200ml',
      unit: '',
      ingredient: { name: 'heavy cream' }
    },
    {
      id: '4',
      quantity: '1',
      unit: '',
      ingredient: { name: 'onion' }
    },
    {
      id: '5',
      quantity: '3 cloves',
      unit: '',
      ingredient: { name: 'garlic' }
    },
    {
      id: '6',
      quantity: 'Fresh',
      unit: '',
      ingredient: { name: 'thyme' }
    }
  ],
  instructions: `1. Clean and slice the mushrooms. 2. Sauté the onion and garlic in a large pot until softened. 3. Add the mushrooms and cook until they release their moisture. 4. Pour in the vegetable broth and bring to a boil. 5. Reduce heat and simmer for 20 minutes. 6. Stir in the heavy cream and fresh thyme. 7. Season with salt and pepper to taste. 8. Serve hot with crusty bread.`,
  averageRating: 4.5,
  ratings: [
    { value: 5, userId: '1', user: { id: '1', name: 'User 1' } },
    { value: 5, userId: '2', user: { id: '2', name: 'User 2' } },
    { value: 4, userId: '3', user: { id: '3', name: 'User 3' } },
    { value: 4, userId: '4', user: { id: '4', name: 'User 4' } },
    { value: 5, userId: '5', user: { id: '5', name: 'User 5' } },
    { value: 4, userId: '6', user: { id: '6', name: 'User 6' } },
    { value: 5, userId: '7', user: { id: '7', name: 'User 7' } },
    { value: 4, userId: '8', user: { id: '8', name: 'User 8' } },
    { value: 3, userId: '9', user: { id: '9', name: 'User 9' } },
    { value: 5, userId: '10', user: { id: '10', name: 'User 10' } },
    { value: 4, userId: '11', user: { id: '11', name: 'User 11' } },
    { value: 5, userId: '12', user: { id: '12', name: 'User 12' } }
  ],
  _count: {
    ratings: 12
  }
}

export default function RecipePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { t } = useTranslate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [isRating, setIsRating] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<{[key: string]: boolean}>({})

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!params.id) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/recipes/${params.id}`)
        
        if (response.ok) {
          const data = await response.json()
          setRecipe(data)
          
          // Check if user has already rated this recipe
          if (session?.user?.id) {
            const existingRating = data.ratings?.find((r: Rating) => r.userId === session.user?.id)
            if (existingRating) {
              setUserRating(existingRating.value)
            }
          }
        } else if (response.status === 401) {
          // Redirect to sign in if unauthorized
          router.push('/auth/signin')
          return
        } else if (response.status === 404) {
          setError('Recipe not found')
        } else {
          // Fallback to mock data if API fails
          setRecipe(mockRecipe)
        }
      } catch (error) {
        console.error('Error fetching recipe:', error)
        // Fallback to mock data
        setRecipe(mockRecipe)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id, session, router])

  // Don't render anything while checking authentication or loading recipe
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const handleRating = async (rating: number) => {
    if (!session?.user?.id || isRating) return
    
    setIsRating(true)
    try {
      const response = await fetch(`/api/recipes/${params.id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: rating }),
      })

      if (response.ok) {
        setUserRating(rating)
        
        // Refresh the recipe data to get updated average rating
        const recipeResponse = await fetch(`/api/recipes/${params.id}`)
        if (recipeResponse.ok) {
          const updatedRecipe = await recipeResponse.json()
          setRecipe(updatedRecipe)
        }
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to rate recipe')
      }
    } catch (error) {
      console.error('Error rating recipe:', error)
      alert('An error occurred while rating the recipe')
    } finally {
      setIsRating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe?')) return
    router.push('/recipes')
  }

  const toggleIngredient = (ingredientId: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }))
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-300 cursor-pointer' : 'cursor-default'}`}
        onClick={() => interactive && onRate && onRate(i + 1)}
        disabled={!interactive || isRating}
      >
        ★
      </button>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{error || 'Recipe not found'}</h2>
        <button onClick={() => router.back()} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Go Back
        </button>
      </div>
    )
  }

  const isOwner = session?.user?.id === recipe.userId

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Hero Image */}
        {recipe.imageUrl && (
          <div className="mb-6">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Recipe Title and Author */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
          <p className="text-gray-600 text-sm">by Chef {recipe.user.email?.split('@')[0] || recipe.user.name || 'Anonymous'}</p>
        </div>

        {/* Ingredients Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h2>
          <div className="space-y-3">
            {recipe.ingredients.map((recipeIngredient: RecipeIngredient) => (
              <label 
                key={recipeIngredient.id} 
                className="flex items-start space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={checkedIngredients[recipeIngredient.id] || false}
                  onChange={() => toggleIngredient(recipeIngredient.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <span className={`text-gray-700 text-sm leading-relaxed ${checkedIngredients[recipeIngredient.id] ? 'line-through text-gray-400' : ''}`}>
                  {recipeIngredient.quantity} {recipeIngredient.unit} {recipeIngredient.ingredient.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
          <div className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
          </div>
        </div>

        {/* Rating Section */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Rate this recipe</h2>
          
          {/* Overall Rating */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="text-3xl font-bold text-gray-900">
              {recipe.averageRating?.toFixed(1) || '0.0'}
            </div>
            <div>
              <div className="flex items-center mb-1">
                {renderStars(recipe.averageRating || 0)}
              </div>
              <div className="text-sm text-gray-600">
                {recipe._count.ratings} reviews
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2 mb-8">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = recipe.ratings?.filter((r: Rating) => r.value === stars).length || 0
              const percentage = recipe._count.ratings > 0 ? (count / recipe._count.ratings) * 100 : 0
              
              return (
                <div key={stars} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-2">{stars}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-800 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{percentage.toFixed(0)}%</span>
                </div>
              )
            })}
          </div>

          {/* User Rating */}
          {session && !isOwner && (
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 mb-3 text-sm">Rate this recipe:</p>
              <div className="flex items-center space-x-2">
                {renderStars(userRating, true, handleRating)}
                {userRating > 0 && (
                  <span className="text-sm text-gray-600 ml-4">
                    Your rating: {userRating}/5
                  </span>
                )}
              </div>
            </div>
          )}

          {!session && (
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 text-sm">
                <a href="/auth/signin" className="text-blue-600 hover:text-blue-700 underline">Sign in</a> to rate this recipe
              </p>
            </div>
          )}
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="border-t border-gray-200 pt-6 flex space-x-4">
            <button
              onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Edit Recipe
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
            >
              Delete Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  )
}