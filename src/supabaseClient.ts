import { createClient } from '@supabase/supabase-js';

// IMPORTANT: These are accessed via Netlify Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add a check to ensure variables are defined (good practice)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key are not defined in environment variables!');
  // You might want to throw an error or handle this more gracefully in a real app
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
