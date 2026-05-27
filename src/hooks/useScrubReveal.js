import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scrubbed section reveal — WTF‑style.
 *
 * Usage:
 *   useScrubReveal(sectionRef, {
 *     elements: [
 *       { ref: titleRef, vars: { y: 60 } },
 *       { ref: cardsRef, vars: { y: 40 }, stagger: 0.15 },
 *     ],
 *     pin: true,               // pin section while animating
 *     pinSpacing: true,
 *     start: 'top top',
 *     end:   'bottom bottom',
 *     scrub: 1,
 *   })
 *
 * Returns nothing – animates directly via ScrollTrigger.
 */
export default function useScrubReveal(sectionRef, config = {}) {
  const {
    elements = [],
    pin = false,
    pinSpacing = true,
    start = 'top top',
    end = 'bottom bottom',
    scrub = 1.2,
    anticipatePin = 1,
  } = config

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !elements.length) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start,
          end,
          scrub,
          pin,
          pinSpacing,
          anticipatePin,
          invalidateOnRefresh: true,
        },
      })

      elements.forEach(({ ref, vars = {}, fromVars = {}, stagger, position }) => {
        const target = ref.current
        if (!target) return

        const defaultFrom = { opacity: 0, y: 50, ...fromVars }
        const defaultTo = { opacity: 1, y: 0, ease: 'none', ...vars }

        if (stagger) {
          tl.fromTo(target, defaultFrom, { ...defaultTo, stagger }, position)
        } else {
          tl.fromTo(target, defaultFrom, defaultTo, position)
        }
      })
    }, section)

    return () => ctx.revert()
  }, [elements, pin, pinSpacing, start, end, scrub, anticipatePin])
}
