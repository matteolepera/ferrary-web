import { initials } from '@/lib/initials'

type AvatarProps = {
  /** Il nome della persona; senza, un punto al posto delle iniziali */
  name: string | null
  /** In rosso, per distinguere chi sta guardando */
  highlighted?: boolean
  className?: string
}

/**
 * Le iniziali in un cerchio. Decorativo: il nome è sempre scritto accanto.
 */
export function Avatar({
  name,
  highlighted = false,
  className = '',
}: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        'font-display flex shrink-0 items-center justify-center rounded-full font-bold',
        highlighted
          ? 'bg-rosso text-white'
          : 'border border-white/10 bg-white/5 text-neutral-100',
        className,
      ].join(' ')}
    >
      {name ? initials(name) : '·'}
    </span>
  )
}
