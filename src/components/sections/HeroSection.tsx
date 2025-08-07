'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useTranslateWithFallback } from '../../lib/translations'

interface HeroSectionProps {
  className?: string
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const { data: session } = useSession()
  const { t } = useTranslateWithFallback()

  return (
    <div className={`relative rounded-2xl overflow-hidden mb-12 shadow-xl ${className}`}>
      <div
        className="h-[500px] bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 max-w-4xl mx-4 border border-white/20">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-orange-100">
              {t('home.hero_title')}
            </h1>
            <p className="text-2xl md:text-3xl mb-10 max-w-3xl text-orange-50">
              {t('home.hero_subtitle')}
            </p>
            <div className="flex gap-6 justify-center">
              {session ? (
                <Link
                  href="/recipes"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 border border-white/30 transform hover:scale-105 shadow-lg"
                >
                  {t('home.explore_recipes')}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {t('navigation.sign_up')}
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 border border-white/30 transform hover:scale-105 shadow-lg"
                  >
                    {t('navigation.sign_in')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 