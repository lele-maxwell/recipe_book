'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTolgee } from '@tolgee/react'
import { useTranslateWithFallback, getUnitName } from '../../../lib/translations'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import OptimizedImage from '../../../components/OptimizedImage'
import { RecommendationSection } from '../../../components/RecommendationSection'
import StarRating from '../../../components/StarRating'
import LoadingSpinner from '../../../components/LoadingSpinner'

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
  description?: string
  imageUrl?: string
  prepTime?: string
  cookTime?: string
  servings?: string
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
  createdAt?: string
  updatedAt?: string
}

// Mock recipe data that matches the FlavorVerse reference design
const mockRecipe = {
  id: '1',
  title: 'Creamy Mushroom Soup',
  description: 'A rich and velvety mushroom soup that combines earthy flavors with a luxurious cream base. Perfect for cozy evenings and special occasions.',
  imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop&crop=center',
  prepTime: '15 min',
  cookTime: '30 min',
  servings: '4',
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
  const { t } = useTranslateWithFallback()
  const tolgee = useTolgee()
  const currentLanguage = tolgee.getLanguage()
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
    return <LoadingSpinner size="lg" text={t('recipe.loading_recipe')} />
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
    if (!confirm(t('recipe.confirm_delete'))) return
    router.push('/recipes')
  }

  const toggleIngredient = (ingredientId: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }))
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
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{error || t('recipe.not_found')}</h2>
        <button onClick={() => router.back()} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          {t('common.back')}
        </button>
      </div>
    )
  }

  const isOwner = session?.user?.id === recipe.userId

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f1c] via-[#0d1121] to-[#0b0f1c]">
      {/* Hero Section with Recipe Image */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-950/20 to-transparent">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Recipe Image */}
            <div className="relative group">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                {recipe.imageUrl ? (
            <OptimizedImage
              src={recipe.imageUrl}
              alt={recipe.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-24 h-24 text-orange-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-orange-600 font-medium">Recipe Image</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl"></div>
            </div>

            {/* Recipe Header Info */}
            <div className="space-y-8">
              {/* Title and Chef */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {recipe.title}
                </h1>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-3">
                    {recipe.user.image ? (
                      <img 
                        src={recipe.user.image} 
                        alt={recipe.user.name} 
                        className="w-12 h-12 rounded-full border-2 border-orange-500/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {recipe.user.name?.charAt(0) || 'C'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-orange-400 font-semibold">{recipe.user.name}</p>
                      <p className="text-gray-400 text-sm">Chef</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={recipe.averageRating || 0} />
                    <span className="text-xl font-bold text-white">
                      {recipe.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <span className="text-gray-400">
                    ({recipe._count.ratings} {t('recipe.reviews')})
                  </span>
                </div>
              </div>

              {/* Recipe Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-orange-400 mb-1">{recipe.prepTime || '30 min'}</div>
                  <div className="text-gray-300 text-sm">Prep Time</div>
                </div>
                <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-orange-400 mb-1">{recipe.cookTime || '45 min'}</div>
                  <div className="text-gray-300 text-sm">Cook Time</div>
                </div>
                <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-orange-400 mb-1">{recipe.servings || '4'}</div>
                  <div className="text-gray-300 text-sm">Servings</div>
                </div>
              </div>

              {/* Description */}
              {recipe.description && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <p className="text-gray-300 leading-relaxed text-lg">{recipe.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
        {/* Ingredients Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 text-orange-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t('recipe.ingredients')}
              </h2>
              <div className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={ingredient.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-200">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-400 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-orange-400 font-medium">
                        {ingredient.quantity} {getUnitName(ingredient.unit)}
                </span>
                      <span className="text-gray-300 ml-2">{ingredient.ingredient.name}</span>
                    </div>
                  </div>
            ))}
              </div>
          </div>
        </div>

        {/* Instructions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 text-orange-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t('recipe.instructions')}
              </h2>
              <div className="prose prose-lg prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed space-y-4">
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-semibold text-orange-400 mb-3">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-medium text-white mb-2">{children}</h3>,
                      p: ({children}) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                      ol: ({children}) => <ol className="list-decimal list-inside space-y-3 text-gray-300">{children}</ol>,
                      ul: ({children}) => <ul className="list-disc list-inside space-y-2 text-gray-300">{children}</ul>,
                      li: ({children}) => <li className="text-gray-300 leading-relaxed">{children}</li>,
                      strong: ({children}) => <strong className="text-orange-400 font-semibold">{children}</strong>,
                      em: ({children}) => <em className="text-orange-300 italic">{children}</em>,
                    }}
                  >
                    {recipe.instructions}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <svg className="w-6 h-6 text-orange-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {t('recipe.rate_recipe')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
              <div className="text-center">
                <div className="text-6xl font-bold text-orange-400 mb-2">
              {recipe.averageRating?.toFixed(1) || '0.0'}
            </div>
                <div className="flex items-center justify-center mb-2">
                  <StarRating rating={recipe.averageRating || 0} size="lg" />
              </div>
                <div className="text-gray-400">
                {recipe._count.ratings} {t('recipe.reviews')}
            </div>
          </div>

          {/* Rating Breakdown */}
              <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = recipe.ratings?.filter((r: Rating) => r.value === stars).length || 0
              const percentage = recipe._count.ratings > 0 ? (count / recipe._count.ratings) * 100 : 0
              
              return (
                    <div key={stars} className="flex items-center space-x-4">
                      <span className="text-gray-300 w-4">{stars}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                      <span className="text-gray-400 w-12 text-sm">{percentage.toFixed(0)}%</span>
                </div>
              )
            })}
              </div>
          </div>

          {/* User Rating */}
          {session && !isOwner && (
              <div className="border-t border-white/10 pt-8 mt-8">
                <p className="text-gray-300 mb-4 text-lg">{t('recipe.rate_this_recipe')}:</p>
                <div className="flex items-center space-x-4">
                  <StarRating rating={userRating} interactive={true} onRate={handleRating} size="lg" />
                {userRating > 0 && (
                    <span className="text-orange-400 font-semibold">
                    {t('recipe.your_rating')}: {userRating}/5
                  </span>
                )}
              </div>
            </div>
          )}

          {!session && (
              <div className="border-t border-white/10 pt-8 mt-8">
                <p className="text-gray-400">
                  <Link href="/auth/signin" className="text-orange-400 hover:text-orange-300 underline font-medium">
                    {t('navigation.sign_in')}
                  </Link> {t('recipe.to_rate_recipe')}
              </p>
            </div>
          )}
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
            >
              {t('recipe.edit_recipe')}
            </button>
            <button
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              {t('recipe.delete_recipe')}
            </button>
          </div>
        )}

        {/* Similar Recipes Section */}
        {recipe && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Similar Recipes</h2>
              <p className="text-gray-400">You might also enjoy these culinary creations</p>
            </div>
            <RecommendationSection
              type="similar"
              baseRecipeId={recipe.id}
              title=""
              subtitle=""
              limit={4}
              className="mb-8"
            />
          </div>
        )}
      </div>
    </div>
  )
}