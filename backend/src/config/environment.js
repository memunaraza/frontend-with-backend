import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const envFilePath = fileURLToPath(new URL('../../.env', import.meta.url))

if (existsSync(envFilePath)) {
  process.loadEnvFile(envFilePath)
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET must be set in the backend environment.')
  }
  return secret
}
