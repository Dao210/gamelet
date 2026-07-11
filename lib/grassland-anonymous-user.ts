const STORAGE_KEY = 'grassland-anonymous-user-id'

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function getGrasslandAnonymousUserId(): string {
  if (typeof window === 'undefined') {
    throw new Error('Anonymous grassland user id is only available in the browser')
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && isUuid(stored)) return stored

  const userId = window.crypto.randomUUID()
  window.localStorage.setItem(STORAGE_KEY, userId)
  return userId
}
