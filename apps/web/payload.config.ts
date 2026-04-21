import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Startup guard: DATABASE_URL is required for database connection
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Startup guard: PAYLOAD_SECRET is required in production
if (process.env.NODE_ENV === 'production' && !process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required in production')
}

export default buildConfig({
  admin: {
    user: 'users', // slug defined in Users collection (Task 3)
  },
  collections: [], // filled in later tasks
  globals: [], // filled in later tasks
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  plugins: [
    s3Storage({
      collections: { media: true }, // 'media' slug must match Media collection (Task 4)
      bucket: process.env.S3_BUCKET ?? '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
        },
        region: process.env.S3_REGION ?? 'auto',
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET ?? 'dev-secret-change-in-prod',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
