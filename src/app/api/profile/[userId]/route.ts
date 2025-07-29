import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { userId } = await params

    // Find the user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
            recipes: {
              where: {
                published: true // Only count published recipes for public view
              }
            },
            ratings: true,
            followers: true // Count followers
          }
        },
        recipes: {
          where: {
            published: true // Only show published recipes in public view
          },
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            createdAt: true,
            ratings: {
              select: {
                value: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 6 // Limit to 6 most recent recipes for public view
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if profile is public or if it's the user's own profile
    const isOwnProfile = session?.user?.email === user.email
    if (!user.isPublicProfile && !isOwnProfile) {
      return NextResponse.json({ error: 'Profile is private' }, { status: 403 })
    }

    // Calculate public statistics (only from published recipes)
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
        
        // Track most popular recipe
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
    
    // Check if current user is following this profile
    let isFollowing = false
    if (session?.user?.email && !isOwnProfile) {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      
      if (currentUser) {
        const followRelation = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.id,
              followingId: userId
            }
          }
        })
        isFollowing = !!followRelation
      }
    }
    
    // Public profile response (hide email for privacy)
    const publicProfile = {
      id: user.id,
      name: user.name,
      email: isOwnProfile ? user.email : undefined, // Only show email to profile owner
      image: user.image,
      bio: user.bio,
      location: user.location,
      website: user.website,
      cookingExperience: user.cookingExperience,
      favoritesCuisines: user.favoritesCuisines,
      dietaryRestrictions: user.dietaryRestrictions,
      profilePicture: user.profilePicture,
      isPublicProfile: user.isPublicProfile,
      createdAt: user.createdAt,
      isOwnProfile,
      isFollowing,
      recipes: user.recipes,
      statistics: {
        publishedRecipes: user._count.recipes,
        ratingsGiven: isOwnProfile ? user._count.ratings : undefined, // Hide ratings given from public view
        averageRatingReceived: Math.round(averageRatingReceived * 10) / 10,
        totalRatingsReceived: totalRatings,
        mostPopularRecipe: mostPopularRecipe,
        followersCount: user._count.followers,
        memberSince: user.createdAt
      }
    }

    return NextResponse.json(publicProfile)
  } catch (error) {
    console.error('Public profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}