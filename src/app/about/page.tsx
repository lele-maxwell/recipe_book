import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Recipe Book',
  description: 'Learn more about our recipe sharing platform and community.',
  keywords: ['about', 'recipe book', 'cooking community', 'food sharing'],
}

export default async function AboutPage() {
  // This is a server component - we can fetch data directly here
  // For now, we'll use static content, but you could fetch from your database
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            About Recipe Book
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to Recipe Book, your ultimate destination for discovering, sharing, and celebrating the art of cooking. 
              Our platform brings together food enthusiasts from around the world to create a vibrant community of culinary creativity.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-6">
              We believe that great food has the power to bring people together, create lasting memories, and nourish both body and soul. 
              Our mission is to make cooking accessible, enjoyable, and inspiring for everyone, from beginners to seasoned chefs.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              What We Offer
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Recipe Discovery:</strong> Explore thousands of carefully curated recipes from diverse cuisines</li>
              <li><strong>Community Sharing:</strong> Share your own culinary creations with fellow food lovers</li>
              <li><strong>Chef Profiles:</strong> Connect with talented chefs and discover their signature dishes</li>
              <li><strong>Rating System:</strong> Help others find the best recipes through our community ratings</li>
              <li><strong>Social Features:</strong> Follow your favorite chefs and stay updated with their latest creations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Our Community
            </h2>
            <p className="text-gray-700 mb-6">
              Recipe Book is more than just a recipe website—it's a thriving community of passionate cooks, 
              food photographers, and culinary enthusiasts. Whether you're looking for quick weeknight dinners, 
              impressive dinner party dishes, or traditional family recipes, you'll find inspiration and support here.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Join Our Community
              </h3>
              <p className="text-blue-800 mb-4">
                Ready to start your culinary journey? Sign up today and become part of our growing community of food lovers!
              </p>
              <div className="flex gap-4">
                <a
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="/recipes"
                  className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-2 rounded-lg font-medium border border-blue-600 transition-colors"
                >
                  Browse Recipes
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 