import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/minio' // Now uses Cubbit DS3
import { withRateLimit, RateLimitConfigs } from '@/lib/rateLimiting'

async function uploadHandler(request: NextRequest) {
  try {
    // Check if required environment variables are set
    const requiredEnvVars = [
      'CUBBIT_S3_ENDPOINT',
      'CUBBIT_S3_ACCESS_KEY_ID', 
      'CUBBIT_S3_SECRET_ACCESS_KEY',
      'CUBBIT_S3_BUCKET'
    ]
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars)
      return NextResponse.json(
        { error: 'Upload service not configured properly' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      bucket: process.env.CUBBIT_S3_BUCKET
    })

    // Upload to Cubbit DS3
    const imageUrl = await uploadImage(buffer, file.name, file.type)

    console.log('Upload successful:', imageUrl)

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'Image uploaded successfully' 
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('credentials')) {
        return NextResponse.json(
          { error: 'Storage service authentication failed' },
          { status: 500 }
        )
      }
      if (error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Storage service connection failed' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to upload image. Please try again.' },
      { status: 500 }
    )
  }
}

// Apply strict rate limiting to upload endpoint
export const POST = withRateLimit(RateLimitConfigs.upload, uploadHandler)