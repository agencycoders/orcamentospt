import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Default to empty values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Add error handling for hooks
export const handleSupabaseError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('Failed to construct URL')) {
      return 'Erro de configuração: Verifique as credenciais do Supabase no arquivo .env';
    }
    return error.message;
  }
  return 'Ocorreu um erro desconhecido';
};
