import { createClient } from '@supabase/supabase-js';
import { AppConfig } from '../constants/config';

export const supabase = createClient(
  AppConfig.supabaseUrl,
  AppConfig.supabaseAnonKey
);
