import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

type ErrorStateProps = {
  message: string
  /** Se presente, mostra il pulsante "Riprova" */
  onRetry?: () => void
  className?: string
}

/**
 * Un errore di caricamento: un'icona, il messaggio e, quando ha senso, il pulsante per riprovare.
 */
export function ErrorState({
  message,
  onRetry,
  className = 'py-16',
}: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div
      role="alert"
      className={`flex flex-col items-center gap-5 text-center ${className}`}
    >
      <CircleAlert aria-hidden="true" className="text-errore size-8" />
      <p className="max-w-md text-neutral-200">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  )
}
