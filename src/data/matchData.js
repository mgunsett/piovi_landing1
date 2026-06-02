// ─── DATOS DE PARTIDOS (FALLBACK LOCAL) ──────────────────────────
// Estos datos se usan como respaldo instantáneo mientras se cargan
// los datos reales desde Supabase — o si Supabase no está configurado.
// El AdminPage edita la versión en la nube; esto solo evita que el
// Hero quede vacío en el primer render o sin backend.

import escudoCruzAzul from '../assets/escudos/cruzazul.png'
import escudoRival from '../assets/escudos/racing.png'

// Estructura de un partido:
//   home / away → { name, shield }   (home = LOCAL, away = VISITANTE)
//   homeScore / awayScore → number | null  (null = sin resultado)
//   date → texto libre (ej: "12 Mar 2026")
//   stadium → texto
//   competition → texto (opcional, ej: "Liga MX · J12")

export const defaultMatches = {
  last: {
    home: { name: 'Cruz Azul', shield: escudoCruzAzul },
    away: { name: 'Rival', shield: escudoRival },
    homeScore: 2,
    awayScore: 1,
    date: '12 Mar 2026',
    stadium: 'Estadio Ciudad de los Deportes',
    competition: 'Liga MX',
  },
  next: {
    home: { name: 'Rival', shield: escudoRival },
    away: { name: 'Cruz Azul', shield: escudoCruzAzul },
    homeScore: null,
    awayScore: null,
    date: '19 Mar 2026',
    stadium: 'Estadio Akron',
    competition: 'Liga MX',
  },
}

// Convierte una fila de la tabla `matches` de Supabase al shape de arriba.
export function rowToMatch(row) {
  if (!row) return null
  return {
    home: { name: row.home_team || '', shield: row.home_shield || '' },
    away: { name: row.away_team || '', shield: row.away_shield || '' },
    homeScore: row.home_score,
    awayScore: row.away_score,
    date: row.match_date || '',
    stadium: row.stadium || '',
    competition: row.competition || '',
  }
}

export default defaultMatches
