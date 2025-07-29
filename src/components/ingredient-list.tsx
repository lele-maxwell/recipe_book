'use client'

import { useState } from 'react'
import { useTranslateWithFallback } from '../lib/translations'
import { RecipeWithDetails } from '@/types/recipe'
import { getUnitName } from '@/lib/translations'

interface IngredientListProps {
  recipe: RecipeWithDetails
  locale?: string
}

export function IngredientList({ recipe, locale = 'en' }: IngredientListProps) {
  const { t } = useTranslateWithFallback()

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title text-lg">{t('recipe.ingredients')}</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((recipeIngredient) => {
            const ingredientName = recipeIngredient.ingredient.name
            const unitName = getUnitName(recipeIngredient.unit, locale)
            
            return (
              <li key={recipeIngredient.id} className="flex justify-between items-center">
                <span className="font-medium">{ingredientName}</span>
                <span className="text-base-content/70 text-sm">
                  {recipeIngredient.quantity} {unitName}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

interface IngredientTranslationManagerProps {
  ingredientId: string
  currentName: string
  onTranslationAdded?: () => void
}

export function IngredientTranslationManager({ 
  ingredientId, 
  currentName, 
  onTranslationAdded 
}: IngredientTranslationManagerProps) {
  const { t } = useTranslateWithFallback()
  const [isOpen, setIsOpen] = useState(false)
  const [locale, setLocale] = useState('fr')
  const [translatedName, setTranslatedName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!translatedName.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/ingredients/${ingredientId}/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locale,
          name: translatedName,
        }),
      })

      if (response.ok) {
        setTranslatedName('')
        setIsOpen(false)
        onTranslationAdded?.()
      }
    } catch (error) {
      console.error('Error adding translation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-outline btn-xs"
        title="Add translation"
      >
        🌐
      </button>

      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Translation</h3>
            <p className="py-2">Add a translation for &quot;{currentName}&quot;</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Language</span>
                </label>
                <select
                  className="select select-bordered"
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Translated Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={translatedName}
                  onChange={(e) => setTranslatedName(e.target.value)}
                  placeholder="Enter translation"
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsOpen(false)}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}