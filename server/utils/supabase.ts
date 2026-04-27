import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export function useSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: 'Missing Supabase environment variables' })
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
