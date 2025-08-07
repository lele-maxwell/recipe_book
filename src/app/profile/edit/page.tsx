'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslateWithFallback } from '@/lib/translations'
import FormField from '@/components/FormField'
import LoadingSpinner from '@/components/LoadingSpinner'

interface FormData {
  name: string
  bio: string
  location: string
  website: string
  cookingExperience: string
  favoritesCuisines: string[]
  dietaryRestrictions: string[]
  profilePicture: string
  isPublicProfile: boolean
}

interface SocialMediaForm {
  platform: string
  url: string
}

export default function EditProfilePage() {
  const { t } = useTranslateWithFallback()
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    location: '',
    website: '',
    cookingExperience: '',
    favoritesCuisines: [],
    dietaryRestrictions: [],
    profilePicture: '',
    isPublicProfile: true
  })

  const [socialMediaForm, setSocialMediaForm] = useState<SocialMediaForm>({
    platform: '',
    url: ''
  })

  const cuisineOptions = [
    'Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'Thai', 'Mediterranean',
    'American', 'Greek', 'Spanish', 'Korean', 'Vietnamese', 'Lebanese', 'Turkish', 'Moroccan'
  ]

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher',
    'Low-Carb', 'Keto', 'Paleo', 'Pescatarian', 'Raw Food'
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setFormData({
            name: data.name || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.website || '',
            cookingExperience: data.cookingExperience || '',
            favoritesCuisines: data.favoritesCuisines || [],
            dietaryRestrictions: data.dietaryRestrictions || [],
            profilePicture: data.profilePicture || '',
            isPublicProfile: data.isPublicProfile !== false
          })
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleArrayInputChange = (field: 'favoritesCuisines' | 'dietaryRestrictions', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    setFormData(prev => ({ ...prev, [field]: items }))
  }

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSocialMediaForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      setError(t('profile.edit.save_error'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('profile.edit.loading')} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {t('profile.edit.title')}
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSocialMediaSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={t('profile.edit.name')}
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(value) => handleInputChange({ target: { name: 'name', value } } as React.ChangeEvent<HTMLInputElement>)}
                  placeholder={t('profile.edit.name_placeholder')}
                />

                <FormField
                  label={t('profile.edit.bio')}
                  name="bio"
                  type="textarea"
                  value={formData.bio}
                  onChange={(value) => handleInputChange({ target: { name: 'bio', value } } as React.ChangeEvent<HTMLTextAreaElement>)}
                  placeholder={t('profile.edit.bio_placeholder')}
                  rows={4}
                />

                <FormField
                  label={t('profile.edit.location')}
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={(value) => handleInputChange({ target: { name: 'location', value } } as React.ChangeEvent<HTMLInputElement>)}
                  placeholder={t('profile.edit.location_placeholder')}
                />

                <FormField
                  label={t('profile.edit.website')}
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={(value) => handleInputChange({ target: { name: 'website', value } } as React.ChangeEvent<HTMLInputElement>)}
                  placeholder={t('profile.edit.website_placeholder')}
                />

                <FormField
                  label={t('profile.edit.cooking_experience')}
                  name="cookingExperience"
                  type="select"
                  value={formData.cookingExperience}
                  onChange={(value) => handleInputChange({ target: { name: 'cookingExperience', value } } as React.ChangeEvent<HTMLSelectElement>)}
                  options={[
                    { value: '', label: t('profile.edit.select_experience') },
                    { value: 'beginner', label: t('profile.edit.beginner') },
                    { value: 'intermediate', label: t('profile.edit.intermediate') },
                    { value: 'advanced', label: t('profile.edit.advanced') },
                    { value: 'professional', label: t('profile.edit.professional') }
                  ]}
                />

                <FormField
                  label={t('profile.edit.cuisines')}
                  name="favoritesCuisines"
                  type="text"
                  value={formData.favoritesCuisines.join(', ')}
                  onChange={(value) => handleArrayInputChange('favoritesCuisines', value)}
                  placeholder={t('profile.edit.cuisines_placeholder')}
                />

                <FormField
                  label={t('profile.edit.dietary')}
                  name="dietaryRestrictions"
                  type="text"
                  value={formData.dietaryRestrictions.join(', ')}
                  onChange={(value) => handleArrayInputChange('dietaryRestrictions', value)}
                  placeholder={t('profile.edit.dietary_placeholder')}
                />

                <FormField
                  label={t('profile.edit.profile_picture')}
                  name="profilePicture"
                  type="text"
                  value={formData.profilePicture}
                  onChange={(value) => handleInputChange({ target: { name: 'profilePicture', value } } as React.ChangeEvent<HTMLInputElement>)}
                  placeholder={t('profile.edit.profile_picture_placeholder')}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublicProfile"
                    name="isPublicProfile"
                    checked={formData.isPublicProfile}
                    onChange={handleInputChange}
                    className="toggle toggle-primary"
                  />
                  <label htmlFor="isPublicProfile" className="text-sm text-gray-700">
                    {t('profile.edit.public_profile')}
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {isSaving ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}