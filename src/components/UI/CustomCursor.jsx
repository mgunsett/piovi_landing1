import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    const addHover = () => {
      cursor.classList.add('hover')
    }

    const removeHover = () => {
      cursor.classList.remove('hover')
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
    <div ref={cursorRef} className="cursor">
      <svg viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 2L3 17L7 13L10.5 21L13 19.5L9.5 12L16 12Z"
          fill="currentColor"
          stroke="rgba(0,0,0,0.6)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
