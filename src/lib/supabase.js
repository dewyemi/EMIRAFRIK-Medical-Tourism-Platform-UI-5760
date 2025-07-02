import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://smvvirzefdvhghtzoeby.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdnZpcnplZmR2aGdodHpvZWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzUwNTYsImV4cCI6MjA2NzAxMTA1Nn0.pzKXc3Z5urZw4Dv1l0b5xy-bg06PsLagM9yFYRbRD88'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})