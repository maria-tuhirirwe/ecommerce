import { supabase, isSupabaseConfigured } from '../supabaseClient';

// Helper: validate email format
const isValidEmail = (email: string) => {
  const trimmed = email.trim().toLowerCase();
  // More comprehensive email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(trimmed) && trimmed.length <= 254;
};

// Helper: ensure Supabase client is ready
const ensureSupabase = () => {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please add your environment variables.');
  }
};

// Sign up with email + password
export async function signUpWithEmail(email: string, password: string) {
  ensureSupabase();

  const trimmedEmail = email.trim().toLowerCase();

  if (!isValidEmail(trimmedEmail)) {
    throw new Error("Please enter a valid email address");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) {
      console.error("Supabase signup error:", error);
      
      // Handle specific error cases
      if (error.message.includes('invalid') || error.message.includes('Invalid')) {
        throw new Error("Please enter a valid email address");
      }
      if (error.message.includes('already registered')) {
        throw new Error("An account with this email already exists. Please sign in instead.");
      }
      if (error.message.includes('Password')) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      throw new Error(error.message || "Failed to create account. Please try again.");
    }

    return data;
  } catch (error: any) {
    console.error("Signup error:", error);
    throw error;
  }
}

// Sign in with email + password
export async function signInWithEmail(email: string, password: string) {
  ensureSupabase();

  const trimmedEmail = email.trim();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password
  });

  if (error) throw error;
  return data;
}

// Sign in with Google
export async function signInWithGoogle() {
  ensureSupabase();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  ensureSupabase();

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}