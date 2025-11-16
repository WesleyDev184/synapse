import * as zod from 'zod'

const EnvSchema = zod.object({
  VITE_API_URL: zod.string().url(),
  VITE_WEBSOCKET_URL: zod.string().url(),
})

type Env = zod.infer<typeof EnvSchema>

let cachedEnv: Env | null = null

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv
  }

  const parsed = EnvSchema.safeParse(import.meta.env)

  if (!parsed.success) {
    console.error(
      'Environment variable validation failed:',
      parsed.error.format(),
    )
    throw new Error('Invalid environment variables')
  }

  cachedEnv = parsed.data
  return cachedEnv
}
