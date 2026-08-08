import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://dcmlhyzjkuagjafbvspj.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjbWxoeXpqa3VhZ2phZmJ2c3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDM1MDgsImV4cCI6MjEwMTY3OTUwOH0.P3-gMMyPzFnYREDsgdZYJEb3uwmP9SfafnUGSxyFSuI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
