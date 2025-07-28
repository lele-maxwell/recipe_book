import { Client } from 'minio'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
})

const bucketName = process.env.MINIO_BUCKET_NAME || 'recipe-images'

export async function initializeBucket() {
  try {
    const bucketExists = await minioClient.bucketExists(bucketName)
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1')
      console.log(`Bucket ${bucketName} created successfully`)
    }
  } catch (error) {
    console.error('Error initializing MinIO bucket:', error)
  }
}

export async function uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    await initializeBucket()
    
    const objectName = `recipes/${Date.now()}-${fileName}`
    
    await minioClient.putObject(bucketName, objectName, file, file.length, {
      'Content-Type': contentType,
    })
    
    // Generate a presigned URL for the uploaded image (valid for 7 days)
    const imageUrl = await minioClient.presignedGetObject(bucketName, objectName, 7 * 24 * 60 * 60)
    
    return imageUrl
  } catch (error) {
    console.error('Error uploading image to MinIO:', error)
    throw new Error('Failed to upload image')
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract object name from the URL
    const url = new URL(imageUrl)
    const objectName = url.pathname.substring(1) // Remove leading slash
    
    await minioClient.removeObject(bucketName, objectName)
    console.log(`Image ${objectName} deleted successfully`)
  } catch (error) {
    console.error('Error deleting image from MinIO:', error)
    throw new Error('Failed to delete image')
  }
}

export async function getImageUrl(objectName: string): Promise<string> {
  try {
    const imageUrl = await minioClient.presignedGetObject(bucketName, objectName, 7 * 24 * 60 * 60)
    return imageUrl
  } catch (error) {
    console.error('Error getting image URL from MinIO:', error)
    throw new Error('Failed to get image URL')
  }
}

export { minioClient, bucketName }