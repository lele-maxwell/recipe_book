import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// POST /api/recipes/[id]/rating - Rate a recipe
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { value } = await request.json()

    // Validate rating value
    if (!value || value < 1 || value > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      )
    }

    // Prevent users from rating their own recipes
    if (recipe.userId === session.user.id) {
      return NextResponse.json(
        { message: 'You cannot rate your own recipe' },
        { status: 400 }
      )
    }

    // Create or update rating
    const rating = await prisma.rating.upsert({
      where: {
        recipeId_userId: {
          recipeId: id,
          userId: session.user.id,
        },
      },
      update: {
        value: parseInt(value),
      },
      create: {
        value: parseInt(value),
        recipeId: id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(rating, { status: 201 })
  } catch (error) {
    console.error('Error rating recipe:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/recipes/[id]/rating - Get user's rating for a recipe
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const rating = await prisma.rating.findUnique({
      where: {
        recipeId_userId: {
          recipeId: id,
          userId: session.user.id,
        },
      },
    })

    if (!rating) {
      return NextResponse.json(
        { message: 'No rating found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rating)
  } catch (error) {
    console.error('Error fetching rating:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}