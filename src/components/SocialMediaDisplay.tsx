'use client'

import { useState, useEffect } from 'react'
import { useTranslateWithFallback } from '../lib/translations'
import { 
  getPlatformIcon,
  formatDisplayUrl,
  type SocialMediaPlatform 
} from '../lib/socialMedia'

interface SocialMediaLink {
  id: string
  platform: SocialMediaPlatform
  url: string
  username: string | null
  verified: boolean
  clickCount: number
}

interface SocialMediaDisplayProps {
  userId: string
  className?: string
  showTitle?: boolean
  compact?: boolean
}

export default function SocialMediaDisplay({ 
  userId, 
  className = '', 
  showTitle = true, 
  compact = false 
}: SocialMediaDisplayProps) {
  const { t } = useTranslateWithFallback()
  const [links, setLinks] = useState<SocialMediaLink[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSocialMediaLinks()
  }, [userId])

  const fetchSocialMediaLinks = async () => {
    try {
      const response = await fetch(`/api/profile/${userId}/social-media`)
      if (response.ok) {
        const data = await response.json()
        setLinks(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch social media links')
        setLinks([]) // Ensure links is always an array
      }
    } catch (error) {
      console.error('Error fetching social media links:', error)
      setLinks([]) // Ensure links is always an array
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkClick = async (linkId: string, url: string) => {
    // Track click analytics
    try {
      await fetch(`/api/social-media/${linkId}/click`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Failed to track click:', error)
    }
    
    // Open link in new tab
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (isLoading) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
          </div>
        )}
        <div className="animate-pulse flex space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    )
  }

  if (links.length === 0) {
    return null
  }

  if (compact) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {t('social_media.connect_with')}
          </h3>
        )}
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              title={`${t(`social_media.platforms.${link.platform}`)}${link.username ? ` - @${link.username}` : ''}`}
            >
              <span className="text-lg">
                {getPlatformIcon(link.platform)}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('social_media.connect_with')}
        </h3>
      )}
      
      <div className="space-y-3">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleLinkClick(link.id, link.url)}
            className="flex items-center space-x-3 w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left group"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                <span className="text-xl">
                  {getPlatformIcon(link.platform)}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">
                  {t(`social_media.platforms.${link.platform}`)}
                </p>
                {link.verified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">
                {link.username ? `@${link.username}` : formatDisplayUrl(link.url)}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}