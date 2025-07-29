import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params
    const followerId = session.user.id

    // Can't follow yourself
    if (followerId === userId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!userToFollow) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId
        }
      }
    })

    if (existingFollow) {
      return NextResponse.json({ error: 'Already following this user' }, { status: 400 })
    }

    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId,
        followingId: userId
      }
    })

    // Get updated follower count
    const followerCount = await prisma.follow.count({
      where: { followingId: userId }
    })

    return NextResponse.json({ 
      success: true, 
      isFollowing: true,
      followerCount 
    })

  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params
    const followerId = session.user.id

    // Find and delete the follow relationship
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId
        }
      }
    })

    if (!existingFollow) {
      return NextResponse.json({ error: 'Not following this user' }, { status: 400 })
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId
        }
      }
    })

    // Get updated follower count
    const followerCount = await prisma.follow.count({
      where: { followingId: userId }
    })

    return NextResponse.json({ 
      success: true, 
      isFollowing: false,
      followerCount 
    })

  } catch (error) {
    console.error('Unfollow error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}