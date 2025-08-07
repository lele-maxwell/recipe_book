import { NextRequest, NextResponse } from 'next/server'

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

// In-memory store for rate limiting (use Redis in production)
class MemoryStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map()

  get(key: string): { count: number; resetTime: number } | undefined {
    const data = this.store.get(key)
    if (data && Date.now() > data.resetTime) {
      this.store.delete(key)
      return undefined
    }
    return data
  }

  set(key: string, value: { count: number; resetTime: number }): void {
    this.store.set(key, value)
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now()
    const existing = this.get(key)
    
    if (existing) {
      existing.count++
      this.store.set(key, existing)
      return existing
    } else {
      const newData = { count: 1, resetTime: now + windowMs }
      this.store.set(key, newData)
      return newData
    }
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, data] of this.store.entries()) {
      if (now > data.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

// Global store instance
const store = new MemoryStore()

// Cleanup expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => store.cleanup(), 5 * 60 * 1000)
}

// Rate limiting middleware
export function createRateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = config

  return async function rateLimit(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    // Get client identifier (IP address)
    const clientId = getClientId(request)
    const key = `rate_limit:${clientId}`

    // Get current count
    const current = store.increment(key, windowMs)

    // Check if limit exceeded
    if (current.count > maxRequests) {
      const resetTime = new Date(current.resetTime).toISOString()
      
      return NextResponse.json(
        {
          error: message,
          retryAfter: Math.ceil((current.resetTime - Date.now()) / 1000),
          resetTime
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': current.resetTime.toString(),
            'Retry-After': Math.ceil((current.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }

    // Execute the handler
    const response = await handler(request)

    // Add rate limit headers
    const remaining = Math.max(0, maxRequests - current.count)
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', current.resetTime.toString())

    // Skip counting based on configuration
    if (
      (skipSuccessfulRequests && response.status < 400) ||
      (skipFailedRequests && response.status >= 400)
    ) {
      // Decrement the count
      const data = store.get(key)
      if (data && data.count > 0) {
        data.count--
        store.set(key, data)
      }
    }

    return response
  }
}

// Get client identifier
function getClientId(request: NextRequest): string {
  // Try to get real IP from headers (for production with proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  // Use the first available IP
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  return ip.trim()
}

// Predefined rate limit configurations
export const RateLimitConfigs = {
  // Strict rate limiting for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again in 15 minutes.'
  },

  // Moderate rate limiting for API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'API rate limit exceeded. Please slow down your requests.'
  },

  // Lenient rate limiting for general endpoints
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000, // 1000 requests per minute
    message: 'Rate limit exceeded. Please try again later.'
  },

  // Strict rate limiting for file uploads
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    message: 'Upload rate limit exceeded. Please wait before uploading again.'
  },

  // Very strict rate limiting for password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 attempts per hour
    message: 'Too many password reset attempts. Please try again in 1 hour.'
  }
}

// Utility function to apply rate limiting to API routes
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  const rateLimit = createRateLimit(config)
  
  return async function rateLimitedHandler(request: NextRequest) {
    return rateLimit(request, handler)
  }
}

// Advanced rate limiting with different limits per user type
export function createAdvancedRateLimit(configs: {
  anonymous: RateLimitConfig
  authenticated: RateLimitConfig
  premium?: RateLimitConfig
}) {
  return async function advancedRateLimit(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>,
    getUserType?: (req: NextRequest) => Promise<'anonymous' | 'authenticated' | 'premium'>
  ): Promise<NextResponse> {
    // Determine user type
    const userType = getUserType ? await getUserType(request) : 'anonymous'
    
    // Select appropriate config
    let config: RateLimitConfig
    switch (userType) {
      case 'premium':
        config = configs.premium || configs.authenticated
        break
      case 'authenticated':
        config = configs.authenticated
        break
      default:
        config = configs.anonymous
    }

    // Apply rate limiting
    const rateLimit = createRateLimit(config)
    return rateLimit(request, handler)
  }
}

// Rate limiting statistics
export function getRateLimitStats(): {
  totalKeys: number
  activeConnections: number
  topClients: Array<{ ip: string; requests: number }>
} {
  const stats = {
    totalKeys: 0,
    activeConnections: 0,
    topClients: [] as Array<{ ip: string; requests: number }>
  }

  const clientCounts = new Map<string, number>()
  
  // Analyze store data
  for (const [key, data] of (store as any).store.entries()) {
    if (key.startsWith('rate_limit:')) {
      stats.totalKeys++
      if (Date.now() < data.resetTime) {
        stats.activeConnections++
        
        const ip = key.replace('rate_limit:', '')
        clientCounts.set(ip, (clientCounts.get(ip) || 0) + data.count)
      }
    }
  }

  // Get top clients
  stats.topClients = Array.from(clientCounts.entries())
    .map(([ip, requests]) => ({ ip, requests }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10)

  return stats
}

// Export store for testing
export { store as rateLimitStore }