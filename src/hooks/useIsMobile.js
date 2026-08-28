import { useEffect, useState } from 'react'

// Punto de corte `md` de Chakra (48em / 768px). Tiene que coincidir con
// los props responsive `{ base, md }` que usa el Hero, para que el JS y
// el CSS decidan "esto es mobile" exactamente igual.
const MOBILE_QUERY = '(max-width: 47.99em)'

// Devuelve true en viewport mobile. Se usa para APAGAR animaciones
// (GSAP, parallax de mouse, scrub de scroll) donde el costo por frame
// no se justifica: en mobile penaliza el pintado inicial y el scroll.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  )

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const onChange = (event) => setIsMobile(event.matches)

    setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

export default useIsMobile
