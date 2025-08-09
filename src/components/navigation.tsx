'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useTolgee } from '@tolgee/react'
import { useTranslateWithFallback } from '../lib/translations'

export function Navigation() {
  const { data: session } = useSession()
  const { t } = useTranslateWithFallback()

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f1c]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <span>apps_dev</span>
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {/* Desktop Navigation - Only Home and Recipes */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-orange-500 font-medium hover:text-orange-400 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t('navigation.home')}
            </Link>
            <Link href="/recipes" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              {t('navigation.recipes')}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            {session ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 h-10 rounded-full">
                    {session.user?.image ? (
                      <img
                        alt={session.user.name || 'User'}
                        src={session.user.image}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                        {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-[#0b0f1c]/95 backdrop-blur-md border border-white/10 rounded-lg z-[1] mt-3 w-48 p-2 shadow-xl">
                  <li>
                    <Link href="/profile" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2">
                      {t('navigation.profile')}
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => signOut()} className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 text-left w-full">
                      {t('navigation.sign_out')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="border border-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                {t('navigation.sign_up')}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Link href="/" className="text-orange-500 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('navigation.home')}
              </Link>
              <Link href="/recipes" className="text-white/80 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                {t('navigation.recipes')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function LanguageSelector() {
  const { t } = useTranslateWithFallback()
  const tolgee = useTolgee(['language'])
  const currentLanguage = tolgee.getLanguage()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
  ]

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await tolgee.changeLanguage(languageCode)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="text-white/80 hover:text-white transition-colors">
        <span className="text-lg">🌐</span>
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-[#0b0f1c]/95 backdrop-blur-md border border-white/10 rounded-lg z-[1] w-48 p-2 shadow-xl">
        {languages.map((language) => (
          <li key={language.code}>
            <button
              onClick={() => handleLanguageChange(language.code)}
              className={`text-left w-full px-3 py-2 rounded-lg transition-colors ${
                currentLanguage === language.code 
                  ? 'text-orange-500 bg-orange-500/10' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {language.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}