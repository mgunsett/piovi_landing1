export const pad2 = (n) => String(n).padStart(2, '0')

// Esquina recortada estilo HUD (misma que las flechas de la galería actual)
export const cutCorner = (cut = '11px', side = 'tr') =>
  ({
    tl: `polygon(${cut} 0, 100% 0, 100% 100%, 0 100%, 0 ${cut})`,
    tr: `polygon(0 0, calc(100% - ${cut}) 0, 100% ${cut}, 100% 100%, 0 100%)`,
  })[side]
