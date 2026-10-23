import { createClient } from '@supabase/supabase-js'

// PASTE YOUR SUPABASE URL AND ANON KEY HERE
const supabaseUrl = 'https://ignlqfoqxgtoovgwkjlg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnbmxxZm9xeGd0b292Z3dramxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3Mzg2ODIsImV4cCI6MjEwODMxNDY4Mn0.X4GAP1wLzRchboj0YmqCc9ZLAFlmL9aZnluR9rMdGKU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)