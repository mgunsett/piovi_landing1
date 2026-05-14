import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'none',
      })
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: 'power2.out',
      })
    }

    const addHover = () => {
      cursor.classList.add('hover')
      follower.classList.add('hover')
    }

    const removeHover = () => {
      cursor.classList.remove('hover')
      follower.classList.remove('hover')
    }

    window.addEventListener('mousemove', moveCursor)

    const hoverTargets = document.querySelectorAll('a, button, [data-cursor-hover]')
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  )
}
