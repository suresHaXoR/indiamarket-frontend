import { createClient } from '@supabase/supabase-js';

// 🔑 Replace with your Supabase project values
// Get from: supabase.com → your project → Settings → API
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Auth helpers ─────────────────────────────────────────────────────────────

export async function sendOtp(phone) {
  // Supabase handles OTP SMS automatically once you configure Twilio/MSG91 in dashboard
  const { error } = await supabase.auth.signInWithOtp({
    phone: '+91' + phone,
  });
  if (error) throw new Error(error.message);
}

export async function verifyOtp(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: '+91' + phone,
    token,
    type: 'sms',
  });
  if (error) throw new Error(error.message);
  return data; // { session, user }
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ── API base URL ─────────────────────────────────────────────────────────────
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function apiFetch(path, options = {}) {
  const session = await getSession();
  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: 'Bearer ' + session.access_token } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}
