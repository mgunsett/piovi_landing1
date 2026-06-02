// ─── useMatches ──────────────────────────────────────────────────
// Devuelve { last, next } para el MatchBox del Hero.
// Render instantáneo con el fallback local; si Supabase está
// configurado, hidrata con los datos reales en segundo plano.

import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { defaultMatches, rowToMatch } from '../data/matchData'

export function useMatches() {
  const [matches, setMatches] = useState(defaultMatches)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true

    ;(async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .in('slot', ['last', 'next'])

      if (!active) return

      if (!error && data) {
        const lastRow = data.find((r) => r.slot === 'last')
        const nextRow = data.find((r) => r.slot === 'next')
        setMatches({
          last: rowToMatch(lastRow) || defaultMatches.last,
          next: rowToMatch(nextRow) || defaultMatches.next,
        })
      }
      setLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  return { matches, loading }
}

export default useMatches
