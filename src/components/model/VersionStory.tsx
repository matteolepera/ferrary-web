import { useTranslation } from 'react-i18next'
import type { Version } from '@/types/catalog'
import { isShortStory } from '@/components/model/story'
import { Eyebrow } from '@/components/ui/Eyebrow'

type VersionStoryProps = {
  version: Version | undefined
}

/**
 * Il racconto della versione: compare solo se lo staff ne ha scritto uno.
 */
export function VersionStory({ version }: VersionStoryProps) {
  const { t } = useTranslation()

  // I racconti brevi stanno già nell'apertura, sotto il nome: qui solo quelli lunghi
  if (!version?.description || isShortStory(version.description)) {
    return null
  }

  return (
    <section
      aria-labelledby="racconto-titolo"
      className="mx-auto grid max-w-[1360px] gap-6 px-5 py-18 md:px-10 md:py-24 lg:grid-cols-3 lg:gap-20 lg:py-32"
    >
      <div>
        <Eyebrow as="h2" id="racconto-titolo">
          {t('model.story')}
        </Eyebrow>
        <p className="font-display mt-4 text-[2rem] leading-none font-extrabold tracking-[-0.035em] md:text-[2.5rem]">
          {version.name}
        </p>
        <p className="font-display mt-1 text-[2rem] leading-none font-extrabold tracking-[-0.035em] text-neutral-600 md:text-[2.5rem]">
          {version.years.start}
        </p>
      </div>
      <p className="max-w-[62ch] text-[1.0625rem] leading-[1.75] text-neutral-200 md:text-lg lg:col-span-2">
        {version.description}
      </p>
    </section>
  )
}
