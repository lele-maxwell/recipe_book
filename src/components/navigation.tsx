'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useTolgee } from '@tolgee/react'
import { useTranslateWithFallback } from '../lib/translations'

export function Navigation() {
  const { data: session } = useSession()
  const { t } = useTranslateWithFallback()

  return (
    <nav className="navbar navbar-glass sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden navbar-nav-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content card-glass z-[1] mt-3 w-64 p-4 shadow-xl"
          >
            <li>
              <Link href="/" className="navbar-nav-item text-xl py-3">{t('navigation.home')}</Link>
            </li>
            <li>
              <Link href="/recipes" className="navbar-nav-item text-xl py-3">{t('navigation.recipes')}</Link>
            </li>
            {session && (
              <li>
                <Link href="/my-recipes" className="navbar-nav-item text-xl py-3">{t('navigation.my_recipes')}</Link>
              </li>
            )}
          </ul>
        </div>
        <Link href="/" className="navbar-brand flex items-center gap-3">
          <img
            src="/chef-logo-simple.svg"
            alt="ChefMaster Recipes Logo"
            className="h-16 w-auto object-contain"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'inline';
              }
            }}
          />
          <span style={{display: 'none'}}>🍳</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-2 gap-2">
          <li>
            <Link href="/" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold text-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
              {t('navigation.home')}
            </Link>
          </li>
          <li>
            <Link href="/recipes" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
              {t('navigation.recipes')}
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-4">
          {session && (
            <Link
              href="/my-recipes"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 text-lg transform hover:scale-105 shadow-lg hover:from-blue-600 hover:to-blue-700"
            >
              {t('navigation.my_recipes')}
            </Link>
          )}
          <LanguageSelector />
          {session ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-14 h-14 rounded-full">
                  {session.user?.image ? (
                    <img
                      alt={session.user.name || 'User'}
                      src={session.user.image}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content card-glass z-[1] mt-3 w-64 p-4 shadow-xl"
              >
                <li>
                  <Link href="/profile" className="navbar-nav-item text-xl py-3">{t('navigation.profile')}</Link>
                </li>
                <li>
                  <button onClick={() => signOut()} className="navbar-nav-item text-xl py-3">{t('navigation.sign_out')}</button>
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 border border-white/30 text-lg transform hover:scale-105 shadow-lg"
            >
              {t('navigation.sign_in')}
            </button>
          )}
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
      <div tabIndex={0} role="button" className="transition-all duration-200 transform hover:scale-110 cursor-pointer">
        <span className="text-4xl">🌐</span>
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg z-[1] w-64 p-4 shadow-xl">
        {languages.map((language) => (
          <li key={language.code}>
            <button
              onClick={() => handleLanguageChange(language.code)}
              className={`text-gray-800 hover:bg-orange-100 hover:text-orange-800 text-lg py-3 px-4 rounded-lg transition-colors duration-200 ${currentLanguage === language.code ? 'bg-orange-100 text-orange-800 font-semibold' : ''}`}
            >
              {language.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}