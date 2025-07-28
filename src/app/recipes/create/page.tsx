'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslate } from '@tolgee/react'
import { RecipeIngredientInput, MEASUREMENT_UNITS } from '@/types/recipe'

export default function CreateRecipe() {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useTranslate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    imageUrl: '',
  })
  
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

  // Redirect to sign in if not authenticated
  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
      setError('Please add at least one ingredient')
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
        setError(data.message || 'Failed to create recipe')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
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
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Recipe Created Successfully!</h1>
              <p className="text-gray-600 mb-8">
                Your recipe <span className="font-medium text-gray-900">&ldquo;{createdRecipe.title}&rdquo;</span> has been created and is now visible to all users.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push(`/recipes/${createdRecipe.id}`)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  View Recipe
                </button>
                <button
                  onClick={() => router.push('/my-recipes')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Go to My Recipes
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Create Another Recipe
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create a New Recipe</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Recipe Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter recipe title"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Image
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                />
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
                  Supported formats: JPEG, PNG, WebP (max 5MB)
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Add Ingredient
                </button>
              </div>
              
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ingredient</label>
                      <input
                        type="text"
                        placeholder="e.g., Flour"
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                        value={ingredient.ingredientName}
                        onChange={(e) => handleIngredientChange(index, 'ingredientName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Measurement</label>
                      <input
                        type="text"
                        placeholder="e.g., 200"
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                        value={ingredient.quantity || ''}
                        onChange={(e) => handleIngredientChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Unit Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  value={ingredients[0]?.unit || 'cups'}
                  onChange={(e) => {
                    // Update all ingredients with the same unit for simplicity
                    setIngredients(prev => prev.map(ing => ({ ...ing, unit: e.target.value })))
                  }}
                >
                  {MEASUREMENT_UNITS.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prep Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                name="prepTime"
                placeholder="e.g., 15"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={formData.prepTime}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            {/* Cook Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                name="cookTime"
                placeholder="e.g., 30"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={formData.cookTime}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            {/* Servings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servings
              </label>
              <input
                type="number"
                name="servings"
                placeholder="e.g., 4"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={formData.servings}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                name="description"
                placeholder="Brief description of your recipe"
                rows={3}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all resize-none"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <div className="text-sm text-gray-500 mb-2">
                You can use Markdown formatting (e.g., **bold**, *italic*, numbered lists, etc.)
              </div>
              <textarea
                name="instructions"
                placeholder="Write your recipe instructions here using Markdown formatting"
                rows={6}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all resize-none"
                value={formData.instructions}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || uploadingImage}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? 'Uploading Image...' : isLoading ? 'Saving...' : 'Save Recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}