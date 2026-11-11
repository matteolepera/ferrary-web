import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { StatePanel } from '@/components/ui/StatePanel'

type ErrorStateProps = {
  message: string
  /** Se presente, mostra il pulsante "Riprova" */
  onRetry?: () => void
  className?: string
}

/**
 * Un errore di caricamento: il pannello con la forma della Y, il messaggio e, quando ha senso, "Riprova".
 */
export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <StatePanel
      role="alert"
      eyebrow={t('errors.load.eyebrow')}
      title={message}
      text={onRetry ? t('errors.load.text') : undefined}
      action={
        onRetry && (
          <Button variant="cta" onClick={onRetry}>
            {t('common.retry')}
          </Button>
        )
      }
      className={className}
    />
  )
}
