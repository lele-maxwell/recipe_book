'use client'

import { ReactNode } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'skeleton'
  text?: string
  className?: string
  children?: ReactNode
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'spinner',
  text,
  className = '',
  children
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )
      case 'skeleton':
        return (
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded h-4 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 mb-2 w-3/4"></div>
            <div className="bg-gray-200 rounded h-4 w-1/2"></div>
          </div>
        )
      default:
        return (
          <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin`}></div>
        )
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      {renderSpinner()}
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
      {children}
    </div>
  )
} 