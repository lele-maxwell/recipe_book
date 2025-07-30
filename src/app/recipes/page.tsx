'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslateWithFallback } from '../../lib/translations'
import { RecipeWithDetails } from '@/types/recipe'
import OptimizedImage from '../../components/OptimizedImage'
import { RecommendationSection } from '../../components/RecommendationSection'

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
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop&crop=center',
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
    imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&crop=center',
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
  
  // Advanced filtering states
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [selectedDietary, setSelectedDietary] = useState('')
  const [maxCookTime, setMaxCookTime] = useState('')
  const [selectedMealType, setSelectedMealType] = useState('')
  const [minRating, setMinRating] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  const { t } = useTranslateWithFallback()

  // Filter options
  const cuisineTypes = ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'American', 'French', 'Indian', 'Thai', 'Chinese', 'Japanese']
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'Paleo', 'Halal', 'Kosher']
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Side Dish', 'Beverage']
  const cookTimeOptions = ['15', '30', '45', '60', '90']

  // Enhanced filtering function
  const applyAdvancedFilters = (recipesToFilter: RecipeWithDetails[]) => {
    let filteredRecipes = [...recipesToFilter]

    // Apply search filter
    if (search) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(search.toLowerCase())) ||
        (recipe.user.name && recipe.user.name.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Apply cuisine filter (mock implementation - in real app this would be a recipe field)
    if (selectedCuisine) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const title = recipe.title.toLowerCase()
        const description = recipe.description?.toLowerCase() || ''
        const cuisineKeywords = {
          'Italian': ['pasta', 'parmesan', 'italian'],
          'Asian': ['stir fry', 'asian', 'soy sauce'],
          'Mexican': ['tacos', 'salsa', 'mexican'],
          'Mediterranean': ['mediterranean', 'olives', 'feta'],
          'American': ['burger', 'bbq', 'american'],
          'French': ['french', 'toast', 'cream'],
          'Indian': ['curry', 'spices', 'indian'],
          'Thai': ['thai', 'coconut'],
          'Chinese': ['chinese', 'stir'],
          'Japanese': ['japanese', 'sushi']
        }
        const keywords = cuisineKeywords[selectedCuisine as keyof typeof cuisineKeywords] || []
        return keywords.some(keyword => title.includes(keyword) || description.includes(keyword))
      })
    }

    // Apply dietary filter (mock implementation)
    if (selectedDietary) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const title = recipe.title.toLowerCase()
        const description = recipe.description?.toLowerCase() || ''
        const dietaryKeywords = {
          'Vegetarian': ['vegetable', 'mushroom', 'salad'],
          'Vegan': ['vegetable', 'coconut'],
          'Gluten-Free': ['salmon', 'grilled'],
          'Dairy-Free': ['coconut', 'dairy-free'],
          'Keto': ['salmon', 'low-carb'],
          'Low-Carb': ['salmon', 'grilled'],
          'Paleo': ['salmon', 'grilled'],
          'Halal': ['halal'],
          'Kosher': ['kosher']
        }
        const keywords = dietaryKeywords[selectedDietary as keyof typeof dietaryKeywords] || []
        return keywords.some(keyword => title.includes(keyword) || description.includes(keyword))
      })
    }

    // Apply cooking time filter
    if (maxCookTime) {
      const maxTime = parseInt(maxCookTime)
      filteredRecipes = filteredRecipes.filter(recipe =>
        (recipe.prepTime || 0) + (recipe.cookTime || 0) <= maxTime
      )
    }

    // Apply meal type filter (mock implementation)
    if (selectedMealType) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const title = recipe.title.toLowerCase()
        const mealKeywords = {
          'Breakfast': ['toast', 'breakfast'],
          'Lunch': ['salad', 'pasta', 'soup'],
          'Dinner': ['salmon', 'chicken', 'beef', 'curry'],
          'Snack': ['snack'],
          'Dessert': ['cake', 'chocolate', 'dessert'],
          'Appetizer': ['appetizer'],
          'Side Dish': ['side'],
          'Beverage': ['drink', 'beverage']
        }
        const keywords = mealKeywords[selectedMealType as keyof typeof mealKeywords] || []
        return keywords.some(keyword => title.includes(keyword))
      })
    }

    // Apply minimum rating filter
    if (minRating) {
      const minRatingValue = parseFloat(minRating)
      filteredRecipes = filteredRecipes.filter(recipe =>
        (recipe.averageRating || 0) >= minRatingValue
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
        case 'cookTime':
          aValue = (a.prepTime || 0) + (a.cookTime || 0)
          bValue = (b.prepTime || 0) + (b.cookTime || 0)
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

    return filteredRecipes
  }

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
          
          // Apply advanced filters
          const filteredRecipes = applyAdvancedFilters(recipesToShow)
          setRecipes(filteredRecipes)
        } else {
          console.error('Failed to fetch recipes')
          // Fallback to mock data if API fails and apply advanced filters
          const filteredRecipes = applyAdvancedFilters(mockRecipes)
          setRecipes(filteredRecipes)
        }
      } catch (error) {
        console.error('Error fetching recipes:', error)
        // Fallback to mock data and apply advanced filters
        const filteredRecipes = applyAdvancedFilters(mockRecipes)
        setRecipes(filteredRecipes)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [search, sortBy, sortOrder, selectedCuisine, selectedDietary, maxCookTime, selectedMealType, minRating])

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

        {/* Quick Filter Tags */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setMaxCookTime(maxCookTime === '30' ? '' : '30')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                maxCookTime === '30'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🕐 Quick Meals (≤30min)
            </button>
            <button
              onClick={() => setSelectedDietary(selectedDietary === 'Vegetarian' ? '' : 'Vegetarian')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedDietary === 'Vegetarian'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🥬 Vegetarian
            </button>
            <button
              onClick={() => setMinRating(minRating === '4' ? '' : '4')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                minRating === '4'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ Highly Rated (4+)
            </button>
            <button
              onClick={() => setSelectedMealType(selectedMealType === 'Dessert' ? '' : 'Dessert')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedMealType === 'Dessert'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🍰 Desserts
            </button>
          </div>
        </div>

        {/* Advanced Filter Controls and Create Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full lg:w-auto">
            {/* Sort By */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 min-w-[140px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="cookTime">Sort by Cook Time</option>
            </select>

            {/* Sort Order */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 min-w-[120px]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                showFilters
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Filters
              {(selectedCuisine || selectedDietary || maxCookTime || selectedMealType || minRating) && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {[selectedCuisine, selectedDietary, maxCookTime, selectedMealType, minRating].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={handleCreateRecipe}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium w-full sm:w-auto"
          >
            {t('recipes.create_recipe')}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Cuisine Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  <option value="">All Cuisines</option>
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              {/* Dietary Restrictions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  value={selectedDietary}
                  onChange={(e) => setSelectedDietary(e.target.value)}
                >
                  <option value="">All Diets</option>
                  {dietaryOptions.map(diet => (
                    <option key={diet} value={diet}>{diet}</option>
                  ))}
                </select>
              </div>

              {/* Max Cook Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Cook Time</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  value={maxCookTime}
                  onChange={(e) => setMaxCookTime(e.target.value)}
                >
                  <option value="">Any Time</option>
                  {cookTimeOptions.map(time => (
                    <option key={time} value={time}>≤ {time} minutes</option>
                  ))}
                </select>
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                >
                  <option value="">All Meals</option>
                  {mealTypes.map(meal => (
                    <option key={meal} value={meal}>{meal}</option>
                  ))}
                </select>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedCuisine || selectedDietary || maxCookTime || selectedMealType || minRating) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedCuisine('')
                    setSelectedDietary('')
                    setMaxCookTime('')
                    setSelectedMealType('')
                    setMinRating('')
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

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
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden rounded-t-xl h-64 md:h-72 lg:h-80">
                  {recipe.imageUrl ? (
                    <OptimizedImage
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      className="transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      priority={recipes.indexOf(recipe) < 4} // Prioritize first 4 images
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
                      {t('recipes.by')} <Link href={`/profile/${recipe.user.id}`} className="font-medium text-orange-600 hover:text-orange-700 hover:underline cursor-pointer">{t('recipes.chef')} {recipe.user.email?.split('@')[0] || recipe.user.name || 'Anonymous'}</Link>
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

        {/* Recommendation Sections */}
        {recipes.length > 0 && (
          <div className="mt-16 space-y-12">
            {/* Trending Recipes */}
            <RecommendationSection
              type="trending"
              title="🔥 Trending Recipes"
              subtitle="Popular recipes that everyone is talking about"
              limit={6}
              excludeIds={recipes.map(r => r.id)}
              className="mb-12"
            />

            {/* Personalized Recommendations (only for authenticated users) */}
            {session && (
              <RecommendationSection
                type="personalized"
                title="✨ Recommended for You"
                subtitle="Recipes tailored to your taste preferences"
                limit={6}
                excludeIds={recipes.map(r => r.id)}
                className="mb-12"
              />
            )}

            {/* Quick Meals */}
            <RecommendationSection
              type="occasion"
              occasion="quick_meals"
              title="⚡ Quick & Easy Meals"
              subtitle="Delicious recipes ready in 30 minutes or less"
              limit={6}
              excludeIds={recipes.map(r => r.id)}
              className="mb-12"
            />

            {/* Comfort Food */}
            <RecommendationSection
              type="occasion"
              occasion="comfort_food"
              title="🏠 Comfort Food Classics"
              subtitle="Hearty, soul-warming dishes for cozy moments"
              limit={6}
              excludeIds={recipes.map(r => r.id)}
              className="mb-12"
            />
          </div>
        )}
      </div>
    </div>
  )
}