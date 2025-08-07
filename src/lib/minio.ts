import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3'
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
    // Check if bucket exists (Cubbit auto-creates buckets via dashboard, so just check)
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }))
  } catch (error) {
    console.error('Error initializing Cubbit bucket:', error)
  }
}

export async function uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    await initializeBucket()
    const objectName = `recipes/${Date.now()}-${fileName}`
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: objectName,
      Body: file,
      ContentType: contentType,
    }))
    // Generate a presigned URL for the uploaded image (valid for 7 days)
    const imageUrl = await getSignedUrl(s3Client, new PutObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    }), { expiresIn: 7 * 24 * 60 * 60 })
    return imageUrl
  } catch (error) {
    console.error('Error uploading image to Cubbit:', error)
    throw new Error('Failed to upload image')
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
    const imageUrl = await getSignedUrl(s3Client, new PutObjectCommand({
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