'use client'

import Link from 'next/link'
import { useTranslateWithFallback } from '../lib/translations'

export default function SidebarNavigation() {
  const { t } = useTranslateWithFallback()

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-r-2xl p-4 flex flex-col gap-6">
        {/* Trending */}
        <Link 
          href="/trending" 
          className="group flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all duration-200"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs font-medium">Trending</span>
        </Link>

        {/* About Us */}
        <Link 
          href="/about" 
          className="group flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all duration-200"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs font-medium">About</span>
        </Link>

        {/* Contact Us */}
        <Link 
          href="/contact" 
          className="group flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all duration-200"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs font-medium">Contact</span>
        </Link>

        {/* Language Selector */}
        <div className="pt-4 border-t border-white/10">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer">
            <span className="text-sm font-bold">EN</span>
          </div>
        </div>
      </div>
    </div>
  )
} 