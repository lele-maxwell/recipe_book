import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateSocialMediaLink, type SocialMediaPlatform } from '@/lib/socialMedia';
import { z } from 'zod';

// Validation schema for social media link creation
const createSocialMediaLinkSchema = z.object({
  platform: z.enum(['youtube', 'tiktok', 'instagram', 'telegram', 'facebook', 'twitter', 'website']),
  url: z.string().url('Invalid URL format'),
});

// GET /api/social-media - Get user's social media links
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const socialMediaLinks = await prisma.socialMediaLink.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ socialMediaLinks });
  } catch (error) {
    console.error('Error fetching social media links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media links' },
      { status: 500 }
    );
  }
}

// POST /api/social-media - Create new social media link
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createSocialMediaLinkSchema.parse(body);

    // Validate the social media link
    const validation = validateSocialMediaLink(
      validatedData.platform as SocialMediaPlatform,
      validatedData.url
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if user already has a link for this platform
    const existingLink = await prisma.socialMediaLink.findUnique({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform: validatedData.platform,
        },
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { error: 'You already have a link for this platform' },
        { status: 409 }
      );
    }

    // Create the social media link
    const socialMediaLink = await prisma.socialMediaLink.create({
      data: {
        userId: session.user.id,
        platform: validatedData.platform,
        url: validation.sanitizedUrl!,
        username: validation.username,
      },
    });

    return NextResponse.json({ socialMediaLink }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating social media link:', error);
    return NextResponse.json(
      { error: 'Failed to create social media link' },
      { status: 500 }
    );
  }
}