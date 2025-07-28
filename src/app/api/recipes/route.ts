import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { RecipeIngredientInput } from '@/types/recipe'

// GET /api/recipes - Get all recipes with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: Prisma.RecipeWhereInput = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Only filter by userId if explicitly requested (for My Recipes page)
    if (userId) {
      // Require authentication for user-specific recipes
      if (!session?.user?.id) {
        return NextResponse.json(
          { message: 'Unauthorized - Please sign in to view your recipes' },
          { status: 401 }
        )
      }
      where.userId = userId
    } else {
      // If no userId is provided, show only published recipes (for main Recipes page)
      // This should be accessible to everyone (no authentication required)
      where.published = true
    }

    const recipes = await prisma.recipe.findMany({
      where,
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
        ratings: true,
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    // Calculate average ratings
    const recipesWithRatings = recipes.map(recipe => ({
      ...recipe,
      averageRating: recipe.ratings.length > 0
        ? recipe.ratings.reduce((sum, rating) => sum + rating.value, 0) / recipe.ratings.length
        : 0,
    }))

    return NextResponse.json(recipesWithRatings)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    console.log('Received recipe data:', JSON.stringify(data, null, 2))
    
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
      console.error('Validation failed:', { title: !!title, instructions: !!instructions, ingredients: ingredients?.length })
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate ingredients structure
    for (const ing of ingredients) {
      if (!ing.ingredientName || !ing.quantity || !ing.unit) {
        console.error('Invalid ingredient:', ing)
        return NextResponse.json(
          { message: 'Invalid ingredient data' },
          { status: 400 }
        )
      }
    }

    console.log('Creating recipe for user:', session.user.id)

    // Create recipe with ingredients
    const recipe = await prisma.recipe.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        instructions: instructions.trim(),
        prepTime: prepTime && !isNaN(prepTime) ? parseInt(prepTime.toString()) : null,
        cookTime: cookTime && !isNaN(cookTime) ? parseInt(cookTime.toString()) : null,
        servings: servings && !isNaN(servings) ? parseInt(servings.toString()) : null,
        imageUrl: imageUrl || null,
        userId: session.user.id,
        ingredients: {
          create: ingredients.map((ing: RecipeIngredientInput) => ({
            quantity: parseFloat(ing.quantity.toString()),
            unit: ing.unit.trim(),
            ingredient: {
              connectOrCreate: {
                where: { name: ing.ingredientName.trim() },
                create: { name: ing.ingredientName.trim() },
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

    console.log('Recipe created successfully:', recipe.id)
    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}