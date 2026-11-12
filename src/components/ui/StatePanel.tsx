import type { ReactNode } from 'react'
import { YPanel } from '@/components/ui/YPanel'

type StatePanelProps = {
  /** error: qualcosa non va, il segno è rosso. neutral: semplicemente non c'è niente, il segno è grigio */
  tone?: 'error' | 'neutral'
  eyebrow: string
  title: string
  text?: string
  /** Il pulsante: a destra dal tablet in su, sotto a tutta larghezza su telefono */
  action?: ReactNode
  /** "alert" per gli errori: il lettore di schermo li annuncia appena compaiono */
  role?: 'alert' | 'status'
  className?: string
}

/**
 * Uno stato dentro una pagina, come un errore di caricamento o nessun risultato:
 * un pannello con la forma della Y, il messaggio e il pulsante giusto.
 */
export function StatePanel({
  tone = 'error',
  eyebrow,
  title,
  text,
  action,
  role,
  className = 'mt-8',
}: StatePanelProps) {
  const error = tone === 'error'

  return (
    <YPanel
      className={`flex flex-col gap-6 p-7 pr-10 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10 md:pr-12 ${className}`}
    >
      <div role={role}>
        <p
          className={`flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs ${
            error ? 'text-rosso-acceso' : 'text-neutral-400'
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-[3px] w-3.5 -skew-x-[28deg] ${
              error
                ? 'bg-rosso-acceso shadow-[0_0_8px_rgba(255,59,48,0.6)]'
                : 'bg-neutral-500'
            }`}
          />
          {eyebrow}
        </p>
        <p className="font-display mt-3 text-[1.375rem] leading-tight font-extrabold tracking-[-0.03em] md:text-[1.75rem]">
          {title}
        </p>
        {text && (
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-neutral-400 md:text-[0.9375rem]">
            {text}
          </p>
        )}
      </div>

      {/* Su telefono il pulsante è largo quanto il pannello; dal tablet torna largo quanto il suo testo */}
      {action && <div className="shrink-0 *:w-full md:*:w-auto">{action}</div>}
    </YPanel>
  )
}
