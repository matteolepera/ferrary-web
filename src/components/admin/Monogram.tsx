import monogram from '@/assets/brand/ferrary-y-rosso.svg'

/**
 * Il monogramma nel cerchio rosso, il segno dell'area admin.
 * Decorativo: il nome lo dà il link che lo contiene.
 */
export function Monogram({ className = '' }: { className?: string }) {
  return (
    <span
      className={[
        'border-rosso bg-notte flex size-12 shrink-0 items-center justify-center rounded-full border',
        'shadow-[0_0_22px_rgb(212_0_0/0.35)]',
        className,
      ].join(' ')}
    >
      <img src={monogram} alt="" className="h-5 w-auto" />
    </span>
  )
}
