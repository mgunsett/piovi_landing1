// ─── SUPABASE CLIENT ─────────────────────────────────────────────
// Inicializa el cliente solo si las variables de entorno existen.
// Si no están configuradas, `supabase` es null y la web cae al
// fallback local (src/data/matchData.js) sin romperse.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null

// Nombre del bucket de Storage donde se guardan los escudos subidos.
export const SHIELDS_BUCKET = 'shields'
