import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useCategories } from '@/hooks/useCategories'

/**
 * Le famiglie: l'ingresso all'archivio dal tipo di Ferrari.
 */
export function HomeFamilies() {
  const { t } = useTranslation()
  const { data: families, isPending, isError } = useCategories()

  // Senza famiglie non c'è niente da proporre: la sezione non compare
  if (!isPending && !isError && families.length === 0) {
    return null
  }

  return (
    <section
      id="famiglie"
      aria-labelledby="famiglie-titolo"
      className="mx-auto max-w-[1360px] px-5 pb-18 md:px-10 md:pb-24 lg:pb-36"
    >
      <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {t('home.families.eyebrow')}
      </p>
      <h2
        id="famiglie-titolo"
        className="font-display mt-2.5 text-[2.125rem] leading-[1.05] font-extrabold tracking-[-0.035em] md:mt-3 md:text-5xl lg:text-[clamp(2.25rem,4.4vw,4rem)]"
      >
        {t('home.families.title')}
      </h2>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-300 md:max-w-[52ch] md:text-[1.0625rem]">
        {t('home.families.text')}
      </p>

      {isError && (
        <p role="alert" className="text-errore mt-8">
          {t('home.families.error')}
        </p>
      )}

      <ul className="border-linea mt-8 border-t md:mt-10 lg:mt-12">
        {isPending &&
          [1, 2, 3].map((placeholder) => (
            <li
              key={placeholder}
              className="border-linea bg-ombra/60 h-20 animate-pulse border-b md:h-24"
            />
          ))}

        {families?.map((family) => (
          <li key={family.id}>
            <Link
              to={`/modelli?category=${family.slug}`}
              className={[
                'group border-linea flex items-center justify-between gap-4 border-b py-5 transition-colors',
                'hover:bg-ombra focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
                'md:px-3 md:py-7',
              ].join(' ')}
            >
              <span className="min-w-0">
                <span className="font-display block text-[1.625rem] leading-tight font-extrabold tracking-[-0.035em] md:text-[2rem] lg:text-[2.5rem]">
                  {family.name}
                </span>
                {family.models_count !== undefined && (
                  <span className="mt-1 block text-[0.8125rem] text-neutral-400 md:text-sm">
                    {t('home.families.models', { count: family.models_count })}
                  </span>
                )}
              </span>
              <span
                aria-hidden="true"
                className="group-hover:text-rosso-acceso text-xl text-neutral-500 transition group-hover:translate-x-1 md:text-2xl"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
