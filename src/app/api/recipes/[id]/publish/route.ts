import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/recipes/[id]/publish - Toggle recipe publication status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: recipeId } = await params

    // Check if recipe exists and belongs to the user
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true, userId: true, published: true, title: true }
    })

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      )
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden - You can only publish your own recipes' },
        { status: 403 }
      )
    }

    // Toggle the published status
    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: { published: !recipe.published },
      select: { id: true, published: true, title: true }
    })

    return NextResponse.json({
      message: updatedRecipe.published 
        ? `Recipe "${recipe.title}" has been published and is now visible to everyone!`
        : `Recipe "${recipe.title}" has been unpublished and is now private.`,
      recipe: updatedRecipe
    })
  } catch (error) {
    console.error('Error toggling recipe publication:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}