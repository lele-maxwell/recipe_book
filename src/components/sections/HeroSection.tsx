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
    <section
      className={`relative isolate overflow-hidden ${className}`}
    >
      {/* Background image with gradient overlay */}
      <div
        className="relative min-h-[80vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(8,11,22,0.85) 0%, rgba(8,11,22,0.65) 40%, rgba(8,11,22,0.35) 100%), url('${heroBg}')`,
        }}
      >
        {/* Decorative dots */}
        <div className="pointer-events-none absolute right-12 top-24 grid grid-cols-6 gap-2 opacity-60">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-sm bg-orange-500/60" />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-center px-6 py-24 md:py-28 lg:py-32 min-h-[80vh]">
          <div className="max-w-2xl">
            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white md:text-6xl">
              {t('home.hero_title') || 'Cook Easy With The Recipe'}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-xl">
              {t('home.hero_subtitle') ||
                'Want to eat delicious food? Then come on over here. As fast as you expect.'}
            </p>
            <div className="mt-10 flex gap-4">
              <Link
                href={session ? '/recipes' : '/auth/signup'}
                className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:bg-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                {session ? t('home.explore_recipes') : t('navigation.sign_up') || 'Get Started'}
              </Link>
              {!session && (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  {t('navigation.sign_in')}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-orange-500">▼</div>

        {/* Gradient edges for a premium look */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(255,125,26,0.15),transparent),radial-gradient(1200px_600px_at_90%_0%,rgba(255,125,26,0.12),transparent)]" />
      </div>
    </section>
  )
} 