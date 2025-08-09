'use client'

import { useState } from 'react'
import { useTranslateWithFallback } from '../lib/translations'
import HeroSection from '../components/sections/HeroSection'
import TopRecipesSection from '../components/sections/TopRecipesSection'

export default function Home() {
  const { t } = useTranslateWithFallback()
  const [showRecipes, setShowRecipes] = useState(false)

  const handleScrollToRecipes = () => {
    setShowRecipes(true)
    // Smooth scroll to recipes section
    setTimeout(() => {
      const recipesSection = document.getElementById('recipes-section')
      if (recipesSection) {
        recipesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-[#0b0f1c]">
      {/* Full-bleed hero */}
      <HeroSection onScrollToRecipes={handleScrollToRecipes} />

      {/* Content sections */}
      <div className="max-w-8xl mx-auto px-8 py-16">
        {/* Top Recipes Section */}
        <div id="recipes-section" className="mb-20">
          <TopRecipesSection isVisible={showRecipes} />
        </div>

        {/* About Us Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('home.about_us_title') || 'About ChefMaster'}
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400 mb-4">
                Discover Culinary Excellence
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {'ChefMaster is your gateway to culinary mastery. Whether you\'re a beginner or a seasoned cook, our platform offers everything you need to create extraordinary dishes.'}
              </p>
              <p className="text-gray-300 leading-relaxed">
                Join our community of passionate food lovers, share your favorite recipes, and discover new culinary adventures from around the world.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">500+</div>
                  <div className="text-gray-400 text-sm">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">50+</div>
                  <div className="text-gray-400 text-sm">Chefs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">10k+</div>
                  <div className="text-gray-400 text-sm">Users</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop" 
                  alt="ChefMaster Kitchen"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
