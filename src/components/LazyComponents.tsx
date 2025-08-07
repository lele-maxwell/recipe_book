'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Loading component for lazy-loaded components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
)

// Lazy load heavy components with loading states
export const LazyOptimizedImage = dynamic(
  () => import('./OptimizedImage'),
  {
    loading: () => <div className="bg-gray-200 animate-pulse rounded" />,
    ssr: false
  }
)

// Lazy load profile components (heavy due to statistics calculations)
export const LazyProfileStats = dynamic(
  () => import('./ProfileStats').catch(() => ({ default: () => <div>Profile stats unavailable</div> })),
  {
    loading: () => <LoadingSpinner />,
    ssr: true
  }
)

// Lazy load recipe creation form (heavy due to form validation)
export const LazyRecipeForm = dynamic(
  () => import('./RecipeForm').catch(() => ({ default: () => <div>Recipe form unavailable</div> })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

// Lazy load chart components (if we add them later)
export const LazyChartComponent = dynamic(
  () => import('./Charts').catch(() => ({ default: () => <div>Charts unavailable</div> })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

// Lazy load markdown editor (heavy dependency)
export const LazyMarkdownEditor = dynamic(
  () => import('./MarkdownEditor').catch(() => ({ default: () => <div>Editor unavailable</div> })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
)

// Higher-order component for lazy loading with error boundaries
export function withLazyLoading<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallbackComponent?: ComponentType<P>
) {
  return dynamic(
    () => importFn().catch(() => ({ 
      default: fallbackComponent || (() => <div>Component unavailable</div>) 
    })),
    {
      loading: () => <LoadingSpinner />,
      ssr: false
    }
  )
}

// Preload components for better UX
export const preloadComponents = {
  profileStats: () => import('./ProfileStats'),
  recipeForm: () => import('./RecipeForm'),
  markdownEditor: () => import('./MarkdownEditor'),
  charts: () => import('./Charts')
}

// Utility to preload components based on user interaction
export function preloadComponent(componentName: keyof typeof preloadComponents) {
  if (typeof window !== 'undefined') {
    preloadComponents[componentName]().catch(() => {
      console.warn(`Failed to preload component: ${componentName}`)
    })
  }
}

// Route-based code splitting helpers
export const RouteComponents = {
  // Home page components
  HeroSection: dynamic(() => import('./HeroSection'), {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: true
  }),
  
  // Recipe page components
  RecipeCard: dynamic(() => import('./RecipeCard'), {
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: true
  }),
  
  // Profile page components
  ProfileHeader: dynamic(() => import('./ProfileHeader'), {
    loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: true
  }),
  
  // Admin components (heavy and rarely used)
  AdminDashboard: dynamic(() => import('./AdminDashboard'), {
    loading: () => <LoadingSpinner />,
    ssr: false
  })
}

// Bundle splitting by feature
export const FeatureComponents = {
  // Social features
  FollowButton: dynamic(() => import('./FollowButton'), {
    loading: () => <div className="w-24 h-8 bg-gray-200 animate-pulse rounded" />,
    ssr: false
  }),
  
  // Rating system
  StarRating: dynamic(() => import('./StarRating'), {
    loading: () => <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4 bg-gray-200 animate-pulse" />
      ))}
    </div>,
    ssr: true
  }),
  
  // Search functionality
  SearchFilters: dynamic(() => import('./SearchFilters'), {
    loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded" />,
    ssr: false
  })
}