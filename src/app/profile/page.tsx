'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslate } from '@tolgee/react'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  location: string | null
  website: string | null
  cookingExperience: string | null
  favoritesCuisines: string | null
  dietaryRestrictions: string | null
  profilePicture: string | null
  isPublicProfile: boolean
  createdAt: string
  _count: {
    recipes: number
    ratings: number
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useTranslate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        setError('Failed to load profile')
      }
    } catch (error) {
      setError('An error occurred while loading profile')
    } finally {
      setIsLoading(false)
    }
  }

  const getExperienceLevel = (level: string | null) => {
    switch (level) {
      case 'beginner': return t('profile.experience.beginner')
      case 'intermediate': return t('profile.experience.intermediate')
      case 'advanced': return t('profile.experience.advanced')
      case 'professional': return t('profile.experience.professional')
      default: return t('profile.experience.not_specified')
    }
  }

  const parseCuisines = (cuisines: string | null) => {
    if (!cuisines) return []
    try {
      return JSON.parse(cuisines)
    } catch {
      return []
    }
  }

  const parseDietaryRestrictions = (restrictions: string | null) => {
    if (!restrictions) return []
    try {
      return JSON.parse(restrictions)
    } catch {
      return []
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('common.error')}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProfile}
            className="btn btn-primary"
          >
            {t('common.try_again')}
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('profile.not_found')}</h1>
          <Link href="/" className="btn btn-primary">
            {t('navigation.home')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profile.profilePicture || profile.image ? (
                  <img
                    src={profile.profilePicture || profile.image || ''}
                    alt={profile.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.name || t('profile.anonymous_user')}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                  {profile.location && (
                    <p className="text-gray-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      {profile.location}
                    </p>
                  )}
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link
                    href="/profile/edit"
                    className="btn btn-outline btn-sm"
                  >
                    {t('profile.edit_profile')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('profile.about')}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Website */}
          {profile.website && (
            <div className="mt-4">
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
                </svg>
                {profile.website}
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.statistics')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('profile.recipes_created')}</span>
                <span className="font-semibold text-orange-600">{profile._count.recipes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('profile.ratings_given')}</span>
                <span className="font-semibold text-orange-600">{profile._count.ratings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('profile.member_since')}</span>
                <span className="font-semibold text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Cooking Experience & Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cooking Experience */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.cooking_experience')}</h3>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                <span className="text-gray-700">{getExperienceLevel(profile.cookingExperience)}</span>
              </div>
            </div>

            {/* Favorite Cuisines */}
            {parseCuisines(profile.favoritesCuisines).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.favorite_cuisines')}</h3>
                <div className="flex flex-wrap gap-2">
                  {parseCuisines(profile.favoritesCuisines).map((cuisine: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Restrictions */}
            {parseDietaryRestrictions(profile.dietaryRestrictions).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.dietary_restrictions')}</h3>
                <div className="flex flex-wrap gap-2">
                  {parseDietaryRestrictions(profile.dietaryRestrictions).map((restriction: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {restriction}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Recipes */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('profile.recent_recipes')}</h3>
            <Link href="/my-recipes" className="text-orange-600 hover:text-orange-700 text-sm">
              {t('profile.view_all_recipes')}
            </Link>
          </div>
          <div className="text-gray-500 text-center py-8">
            {t('profile.recent_recipes_placeholder')}
          </div>
        </div>
      </div>
    </div>
  )
}