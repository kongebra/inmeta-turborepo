import { db } from '../src/lib/db'
import { auth } from '../src/lib/auth'

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@leikan.no'
  const password = process.env.ADMIN_PASSWORD ?? 'bytt-meg-nå'

  await auth.api.signUpEmail({
    body: { name: 'Admin', email, password },
  })

  await db.user.update({
    where: { email },
    data: { role: 'admin' },
  })

  console.log(`Admin opprettet: ${email}`)
}

main().catch(console.error).finally(() => db.$disconnect())
