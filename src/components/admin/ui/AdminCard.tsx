import type { ComponentProps } from 'react'

type AdminCardProps = ComponentProps<'section'> & {
  /** Ritardo dell'entrata, in millisecondi: i blocchi compaiono uno dopo l'altro */
  delay?: number
}

/**
 * Il blocco dell'area admin: angoli da 24 px, bordo sottile ed entrata morbida, come nella bozza.
 */
export function AdminCard({
  delay = 0,
  className = '',
  style,
  ...props
}: AdminCardProps) {
  return (
    <section
      className={[
        'border-linea bg-ombra rounded-3xl border',
        'motion-safe:animate-comparsa [animation-fill-mode:backwards]',
        className,
      ].join(' ')}
      style={{ animationDelay: `${delay}ms`, ...style }}
      {...props}
    />
  )
}
