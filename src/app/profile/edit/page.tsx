'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslateWithFallback } from '../../../lib/translations'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string | null
  email: string
  bio: string | null
  location: string | null
  website: string | null
  cookingExperience: string | null
  favoritesCuisines: string | null
  dietaryRestrictions: string | null
  profilePicture: string | null
  isPublicProfile: boolean
}

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useTranslateWithFallback()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    cookingExperience: '',
    favoritesCuisines: [] as string[],
    dietaryRestrictions: [] as string[],
    profilePicture: '',
    isPublicProfile: true
  })

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
        
        // Parse JSON fields
        const cuisines = data.favoritesCuisines ? JSON.parse(data.favoritesCuisines) : []
        const dietary = data.dietaryRestrictions ? JSON.parse(data.dietaryRestrictions) : []
        
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          cookingExperience: data.cookingExperience || '',
          favoritesCuisines: cuisines,
          dietaryRestrictions: dietary,
          profilePicture: data.profilePicture || '',
          isPublicProfile: data.isPublicProfile
        })
      } else {
        setError('Failed to load profile')
      }
    } catch (error) {
      setError('An error occurred while loading profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleArrayInputChange = (field: 'favoritesCuisines' | 'dietaryRestrictions', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    setFormData(prev => ({ ...prev, [field]: items }))
  }

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError(t('profile.edit.invalid_file_type'))
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError(t('profile.edit.file_too_large'))
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, profilePicture: data.imageUrl }))
        setSuccessMessage(t('profile.edit.profile_picture_uploaded'))
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || t('profile.edit.upload_error'))
      }
    } catch (error) {
      setError(t('profile.edit.upload_error'))
    } finally {
      setIsUploading(false)
    }
  }

  const removeProfilePicture = () => {
    setFormData(prev => ({ ...prev, profilePicture: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccessMessage(t('profile.edit.save_success'))
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || t('profile.edit.save_error'))
      }
    } catch (error) {
      setError(t('profile.edit.save_error'))
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{t('profile.edit.title')}</h1>
            <Link
              href="/profile"
              className="btn btn-outline btn-sm"
            >
              {t('profile.edit.cancel')}
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('profile.edit.personal_info')}</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.edit.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('profile.edit.name_placeholder')}
                  className="input input-bordered w-full bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.edit.bio')}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder={t('profile.edit.bio_placeholder')}
                  className="textarea textarea-bordered w-full bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.edit.location')}
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder={t('profile.edit.location_placeholder')}
                  className="input input-bordered w-full bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.edit.website')}
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder={t('profile.edit.website_placeholder')}
                  className="input input-bordered w-full bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('profile.edit.profile_picture')}</h2>
            
            <div className="flex items-start space-x-6">
              {/* Current Profile Picture */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {formData.profilePicture ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {formData.name?.charAt(0)?.toUpperCase() || profile?.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.edit.change_picture')}
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="btn btn-outline btn-sm cursor-pointer">
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                            {t('profile.edit.uploading')}
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            {t('profile.edit.upload_picture')}
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleProfilePictureUpload}
                          disabled={isUploading}
                        />
                      </label>
                      
                      {formData.profilePicture && (
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="btn btn-outline btn-error btn-sm"
                          disabled={isUploading}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {t('profile.edit.remove_picture')}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {t('profile.edit.picture_requirements')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cooking Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('profile.edit.cooking_preferences')}</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="cookingExperience" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.edit.experience_level')}
                </label>
                <select
                  id="cookingExperience"
                  name="cookingExperience"
                  value={formData.cookingExperience}
                  onChange={handleInputChange}
                  className="select select-bordered w-full bg-gray-50 text-gray-900"
                >
                  <option value="">{t('profile.edit.select_experience')}</option>
                  <option value="beginner">{t('profile.experience.beginner')}</option>
                  <option value="intermediate">{t('profile.experience.intermediate')}</option>
                  <option value="advanced">{t('profile.experience.advanced')}</option>
                  <option value="professional">{t('profile.experience.professional')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="favoritesCuisines" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.edit.cuisines')}
                </label>
                <input
                  type="text"
                  id="favoritesCuisines"
                  value={formData.favoritesCuisines.join(', ')}
                  onChange={(e) => handleArrayInputChange('favoritesCuisines', e.target.value)}
                  placeholder={t('profile.edit.cuisines_placeholder')}
                  className="input input-bordered w-full bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.edit.dietary')}
                </label>
                <input
                  type="text"
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions.join(', ')}
                  onChange={(e) => handleArrayInputChange('dietaryRestrictions', e.target.value)}
                  placeholder={t('profile.edit.dietary_placeholder')}
                  className="input input-bordered w-full bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('profile.edit.privacy')}</h2>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  <div>
                    <div className="font-medium">{t('profile.edit.public_profile')}</div>
                    <div className="text-sm text-gray-500">{t('profile.edit.public_profile_help')}</div>
                  </div>
                </span>
                <input
                  type="checkbox"
                  name="isPublicProfile"
                  checked={formData.isPublicProfile}
                  onChange={handleInputChange}
                  className="toggle toggle-primary"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary px-8"
            >
              {isSaving ? t('profile.edit.saving') : t('profile.edit.save_changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}