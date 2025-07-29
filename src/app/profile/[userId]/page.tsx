'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslateWithFallback } from '../../../lib/translations'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Recipe {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  createdAt: string
  ratings: { value: number }[]
}

interface PublicProfile {
  id: string
  name: string | null
  email?: string
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
  isOwnProfile: boolean
  isFollowing: boolean
  recipes: Recipe[]
  statistics: {
    publishedRecipes: number
    ratingsGiven?: number
    averageRatingReceived: number
    totalRatingsReceived: number
    mostPopularRecipe: {
      id: string
      title: string
      averageRating: number
      totalRatings: number
    } | null
    followersCount: number
    memberSince: string
  }
}

export default function PublicProfilePage() {
  const { data: session } = useSession()
  const { t } = useTranslateWithFallback()
  const params = useParams()
  const userId = params.userId as string
  
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setIsFollowing(data.isFollowing || false)
        setFollowersCount(data.statistics.followersCount || 0)
      } else if (response.status === 403) {
        setError(t('profile.public.private_profile'))
      } else if (response.status === 404) {
        setError(t('profile.public.not_found'))
      } else {
        setError(t('profile.public.load_error'))
      }
    } catch (error) {
      setError(t('profile.public.load_error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowToggle = async () => {
    if (!session) {
      // Redirect to login or show login modal
      return
    }

    setIsFollowLoading(true)
    try {
      const method = isFollowing ? 'DELETE' : 'POST'
      const response = await fetch(`/api/profile/${userId}/follow`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.isFollowing)
        setFollowersCount(data.followersCount)
      } else {
        console.error('Failed to toggle follow status')
      }
    } catch (error) {
      console.error('Error toggling follow status:', error)
    } finally {
      setIsFollowLoading(false)
    }
  }

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).getFullYear().toString()
  }

  const calculateAverageRating = (ratings: { value: number }[]) => {
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, rating) => acc + rating.value, 0)
    return Math.round((sum / ratings.length) * 10) / 10
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      )
    }

    return stars
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
            {t('profile.public.go_home')}
          </Link>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 text-center">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-5xl font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || profile.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name and Email */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chef {profile.name || profile.email?.split('@')[0] || 'User'}
          </h1>
          {!profile.isOwnProfile && profile.email && (
            <p className="text-gray-600 mb-6">{profile.email}</p>
          )}

          {/* Follow Button */}
          {!profile.isOwnProfile && session && (
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                } ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className={`text-sm font-bold ${isFollowing ? 'text-gray-700' : 'text-orange-500'}`}>
                      {profile.name?.charAt(0)?.toUpperCase() || profile.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span>
                  {isFollowLoading ? t('common.loading') : (isFollowing ? t('profile.public.following') : t('profile.public.follow'))}
                </span>
              </button>
            </div>
          )}

          {/* Edit Profile Button for Own Profile */}
          {profile.isOwnProfile && (
            <Link
              href="/profile/edit"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-2 rounded-full font-medium transition-colors inline-block"
            >
              {t('profile.edit_profile')}
            </Link>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Recipes Created */}
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {profile.statistics.publishedRecipes}
            </div>
            <div className="text-gray-600 font-medium">Recipes Created</div>
          </div>

          {/* Ratings Given */}
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {profile.statistics.totalRatingsReceived || 0}
            </div>
            <div className="text-gray-600 font-medium">Ratings Given</div>
          </div>

          {/* Followers */}
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {followersCount}
            </div>
            <div className="text-gray-600 font-medium">Followers</div>
          </div>
        </div>

        {/* Cooking Experience and Promotional Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cooking Experience */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cooking Experience</h3>
            <div className="text-2xl font-bold text-gray-700 capitalize">
              {profile.cookingExperience ? t(`profile.experience.${profile.cookingExperience}`) : 'Intermediate'}
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Hor Taiferi</h3>
              <p className="text-orange-100 text-sm">Master the art of cooking</p>
            </div>
            {/* Decorative cooking icons */}
            <div className="absolute right-4 top-4 opacity-20">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Recent Recipes */}
        {profile.recipes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.recipes.slice(0, 6).map((recipe) => (
                <div key={recipe.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {recipe.title}
                    </h3>
                    {recipe.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {renderStars(calculateAverageRating(recipe.ratings))}
                        <span className="text-sm text-gray-600 ml-2">
                          ({recipe.ratings.length})
                        </span>
                      </div>
                      
                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        View Recipe →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
{/* Bio Section */}
{profile.bio && (
  <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
  </div>
)}

{/* Cooking Preferences */}
{(profile.favoritesCuisines || profile.dietaryRestrictions) && (
  <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Cooking Preferences</h2>
    <div className="space-y-6">
      {profile.favoritesCuisines && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Favorite Cuisines</h3>
          <div className="flex flex-wrap gap-2">
            {JSON.parse(profile.favoritesCuisines).map((cuisine: string, index: number) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {profile.dietaryRestrictions && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Dietary Restrictions</h3>
          <div className="flex flex-wrap gap-2">
            {JSON.parse(profile.dietaryRestrictions).map((restriction: string, index: number) => (
              <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {restriction}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}
</div>
</div>
)
}
          