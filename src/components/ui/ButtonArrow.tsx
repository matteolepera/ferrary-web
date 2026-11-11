/**
 * La freccia in fondo ai pulsanti con la forma della Y: avanza al passaggio del mouse.
 * Il colore lo decide la variante del pulsante, attraverso data-arrow.
 */
export function ButtonArrow() {
  return (
    <span
      aria-hidden="true"
      data-arrow
      className="text-[0.9375rem] transition-transform duration-300 group-hover/cta:translate-x-1"
    >
      →
    </span>
  )
}
