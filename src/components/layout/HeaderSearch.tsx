import { Search } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchResults } from '@/components/layout/SearchResults'
import { useQuickSearch } from '@/hooks/useQuickSearch'

type HeaderSearchProps = {
  onClose: () => void
}

/**
 * La ricerca nella barra della Y del desktop: il campo nella barra, i suggerimenti sotto.
 */
export function HeaderSearch({ onClose }: HeaderSearchProps) {
  const { t } = useTranslation()
  const search = useQuickSearch(onClose)
  const input = useRef<HTMLInputElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const listId = useId()

  // Aperta: il cursore nel campo
  useEffect(() => {
    input.current?.focus()
  }, [])

  // Un clic fuori dalla ricerca la chiude
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) onClose()
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [onClose])

  return (
    <div
      ref={container}
      className="relative flex flex-1 items-center gap-3 pr-1"
    >
      <Search
        aria-hidden="true"
        className="text-rosso-acceso size-4 shrink-0"
      />

      <input
        ref={input}
        type="text"
        role="combobox"
        aria-label={t('nav.searchLabel')}
        aria-expanded={search.typed.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          search.active >= 0 ? `${listId}-${search.active}` : undefined
        }
        placeholder={t('nav.searchPlaceholder')}
        value={search.term}
        onChange={(event) => search.change(event.target.value)}
        onKeyDown={search.onKeyDown}
        className="h-11 flex-1 bg-transparent text-[0.9375rem] text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
      />

      <button
        type="button"
        aria-label={t('nav.searchClose')}
        onClick={onClose}
        className="shrink-0 rounded-[2px] border border-white/15 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.14em] text-neutral-400 uppercase transition-colors hover:border-white/40 hover:text-white"
      >
        Esc
      </button>

      {/* I suggerimenti, sotto la barra, con la stessa forma della Y */}
      {search.typed && (
        <div className="absolute top-full -right-5 left-0 mt-4 rounded-[3px] rounded-tl-[18px] bg-neutral-900 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)]">
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
