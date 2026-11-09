import { Search } from 'lucide-react'
import { useId, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchResults } from '@/components/layout/SearchResults'
import { useQuickSearch } from '@/hooks/useQuickSearch'

type MobileSearchProps = {
  onClose: () => void
}

/**
 * La ricerca del dock: a tutto schermo, con il campo in alto,
 * perché la tastiera che si alza non copra né il campo né i suggerimenti.
 */
export function MobileSearch({ onClose }: MobileSearchProps) {
  const { t } = useTranslation()
  const search = useQuickSearch(onClose)
  const input = useRef<HTMLInputElement>(null)
  const listId = useId()

  // Il cursore nel campo subito, nello stesso tocco che ha aperto la ricerca:
  // su iPhone la tastiera si alza solo così
  useLayoutEffect(() => {
    input.current?.focus()
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.searchLabel')}
      className="bg-notte/95 fixed inset-0 z-40 flex flex-col px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-32 backdrop-blur-md lg:hidden"
    >
      {/* Il campo, con la forma della Y */}
      <div className="flex items-center gap-3">
        <div className="flex h-14 flex-1 items-center gap-3 rounded-[4px] rounded-tl-[18px] bg-neutral-900 px-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
          <Search
            aria-hidden="true"
            className="text-rosso-acceso size-4 shrink-0"
          />
          <input
            ref={input}
            type="search"
            enterKeyHint="search"
            role="combobox"
            aria-label={t('nav.searchLabel')}
            aria-expanded={search.typed.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            placeholder={t('nav.searchPlaceholder')}
            value={search.term}
            onChange={(event) => search.change(event.target.value)}
            onKeyDown={search.onKeyDown}
            className="h-full min-w-0 flex-1 bg-transparent text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 py-2 text-sm text-neutral-300"
        >
          {t('nav.searchCancel')}
        </button>
      </div>

      {search.typed && (
        <div className="mt-4 overflow-y-auto">
          <SearchResults
            listId={listId}
            results={search.results}
            active={search.active}
            typed={search.typed}
            empty={search.empty}
            onOpenModel={search.openModel}
            onOpenAll={search.openAll}
          />
        </div>
      )}
    </div>
  )
}
