'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Generate blur placeholder for better UX
  const generateBlurDataURL = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
      </svg>`
    ).toString('base64')}`
  }

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-center">
          <span className="text-4xl">🖼️</span>
          <p className="text-sm mt-2">Image not available</p>
        </div>
      </div>
    )
  }

  const imageProps = {
    src,
    alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    priority,
    quality,
    placeholder: placeholder === 'blur' ? 'blur' as const : 'empty' as const,
    blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    onLoad: handleLoad,
    onError: handleError,
    sizes: sizes || (fill ? '100vw' : undefined),
  }

  if (fill) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}
        <Image
          {...imageProps}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  if (!width || !height) {
    console.warn('OptimizedImage: width and height are required when fill is false')
    return null
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      <Image
        {...imageProps}
        width={width}
        height={height}
      />
    </div>
  )
}