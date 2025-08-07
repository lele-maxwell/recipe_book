'use client'

import { useTranslateWithFallback } from '../lib/translations'
import HeroSection from '../components/sections/HeroSection'
import TopRecipesSection from '../components/sections/TopRecipesSection'
import RatingsSection from '../components/sections/RatingsSection'

export default function Home() {
  const { t } = useTranslateWithFallback()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* About Us Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('home.about_us_title')}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
            {t('home.about_us_text')}
          </p>
        </div>

        {/* Top Recipes Section */}
        <TopRecipesSection />

        {/* Ratings Section */}
        <RatingsSection />
      </div>
    </div>
  )
}
