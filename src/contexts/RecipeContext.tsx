'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { RecipeWithDetails } from '@/types/recipe'

interface RecipeState {
  recipes: RecipeWithDetails[]
  loading: boolean
  error: string | null
  filters: {
    search: string
    category: string
    difficulty: string
    maxTime: number | null
  }
}

type RecipeAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RECIPES'; payload: RecipeWithDetails[] }
  | { type: 'ADD_RECIPE'; payload: RecipeWithDetails }
  | { type: 'UPDATE_RECIPE'; payload: { id: string; updates: Partial<RecipeWithDetails> } }
  | { type: 'REMOVE_RECIPE'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<RecipeState['filters']> }
  | { type: 'CLEAR_FILTERS' }

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    difficulty: '',
    maxTime: null
  }
}

function recipeReducer(state: RecipeState, action: RecipeAction): RecipeState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_RECIPES':
      return { ...state, recipes: action.payload }
    
    case 'ADD_RECIPE':
      return { ...state, recipes: [action.payload, ...state.recipes] }
    
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id
            ? { ...recipe, ...action.payload.updates }
            : recipe
        )
      }
    
    case 'REMOVE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
      }
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }
    
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      }
    
    default:
      return state
  }
}

interface RecipeContextType {
  state: RecipeState
  dispatch: React.Dispatch<RecipeAction>
  filteredRecipes: RecipeWithDetails[]
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recipeReducer, initialState)

  // Compute filtered recipes
  const filteredRecipes = state.recipes.filter(recipe => {
    const { search, category, difficulty, maxTime } = state.filters

    if (search) {
      const searchLower = search.toLowerCase()
      const matchesSearch = 
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower) ||
        recipe.user.name.toLowerCase().includes(searchLower)
      
      if (!matchesSearch) return false
    }

    if (category && recipe.category !== category) {
      return false
    }

    if (difficulty && recipe.difficulty !== difficulty) {
      return false
    }

    if (maxTime) {
      const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
      if (totalTime > maxTime) return false
    }

    return true
  })

  const value = {
    state,
    dispatch,
    filteredRecipes
  }

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipeContext() {
  const context = useContext(RecipeContext)
  if (context === undefined) {
    throw new Error('useRecipeContext must be used within a RecipeProvider')
  }
  return context
} 