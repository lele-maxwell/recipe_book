'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslateWithFallback } from '../../lib/translations'
import { RecipeWithDetails } from '@/types/recipe'
import StarRating from '../../components/StarRating'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function MyRecipesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [publishingRecipe, setPublishingRecipe] = useState<string | null>(null)
  const { t } = useTranslateWithFallback()

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    // Only load recipes if authenticated
    if (!session?.user?.id) return

    const fetchMyRecipes = async () => {
      try {
        const params = new URLSearchParams({
          userId: session.user.id,
          search: search,
          sortBy: sortBy,
          sortOrder: sortOrder,
        })

        const response = await fetch(`/api/recipes?${params}`)
        if (response.ok) {
          const data = await response.json()
          // Extract recipes array from the response
          setRecipes(data.recipes || [])
        } else {
          console.error('Failed to fetch recipes')
          setRecipes([])
        }
      } catch (error) {
        console.error('Error fetching recipes:', error)
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }

    fetchMyRecipes()
  }, [session, search, sortBy, sortOrder])

  const handlePublishRecipe = async (recipeId: string) => {
    if (!session?.user?.id) return
    
    setPublishingRecipe(recipeId)
    try {
      const response = await fetch(`/api/recipes/${recipeId}/publish`, {
        method: 'PATCH',
      })
      
      if (response.ok) {
        const data = await response.json()
        // Show success message
        alert(data.message)
        // Refresh the recipes list
        const params = new URLSearchParams({
          userId: session.user.id,
          search: search,
          sortBy: sortBy,
          sortOrder: sortOrder,
        })

        const refreshResponse = await fetch(`/api/recipes?${params}`)
        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json()
          setRecipes(refreshedData.recipes || [])
        }
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to publish recipe')
      }
    } catch (error) {
      console.error('Error publishing recipe:', error)
      alert('An error occurred while publishing the recipe')
    } finally {
      setPublishingRecipe(null)
    }
  }

  // Don't render anything while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0b0f1c]">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" text={t('my_recipes.loading_recipes')} />
          </div>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1c]">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" text={t('my_recipes.loading_recipes')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0f1c]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('my_recipes.title')}</h1>
          <p className="text-gray-300">{t('my_recipes.subtitle')}</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('my_recipes.search_placeholder')}
              className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-lg text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Controls and Create Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-4">
            <select
              className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800/50 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">{t('my_recipes.date_created')}</option>
              <option value="title">{t('recipes.title')}</option>
              <option value="rating">{t('recipes.rating')}</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-600 rounded-lg bg-gray-800/50 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">{t('my_recipes.newest_first')}</option>
              <option value="asc">{t('my_recipes.oldest_first')}</option>
            </select>
          </div>

          <Link
            href="/recipes/create"
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
          >
            {t('my_recipes.create_new_recipe')}
          </Link>
        </div>

        {/* Recipes Grid */}
        {!Array.isArray(recipes) || recipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold mb-2 text-white">{t('my_recipes.no_recipes_yet')}</h2>
            <p className="text-gray-300 mb-6">
              {t('my_recipes.start_creating')}
            </p>
            <Link
              href="/recipes/create"
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              {t('my_recipes.create_first_recipe')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-black/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:shadow-orange-500/20 hover:border-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative aspect-[4/3] bg-gray-800 overflow-hidden">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span className="text-6xl">🍽️</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-xl text-white mb-2 line-clamp-2 min-h-[3.5rem]">{recipe.title}</h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-400">
                      {t('my_recipes.created')} {new Date(recipe.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {recipe.prepTime && recipe.cookTime && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {recipe.prepTime + recipe.cookTime}min
                        </span>
                      )}
                      {recipe.servings && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {recipe.servings} {t('recipes.servings')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-center py-2 px-4 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-400 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-orange-500/25"
                    >
                      {t('my_recipes.view_recipe')}
                    </Link>
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-1.5 px-3 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                      {t('my_recipes.edit')}
                    </Link>
                    <button
                      onClick={() => handlePublishRecipe(recipe.id)}
                      disabled={publishingRecipe === recipe.id}
                      className={`py-1.5 px-3 rounded-lg font-medium transition-all duration-200 text-sm ${
                        recipe.published
                          ? 'bg-red-900/50 hover:bg-red-800/50 text-red-300 border border-red-500/30'
                          : 'bg-green-900/50 hover:bg-green-800/50 text-green-300 border border-green-500/30'
                      } ${publishingRecipe === recipe.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {publishingRecipe === recipe.id
                        ? '...'
                        : recipe.published
                          ? t('my_recipes.unpublish')
                          : t('my_recipes.publish')
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}