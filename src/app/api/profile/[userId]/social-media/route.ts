import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    // Check if user exists and has public profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        isPublicProfile: true 
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.isPublicProfile) {
      return NextResponse.json(
        { error: 'Profile is private' },
        { status: 403 }
      )
    }

    // Fetch social media links for the user
    const socialMediaLinks = await prisma.socialMediaLink.findMany({
      where: { userId },
      select: {
        id: true,
        platform: true,
        url: true,
        username: true,
        verified: true,
        clickCount: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(socialMediaLinks)
  } catch (error) {
    console.error('Error fetching user social media links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}