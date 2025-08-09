import { Metadata } from 'next'
import Link from 'next/link'
import { useTranslateWithFallback } from '../../lib/translations'

export const metadata: Metadata = {
  title: 'About Us - ChefMaster',
  description: 'Learn more about ChefMaster, our mission, and our community of food lovers.',
}

export default function About() {
  const { t } = useTranslateWithFallback()

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About ChefMaster
          </h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-700">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              ChefMaster is more than just a recipe website—it's a thriving community of passionate cooks,
              culinary enthusiasts, and food lovers from around the globe. Born from a simple idea that great
              food brings people together, we've created a space where culinary traditions meet modern innovation.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're a seasoned chef or just starting your culinary journey, ChefMaster provides
              the tools, inspiration, and community support you need to create memorable dining experiences.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3" 
              alt="Chef cooking in kitchen"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3" 
              alt="Community cooking together"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-semibold text-gray-700">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              ChefMaster is more than just a recipe website—it's a thriving community of passionate cooks,
              culinary enthusiasts, and food lovers from around the globe. We believe that cooking is an art form that should be
              accessible to everyone, regardless of skill level or background.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to democratize culinary knowledge, preserve traditional cooking methods, and foster innovation in the kitchen. We
              provide a platform where cultures converge through food, where home cooks can learn from professional chefs, and where every meal becomes an opportunity to
              express creativity, and create lasting memories. Our platform is designed to inspire and empower
              cooks of all levels to explore new flavors, techniques, and cuisines.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                ChefMaster is more than just a recipe website—it&apos;s a thriving community of passionate cooks, 
                food photographers, and culinary enthusiasts. Whether you&apos;re looking for quick weeknight dinners, 
                impressive dinner party dishes, or traditional family recipes, you&apos;ll find inspiration and support here.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-6">
                We believe that cooking is more than just preparing food—it&apos;s a way to bring people together, 
                express creativity, and create lasting memories. Our platform is designed to inspire and empower 
                home cooks of all skill levels to explore new flavors, techniques, and cuisines.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Community
              </h2>
              <p className="text-gray-700 mb-6">
                ChefMaster is more than just a recipe website—it&apos;s a thriving community of passionate cooks, 
                food photographers, and culinary enthusiasts. Whether you&apos;re looking for quick weeknight dinners, 
                impressive dinner party dishes, or traditional family recipes, you&apos;ll find inspiration and support here.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  Join Our Community
                </h3>
                <p className="text-blue-800 mb-4">
                  Ready to start your culinary journey? Sign up today and become part of our growing community of food lovers!
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/recipes" 
                    className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-2 rounded-lg font-medium border border-blue-600 transition-colors"
                  >
                    Browse Recipes
                  </Link>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
} 