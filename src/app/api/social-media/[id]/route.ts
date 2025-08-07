import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateSocialMediaLink, type SocialMediaPlatform } from '@/lib/socialMedia';
import { z } from 'zod';

// Validation schema for social media link update
const updateSocialMediaLinkSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

// PUT /api/social-media/[id] - Update social media link
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const validatedData = updateSocialMediaLinkSchema.parse(body);

    // Find the existing social media link
    const existingLink = await prisma.socialMediaLink.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Social media link not found' },
        { status: 404 }
      );
    }

    // Check if the user owns this link
    if (existingLink.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Validate the updated URL
    const validation = validateSocialMediaLink(
      existingLink.platform as SocialMediaPlatform,
      validatedData.url
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Update the social media link
    const updatedLink = await prisma.socialMediaLink.update({
      where: { id },
      data: {
        url: validation.sanitizedUrl!,
        username: validation.username,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ socialMediaLink: updatedLink });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating social media link:', error);
    return NextResponse.json(
      { error: 'Failed to update social media link' },
      { status: 500 }
    );
  }
}

// DELETE /api/social-media/[id] - Delete social media link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find the existing social media link
    const existingLink = await prisma.socialMediaLink.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Social media link not found' },
        { status: 404 }
      );
    }

    // Check if the user owns this link
    if (existingLink.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the social media link
    await prisma.socialMediaLink.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Social media link deleted successfully' });
  } catch (error) {
    console.error('Error deleting social media link:', error);
    return NextResponse.json(
      { error: 'Failed to delete social media link' },
      { status: 500 }
    );
  }
}

// GET /api/social-media/[id] - Get specific social media link
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find the social media link
    const socialMediaLink = await prisma.socialMediaLink.findUnique({
      where: { id },
    });

    if (!socialMediaLink) {
      return NextResponse.json(
        { error: 'Social media link not found' },
        { status: 404 }
      );
    }

    // Check if the user owns this link
    if (socialMediaLink.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ socialMediaLink });
  } catch (error) {
    console.error('Error fetching social media link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media link' },
      { status: 500 }
    );
  }
}