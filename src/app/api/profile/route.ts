import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        cookingExperience: true,
        favoritesCuisines: true,
        dietaryRestrictions: true,
        profilePicture: true,
        isPublicProfile: true,
        createdAt: true,
        _count: {
          select: {
            recipes: true,
            ratings: true
          }
        },
        recipes: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
            ratings: {
              select: {
                value: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate enhanced statistics
    const publishedRecipes = user.recipes.filter(recipe => recipe.published)
    const draftRecipes = user.recipes.filter(recipe => !recipe.published)
    
    // Calculate average rating received on user's recipes
    let totalRatings = 0
    let ratingSum = 0
    let mostPopularRecipe = null
    let highestRating = 0
    
    user.recipes.forEach(recipe => {
      if (recipe.ratings.length > 0) {
        const recipeRatingSum = recipe.ratings.reduce((sum, rating) => sum + rating.value, 0)
        const recipeAverage = recipeRatingSum / recipe.ratings.length
        
        totalRatings += recipe.ratings.length
        ratingSum += recipeRatingSum
        
        // Track most popular recipe (highest average rating with at least 1 rating)
        if (recipeAverage > highestRating) {
          highestRating = recipeAverage
          mostPopularRecipe = {
            id: recipe.id,
            title: recipe.title,
            averageRating: recipeAverage,
            totalRatings: recipe.ratings.length
          }
        }
      }
    })
    
    const averageRatingReceived = totalRatings > 0 ? ratingSum / totalRatings : 0
    
    // Enhanced user profile with statistics
    const enhancedProfile = {
      ...user,
      recipes: undefined, // Remove the full recipes array from response
      statistics: {
        recipesCreated: user._count.recipes,
        ratingsGiven: user._count.ratings,
        publishedRecipes: publishedRecipes.length,
        draftRecipes: draftRecipes.length,
        averageRatingReceived: Math.round(averageRatingReceived * 10) / 10, // Round to 1 decimal
        totalRatingsReceived: totalRatings,
        mostPopularRecipe: mostPopularRecipe,
        memberSince: user.createdAt
      }
    }

    return NextResponse.json(enhancedProfile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      bio,
      location,
      website,
      cookingExperience,
      favoritesCuisines,
      dietaryRestrictions,
      profilePicture,
      isPublicProfile
    } = body

    // Validate cooking experience
    const validExperiences = ['beginner', 'intermediate', 'advanced', 'professional']
    if (cookingExperience && !validExperiences.includes(cookingExperience)) {
      return NextResponse.json({ error: 'Invalid cooking experience level' }, { status: 400 })
    }

    // Validate website URL
    if (website && website.trim()) {
      try {
        new URL(website)
      } catch {
        return NextResponse.json({ error: 'Invalid website URL' }, { status: 400 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name?.trim() || null,
        bio: bio?.trim() || null,
        location: location?.trim() || null,
        website: website?.trim() || null,
        cookingExperience: cookingExperience || null,
        favoritesCuisines: favoritesCuisines ? JSON.stringify(favoritesCuisines) : null,
        dietaryRestrictions: dietaryRestrictions ? JSON.stringify(dietaryRestrictions) : null,
        profilePicture: profilePicture?.trim() || null,
        isPublicProfile: Boolean(isPublicProfile)
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        cookingExperience: true,
        favoritesCuisines: true,
        dietaryRestrictions: true,
        profilePicture: true,
        isPublicProfile: true,
        createdAt: true,
        _count: {
          select: {
            recipes: true,
            ratings: true
          }
        },
        recipes: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
            ratings: {
              select: {
                value: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    // Calculate enhanced statistics for updated profile
    const publishedRecipes = updatedUser.recipes.filter(recipe => recipe.published)
    const draftRecipes = updatedUser.recipes.filter(recipe => !recipe.published)
    
    let totalRatings = 0
    let ratingSum = 0
    let mostPopularRecipe = null
    let highestRating = 0
    
    updatedUser.recipes.forEach(recipe => {
      if (recipe.ratings.length > 0) {
        const recipeRatingSum = recipe.ratings.reduce((sum, rating) => sum + rating.value, 0)
        const recipeAverage = recipeRatingSum / recipe.ratings.length
        
        totalRatings += recipe.ratings.length
        ratingSum += recipeRatingSum
        
        if (recipeAverage > highestRating) {
          highestRating = recipeAverage
          mostPopularRecipe = {
            id: recipe.id,
            title: recipe.title,
            averageRating: recipeAverage,
            totalRatings: recipe.ratings.length
          }
        }
      }
    })
    
    const averageRatingReceived = totalRatings > 0 ? ratingSum / totalRatings : 0
    
    const enhancedUpdatedProfile = {
      ...updatedUser,
      recipes: undefined,
      statistics: {
        recipesCreated: updatedUser._count.recipes,
        ratingsGiven: updatedUser._count.ratings,
        publishedRecipes: publishedRecipes.length,
        draftRecipes: draftRecipes.length,
        averageRatingReceived: Math.round(averageRatingReceived * 10) / 10,
        totalRatingsReceived: totalRatings,
        mostPopularRecipe: mostPopularRecipe,
        memberSince: updatedUser.createdAt
      }
    }

    return NextResponse.json(enhancedUpdatedProfile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}