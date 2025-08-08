import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadBucketCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: 'eu-west-1', // Cubbit DS3 region (use any valid AWS region, Cubbit ignores it)
  endpoint: process.env.CUBBIT_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CUBBIT_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CUBBIT_S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for S3-compatible storage like Cubbit
})

const bucketName = process.env.CUBBIT_S3_BUCKET || 'recipe-images'

export async function initializeBucket() {
  try {
    console.log('Initializing bucket:', bucketName)
    // Check if bucket exists (Cubbit auto-creates buckets via dashboard, so just check)
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }))
    console.log('Bucket check successful')
  } catch (error) {
    console.error('Error initializing Cubbit bucket:', error)
    throw new Error(`Bucket initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    console.log('Starting upload to Cubbit:', {
      fileName,
      contentType,
      fileSize: file.length,
      bucket: bucketName,
      endpoint: process.env.CUBBIT_S3_ENDPOINT
    })

    await initializeBucket()
    const objectName = `recipes/${Date.now()}-${fileName}`
    
    console.log('Uploading object:', objectName)
    
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: objectName,
      Body: file,
      ContentType: contentType,
    }))
    
    console.log('Upload successful, generating presigned URL')
    
    // Generate a presigned GET URL for the uploaded image (valid for 7 days)
    const imageUrl = await getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }), { expiresIn: 7 * 24 * 60 * 60 })
    
    console.log('Presigned URL generated:', imageUrl)
    return imageUrl
  } catch (error) {
    console.error('Error uploading image to Cubbit:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('credentials') || error.message.includes('AccessDenied')) {
        throw new Error('Storage service authentication failed - check your access keys')
      }
      if (error.message.includes('NoSuchBucket')) {
        throw new Error('Storage bucket not found - check your bucket configuration')
      }
      if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        throw new Error('Storage service connection failed - check your endpoint URL')
      }
    }
    
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract object name from the URL
    const url = new URL(imageUrl)
    const objectName = decodeURIComponent(url.pathname.replace(/^\//, ''))
    await s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }))
    console.log(`Image ${objectName} deleted successfully`)
  } catch (error) {
    console.error('Error deleting image from Cubbit:', error)
    throw new Error('Failed to delete image')
  }
}

export async function getImageUrl(objectName: string): Promise<string> {
  try {
    const imageUrl = await getSignedUrl(s3Client, new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }), { expiresIn: 7 * 24 * 60 * 60 })
    return imageUrl
  } catch (error) {
    console.error('Error getting image URL from Cubbit:', error)
    throw new Error('Failed to get image URL')
  }
}

export { s3Client, bucketName }