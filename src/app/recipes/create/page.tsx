'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTolgee } from '@tolgee/react'
import { useTranslateWithFallback } from '../../../lib/translations'
import { RecipeIngredientInput, MEASUREMENT_UNITS } from '@/types/recipe'
import { getUnitName } from '@/lib/translations'
import FormField from '../../../components/FormField'

export default function CreateRecipe() {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useTranslateWithFallback()
  const tolgee = useTolgee()
  const currentLanguage = tolgee.getLanguage()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    imageUrl: '',
  })
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [fieldSuccess, setFieldSuccess] = useState<{[key: string]: boolean}>({})
  const [ingredients, setIngredients] = useState<RecipeIngredientInput[]>([
    { ingredientName: '', quantity: 0, unit: 'cups' }
  ])
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [createdRecipe, setCreatedRecipe] = useState<{ id: string; title: string } | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [step, setStep] = useState(1)

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

  if (!session) {
    return null
  }

  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {}
    const success: {[key: string]: boolean} = {}

    switch (name) {
      case 'title':
        if (!value.trim()) {
          errors.title = 'Recipe title is required'
        } else if (value.length < 3) {
          errors.title = 'Title must be at least 3 characters'
        } else if (value.length > 100) {
          errors.title = 'Title must be less than 100 characters'
        } else {
          success.title = true
        }
        break
      case 'description':
        if (value && value.length > 500) {
          errors.description = 'Description must be less than 500 characters'
        } else if (value && value.length >= 10) {
          success.description = true
        }
        break
      case 'instructions':
        if (!value.trim()) {
          errors.instructions = 'Instructions are required'
        } else if (value.length < 20) {
          errors.instructions = 'Instructions must be at least 20 characters'
        } else {
          success.instructions = true
        }
        break
      case 'prepTime':
        if (value && (parseInt(value) < 0 || parseInt(value) > 480)) {
          errors.prepTime = 'Prep time must be between 0 and 480 minutes'
        } else if (value && parseInt(value) > 0) {
          success.prepTime = true
        }
        break
      case 'cookTime':
        if (value && (parseInt(value) < 0 || parseInt(value) > 480)) {
          errors.cookTime = 'Cook time must be between 0 and 480 minutes'
        } else if (value && parseInt(value) > 0) {
          success.cookTime = true
        }
        break
      case 'servings':
        if (value && (parseInt(value) < 1 || parseInt(value) > 50)) {
          errors.servings = 'Servings must be between 1 and 50'
        } else if (value && parseInt(value) > 0) {
          success.servings = true
        }
        break
    }

    setValidationErrors(prev => ({ ...prev, ...errors }))
    setFieldSuccess(prev => ({ ...prev, ...success }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Real-time validation
    validateField(name, value)
  }

  const handleIngredientChange = (index: number, field: keyof RecipeIngredientInput, value: string | number) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ))
  }

  const addIngredient = () => {
    setIngredients(prev => [...prev, { ingredientName: '', quantity: 0, unit: 'cups' }])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return ''
    
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      const data = await response.json()
      return data.imageUrl
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    // Validate ingredients
    const validIngredients = ingredients.filter(ing =>
      ing.ingredientName.trim() && ing.quantity > 0
    )

    if (validIngredients.length === 0) {
      setError(t('create_recipe.error_no_ingredients'))
      setIsLoading(false)
      return
    }

    try {
      // Upload image first if provided
      let imageUrl = formData.imageUrl
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          instructions: formData.instructions,
          prepTime: formData.prepTime ? parseInt(formData.prepTime) : null,
          cookTime: formData.cookTime ? parseInt(formData.cookTime) : null,
          servings: formData.servings ? parseInt(formData.servings) : null,
          imageUrl,
          ingredients: validIngredients,
        }),
      })

      if (response.ok) {
        const recipe = await response.json()
        setCreatedRecipe(recipe)
        setSuccess(true)
        // Reset form
        setFormData({
          title: '',
          description: '',
          instructions: '',
          prepTime: '',
          cookTime: '',
          servings: '',
          imageUrl: '',
        })
        setIngredients([{ ingredientName: '', quantity: 0, unit: 'cups' }])
        setImageFile(null)
        setImagePreview('')
      } else {
        const data = await response.json()
        setError(data.message || t('create_recipe.error_failed_create'))
      }
    } catch (error) {
      setError(t('create_recipe.error_generic'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAnother = () => {
    setSuccess(false)
    setCreatedRecipe(null)
    setError('')
  }

  // Show success message if recipe was created successfully
  if (success && createdRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">{t('create_recipe.success_title')}</h1>
              <p className="text-gray-600 mb-8">
                {t('create_recipe.success_message', { title: createdRecipe.title })}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push(`/recipes/${createdRecipe.id}`)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  {t('create_recipe.view_recipe')}
                </button>
                <button
                  onClick={() => router.push('/my-recipes')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {t('create_recipe.go_to_my_recipes')}
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {t('create_recipe.create_another')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">{t('create_recipe.title')}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Basic Info</h2>
                <FormField
                  label={t('create_recipe.recipe_title')}
                  name="title"
                  type="text"
                  placeholder={t('create_recipe.recipe_title_placeholder')}
                  value={formData.title}
                  onChange={(value) => handleInputChange({ target: { name: 'title', value } } as any)}
                  required
                  error={validationErrors.title}
                  success={fieldSuccess.title}
                />
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('create_recipe.recipe_image')}
                  </label>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 cursor-pointer hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500 transition-all"
                      >
                        <span className="mr-3 px-4 py-2 bg-orange-50 text-orange-700 rounded-md text-sm font-medium hover:bg-orange-100 transition-colors">
                          {t('create_recipe.choose_image')}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {imageFile ? imageFile.name : t('create_recipe.no_image_chosen')}
                        </span>
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Recipe preview"
                          className="w-full h-48 object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {t('create_recipe.supported_formats')}
                    </div>
                  </div>
                </div>
                <FormField
                  label={t('create_recipe.description')}
                  name="description"
                  type="textarea"
                  placeholder={t('create_recipe.description_placeholder')}
                  value={formData.description}
                  onChange={(value) => handleInputChange({ target: { name: 'description', value } } as any)}
                  rows={3}
                  error={validationErrors.description}
                  success={fieldSuccess.description}
                />
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setStep(2)}
                  >
                    {t('common.next')}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Ingredients, Instructions, Advanced */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Ingredients & Details</h2>
                {/* Ingredients */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('create_recipe.ingredients')}
                    </label>
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      {t('create_recipe.add_ingredient')}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3">
                        <FormField
                          label={t('create_recipe.ingredient')}
                          name={`ingredient-${index}`}
                          type="text"
                          placeholder={t('create_recipe.ingredient_placeholder')}
                          value={ingredient.ingredientName}
                          onChange={(value) => handleIngredientChange(index, 'ingredientName', value)}
                          required
                          className="mb-0"
                        />
                        <FormField
                          label={t('create_recipe.measurement')}
                          name={`quantity-${index}`}
                          type="text"
                          placeholder={t('create_recipe.measurement_placeholder')}
                          value={ingredient.quantity || ''}
                          onChange={(value) => handleIngredientChange(index, 'quantity', parseFloat(value) || 0)}
                          required
                          className="mb-0"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Unit Selection */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('create_recipe.unit')}
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                      value={ingredients[0]?.unit || 'cups'}
                      onChange={(e) => {
                        setIngredients(prev => prev.map(ing => ({ ...ing, unit: e.target.value })))
                      }}
                    >
                      {MEASUREMENT_UNITS.map(unit => (
                        <option key={unit} value={unit}>
                          {getUnitName(unit, currentLanguage)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Instructions */}
                <FormField
                  label={t('create_recipe.instructions')}
                  name="instructions"
                  type="textarea"
                  placeholder={t('create_recipe.instructions_placeholder')}
                  value={formData.instructions}
                  onChange={(value) => handleInputChange({ target: { name: 'instructions', value } } as any)}
                  rows={6}
                  required
                  error={validationErrors.instructions}
                  success={fieldSuccess.instructions}
                  children={<div className="text-sm text-gray-500 mb-2">{t('create_recipe.markdown_info')}</div>}
                />
                {/* Advanced Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label={t('create_recipe.prep_time')}
                    name="prepTime"
                    type="number"
                    placeholder={t('create_recipe.prep_time_placeholder')}
                    value={formData.prepTime}
                    onChange={(value) => handleInputChange({ target: { name: 'prepTime', value } } as any)}
                    min={0}
                    error={validationErrors.prepTime}
                    success={fieldSuccess.prepTime}
                  />
                  <FormField
                    label={t('create_recipe.cook_time')}
                    name="cookTime"
                    type="number"
                    placeholder={t('create_recipe.cook_time_placeholder')}
                    value={formData.cookTime}
                    onChange={(value) => handleInputChange({ target: { name: 'cookTime', value } } as any)}
                    min={0}
                    error={validationErrors.cookTime}
                    success={fieldSuccess.cookTime}
                  />
                  <FormField
                    label={t('create_recipe.servings')}
                    name="servings"
                    type="number"
                    placeholder={t('create_recipe.servings_placeholder')}
                    value={formData.servings}
                    onChange={(value) => handleInputChange({ target: { name: 'servings', value } } as any)}
                    min={1}
                    error={validationErrors.servings}
                    success={fieldSuccess.servings}
                  />
                </div>
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    onClick={() => setStep(1)}
                  >
                    {t('common.previous')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || uploadingImage}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? t('create_recipe.uploading_image') : isLoading ? t('create_recipe.saving') : t('create_recipe.save_recipe')}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}