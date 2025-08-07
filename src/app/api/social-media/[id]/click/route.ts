import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if social media link exists
    const socialMediaLink = await prisma.socialMediaLink.findUnique({
      where: { id },
      select: { id: true, clickCount: true }
    })

    if (!socialMediaLink) {
      return NextResponse.json(
        { error: 'Social media link not found' },
        { status: 404 }
      )
    }

    // Increment click count
    await prisma.socialMediaLink.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking social media click:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}