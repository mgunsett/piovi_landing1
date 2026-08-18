export function docToMatch(data) {
  return {
    home:      { name: data.home_team, shield: data.home_shield || null },
    away:      { name: data.away_team, shield: data.away_shield || null },
    homeScore: data.home_score ?? null,
    awayScore: data.away_score ?? null,
    date:      data.match_date,
    stadium:   data.stadium || '',
    competition: data.competition || '',
  }
}

export const defaultMatches = {
  last: {
    home:      { name: 'Cruz Azul', shield: null },
    away:      { name: 'Pumas', shield: null },
    homeScore: 2,
    awayScore: 1,
    date:      '08 Jun 2025',
    stadium:   'Mario Kempes',
    competition: 'Liga Profesional',
  },
  next: {
    home:      { name: 'Chivas', shield: null },
    away:      { name: 'Cruz Azul', shield: null },
    homeScore: null,
    awayScore: null,
    date:      '22 Jun 2025',
    stadium:   'Monumental',
    competition: 'Liga Profesional',
  },
}
