import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://refzqaxrqoylqlvyaqff.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZnpxYXhycW95bHFsdnlhcWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MzY4NTksImV4cCI6MjA2NzUxMjg1OX0.X-ZNAtszjFvnv3TFevUnHCdtvWx-CEmqgGxpqiPumxI'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})