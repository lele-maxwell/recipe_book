'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslate } from '@tolgee/react'

// Mock data for top recipes
const topRecipes = [
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

export default function Home() {
  const { data: session } = useSession()
  const { t } = useTranslate()

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-yellow-400 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  const handleRecipeClick = (recipeId: string) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }
    window.location.href = `/recipes/${recipeId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-xl">
          <div
            className="h-[500px] bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop')`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 max-w-4xl mx-4 border border-white/20">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 text-orange-100">
                  Welcome to ChefMaster Recipes
                </h1>
                <p className="text-2xl md:text-3xl mb-10 max-w-3xl text-orange-50">
                  Master your culinary skills and share your favorite recipes with a community of food lovers.
                </p>
                <div className="flex gap-6 justify-center">
                  {session ? (
                    <Link
                      href="/recipes"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 border border-white/30 transform hover:scale-105 shadow-lg"
                    >
                      Explore Recipes
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/auth/signup"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        Sign Up
                      </Link>
                      <Link
                        href="/auth/signin"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 border border-white/30 transform hover:scale-105 shadow-lg"
                      >
                        Log In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
            ChefMaster Recipes is a platform for food enthusiasts to explore, create, and share recipes from around the world. Our mission is
            to help you master your culinary skills and provide a space for culinary creativity to flourish.
          </p>
        </div>

        {/* Top Recipes Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Top Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topRecipes.map((recipe) => (
              <div key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400"><span class="text-4xl">🍽️</span></div>';
                        }
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {renderStars(recipe.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Rating: {recipe.rating}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      By {recipe.chef}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings Section */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ratings</h2>
          <div className="flex items-start gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">4.5</div>
              <div className="flex items-center justify-center mb-2">
                {renderStars(4.5)}
              </div>
              <div className="text-gray-600 text-sm">150 reviews</div>
            </div>
            
            <div className="flex-1 max-w-md">
              {[
                { stars: 5, percentage: 40, count: 60 },
                { stars: 4, percentage: 30, count: 45 },
                { stars: 3, percentage: 15, count: 23 },
                { stars: 2, percentage: 10, count: 15 },
                { stars: 1, percentage: 5, count: 7 }
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-600 w-2">{item.stars}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
