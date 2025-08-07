import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - Recipe Book',
  description: 'Learn more about Recipe Book, our mission, and our community of food lovers.',
}

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Recipe Book
            </h1>
            <p className="text-xl text-gray-600">
              Connecting food lovers through the joy of cooking
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Recipe Book is more than just a recipe website—it&apos;s a thriving community of passionate cooks, 
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
                Recipe Book is more than just a recipe website—it&apos;s a thriving community of passionate cooks, 
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
    </div>
  )
} 