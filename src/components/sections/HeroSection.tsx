'use client'

import { useTranslateWithFallback } from '../../lib/translations'
import Link from 'next/link'

interface HeroSectionProps {
  heroBg?: string
  onScrollToRecipes?: () => void
}

export default function HeroSection({ 
  heroBg = process.env.NEXT_PUBLIC_HERO_BG_URL || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop',
  onScrollToRecipes
}: HeroSectionProps) {
  const { t } = useTranslateWithFallback()

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background Image */}
      <div 
        className="min-h-[85vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(8,11,22,0.9) 0%, rgba(8,11,22,0.7) 50%, rgba(8,11,22,0.4) 100%), url('${heroBg}')`
        }}
      >
        {/* Decorative Dots */}
        <div className="absolute right-16 top-20 grid grid-cols-6 gap-1.5 opacity-50">
          <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24 lg:py-28 min-h-[85vh] flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Discover Culinary Excellence
            </h1>
            <p className="mt-6 text-base md:text-lg text-gray-300 max-w-xl leading-relaxed">
              Explore world-class recipes from renowned chefs. From quick meals to gourmet experiences, 
              find your next culinary adventure.
            </p>
            <div className="mt-8 flex gap-4">
              <Link 
                href="/recipes"
                className="rounded-full bg-orange-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-600/25 transition-all duration-200 hover:bg-orange-500 hover:shadow-orange-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                Get Started
              </Link>
              <Link 
                href="/auth/signin"
                className="rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/30"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-12 h-0.5 bg-white/30"></div>
          <button
            onClick={onScrollToRecipes}
            className="group p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
            aria-label="Scroll to recipes"
          >
            <svg 
              className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Gradient Edges */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(255,125,26,0.12),transparent),radial-gradient(1200px_600px_at_90%_0%,rgba(255,125,26,0.08),transparent)]"></div>
    </section>
  )
} 