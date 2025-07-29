'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslate } from '@tolgee/react'
import { RecipeWithDetails } from '@/types/recipe'

// Mock data for recipes
const mockRecipes: RecipeWithDetails[] = [
  {
    id: '1',
    title: 'Creamy Mushroom Soup',
    description: 'A rich and creamy mushroom soup with fresh herbs and a touch of cream',
    instructions: 'Sauté mushrooms, add broth, simmer, and finish with cream',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&crop=center',
    userId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    averageRating: 4.5,
    user: {
      id: '1',
      name: 'Chef Maria',
      email: 'maria@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 12
    }
  },
  {
    id: '2',
    title: 'Mediterranean Pasta',
    description: 'Fresh pasta with tomatoes, olives, and feta cheese',
    instructions: 'Cook pasta, sauté vegetables, combine with cheese',
    prepTime: 20,
    cookTime: 25,
    servings: 6,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=400&fit=crop&crop=center',
    userId: '2',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    averageRating: 4.2,
    user: {
      id: '2',
      name: 'Chef Antonio',
      email: 'antonio@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 8
    }
  },
  {
    id: '3',
    title: 'Chocolate Lava Cake',
    description: 'Decadent chocolate cake with molten center',
    instructions: 'Mix batter, bake in ramekins, serve warm',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&crop=center',
    userId: '3',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    averageRating: 4.8,
    user: {
      id: '3',
      name: 'Chef Sophie',
      email: 'sophie@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 15
    }
  },
  {
    id: '4',
    title: 'Asian Stir Fry',
    description: 'Quick and healthy vegetable stir fry with soy sauce',
    instructions: 'Heat oil, stir fry vegetables, add sauce',
    prepTime: 10,
    cookTime: 8,
    servings: 4,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop&crop=center',
    userId: '4',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    averageRating: 4.0,
    user: {
      id: '4',
      name: 'Chef Lin',
      email: 'lin@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 6
    }
  },
  {
    id: '5',
    title: 'Grilled Salmon',
    description: 'Perfectly grilled salmon with lemon and herbs',
    instructions: 'Season salmon, grill 4-5 minutes per side',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&crop=center',
    userId: '5',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    averageRating: 4.6,
    user: {
      id: '5',
      name: 'Chef James',
      email: 'james@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 10
    }
  },
  {
    id: '6',
    title: 'Caesar Salad',
    description: 'Classic Caesar salad with homemade croutons',
    instructions: 'Prepare dressing, toss with lettuce and croutons',
    prepTime: 15,
    cookTime: 5,
    servings: 4,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop&crop=center',
    userId: '6',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    averageRating: 3.8,
    user: {
      id: '6',
      name: 'Chef Emma',
      email: 'emma@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 5
    }
  },
  {
    id: '7',
    title: 'Beef Tacos',
    description: 'Spicy beef tacos with fresh salsa and avocado',
    instructions: 'Cook beef, warm tortillas, assemble with toppings',
    prepTime: 20,
    cookTime: 15,
    servings: 6,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&crop=center',
    userId: '7',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
    averageRating: 4.4,
    user: {
      id: '7',
      name: 'Chef Carlos',
      email: 'carlos@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 9
    }
  },
  {
    id: '8',
    title: 'Vegetable Curry',
    description: 'Aromatic vegetable curry with coconut milk',
    instructions: 'Sauté spices, add vegetables and coconut milk, simmer',
    prepTime: 15,
    cookTime: 25,
    servings: 5,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=400&fit=crop&crop=center',
    userId: '8',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    averageRating: 4.3,
    user: {
      id: '8',
      name: 'Chef Priya',
      email: 'priya@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 7
    }
  },
  {
    id: '9',
    title: 'French Toast',
    description: 'Classic French toast with maple syrup',
    instructions: 'Dip bread in egg mixture, cook until golden',
    prepTime: 5,
    cookTime: 10,
    servings: 4,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=400&fit=crop&crop=center',
    userId: '9',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
    averageRating: 4.1,
    user: {
      id: '9',
      name: 'Chef Pierre',
      email: 'pierre@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 11
    }
  },
  {
    id: '10',
    title: 'Chicken Parmesan',
    description: 'Breaded chicken with marinara sauce and mozzarella',
    instructions: 'Bread chicken, fry, top with sauce and cheese, bake',
    prepTime: 25,
    cookTime: 30,
    servings: 4,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=400&fit=crop&crop=center',
    userId: '10',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
    averageRating: 4.7,
    user: {
      id: '10',
      name: 'Chef Isabella',
      email: 'isabella@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      emailVerified: null,
      image: null,
      bio: null,
      location: null,
      website: null,
      cookingExperience: null,
      favoritesCuisines: null,
      dietaryRestrictions: null,
      profilePicture: null,
      isPublicProfile: true
    },
    ingredients: [],
    ratings: [],
    _count: {
      ratings: 13
    }
  }
]

export default function RecipesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const { t } = useTranslate()

  useEffect(() => {
    // Load recipes regardless of authentication status
    const fetchRecipes = async () => {
      try {
        const params = new URLSearchParams({
          search: search,
          sortBy: sortBy,
          sortOrder: sortOrder,
          // Don't pass userId - we want only published recipes from all users
        })

        const response = await fetch(`/api/recipes?${params}`)
        if (response.ok) {
          const data = await response.json()
          
          // If API returns few recipes, combine with mock data to ensure good user experience
          let recipesToShow = data
          if (data.length < 5) {
            // Combine API data with mock data, avoiding duplicates
            const apiIds = new Set(data.map((r: RecipeWithDetails) => r.id))
            const additionalMockRecipes = mockRecipes.filter(mockRecipe => !apiIds.has(mockRecipe.id))
            recipesToShow = [...data, ...additionalMockRecipes]
          }
          
          setRecipes(recipesToShow)
        } else {
          console.error('Failed to fetch recipes')
          // Fallback to mock data if API fails
          let filteredRecipes = [...mockRecipes]
          
          // Apply search filter
          if (search) {
            filteredRecipes = filteredRecipes.filter(recipe =>
              recipe.title.toLowerCase().includes(search.toLowerCase()) ||
              (recipe.description && recipe.description.toLowerCase().includes(search.toLowerCase()))
            )
          }
          
          // Apply sorting
          filteredRecipes.sort((a, b) => {
            let aValue, bValue
            
            switch (sortBy) {
              case 'title':
                aValue = a.title
                bValue = b.title
                break
              case 'rating':
                aValue = a.averageRating || 0
                bValue = b.averageRating || 0
                break
              default:
                aValue = a.createdAt
                bValue = b.createdAt
            }
            
            if (sortOrder === 'asc') {
              return aValue > bValue ? 1 : -1
            } else {
              return aValue < bValue ? 1 : -1
            }
          })
          
          setRecipes(filteredRecipes)
        }
      } catch (error) {
        console.error('Error fetching recipes:', error)
        // Fallback to mock data
        setRecipes(mockRecipes)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [search, sortBy, sortOrder])

  const handleViewRecipe = (recipeId: string) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    router.push(`/recipes/${recipeId}`)
  }

  const handleCreateRecipe = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    router.push('/recipes/create')
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-600 mt-4">{t('recipes.loading_recipes')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
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
              placeholder={t('recipes.search_placeholder')}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Controls and Create Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">{t('recipes.category')}</option>
              <option value="title">{t('recipes.title')}</option>
              <option value="rating">{t('recipes.rating')}</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500">
              <option>{t('recipes.language')}</option>
              <option>{t('recipes.english')}</option>
              <option>{t('recipes.spanish')}</option>
              <option>{t('recipes.french')}</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">{t('recipes.rating')}</option>
              <option value="asc">{t('recipes.ascending')}</option>
            </select>
          </div>

          <button
            onClick={handleCreateRecipe}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
          >
            {t('recipes.create_recipe')}
          </button>
        </div>

        {/* Recipes Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{t('recipes.no_recipes_found')}</h2>
            <p className="text-gray-600 mb-6">
              {t('recipes.try_adjusting')}
            </p>
            <button
              onClick={handleCreateRecipe}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
            >
              {t('recipes.create_recipe')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
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
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{recipe.title}</h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {renderStars(recipe.averageRating || 0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {recipe.averageRating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({recipe._count.ratings} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      {t('recipes.by')} <span className="font-medium text-gray-800">{t('recipes.chef')} {recipe.user.email?.split('@')[0] || recipe.user.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {(recipe.prepTime || 0) + (recipe.cookTime || 0)}min
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {recipe.servings} {t('recipes.servings')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewRecipe(recipe.id)}
                    className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    {t('recipes.view_recipe')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}