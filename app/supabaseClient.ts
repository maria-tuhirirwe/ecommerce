import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Simple check if env vars are present
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Create client - use dummy values for build if not configured
export const supabase = createClient(
  supabaseUrl || "https://dummy.supabase.co",
  supabaseAnonKey || "dummy-anon-key"
);
