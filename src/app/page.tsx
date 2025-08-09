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
        {/* About Us Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('home.about_us_title')}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
            {t('home.about_us_text')}
          </p>
        </div>

        {/* Top Recipes Section */}
        <div id="recipes-section">
          <TopRecipesSection isVisible={showRecipes} />
        </div>
      </div>
    </div>
  )
}
