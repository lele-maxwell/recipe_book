'use client'

import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select'
  placeholder?: string
  value: string | number
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  error?: string
  success?: boolean
  loading?: boolean
  className?: string
  rows?: number
  min?: number
  max?: number
  options?: { value: string; label: string }[]
  children?: React.ReactNode
}

export default function FormField({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  success = false,
  loading = false,
  className = '',
  rows = 3,
  min,
  max,
  options = [],
  children
}: FormFieldProps) {
  const getInputClasses = () => {
    let baseClasses = "w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
    
    if (error) {
      baseClasses += " border-2 border-red-500 bg-red-50"
    } else if (success) {
      baseClasses += " border-2 border-green-500 bg-green-50"
    }
    
    if (disabled) {
      baseClasses += " opacity-50 cursor-not-allowed"
    }
    
    return baseClasses
  }

  const getStatusIcon = () => {
    if (loading) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    }
    
    if (success) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    }
    
    return null
  }

  const renderInput = () => {
    const commonProps = {
      name,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(e.target.value),
      placeholder,
      required,
      disabled,
      className: getInputClasses(),
      min,
      max
    }

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className={`${getInputClasses()} resize-none`}
          />
        )
      case 'select':
        return (
          <select {...commonProps}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      default:
        return (
          <input
            {...commonProps}
            type={type}
          />
        )
    }
  }

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {renderInput()}
        {getStatusIcon()}
      </div>
      
      {children}
      
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      {success && !error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Looks good!
        </div>
      )}
    </div>
  )
} 