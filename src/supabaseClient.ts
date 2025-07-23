// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djhccukliiunqtyibfng.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqaGNjdWtsaWl1bnF0eWliZm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTE5OTAsImV4cCI6MjA2ODgyNzk5MH0.P-dnijKO3tir7VkAGj9qe2r02evwaA2SXrqhlX4JaLE'
export const supabase = createClient(supabaseUrl, supabaseKey)
