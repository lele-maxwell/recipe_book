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

  const heroBg =
    process.env.NEXT_PUBLIC_HERO_BG_URL ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop'

  return (
    <section className={`relative isolate overflow-hidden ${className}`}>
      {/* Background image with gradient overlay */}
      <div
        className="relative min-h-[85vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(8,11,22,0.9) 0%, rgba(8,11,22,0.7) 50%, rgba(8,11,22,0.4) 100%), url('${heroBg}')`,
        }}
      >
        {/* Decorative dots - matching reference pattern */}
        <div className="pointer-events-none absolute right-16 top-20 grid grid-cols-6 gap-1.5 opacity-50">
          {Array.from({ length: 24 }).map((_, i) => (
            <span 
              key={i} 
              className={`h-1 w-1 rounded-sm ${
                i === 5 || i === 11 || i === 17 || i === 23 
                  ? 'bg-orange-500' 
                  : 'bg-orange-500/40'
              }`} 
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-center px-6 py-20 md:py-24 lg:py-28 min-h-[85vh]">
          <div className="max-w-2xl">
            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              {t('home.hero_title') || 'Cook Easy With The Recipe'}
            </h1>
            <p className="mt-6 text-base md:text-lg text-gray-300 max-w-xl leading-relaxed">
              {t('home.hero_subtitle') ||
                'Want to eat delicious food? Then come on over here. As fast as you expect.'}
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href={session ? '/recipes' : '/auth/signup'}
                className="inline-flex items-center justify-center rounded-full bg-orange-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-600/25 transition-all duration-200 hover:bg-orange-500 hover:shadow-orange-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                {session ? t('home.explore_recipes') : t('navigation.sign_up') || 'Get Started'}
              </Link>
              {!session && (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/30"
                >
                  {t('navigation.sign_in')}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom indicator line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-12 h-0.5 bg-white/30"></div>
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <div className="w-2 h-2 rounded-full bg-white/30"></div>
          <div className="w-2 h-2 rounded-full bg-white/30"></div>
        </div>

        {/* Gradient edges for premium look */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(255,125,26,0.12),transparent),radial-gradient(1200px_600px_at_90%_0%,rgba(255,125,26,0.08),transparent)]" />
      </div>
    </section>
  )
} 