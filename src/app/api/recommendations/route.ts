import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { RecipeRecommendationEngine, UserPreferences } from '@/lib/recommendations'
import { RecipeWithDetails } from '@/types/recipe'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    const type = searchParams.get('type') || 'personalized'
    const limit = parseInt(searchParams.get('limit') || '6')
    const excludeIds = searchParams.get('exclude')?.split(',') || []
    const baseRecipeId = searchParams.get('baseRecipeId')
    const occasion = searchParams.get('occasion')

    // Get all published recipes with necessary relations
    const recipes = await prisma.recipe.findMany({
      where: { published: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            bio: true,
            location: true,
            website: true,
            cookingExperience: true,
            favoritesCuisines: true,
            dietaryRestrictions: true,
            profilePicture: true,
            isPublicProfile: true
          }
        },
        ingredients: {
          include: {
            ingredient: {
              include: {
                translations: true
              }
            }
          }
        },
        ratings: {
          select: {
            id: true,
            value: true,
            userId: true,
            recipeId: true,
            createdAt: true,
            updatedAt: true
          }
        },
        _count: {
          select: {
            ratings: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate average ratings and format as RecipeWithDetails
    const recipesWithRatings: RecipeWithDetails[] = recipes.map(recipe => ({
      ...recipe,
      averageRating: recipe.ratings.length > 0 
        ? recipe.ratings.reduce((sum: number, r: { value: number }) => sum + r.value, 0) / recipe.ratings.length
        : 0
    }))

    // Get user preferences if authenticated
    let userPreferences: UserPreferences = {}
    let viewHistory: string[] = []
    let ratedRecipes: { [recipeId: string]: number } = {}

    if (session?.user?.id) {
      // Get user profile for preferences
      const userProfile = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          dietaryRestrictions: true,
          favoritesCuisines: true
        }
      })

      if (userProfile) {
        // Parse JSON strings to arrays
        const favoritesCuisines = userProfile.favoritesCuisines 
          ? JSON.parse(userProfile.favoritesCuisines) 
          : []
        const dietaryRestrictions = userProfile.dietaryRestrictions 
          ? JSON.parse(userProfile.dietaryRestrictions) 
          : []

        userPreferences = {
          favoritesCuisines,
          dietaryRestrictions,
          preferredMealTypes: ['Breakfast', 'Lunch', 'Dinner'] // Default meal types
        }
      }

      // Get user's ratings
      const userRatings = await prisma.rating.findMany({
        where: { userId: session.user.id },
        select: { recipeId: true, value: true }
      })

      ratedRecipes = userRatings.reduce((acc, rating) => {
        acc[rating.recipeId] = rating.value
        return acc
      }, {} as { [recipeId: string]: number })

      // For simplicity, use rated recipes as view history
      viewHistory = Object.keys(ratedRecipes)
    }

    // Initialize recommendation engine
    const engine = new RecipeRecommendationEngine(
      recipesWithRatings,
      userPreferences,
      viewHistory,
      ratedRecipes
    )

    let recommendations: RecipeWithDetails[] = []

    // Get recommendations based on type
    switch (type) {
      case 'similar':
        if (baseRecipeId) {
          recommendations = engine.getSimilarRecipes(baseRecipeId, limit)
        }
        break
      
      case 'trending':
        recommendations = engine.getTrendingRecipes(limit)
        break
      
      case 'occasion':
        if (occasion) {
          recommendations = engine.getRecipesForOccasion(occasion, limit)
        }
        break
      
      case 'personalized':
      default:
        recommendations = engine.getRecommendations(excludeIds, limit)
        break
    }

    // Format response
    const formattedRecommendations = recommendations.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.imageUrl,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      averageRating: recipe.averageRating || 0,
      ratingsCount: recipe._count.ratings,
      author: {
        id: recipe.user.id,
        name: recipe.user.name,
        image: recipe.user.image
      },
      createdAt: recipe.createdAt
    }))

    return NextResponse.json({
      success: true,
      recommendations: formattedRecommendations,
      type,
      count: formattedRecommendations.length
    })

  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}