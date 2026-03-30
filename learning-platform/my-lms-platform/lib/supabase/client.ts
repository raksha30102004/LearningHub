import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  console.log('🔍 Supabase Client Debug:');
  console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing');
  console.log('Full URL:', supabaseUrl);

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables!');
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  )
}
