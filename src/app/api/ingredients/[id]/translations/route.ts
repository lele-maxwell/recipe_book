import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/ingredients/[id]/translations - Get all translations for an ingredient
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const translations = await prisma.ingredientTranslation.findMany({
      where: { ingredientId: id },
      include: {
        ingredient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(translations)
  } catch (error) {
    console.error('Error fetching ingredient translations:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/ingredients/[id]/translations - Add a translation for an ingredient
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

    const { locale, name } = await request.json()

    // Validate input
    if (!locale || !name) {
      return NextResponse.json(
        { message: 'Locale and name are required' },
        { status: 400 }
      )
    }

    // Check if ingredient exists
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
    })

    if (!ingredient) {
      return NextResponse.json(
        { message: 'Ingredient not found' },
        { status: 404 }
      )
    }

    // Create or update translation
    const translation = await prisma.ingredientTranslation.upsert({
      where: {
        ingredientId_locale: {
          ingredientId: id,
          locale,
        },
      },
      update: {
        name,
      },
      create: {
        ingredientId: id,
        locale,
        name,
      },
      include: {
        ingredient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(translation, { status: 201 })
  } catch (error) {
    console.error('Error creating ingredient translation:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}