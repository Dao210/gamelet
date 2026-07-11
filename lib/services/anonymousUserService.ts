import { db } from '@/db'
import { users } from '@/db/schema/users'
import { eq } from 'drizzle-orm'
import { isUuid } from '@/lib/grassland-anonymous-user'

export async function ensureAnonymousUser(userId: string) {
  if (!isUuid(userId)) {
    throw new Error('Invalid anonymous user id')
  }

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (existingUser.length > 0) return existingUser[0]

  const [createdUser] = await db
    .insert(users)
    .values({
      id: userId,
      name: 'Anonymous Gardener'
    })
    .returning({ id: users.id })

  return createdUser
}
