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
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
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
        }
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}