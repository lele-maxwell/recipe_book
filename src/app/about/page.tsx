'use client'

import Link from 'next/link'
import { useTranslateWithFallback } from '../../lib/translations'

export default function About() {
  const { t } = useTranslateWithFallback()

  return (
    <div className="min-h-screen py-12 px-6 bg-[#0b0f1c]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            About ChefMaster
          </h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-orange-400">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              ChefMaster is more than just a recipe website—it's a thriving community of passionate cooks,
              culinary enthusiasts, and food lovers from around the globe. Born from a simple idea that great
              food brings people together, we've created a space where culinary traditions meet modern innovation.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Whether you're a seasoned chef or just starting your culinary journey, ChefMaster provides
              the tools, inspiration, and community support you need to create memorable dining experiences.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3" 
              alt="Chef cooking in kitchen"
              className="rounded-lg shadow-2xl w-full h-80 object-cover border border-white/10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3" 
              alt="Community cooking together"
              className="rounded-lg shadow-2xl w-full h-80 object-cover border border-white/10"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-semibold text-orange-400">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              ChefMaster is more than just a recipe website—it's a thriving community of passionate cooks,
              culinary enthusiasts, and food lovers from around the globe. We believe that cooking is an art form that should be
              accessible to everyone, regardless of skill level or background.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our mission is to democratize culinary knowledge, preserve traditional cooking methods, and foster innovation in the kitchen. We
              provide a platform where cultures converge through food, where home cooks can learn from professional chefs, and where every meal becomes an opportunity to
              express creativity, and create lasting memories. Our platform is designed to inspire and empower
              cooks of all levels to explore new flavors, techniques, and cuisines.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 