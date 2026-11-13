import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ButtonArrow } from '@/components/ui/ButtonArrow'
import { buttonClass } from '@/components/ui/buttonClass'
import { StatePage } from '@/components/ui/StatePage'

type NotFoundPageProps = {
  /** Dove riporta il pulsante: la home del sito o del pannello */
  backTo?: string
}

/**
 * Pagina mostrata per gli indirizzi che non esistono.
 */
export function NotFoundPage({ backTo = '/' }: NotFoundPageProps) {
  const { t } = useTranslation()

  return (
    <StatePage
      watermark="404"
      eyebrow={t('notFound.code')}
      title={t('notFound.title')}
      text={t('notFound.description')}
    >
      <Link to={backTo} className={buttonClass('cta')}>
        {t('common.backHome')}
        <ButtonArrow />
      </Link>

      {/* Nel sito pubblico, chi arriva qui cercava quasi sempre un modello: l'archivio è il posto giusto */}
      {backTo === '/' && (
        <Link to="/modelli" className={buttonClass('ctaGhost')}>
          {t('home.invite.cta')}
          <ButtonArrow />
        </Link>
      )}
    </StatePage>
  )
}
