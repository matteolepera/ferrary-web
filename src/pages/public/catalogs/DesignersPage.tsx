import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useDesigners } from '@/hooks/useDesigners'

export function DesignersPage() {
  const { t } = useTranslation()
  const { data: designers, isPending, isError } = useDesigners()

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-28 pb-18 md:px-10 md:pt-36 md:pb-24 lg:pt-40">
      <title>{`${t('catalogs.designers.title')} – Ferrary`}</title>

      <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {t('catalogs.eyebrow')}
      </p>
      <h1 className="font-display mt-3 text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:text-6xl lg:text-[clamp(3.5rem,6vw,5.5rem)]">
        {t('catalogs.designers.title')}
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-300 md:max-w-[52ch] md:text-[1.0625rem]">
        {t('catalogs.designers.text')}
      </p>

      {isError && (
        <p role="alert" className="text-errore mt-10">
          {t('catalogs.error')}
        </p>
      )}

      <ul aria-busy={isPending} className="border-linea mt-10 border-t">
        {isPending &&
          [1, 2, 3].map((placeholder) => (
            <li
              key={placeholder}
              aria-hidden="true"
              className="border-linea bg-ombra/60 h-20 animate-pulse border-b"
            />
          ))}

        {designers?.map((designer) => (
          <li key={designer.id}>
            <Link
              to={`/designer/${designer.slug}`}
              className="group border-linea hover:bg-ombra focus-visible:outline-rosso-acceso flex items-center justify-between gap-4 border-b py-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:px-3"
            >
              <span className="min-w-0">
                <span className="font-display block text-[1.625rem] leading-tight font-extrabold tracking-[-0.035em] md:text-[2rem]">
                  {designer.name}
                </span>
                <span className="mt-1 block text-[0.8125rem] text-neutral-400 md:text-sm">
                  {[
                    t(`catalogs.designers.types.${designer.type}`),
                    designer.country,
                    designer.versions_count !== undefined &&
                      t('catalogs.count', { count: designer.versions_count }),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="group-hover:text-rosso-acceso text-xl text-neutral-500 transition group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
