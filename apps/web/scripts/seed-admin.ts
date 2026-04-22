import 'dotenv/config'
import { db } from '../src/lib/db'
import { auth } from '../src/lib/auth'

const email = process.env.ADMIN_EMAIL ?? 'admin@leikan.no'
const password = process.env.ADMIN_PASSWORD ?? 'bytt-meg-nå'
const name = process.env.ADMIN_NAME ?? 'Admin'

await auth.api.signUpEmail({ body: { name, email, password } })
await db.user.update({ where: { email }, data: { role: 'admin' } })

console.log(`Admin opprettet: ${email}`)
process.exit(0)
