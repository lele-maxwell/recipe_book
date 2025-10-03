'use client'

import React, { useState, useCallback } from 'react'
import { useDebounce } from '../hooks/useDebounce'

interface SearchAndFiltersProps {
  onSearchChange: (search: string) => void
  onFilterChange: (filters: FilterOptions) => void
}

interface FilterOptions {
  cuisine: string
  difficulty: string
  maxTime: string
  rating: string
}

export default function SearchAndFilters({ onSearchChange, onFilterChange }: SearchAndFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: '',
    difficulty: '',
    maxTime: '',
    rating: ''
  })

  const debouncedSearch = useDebounce(searchTerm, 300)

  // Handle search with loading feedback
  React.useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      setIsSearching(true)
      onSearchChange(debouncedSearch)
      // Simulate search delay for better UX
      setTimeout(() => setIsSearching(false), 200)
    }
  }, [debouncedSearch, onSearchChange, searchTerm])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsSearching(true)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    onSearchChange('')
  }, [onSearchChange])

  const handleFilterChange = useCallback((key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }, [filters, onFilterChange])

  const clearFilters = useCallback(() => {
    const clearedFilters: FilterOptions = {
      cuisine: '',
      difficulty: '',
      maxTime: '',
      rating: ''
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }, [onFilterChange])

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="mb-16 space-y-10">
      {/* Search Bar with Feedback */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search recipes, topics, or keywords..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-12 pr-12 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-gray-400"
          />
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {/* Search Status */}
        {isSearching && (
          <div className="mt-2 text-sm text-gray-400 flex items-center gap-2 justify-center">
            <div className="w-3 h-3 border border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            Searching...
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          {showFilters ? 'Hide filters' : 'Show filters'}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors ml-4"
          >
            Clear all filters
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cuisine</label>
              <select
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white"
              >
                <option value="">All cuisines</option>
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
                <option value="chinese">Chinese</option>
                <option value="indian">Indian</option>
                <option value="french">French</option>
                <option value="japanese">Japanese</option>
                <option value="thai">Thai</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white"
              >
                <option value="">All levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Time</label>
              <select
                value={filters.maxTime}
                onChange={(e) => handleFilterChange('maxTime', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white"
              >
                <option value="">Any time</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white"
              >
                <option value="">Any rating</option>
                <option value="4">4+ stars</option>
                <option value="3">3+ stars</option>
                <option value="2">2+ stars</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {filters.cuisine && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-900/50 text-orange-300 border border-orange-700">
                  Cuisine: {filters.cuisine}
                  <button
                    onClick={() => handleFilterChange('cuisine', '')}
                    className="ml-2 text-orange-400 hover:text-orange-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.difficulty && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-900/50 text-orange-300 border border-orange-700">
                  Difficulty: {filters.difficulty}
                  <button
                    onClick={() => handleFilterChange('difficulty', '')}
                    className="ml-2 text-orange-400 hover:text-orange-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.maxTime && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-900/50 text-orange-300 border border-orange-700">
                  Max time: {filters.maxTime}min
                  <button
                    onClick={() => handleFilterChange('maxTime', '')}
                    className="ml-2 text-orange-400 hover:text-orange-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.rating && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-900/50 text-orange-300 border border-orange-700">
                  Min rating: {filters.rating}+
                  <button
                    onClick={() => handleFilterChange('rating', '')}
                    className="ml-2 text-orange-400 hover:text-orange-300"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 