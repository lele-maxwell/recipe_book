import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { RecipeIngredientInput } from '@/types/recipe'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/recipes/[id] - Get a specific recipe
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        ingredients: {
          include: {
            ingredient: {
              include: {
                translations: true,
              },
            },
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      )
    }

    // Check if user can access this recipe
    const isOwner = session?.user?.id === recipe.userId
    const isPublished = recipe.published
    
    // Allow access if: user is owner, recipe is published, or user is authenticated
    if (!isOwner && !isPublished && !session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized - Please sign in to view recipes' },
        { status: 401 }
      )
    }

    // Calculate average rating
    const averageRating = recipe.ratings.length > 0
      ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / recipe.ratings.length
      : 0

    return NextResponse.json({
      ...recipe,
      averageRating,
    })
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/recipes/[id] - Update a recipe
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if recipe exists and user owns it
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!existingRecipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      )
    }

    if (existingRecipe.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden - You can only edit your own recipes' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const {
      title,
      description,
      instructions,
      prepTime,
      cookTime,
      servings,
      imageUrl,
      ingredients,
    } = data

    // Validate required fields
    if (!title || !instructions || !ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update recipe with ingredients
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description,
        instructions,
        prepTime: prepTime ? parseInt(prepTime) : null,
        cookTime: cookTime ? parseInt(cookTime) : null,
        servings: servings ? parseInt(servings) : null,
        imageUrl,
        ingredients: {
          deleteMany: {}, // Remove all existing ingredients
          create: ingredients.map((ing: RecipeIngredientInput) => ({
            quantity: parseFloat(ing.quantity.toString()),
            unit: ing.unit,
            ingredient: {
              connectOrCreate: {
                where: { name: ing.ingredientName },
                create: { name: ing.ingredientName },
              },
            },
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        ingredients: {
          include: {
            ingredient: {
              include: {
                translations: true,
              },
            },
          },
        },
        ratings: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes/[id] - Delete a recipe
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if recipe exists and user owns it
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!existingRecipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      )
    }

    if (existingRecipe.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden - You can only delete your own recipes' },
        { status: 403 }
      )
    }

    // Delete recipe (cascade will handle related records)
    await prisma.recipe.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Recipe deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}