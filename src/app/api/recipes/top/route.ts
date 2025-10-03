import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/recipes/top - Get top 6 recipes with highest ratings considering time
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching top recipes from database...')
    
    // Get recipes with ratings and user info
    const recipes = await prisma.recipe.findMany({
      where: {
        published: true, // Only published recipes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        ratings: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Newer recipes first as fallback
      },
    })

    console.log(`📊 Found ${recipes.length} published recipes in database`)

    // Calculate weighted scores for each recipe
    const recipesWithScores = recipes.map(recipe => {
      const now = new Date()
      const daysSinceCreated = Math.floor((now.getTime() - recipe.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      
      // Calculate average rating
      const averageRating = recipe.ratings.length > 0
        ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / recipe.ratings.length
        : 0

      // Calculate weighted score considering rating and time
      // Higher ratings get more weight, but newer recipes get a bonus
      let score = 0
      
      // Base score for all recipes (ensures we always have recipes to show)
      score += 10
      
      if (averageRating > 0) {
        // Base score from rating (0-5 scale, multiply by 20 for 0-100 range)
        score += averageRating * 20
        
        // Time decay bonus: newer recipes get up to 30 bonus points
        // Bonus decreases over time, reaching 0 after 30 days
        const timeBonus = Math.max(0, 30 - (daysSinceCreated * 1))
        score += timeBonus
        
        // Rating count bonus: recipes with more ratings get bonus points
        // This rewards consistency and popularity
        const ratingCountBonus = Math.min(recipe._count.ratings * 2, 20)
        score += ratingCountBonus
      } else {
        // For unrated recipes, give them a score based on recency
        const timeBonus = Math.max(0, 20 - (daysSinceCreated * 0.5))
        score += timeBonus
      }

      return {
        ...recipe,
        averageRating,
        score,
        daysSinceCreated,
      }
    })

    console.log(`📈 Calculated scores for ${recipesWithScores.length} recipes`)
    console.log('🏆 Recipe scores:', recipesWithScores.map(r => ({
      title: r.title,
      score: r.score,
      rating: r.averageRating,
      ratingCount: r._count.ratings,
      daysOld: r.daysSinceCreated
    })))

    // Sort by score (highest first) and take top 6
    const topRecipes = recipesWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    console.log(`🎯 Selected top ${topRecipes.length} recipes`)

    // Transform to match the expected format for TopRecipesSection
    const formattedRecipes = topRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      chef: recipe.user?.name || 'Anonymous Chef',
      category: 'Recipes', // You can add category field to your schema later
      difficulty: recipe.prepTime && recipe.cookTime 
        ? (recipe.prepTime + recipe.cookTime <= 30 ? 'Quick' : 
           recipe.prepTime + recipe.cookTime <= 60 ? 'Easy' : 
           recipe.prepTime + recipe.cookTime <= 120 ? 'Intermediate' : 'Advanced')
        : 'Easy',
      image: recipe.imageUrl || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', // Fallback image
      description: recipe.description || 'A delicious recipe from our community',
      averageRating: recipe.averageRating,
      ratingCount: recipe._count.ratings,
    }))

    console.log('✅ Returning formatted recipes:', formattedRecipes.length)
    return NextResponse.json({ recipes: formattedRecipes })
  } catch (error) {
    console.error('❌ Error fetching top recipes:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
