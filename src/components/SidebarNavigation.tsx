'use client'

import Link from 'next/link'

export default function SidebarNavigation() {

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-r-2xl p-3 flex flex-col gap-4">
        {/* Trending */}
        <Link 
          href="/trending" 
          className="group flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all duration-200"
        >
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.016 2.011c4.963 0.018 8.972 4.027 8.99 8.99-1.584-1.595-3.740-2.496-6.001-2.496-2.315 0-4.512 0.931-6.144 2.563-1.631 1.631-2.563 3.829-2.563 6.144 0 2.261 0.901 4.417 2.496 6.001-4.963-0.018-8.972-4.027-8.99-8.99 0.018-4.963 4.027-8.972 8.99-8.99z"/>
              <path d="M18.5 14.5c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5c0-1.657 0.895-3.1 2.227-3.882 0.223-0.131 0.473-0.118 0.673 0.118 0.2 0.236 0.1 0.618-0.1 0.764-0.6 0.436-1 1.127-1 1.9 0 1.381 1.119 2.5 2.5 2.5s2.5-1.119 2.5-2.5c0-0.773-0.4-1.464-1-1.9-0.2-0.146-0.3-0.528-0.1-0.764 0.2-0.236 0.45-0.249 0.673-0.118 1.332 0.782 2.227 2.225 2.227 3.882z"/>
            </svg>
          </div>
          <span className="text-xs font-medium">Trending</span>
        </Link>

        {/* About Us */}
        <Link 
          href="/about" 
          className="group flex flex-col items-center gap-2 text-white/80 hover:text-white transition-all duration-200"
        >
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xs font-medium">Contact</span>
        </Link>
      </div>
    </div>
  )
} 