import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { randomUUID } from 'crypto'

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION ?? 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

const BUCKET = process.env.S3_BUCKET!

export type UploadResult = {
  url: string
  thumbnailUrl: string
  mediumUrl: string
}

function mediaUrl(key: string) {
  return `/api/media?key=${encodeURIComponent(key)}`
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
    url: mediaUrl(keys.original),
    thumbnailUrl: mediaUrl(keys.thumbnail),
    mediumUrl: mediaUrl(keys.medium),
  }
}

export async function getObjectStream(key: string) {
  const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
  return { body: res.Body, contentType: res.ContentType ?? 'application/octet-stream' }
}

export async function deleteFromS3(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
