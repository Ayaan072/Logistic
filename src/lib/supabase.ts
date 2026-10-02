import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient } from './mockSupabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const hasValidSupabaseConfig = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

if (!hasValidSupabaseConfig) {
  console.info('[LogiFlow] No active Supabase credentials found in environment. Using integrated mock store with seed data.');
}

export const supabase: any = hasValidSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : createMockSupabaseClient();

