import { useTranslation } from 'react-i18next'
import type { CarModel } from '@/types/catalog'

type SearchResultsProps = {
  listId: string
  results: CarModel[]
  active: number
  typed: string
  empty: boolean
  onOpenModel: (slug: string) => void
  onOpenAll: () => void
}

/**
 * I suggerimenti della ricerca veloce: i modelli, con la miniatura, la famiglia e l'anno,
 * e in fondo l'accesso a tutti i risultati nell'archivio.
 */
export function SearchResults({
  listId,
  results,
  active,
  typed,
  empty,
  onOpenModel,
  onOpenAll,
}: SearchResultsProps) {
  const { t } = useTranslation()

  return (
    <>
      <ul id={listId} role="listbox" aria-label={t('nav.searchLabel')}>
        {results.map((model, place) => (
          <li
            key={model.id}
            id={`${listId}-${place}`}
            role="option"
            aria-selected={place === active}
            // Il campo non perde il focus toccando un risultato
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => onOpenModel(model.slug)}
            className={[
              'flex cursor-pointer items-center gap-4 rounded-[2px] rounded-tl-[12px] px-3 py-2.5 text-[0.9375rem] transition-colors',
              place === active
                ? 'bg-white/[0.07] text-white'
                : 'text-neutral-300 hover:bg-white/5 hover:text-white',
            ].join(' ')}
          >
            <span className="bg-ombra riflettore relative h-11 w-[4.5rem] shrink-0 overflow-hidden rounded-[2px] rounded-tl-[8px]">
              {model.cover && (
                <img
                  src={model.cover.url}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </span>
            <span className="min-w-0 flex-1 truncate">{model.name}</span>
            <span className="shrink-0 text-[0.625rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase">
              {[model.category?.name, model.first_year]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </li>
        ))}
      </ul>

      {empty && (
        <p className="px-3 py-3 text-sm text-neutral-400">
          {t('nav.searchEmpty')}
        </p>
      )}

      <button
        type="button"
        onPointerDown={(event) => event.preventDefault()}
        onClick={onOpenAll}
        className="text-rosso-acceso flex w-full items-center justify-between rounded-[2px] px-3 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase hover:bg-white/5"
      >
        {t('nav.searchAll', { term: typed })}
        <span aria-hidden="true">Invio ↵</span>
      </button>
    </>
  )
}
