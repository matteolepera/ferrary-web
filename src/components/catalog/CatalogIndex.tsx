import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { StatePanel } from '@/components/ui/StatePanel'
import { yFocusMark } from '@/components/ui/yFocus'
import { YPanel, YSeparator } from '@/components/ui/YPanel'

export type CatalogItem = {
  id: number
  to: string
  name: string
  /** Il codice in rosso sopra il nome, come "F140B" per i motori */
  code?: string
  /** I dettagli sotto il nome, già pronti: "V12 a 65° · 5998 cm³" */
  meta?: string
  /** Quante Ferrari: in fondo alla scheda, con il numero in evidenza */
  count?: number
  /** La lettera del gruppo, per l'indice alfabetico: "L" per Lauda */
  initial?: string
}

type CatalogIndexProps = {
  title: string
  text: string
  items: CatalogItem[] | undefined
  isPending: boolean
  isError: boolean
  onRetry?: () => void
  /** Il nome di ciò che si conta, per la riga sotto la barra: "48 motori" */
  countLabel?: (count: number) => string
  /** Altri controlli nella barra, dopo la ricerca: un filtro della pagina */
  controls?: ReactNode
  /** Raggruppa gli elementi per iniziale, con l'indice dalla A alla Z */
  alphabetical?: boolean
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const gridClass = 'grid gap-3.5 md:grid-cols-2 lg:grid-cols-3'

/** La scheda di un elemento, con la forma della Y */
const plateClass = [
  'group relative flex min-h-36 flex-1 flex-col rounded-[3px] rounded-tl-[18px] bg-neutral-950 px-6 py-5',
  '[clip-path:polygon(0_0,100%_0,100%_calc(100%-18px),calc(100%-18px)_100%,0_100%)]',
  'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] transition duration-300',
  // Passando il mouse: il bordo si schiarisce e il riflettore si accende
  'hover:bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(255,255,255,0.07),transparent_75%)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]',
  // Il contorno del focus disegnato dentro: il ritaglio taglierebbe quello di fuori
  'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-4',
].join(' ')

/** La scheda: il codice, il nome, i dettagli e le Ferrari in fondo */
function Plate({ item }: { item: CatalogItem }) {
  const { t } = useTranslation()

  return (
    <li className="flex">
      <Link to={item.to} className={plateClass}>
        {item.code && (
          <span className="font-display text-rosso-acceso flex items-center gap-2.5 text-[0.8125rem] font-extrabold tracking-[0.06em]">
            <span
              aria-hidden="true"
              className="bg-rosso-acceso h-[3px] w-3 -skew-x-[28deg]"
            />
            {item.code}
          </span>
        )}
        <span
          className={`font-display text-xl leading-tight font-extrabold tracking-[-0.025em] md:text-[1.375rem] ${item.code ? 'mt-2.5' : ''}`}
        >
          {item.name}
        </span>
        {item.meta && (
          <span className="mt-2 text-[0.8125rem] leading-relaxed text-neutral-400">
            {item.meta}
          </span>
        )}

        {/* In fondo: quante Ferrari, e la freccia che si accende di rosso */}
        <span className="mt-auto flex items-center justify-between pt-4 text-xs text-neutral-400">
          <span>
            {item.count !== undefined && (
              <>
                <span className="font-display text-[0.9375rem] font-extrabold text-white">
                  {item.count}
                </span>{' '}
                {t('catalogs.ferrari', { count: item.count })}
              </>
            )}
          </span>
          <span
            aria-hidden="true"
            className="group-hover:text-rosso-acceso text-[0.9375rem] text-neutral-600 transition duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </Link>
    </li>
  )
}

/**
 * L'elenco di un catalogo, designer, piloti o motori: la barra della Y con la ricerca,
 * il conteggio e le schede in tre colonne, anche raggruppate per iniziale.
 * La ricerca filtra nel browser: sono al massimo qualche centinaio.
 */
export function CatalogIndex({
  title,
  text,
  items,
  isPending,
  isError,
  onRetry,
  countLabel,
  controls,
  alphabetical = false,
}: CatalogIndexProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const visible = (items ?? []).filter(
    (item) =>
      !query ||
      [item.name, item.code, item.meta].some((text) =>
        text?.toLowerCase().includes(query),
      ),
  )
  const label =
    countLabel ?? ((count: number) => t('catalogs.resultsLabel', { count }))

  // I gruppi per iniziale, nell'ordine in cui arrivano gli elementi: la pagina li ha già ordinati
  const groups = new Map<string, CatalogItem[]>()
  if (alphabetical) {
    for (const item of visible) {
      const letter = item.initial ?? '#'
      groups.set(letter, [...(groups.get(letter) ?? []), item])
    }
  }

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-10 pb-18 md:px-10 md:pt-14 md:pb-24 lg:pt-40">
      <title>{`${title} – Ferrary`}</title>

      <Eyebrow>{t('catalogs.eyebrow')}</Eyebrow>
      <h1 className="font-display mt-3 text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:text-6xl lg:text-[clamp(3.5rem,6vw,5.5rem)]">
        {title}
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-300 md:max-w-[52ch] md:text-[1.0625rem]">
        {text}
      </p>

      {/* La barra della Y: la ricerca, e i controlli della pagina se ce ne sono */}
      <YPanel className="mt-8 flex flex-wrap md:mt-10 lg:h-[3.75rem] lg:flex-nowrap">
        <label
          className={`${yFocusMark} flex h-14 flex-1 basis-full items-center after:left-12 after:translate-x-0 lg:h-full lg:basis-auto`}
        >
          <span className="sr-only">{t('catalogs.searchLabel')}</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-5 size-4 text-neutral-400"
          />
          <input
            type="search"
            value={search}
            placeholder={t('catalogs.searchPlaceholder')}
            onChange={(event) => setSearch(event.target.value)}
            className="h-full w-full bg-transparent pr-8 pl-12 text-[0.9375rem] text-neutral-100 placeholder:text-neutral-500 focus-visible:outline-none"
          />
        </label>

        {controls && (
          <>
            <YSeparator className="hidden lg:block" />
            <div className="flex h-12 min-w-0 basis-full border-t border-white/10 lg:h-auto lg:basis-auto lg:border-t-0">
              {controls}
            </div>
          </>
        )}
      </YPanel>

      {/* L'indice: le lettere con almeno un elemento portano al loro gruppo, le altre sono spente */}
      {alphabetical && items && (
        <nav aria-label={t('catalogs.lettersLabel')} className="mt-5">
          <ul className="flex flex-wrap gap-1">
            {LETTERS.map((letter) => (
              <li key={letter}>
                {groups.has(letter) ? (
                  <a
                    href={`#lettera-${letter}`}
                    className="font-display focus-visible:outline-rosso-acceso flex size-8 items-center justify-center rounded-[2px] rounded-tl-[9px] text-[0.8125rem] font-bold text-neutral-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] transition hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] focus-visible:outline-2 focus-visible:-outline-offset-2"
                  >
                    {letter}
                  </a>
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-display flex size-8 items-center justify-center text-[0.8125rem] font-bold text-neutral-800"
                  >
                    {letter}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Il conteggio, annunciato quando cambia con la ricerca */}
      <p
        aria-live="polite"
        className="border-linea mt-8 border-b pb-4 text-sm text-neutral-400 md:mt-10"
      >
        {items ? (
          <>
            <span className="font-display text-lg font-extrabold tracking-[-0.02em] text-white">
              {visible.length}
            </span>{' '}
            {label(visible.length)}
          </>
        ) : (
          '\u00a0'
        )}
      </p>

      {isError && (
        <ErrorState message={t('catalogs.error')} onRetry={onRetry} />
      )}

      {isPending && (
        <ul aria-busy="true" className={`mt-8 ${gridClass}`}>
          {[1, 2, 3, 4, 5, 6].map((placeholder) => (
            <li
              key={placeholder}
              aria-hidden="true"
              className="bg-ombra h-36 animate-pulse rounded-[3px] rounded-tl-[18px]"
            />
          ))}
        </ul>
      )}

      {items && visible.length === 0 && (
        <StatePanel
          tone="neutral"
          role="status"
          eyebrow={t('common.noResults')}
          title={t('catalogs.empty')}
          text={t('catalogs.emptyHint')}
          action={
            query ? (
              <Button variant="ctaGhost" onClick={() => setSearch('')}>
                {t('catalogs.clearSearch')}
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Senza indice: una griglia sola. Con l'indice: un gruppo per lettera, con la lettera come segnalibro */}
      {visible.length > 0 && !alphabetical && (
        <ul className={`mt-8 ${gridClass}`}>
          {visible.map((item) => (
            <Plate key={item.id} item={item} />
          ))}
        </ul>
      )}

      {visible.length > 0 &&
        alphabetical &&
        [...groups].map(([letter, members]) => (
          <section
            key={letter}
            id={`lettera-${letter}`}
            aria-labelledby={`lettera-${letter}-titolo`}
            className="mt-10 scroll-mt-8 lg:scroll-mt-32"
          >
            <h2
              id={`lettera-${letter}-titolo`}
              className="flex items-baseline gap-4"
            >
              <span className="font-display text-5xl leading-none font-extrabold text-neutral-800 md:text-6xl">
                {letter}
              </span>
              <span className="text-xs tracking-[0.16em] text-neutral-500 uppercase">
                {label(members.length)}
              </span>
            </h2>
            <ul className={`mt-4 ${gridClass}`}>
              {members.map((item) => (
                <Plate key={item.id} item={item} />
              ))}
            </ul>
          </section>
        ))}
    </div>
  )
}
