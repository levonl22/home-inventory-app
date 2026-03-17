import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lcqkdyarnebuakigdflg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcWtkeWFybmVidWFraWdkZmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzkwMjMsImV4cCI6MjA4ODg1NTAyM30.XJzXLVYzykE7ySLqtBkt-QYDk0KSIV9PUYRswEzX4qo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);