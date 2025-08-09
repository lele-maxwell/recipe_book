'use client'

import { useSession } from 'next-auth/react'
import { useTranslateWithFallback } from '../../lib/translations'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

interface Recipe {
  id: string
  title: string
  chef: string
  category: string
  difficulty: string
  image: string
  description: string
}

interface TopRecipesSectionProps {
  recipes?: Recipe[]
  className?: string
  isVisible?: boolean
}

const defaultRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Fresh Orange Juice',
    chef: 'Chef Isabella Rivera',
    category: 'Beverages',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
    description: 'Start your day with this refreshing homemade orange juice'
  },
  {
    id: '2',
    title: 'Tropical Fruit Salad',
    chef: 'Chef Marco Bianchi',
    category: 'Desserts',
    difficulty: 'Quick',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    description: 'A vibrant mix of tropical fruits in a colorful presentation'
  },
  {
    id: '3',
    title: 'Lemon Citrus Slices',
    chef: 'Chef Sofia Martinez',
    category: 'Garnishes',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    description: 'Perfect citrus garnish for cocktails and desserts'
  },
  {
    id: '4',
    title: 'Spa Facial Treatment',
    chef: 'Chef Alex Chen',
    category: 'Wellness',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    description: 'Relaxing facial treatment with natural ingredients'
  },
  {
    id: '5',
    title: 'Outdoor Dining Experience',
    chef: 'Chef Emma Wilson',
    category: 'Dining',
    difficulty: 'Advanced',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    description: 'Elegant outdoor dining with scenic water views'
  },
  {
    id: '6',
    title: 'Garden Fresh Salad',
    chef: 'Chef David Kim',
    category: 'Salads',
    difficulty: 'Quick',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    description: 'Fresh garden vegetables with homemade dressing'
  }
]

export default function TopRecipesSection({ 
  recipes = defaultRecipes, 
  className = '',
  isVisible = false // Changed default to false so section is hidden initially
}: TopRecipesSectionProps) {
  const { data: session } = useSession()
  const { t } = useTranslateWithFallback()
  const [animatedCards, setAnimatedCards] = useState<number[]>([])
  const [showHeadline, setShowHeadline] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollY, setScrollY] = useState(0)

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isVisible) {
      // Reset states when becoming visible
      setAnimatedCards([])
      setShowHeadline(false)
      setShowCTA(false)
      
      // Animate headline first
      setTimeout(() => setShowHeadline(true), 300)
      
      // Animate cards with staggered delays (0.15s between each)
      recipes.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedCards(prev => [...prev, index])
        }, 800 + (index * 150)) // 0.8s initial delay + 0.15s stagger
      })
      
      // Animate CTA after cards settle
      setTimeout(() => setShowCTA(true), 800 + (recipes.length * 150) + 500)
    }
  }, [isVisible, recipes.length])

  const handleRecipeClick = (recipeId: string) => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }
    window.location.href = `/recipes/${recipeId}`
  }

  // Don't render anything if not visible
  if (!isVisible) {
    return null
  }

  return (
    <div className={`relative py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100 overflow-hidden ${className}`}>
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating herbs and kitchen elements */}
        <div 
          className="absolute top-20 left-10 w-24 h-24 opacity-10"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-600">
            <path d="M50 10 Q60 30 50 50 Q40 30 50 10 M50 50 L50 90 M45 60 Q50 65 55 60 M45 70 Q50 75 55 70" 
                  fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        
        <div 
          className="absolute top-32 right-16 w-20 h-20 opacity-8"
          style={{ transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.05}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
            <circle cx="50" cy="30" r="8" fill="currentColor"/>
            <path d="M50 38 L50 85 M35 45 Q50 50 65 45 M40 60 Q50 65 60 60 M42 75 Q50 80 58 75" 
                  fill="none" stroke="currentColor" strokeWidth="3"/>
          </svg>
        </div>

        <div 
          className="absolute bottom-32 left-20 w-16 h-16 opacity-8"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
            <path d="M20 50 Q50 20 80 50 Q50 80 20 50 M50 35 L50 65 M35 50 L65 50" 
                  fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>

        <div 
          className="absolute top-60 right-32 w-18 h-18 opacity-6"
          style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
            <path d="M30 70 Q50 40 70 70 M50 70 Q60 60 70 50 Q60 40 50 50 Q40 40 30 50 Q40 60 50 70" 
                  fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Hero Headline */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          showHeadline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-5xl font-light text-gray-800 mb-6 tracking-wide">
            Top Recipes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our handpicked collection of exceptional recipes crafted by world-class chefs
          </p>
        </div>

        {/* Large Recipe Cards Grid */}
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
        >
          {recipes.slice(0, 6).map((recipe, index) => (
            <div 
              key={recipe.id} 
              className={`group cursor-pointer transition-all duration-800 ease-out large-recipe-card ${
                animatedCards.includes(index) 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 translate-y-8'
              } ${hoveredCard === index ? 'recipe-card-hover-active' : ''}`}
              onClick={() => handleRecipeClick(recipe.id)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${index * 0.15}s`
              }}
            >
              {/* Large Recipe Card */}
              <div className="relative w-full h-96 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden border border-orange-100">
                {/* Recipe Image */}
                <div className="relative h-64 overflow-hidden rounded-t-xl">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className={`recipe-image w-full h-full object-cover transition-all duration-300 ease-out ${
                      hoveredCard === index 
                        ? 'scale-105 brightness-110' 
                        : 'scale-100 brightness-100'
                    }`}
                    style={{
                      filter: hoveredCard === index 
                        ? 'brightness(1.1) contrast(1.05) saturate(1.1)' 
                        : 'brightness(1) contrast(1) saturate(1)'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full shadow-lg">
                      {recipe.category}
                    </span>
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full shadow-lg">
                      {recipe.difficulty}
                    </span>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent transition-opacity duration-300 ${
                    hoveredCard === index ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                </div>
                
                {/* Card Content */}
                <div className="p-6 h-32 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">
                      {recipe.chef}
                    </span>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                      <svg className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3D Depth Shadow */}
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                  hoveredCard === index 
                    ? 'shadow-2xl shadow-orange-500/20' 
                    : 'shadow-lg'
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className={`text-center transition-all duration-1000 ease-out delay-500 ${
          showCTA ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative inline-block">
            <Link 
              href="/recipes"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 text-lg"
            >
              Explore Recipes
              <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            {/* Floating indicator */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-orange-500 text-sm font-medium animate-pulse">
              <span className="block text-center">Start your culinary journey</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 