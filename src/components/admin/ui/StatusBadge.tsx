import type { PublicationStatus } from '@/types/admin'

const labels: Record<PublicationStatus, string> = {
  published: 'Pubblicato',
  scheduled: 'Programmato',
  draft: 'Bozza',
}

const dateFormat = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

type StatusBadgeProps = {
  status: PublicationStatus
  /** La data di pubblicazione: per le programmate dice quando escono */
  publishedAt?: string | null
}

/**
 * Lo stato di pubblicazione, a colpo d'occhio: punto verde, punto rosso con la data, o bozza bianca.
 */
export function StatusBadge({ status, publishedAt }: StatusBadgeProps) {
  if (status === 'draft') {
    return (
      <span className="text-notte inline-flex rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.06em] uppercase">
        {labels.draft}
      </span>
    )
  }

  return (
    <span className="inline-flex flex-col">
      <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold">
        <span
          aria-hidden="true"
          className={[
            'size-2 rounded-full',
            status === 'published' ? 'bg-emerald-400' : 'bg-rosso-acceso',
          ].join(' ')}
        />
        {labels[status]}
      </span>
      {status === 'scheduled' && publishedAt && (
        <time
          dateTime={publishedAt}
          className="mt-0.5 pl-4 text-xs text-neutral-400"
        >
          {dateFormat.format(new Date(publishedAt))}
        </time>
      )}
    </span>
  )
}
