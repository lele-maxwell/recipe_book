'use client'

import dynamic from 'next/dynamic'

// Loading component for lazy-loaded components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
  </div>
)

// Code splitting utilities for existing components
export const DynamicComponents = {
  // Lazy load the OptimizedImage component
  OptimizedImage: dynamic(() => import('../components/OptimizedImage'), {
    loading: () => <div className="bg-gray-200 animate-pulse rounded" />,
    ssr: false
  }),

  // Lazy load footer (not critical for initial page load)
  Footer: dynamic(() => import('../components/footer'), {
    loading: () => <div className="h-32 bg-gray-100" />,
    ssr: true
  }),

  // Lazy load navigation dropdown (only when needed)
  NavigationDropdown: dynamic(() => import('../components/navigation'), {
    loading: () => <div className="h-12 bg-gray-100" />,
    ssr: false
  })
}

// Route-based code splitting
export const RouteBasedSplitting = {
  // Profile pages (heavy due to statistics)
  ProfilePage: dynamic(() => import('../app/profile/page'), {
    loading: LoadingSpinner,
    ssr: true
  }),

  // Recipe creation (heavy form validation)
  RecipeCreatePage: dynamic(() => import('../app/recipes/create/page'), {
    loading: LoadingSpinner,
    ssr: false
  }),

  // Settings pages (rarely accessed)
  SettingsPage: dynamic(() => import('../app/settings/page').catch(() => ({ 
    default: () => <div>Settings unavailable</div> 
  })), {
    loading: LoadingSpinner,
    ssr: false
  })
}

// Feature-based code splitting
export const FeatureBasedSplitting = {
  // Authentication forms (only when needed)
  SignInForm: dynamic(() => import('../app/auth/signin/page'), {
    loading: LoadingSpinner,
    ssr: false
  }),

  SignUpForm: dynamic(() => import('../app/auth/signup/page'), {
    loading: LoadingSpinner,
    ssr: false
  })
}

// Preloading utilities
export const preloadRoutes = {
  profile: () => import('../app/profile/page'),
  recipeCreate: () => import('../app/recipes/create/page').catch(() => null),
  signin: () => import('../app/auth/signin/page'),
  signup: () => import('../app/auth/signup/page')
}

// Preload components based on user interaction
export function preloadRoute(routeName: keyof typeof preloadRoutes) {
  if (typeof window !== 'undefined') {
    preloadRoutes[routeName]().catch(() => {
      console.warn(`Failed to preload route: ${routeName}`)
    })
  }
}

// Bundle analysis helper
export function analyzeBundleUsage() {
  if (typeof window === 'undefined') return

  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const nextScripts = scripts.filter(script => 
    (script as HTMLScriptElement).src.includes('_next/static')
  )

  const bundleInfo = {
    totalScripts: scripts.length,
    nextScripts: nextScripts.length,
    estimatedSize: nextScripts.length * 50, // Rough estimate in KB
    loadedAt: new Date().toISOString()
  }

  console.log('📦 Bundle Analysis:', bundleInfo)
  return bundleInfo
}

// Performance-aware component loader
export function createPerformanceAwareLoader<T>(
  importFn: () => Promise<{ default: T }>,
  options: {
    priority?: 'high' | 'low'
    timeout?: number
    fallback?: T
  } = {}
) {
  const { priority = 'low', timeout = 5000, fallback } = options

  return dynamic(
    () => {
      const loadPromise = importFn()
      
      // Add timeout for low priority components
      if (priority === 'low') {
        const timeoutPromise = new Promise<{ default: T }>((_, reject) => {
          setTimeout(() => reject(new Error('Component load timeout')), timeout)
        })
        
        return Promise.race([loadPromise, timeoutPromise]).catch(() => ({
          default: fallback || (() => <div>Component unavailable</div>) as T
        }))
      }
      
      return loadPromise.catch(() => ({
        default: fallback || (() => <div>Component unavailable</div>) as T
      }))
    },
    {
      loading: LoadingSpinner,
      ssr: priority === 'high'
    }
  )
}

// Intersection Observer for lazy loading
export function createIntersectionLoader<T>(
  importFn: () => Promise<{ default: T }>,
  threshold = 0.1
) {
  return dynamic(
    () => {
      return new Promise<{ default: T }>((resolve) => {
        if (typeof window === 'undefined') {
          importFn().then(resolve)
          return
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                importFn().then(resolve)
                observer.disconnect()
              }
            })
          },
          { threshold }
        )

        // Create a dummy element to observe
        const dummyElement = document.createElement('div')
        dummyElement.style.height = '1px'
        document.body.appendChild(dummyElement)
        observer.observe(dummyElement)
      })
    },
    {
      loading: LoadingSpinner,
      ssr: false
    }
  )
}