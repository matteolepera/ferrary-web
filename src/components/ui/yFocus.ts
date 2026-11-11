/**
 * Il segno rosso obliquo sotto il controllo attivo, al posto del contorno rettangolare del focus,
 * che dentro la forma della Y stonerebbe. Va sull'elemento che contiene il controllo:
 * un input o un select non possono avere un ::after.
 */
export const yFocusMark = [
  "relative after:pointer-events-none after:absolute after:bottom-1.5 after:left-1/2 after:h-[3px] after:w-4 after:-translate-x-1/2 after:-skew-x-[28deg] after:content-['']",
  'after:bg-rosso-acceso after:opacity-0 after:shadow-[0_0_8px_rgba(255,59,48,0.7)] after:transition-opacity',
  // Acceso quando l'elemento stesso ha il focus, o quando ce l'ha il campo che contiene
  'focus-visible:after:opacity-100 has-[:focus-visible]:after:opacity-100',
].join(' ')
