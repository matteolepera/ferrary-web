import type { MouseEvent, ReactNode } from 'react'

/** Lo stato di una sezione: completa, con qualcosa da completare, o ancora vuota */
export type SectionStatus = 'complete' | 'partial' | 'empty'

export type SectionIndexItem = {
  /** L'id del titolo della sezione, a cui porta il link */
  id: string
  label: string
  status: SectionStatus
}

const statusLabel: Record<SectionStatus, string> = {
  complete: 'completa',
  partial: 'da completare',
  empty: 'vuota',
}

const dotClass: Record<SectionStatus, string> = {
  complete: 'bg-emerald-400',
  partial: 'bg-amber-400',
  empty: 'bg-neutral-700',
}

type SectionIndexProps = {
  items: SectionIndexItem[]
  /** L'id della sezione che si sta leggendo */
  active: string
  /** Sotto l'elenco: ad esempio le date di creazione e di modifica */
  children?: ReactNode
  className?: string
}

/**
 * L'indice di una pagina lunga: porta a ogni sezione, segna quella che si sta leggendo
 * e, con un pallino, dice se è completa (verde), da completare (arancio) o vuota (grigio).
 */
export function SectionIndex({
  items,
  active,
  children,
  className = '',
}: SectionIndexProps) {
  function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    // Il titolo arriva poco sotto il bordo dello schermo, non incollato in cima
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 32,
      behavior: 'smooth',
    })
  }

  return (
    <nav
      aria-label="Sezioni"
      className={`border-linea bg-ombra rounded-3xl border px-2.5 pt-4 pb-3.5 ${className}`}
    >
      <p className="mb-2 px-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
        Sezioni
      </p>
      <ul>
        {items.map((item) => {
          const isActive = item.id === active

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => goTo(event, item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={[
                  'relative flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                  'focus-visible:outline-rosso-acceso focus-visible:outline-2',
                  isActive
                    ? 'bg-white/6 text-white'
                    : 'text-neutral-400 hover:text-white',
                ].join(' ')}
              >
                {/* Il segno rosso obliquo della sezione che si sta leggendo, come nel sito */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="bg-rosso-acceso absolute top-1/2 -left-0.5 h-[3px] w-2.5 -translate-y-1/2 -skew-x-[28deg]"
                  />
                )}
                {item.label}
                <span
                  title={statusLabel[item.status]}
                  className={`size-[7px] shrink-0 rounded-full ${dotClass[item.status]}`}
                >
                  {/* Il colore non basta: il lettore di schermo legge lo stato in parole */}
                  <span className="sr-only">, {statusLabel[item.status]}</span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
      {children && (
        <div className="border-linea mx-3 mt-3 border-t pt-3 text-xs leading-relaxed text-neutral-500">
          {children}
        </div>
      )}
    </nav>
  )
}
