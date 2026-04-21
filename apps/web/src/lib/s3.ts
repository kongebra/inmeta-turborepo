import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { randomUUID } from 'crypto'

export const s3 = new S3Client({
  endpoint: process.env.RAILWAY_S3_ENDPOINT!,
  region: process.env.RAILWAY_S3_REGION ?? 'auto',
  credentials: {
    accessKeyId: process.env.RAILWAY_S3_ACCESS_KEY!,
    secretAccessKey: process.env.RAILWAY_S3_SECRET_KEY!,
  },
  forcePathStyle: true,
})

const BUCKET = process.env.RAILWAY_S3_BUCKET!
const BASE_URL = process.env.RAILWAY_S3_ENDPOINT!

export type UploadResult = {
  url: string
  thumbnailUrl: string
  mediumUrl: string
}

export async function uploadImage(
  buffer: Buffer,
  mimeType: string,
  prefix = 'media'
): Promise<UploadResult> {
  const id = randomUUID()
  const ext = mimeType === 'image/webp' ? 'webp' : mimeType === 'image/png' ? 'png' : 'jpg'

  const [original, thumbnail, medium] = await Promise.all([
    sharp(buffer).toBuffer(),
    sharp(buffer).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer(),
    sharp(buffer).resize(800, 800, { fit: 'inside' }).jpeg({ quality: 90 }).toBuffer(),
  ])

  const keys = {
    original: `${prefix}/${id}.${ext}`,
    thumbnail: `${prefix}/${id}_thumb.jpg`,
    medium: `${prefix}/${id}_medium.jpg`,
  }

  await Promise.all([
    s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: keys.original, Body: original, ContentType: mimeType })),
    s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: keys.thumbnail, Body: thumbnail, ContentType: 'image/jpeg' })),
    s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: keys.medium, Body: medium, ContentType: 'image/jpeg' })),
  ])

  return {
    url: `${BASE_URL}/${BUCKET}/${keys.original}`,
    thumbnailUrl: `${BASE_URL}/${BUCKET}/${keys.thumbnail}`,
    mediumUrl: `${BASE_URL}/${BUCKET}/${keys.medium}`,
  }
}

export async function deleteFromS3(url: string) {
  const key = url.replace(`${BASE_URL}/${BUCKET}/`, '')
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
