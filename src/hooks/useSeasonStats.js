import { useState, useEffect } from 'react'
import { getDoc } from 'firebase/firestore'
import { isFirebaseConfigured, playerStatsDoc } from '../lib/firebase'

// Totales de la temporada en curso (stats/season), que carga la
// sincronización con API-Football. null si no hay datos: el panel de
// temporada usa entonces los valores fijos de playerData.
export default function useSeasonStats() {
  const [season, setSeason] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    getDoc(playerStatsDoc('season'))
      .then((snap) => { if (snap.exists()) setSeason(snap.data()) })
      .catch(() => {})
  }, [])

  return season
}
