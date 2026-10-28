import { useModels } from '@/hooks/useModels'
import { useTranslation } from 'react-i18next'

export function ArchivePage() {
  const { t } = useTranslation()

  const { data, isPending, isError } = useModels()

  return (
    <section className="px-5 pt-28 md:px-10">
      <h1 className="text-3xl font-bold">{t('archive.title')}</h1>

      {isPending && (
        <p className="mt-6 text-neutral-500">{t('archive.loading')}</p>
      )}

      {isError && (
        <p role="alert" className="mt-6 text-red-700">
          {t('archive.error')}
        </p>
      )}

      {data && (
        <ul className="mt-6 space-y-2">
          {data.data.map((model) => (
            <li key={model.id}>{model.name}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
