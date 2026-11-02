import { useId, useState } from 'react'
import { fieldLabel, formatValue } from '@/components/admin/activity/changes'
import { phrase, subjectLabel } from '@/components/admin/activity/phrases'
import { Avatar } from '@/components/admin/ui/Avatar'
import type { ActivityEntry } from '@/types/dashboard'

const timeFormat = new Intl.DateTimeFormat('it', {
  hour: '2-digit',
  minute: '2-digit',
})

type ActivityEntryRowProps = {
  entry: ActivityEntry
  /** Chi sta guardando: il suo avatar è rosso */
  currentUserId?: number
}

/**
 * Una voce del registro: la frase, e su richiesta le modifiche campo per campo.
 */
export function ActivityEntryRow({
  entry,
  currentUserId,
}: ActivityEntryRowProps) {
  const [open, setOpen] = useState(false)
  const detailsId = useId()

  return (
    <li className="border-linea border-b px-6 py-4 last:border-b-0">
      <div className="flex gap-3.5">
        <Avatar
          name={entry.causer}
          highlighted={
            entry.causer_id !== null && entry.causer_id === currentUserId
          }
          className="size-9 text-xs"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-neutral-300">
            <strong className="font-semibold text-white">
              {entry.causer ?? 'Sistema'}
            </strong>{' '}
            {phrase(entry)}{' '}
            <strong className="font-semibold text-white">
              {subjectLabel(entry)}
            </strong>
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            <time dateTime={entry.created_at}>
              {timeFormat.format(new Date(entry.created_at))}
            </time>
            {entry.log === 'staff' && ' · Staff'}
          </p>
        </div>

        {entry.changes.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((current) => !current)}
            className="h-8 shrink-0 self-start rounded-full border border-white/15 px-3 text-xs font-semibold text-neutral-300 transition-colors hover:border-white/40 hover:text-white"
          >
            {open ? 'Nascondi' : 'Dettagli'}
          </button>
        )}
      </div>

      {entry.changes.length > 0 && (
        <div
          id={detailsId}
          hidden={!open}
          className="border-linea mt-3.5 overflow-x-auto rounded-2xl border md:ml-12.5"
        >
          <table className="w-full min-w-[32rem] text-left text-xs">
            <caption className="sr-only">Modifiche</caption>
            <thead>
              <tr className="border-linea border-b text-neutral-400">
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Campo
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Prima
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Dopo
                </th>
              </tr>
            </thead>
            <tbody>
              {entry.changes.map((change) => (
                <tr
                  key={change.field}
                  className="border-linea border-b align-top last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-2.5 font-semibold whitespace-nowrap text-neutral-200"
                  >
                    {fieldLabel(change.field)}
                  </th>
                  <td className="px-4 py-2.5 text-neutral-400">
                    <span className="line-clamp-3">
                      {formatValue(change.field, change.old)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-neutral-100">
                    <span className="line-clamp-3">
                      {formatValue(change.field, change.new)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </li>
  )
}
