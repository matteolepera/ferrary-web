import { Icon } from '@/components/admin/ui/Icon'

type AdminPaginationProps = {
  page: number
  lastPage: number
  onChange: (page: number) => void
}

const arrowClass =
  'flex size-9 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:border-rosso hover:bg-rosso hover:text-white disabled:pointer-events-none disabled:opacity-30'

/**
 * Le pagine di una tabella: compare solo se ce n'è più di una.
 */
export function AdminPagination({
  page,
  lastPage,
  onChange,
}: AdminPaginationProps) {
  if (lastPage <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Pagine"
      className="border-linea flex items-center justify-end gap-3 border-t px-6 py-4"
    >
      <p className="text-xs text-neutral-400 tabular-nums">
        Pagina {page} di {lastPage}
      </p>
      <button
        type="button"
        aria-label="Pagina precedente"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={arrowClass}
      >
        <Icon path="M15 6l-6 6 6 6" size={16} />
      </button>
      <button
        type="button"
        aria-label="Pagina successiva"
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
        className={arrowClass}
      >
        <Icon path="M9 6l6 6-6 6" size={16} />
      </button>
    </nav>
  )
}
