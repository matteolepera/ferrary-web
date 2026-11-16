import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  GROUP_MARK,
  groupCategories,
} from '@/components/archive/categoryGroups'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { YPanel } from '@/components/ui/YPanel'
import { YSegments } from '@/components/ui/YSegments'
import { useCategories } from '@/hooks/useCategories'

/** La forma della Y per le carte, come nell'archivio */
const cardShape =
  'rounded-[4px] rounded-tl-[28px] [clip-path:polygon(0_0,100%_0,100%_calc(100%-28px),calc(100%-28px)_100%,0_100%)]'

/** Il margine a sinistra della fila: allineato al contenuto della pagina, anche sugli schermi larghi */
const rowInset =
  'px-5 scroll-px-5 md:px-10 md:scroll-px-10 xl:px-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))] xl:scroll-px-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))]'

/**
 * Le famiglie della home: una galleria che scorre di lato, divisa nei gruppi dell'archivio
 * (Stradali, Corsa, Concept). Ogni gruppo si apre con la sua targa; ogni carta porta
 * all'archivio filtrato su quella famiglia. La barra della Y porta da un gruppo all'altro.
 */
export function HomeFamilies() {
  const { t } = useTranslation()
  const { data: families, isPending, isError } = useCategories()
  // La fila che scorre, e quale parte se ne vede: inizio e larghezza, in frazioni da 0 a 1
  const row = useRef<HTMLDivElement>(null)
  const [view, setView] = useState({ start: 0, size: 1 })
  // Il gruppo in vista: cambia scorrendo, o scegliendolo nella barra
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  // Il gruppo appena scelto nella barra: finché la fila scorre per arrivarci,
  // il calcolo del gruppo in vista resta fermo, così gli altri gruppi non si accendono di passaggio
  const chosen = useRef<string | null>(null)

  // La traccia e il gruppo acceso seguono lo scorrimento e le misure della finestra
  useEffect(() => {
    const element = row.current
    if (!element) return
    let settle: ReturnType<typeof setTimeout> | undefined

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = element
      setView({
        start: scrollLeft / scrollWidth,
        size: clientWidth / scrollWidth,
      })

      // Il gruppo acceso è l'ultimo il cui inizio ha superato un terzo della fila.
      // In fondo alla fila vince l'ultimo gruppo, anche se è corto e non arriva fin lì
      const starts = [...element.querySelectorAll<HTMLElement>('[data-group]')]
      const edge = scrollLeft + clientWidth * 0.35
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 2
      const current = atEnd
        ? starts.at(-1)
        : starts.filter((start) => start.offsetLeft <= edge).at(-1)

      // Dopo un clic nella barra: si aspetta che la fila si fermi (nessuno scorrimento per 150 ms)
      // e si lascia acceso il gruppo scelto. Poi il calcolo riprende, al prossimo scorrimento a mano
      if (chosen.current) {
        clearTimeout(settle)
        settle = setTimeout(() => {
          chosen.current = null
        }, 150)
        return
      }

      if (current?.dataset.group) setActiveGroup(current.dataset.group)
    }

    // La prima misura al fotogramma dopo, quando le carte hanno già la loro larghezza
    const frame = requestAnimationFrame(update)
    element.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      clearTimeout(settle)
    }
  }, [families])

  // Senza famiglie non c'è niente da proporre: la sezione non compare
  if (!isPending && !isError && families.length === 0) {
    return null
  }

  const groups = families ? groupCategories(families) : []

  /** Porta la fila all'inizio di un gruppo: lo scorrimento morbido lo fa "scroll-smooth" */
  function goToGroup(key: string) {
    const element = row.current
    const start = element?.querySelector<HTMLElement>(`[data-group="${key}"]`)
    if (!element || !start) return

    chosen.current = key
    setActiveGroup(key)
    // Il margine a sinistra della fila, per fermarsi allineati al contenuto della pagina
    element.scrollLeft =
      start.offsetLeft - parseFloat(getComputedStyle(element).paddingLeft)
  }

  return (
    <section
      id="famiglie"
      aria-labelledby="famiglie-titolo"
      className="pb-18 md:pb-24 lg:pb-32"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:flex md:items-end md:justify-between md:gap-10 md:px-10">
        <div>
          <Eyebrow>{t('home.families.eyebrow')}</Eyebrow>
          <h2
            id="famiglie-titolo"
            className="font-display mt-4 text-[2.625rem] leading-[0.98] font-extrabold tracking-[-0.04em] md:text-6xl lg:mt-5"
          >
            <span className="block">{t('home.families.titleStart')}</span>{' '}
            <span className="block text-neutral-600">
              {t('home.families.titleEnd')}
            </span>
          </h2>
        </div>

        {/* La barra: i gruppi, che portano la fila al loro inizio */}
        {groups.length > 1 && (
          <YPanel className="mt-6 flex h-12 items-stretch md:mt-0 md:h-13 md:shrink-0">
            <YSegments
              label={t('home.families.groupsLabel')}
              options={groups.map((group) => ({
                value: group.key,
                label: t(`archive.groups.${group.key}`),
              }))}
              itemClassName="flex-1 md:flex-none"
              value={activeGroup ?? groups[0].key}
              onChange={goToGroup}
              // L'ultimo gruppo lascia spazio al taglio in basso a destra
              className="flex-1 pr-3"
            />
          </YPanel>
        )}
      </div>

      {isError && (
        <p
          role="alert"
          className="text-errore mx-auto mt-8 max-w-[1360px] px-5 md:px-10"
        >
          {t('home.families.error')}
        </p>
      )}

      {isPending && (
        <div
          aria-hidden="true"
          className={`mt-10 flex gap-4 overflow-hidden ${rowInset}`}
        >
          {[1, 2, 3, 4].map((placeholder) => (
            <div
              key={placeholder}
              className={`bg-ombra/60 h-[22.5rem] w-[15.5rem] shrink-0 animate-pulse md:h-[28.75rem] md:w-[20.625rem] ${cardShape}`}
            />
          ))}
        </div>
      )}

      {groups.length > 0 && (
        <>
          {/*
            La fila: scorre di lato con il dito, il trackpad, la rotella o le frecce, e si aggancia a ogni carta.
            "relative": i gruppi misurano la loro posizione da qui
          */}
          <div
            ref={row}
            className={`senza-barra relative mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pt-1 pb-2 md:mt-12 ${rowInset}`}
          >
            {groups.map((group) => (
              <div
                key={group.key}
                role="group"
                aria-labelledby={`famiglie-${group.key}`}
                data-group={group.key}
                // Sul telefono l'etichetta sta sopra le carte; dal tablet la targa sta di fianco
                className="flex shrink-0 flex-col gap-3 md:flex-row md:gap-4"
              >
                {/*
                  La targa del gruppo: il suo segno, il nome e quante famiglie.
                  Sul telefono è un'etichetta in riga sopra le carte; dal tablet una targa stretta
                  con il nome in verticale, dal basso verso l'alto come il dorso di un libro
                */}
                <div className="flex items-center gap-2.5 md:relative md:block md:w-[4.75rem] md:shrink-0 md:border-l md:border-white/12">
                  <span
                    aria-hidden="true"
                    className={`h-[3px] w-3.5 shrink-0 -skew-x-[28deg] md:absolute md:top-0 md:left-5 ${GROUP_MARK[group.key]}`}
                  />
                  <h3
                    id={`famiglie-${group.key}`}
                    className={[
                      'text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-200 uppercase',
                      'md:font-display md:absolute md:bottom-0 md:left-4 md:rotate-180 md:text-[1.875rem] md:leading-none md:font-extrabold md:tracking-[-0.02em] md:whitespace-nowrap md:text-neutral-600 md:normal-case md:[writing-mode:vertical-rl]',
                    ].join(' ')}
                  >
                    {t(`archive.groups.${group.key}`)}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="text-[0.6875rem] font-semibold text-neutral-500 tabular-nums md:absolute md:top-4 md:left-5 md:text-[0.625rem] md:tracking-[0.16em]"
                  >
                    {group.categories.length}
                  </span>
                </div>

                <ul className="flex gap-4">
                  {group.categories.map((family) => (
                    <li key={family.id} className="snap-start">
                      <Link
                        to={`/modelli?category=${family.slug}`}
                        className={[
                          'group bg-ombra relative flex h-[22.5rem] w-[15.5rem] flex-col justify-end overflow-hidden md:h-[28.75rem] md:w-[20.625rem]',
                          cardShape,
                          'transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1',
                          // Il bordo è un'ombra interna sul livello ::after: un bordo vero verrebbe tagliato con l'angolo
                          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
                          'after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] after:transition-shadow hover:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.24)]',
                          // Il contorno del focus disegnato dentro: il ritaglio taglierebbe quello di fuori
                          'focus-visible:outline-none focus-visible:after:shadow-[inset_0_0_0_2px_var(--color-rosso-acceso)]',
                        ].join(' ')}
                      >
                        {family.cover ? (
                          // Decorativa: il nome della famiglia è già nel testo del link
                          <img
                            src={family.cover.url}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 size-full object-cover object-[50%_55%] brightness-[.85] saturate-[.92] transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
                          />
                        ) : (
                          // Senza foto: il riflettore sulla trama di carbonio
                          <div
                            aria-hidden="true"
                            className="riflettore absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.022)_0_2px,transparent_2px_6px)]"
                          />
                        )}

                        {/* Il nero in alto per l'etichetta e in basso per il nome */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.75),transparent_26%),linear-gradient(to_top,#050505_6%,rgba(5,5,5,0.3)_50%,transparent)]"
                        />

                        {/* Il riflettore, che si accende passando il mouse */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(255,255,255,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        />

                        {/* In alto: il segno del gruppo e quanti modelli */}
                        <span className="absolute inset-x-6 top-5 flex items-center gap-2.5 text-[0.625rem] font-semibold tracking-[0.2em] text-neutral-300 uppercase md:top-6">
                          <span
                            aria-hidden="true"
                            className={`h-[3px] w-3 shrink-0 -skew-x-[28deg] ${GROUP_MARK[group.key]}`}
                          />
                          {family.models_count !== undefined &&
                            t('home.families.models', {
                              count: family.models_count,
                            })}
                        </span>

                        <span className="font-display relative py-6 pr-11 pl-6 text-[1.75rem] leading-[0.95] font-extrabold tracking-[-0.035em] md:text-[2.125rem]">
                          {family.name}
                        </span>

                        {/* La freccia accanto al taglio, che si accende di rosso */}
                        <span
                          aria-hidden="true"
                          className="group-hover:text-rosso-acceso absolute right-7 bottom-7 text-base text-neutral-500 transition duration-300 group-hover:translate-x-0.5"
                        >
                          →
                        </span>

                        {/* Il bordo del taglio, che le ombre interne non disegnano */}
                        <span
                          aria-hidden="true"
                          className="absolute right-0 bottom-0 h-px w-10 origin-bottom-right -rotate-45 bg-white/12"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* La traccia: quale parte della fila si vede. Sparisce se si vede tutta */}
          {view.size < 1 && (
            <div className="mx-auto max-w-[1360px] px-5 md:px-10">
              <div
                aria-hidden="true"
                className="relative mt-6 h-0.5 bg-white/8 md:mt-8"
              >
                <span
                  className="bg-rosso-acceso absolute top-0 h-full shadow-[0_0_10px_rgba(255,59,48,0.6)] transition-[left] duration-150"
                  style={{
                    left: `${view.start * 100}%`,
                    width: `${view.size * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
