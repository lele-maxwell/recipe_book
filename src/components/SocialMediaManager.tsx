'use client'

import { useState, useEffect } from 'react'
import { useTranslateWithFallback } from '../lib/translations'
import { 
  validateSocialMediaLink, 
  extractUsername, 
  getSupportedPlatforms,
  getPlatformIcon,
  formatDisplayUrl,
  type SocialMediaPlatform 
} from '../lib/socialMedia'
import FormField from './FormField'

interface SocialMediaLink {
  id: string
  platform: SocialMediaPlatform
  url: string
  username: string | null
  isVerified: boolean
  clickCount: number
}

interface SocialMediaManagerProps {
  userId?: string
  className?: string
}

export default function SocialMediaManager({ userId, className = '' }: SocialMediaManagerProps) {
  const { t } = useTranslateWithFallback()
  const [links, setLinks] = useState<SocialMediaLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form state for adding new link
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLink, setNewLink] = useState({
    platform: '' as SocialMediaPlatform,
    url: ''
  })
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    platform: '' as SocialMediaPlatform,
    url: ''
  })

  const platforms = getSupportedPlatforms()

  useEffect(() => {
    fetchSocialMediaLinks()
  }, [])

  const fetchSocialMediaLinks = async () => {
    try {
      const response = await fetch('/api/social-media')
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

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      // Validate URL
      const validation = validateSocialMediaLink(newLink.platform, newLink.url)
      if (!validation.isValid) {
        setError(validation.error || t('social_media.validation.invalid_url'))
        setIsSubmitting(false)
        return
      }

      // Check if platform already exists
      if (links.some(link => link.platform === newLink.platform)) {
        setError(t('social_media.validation.already_exists'))
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: newLink.platform,
          url: validation.sanitizedUrl || newLink.url
        }),
      })

      if (response.ok) {
        const createdLink = await response.json()
        setLinks(prev => [...prev, createdLink])
        setNewLink({ platform: '' as SocialMediaPlatform, url: '' })
        setShowAddForm(false)
        setSuccessMessage(t('social_media.messages.added_successfully'))
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || t('social_media.messages.failed_to_add'))
      }
    } catch (error) {
      setError(t('social_media.messages.failed_to_add'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      // Validate URL
      const validation = validateSocialMediaLink(editForm.platform, editForm.url)
      if (!validation.isValid) {
        setError(validation.error || t('social_media.validation.invalid_url'))
        setIsSubmitting(false)
        return
      }

      const response = await fetch(`/api/social-media/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: editForm.platform,
          url: validation.sanitizedUrl || editForm.url
        }),
      })

      if (response.ok) {
        const updatedLink = await response.json()
        setLinks(prev => prev.map(link => 
          link.id === editingId ? updatedLink : link
        ))
        setEditingId(null)
        setEditForm({ platform: '' as SocialMediaPlatform, url: '' })
        setSuccessMessage(t('social_media.messages.updated_successfully'))
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || t('social_media.messages.failed_to_update'))
      }
    } catch (error) {
      setError(t('social_media.messages.failed_to_update'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm(t('common.confirm_delete'))) return

    try {
      const response = await fetch(`/api/social-media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLinks(prev => prev.filter(link => link.id !== id))
        setSuccessMessage(t('social_media.messages.removed_successfully'))
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || t('social_media.messages.failed_to_remove'))
      }
    } catch (error) {
      setError(t('social_media.messages.failed_to_remove'))
    }
  }

  const startEdit = (link: SocialMediaLink) => {
    setEditingId(link.id)
    setEditForm({
      platform: link.platform,
      url: link.url
    })
    setShowAddForm(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ platform: '' as SocialMediaPlatform, url: '' })
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('social_media.title')}</h2>
          <p className="text-sm text-gray-600 mt-1">{t('social_media.description')}</p>
        </div>
        {!showAddForm && !editingId && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary btn-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('social_media.add_link')}
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Add New Link Form */}
      {showAddForm && (
        <form onSubmit={handleAddLink} className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-4">{t('social_media.add_link')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label={t('social_media.platform')}
              name="platform"
              type="select"
              value={newLink.platform}
              onChange={(value) => setNewLink(prev => ({ ...prev, platform: value as SocialMediaPlatform }))}
              options={[
                { value: '', label: t('social_media.select_platform') },
                ...platforms.map((platform: SocialMediaPlatform) => ({ value: platform, label: t(`social_media.platforms.${platform}`) }))
              ]}
              required
            />
            <FormField
              label={t('social_media.url')}
              name="url"
              type="url"
              value={newLink.url}
              onChange={(value) => setNewLink(prev => ({ ...prev, url: value }))}
              placeholder={newLink.platform ? t(`social_media.placeholders.${newLink.platform}`) : t('social_media.enter_url')}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setNewLink({ platform: '' as SocialMediaPlatform, url: '' })
              }}
              className="btn btn-ghost btn-sm"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-sm"
            >
              {isSubmitting ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      )}

      {/* Existing Links */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔗</div>
            <p>{t('social_media.no_links')}</p>
            <p className="text-sm">{t('social_media.add_first_link')}</p>
          </div>
        ) : (
          links.map((link) => (
            <div key={link.id} className="border border-gray-200 rounded-lg p-4">
              {editingId === link.id ? (
                /* Edit Form */
                <form onSubmit={handleEditLink}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      label={t('social_media.platform')}
                      name="edit-platform"
                      type="select"
                      value={editForm.platform}
                      onChange={(value) => setEditForm(prev => ({ ...prev, platform: value as SocialMediaPlatform }))}
                      options={platforms.map((platform: SocialMediaPlatform) => ({ value: platform, label: t(`social_media.platforms.${platform}`) }))}
                      required
                    />
                    <FormField
                      label={t('social_media.url')}
                      name="edit-url"
                      type="url"
                      value={editForm.url}
                      onChange={(value) => setEditForm(prev => ({ ...prev, url: value }))}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="btn btn-ghost btn-sm"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-sm"
                    >
                      {isSubmitting ? t('common.saving') : t('common.save')}
                    </button>
                  </div>
                </form>
              ) : (
                /* Display Link */
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {t(`social_media.platforms.${link.platform}`)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {link.username && `@${link.username} • `}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {formatDisplayUrl(link.url)}
                        </a>
                        {link.clickCount > 0 && (
                          <span className="ml-2 text-xs text-gray-400">
                            {link.clickCount} clicks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEdit(link)}
                      className="btn btn-ghost btn-xs"
                      title={t('social_media.edit')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="btn btn-ghost btn-xs text-red-600 hover:text-red-800"
                      title={t('social_media.remove')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}