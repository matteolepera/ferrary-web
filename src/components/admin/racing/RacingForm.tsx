import { useState } from 'react'
import { validationErrors } from '@/api/errors'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'
import { useRacingActions } from '@/hooks/useVersionRacing'
import type { AdminRacingRecord } from '@/types/admin'

/** I campi numerici, nell'ordine della tabella del sito */
const numbers = [
  ['season_start', 'Stagione'],
  ['season_end', 'Fino alla stagione'],
  ['races', 'Gare'],
  ['wins', 'Vittorie'],
  ['poles', 'Pole'],
  ['podiums', 'Podi'],
  ['fastest_laps', 'Giri veloci'],
  ['drivers_titles', 'Titoli piloti'],
  ['constructors_titles', 'Titoli costruttori'],
] as const

type NumberField = (typeof numbers)[number][0]

function toNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}

type RacingFormProps = {
  versionId: number
  record?: AdminRacingRecord
  onDone: () => void
}

/**
 * Il form di un campionato. Non è un <form>: sta dentro il form della versione,
 * e i form annidati non sono ammessi in HTML.
 */
export function RacingForm({ versionId, record, onDone }: RacingFormProps) {
  const { save } = useRacingActions(versionId)
  const [championship, setChampionship] = useState(record?.championship ?? '')
  const [values, setValues] = useState<Record<NumberField, string>>(
    () =>
      Object.fromEntries(
        numbers.map(([field]) => [
          field,
          record?.[field] === null || record?.[field] === undefined
            ? ''
            : String(record[field]),
        ]),
      ) as Record<NumberField, string>,
  )
  const [notesIt, setNotesIt] = useState(record?.notes?.it ?? '')
  const [notesEn, setNotesEn] = useState(record?.notes?.en ?? '')

  const errors = validationErrors(save.error)

  function submit() {
    save.mutate(
      {
        id: record?.id,
        payload: {
          championship: championship.trim(),
          season_start: toNumber(values.season_start),
          season_end: toNumber(values.season_end),
          races: toNumber(values.races),
          wins: toNumber(values.wins),
          poles: toNumber(values.poles),
          podiums: toNumber(values.podiums),
          fastest_laps: toNumber(values.fastest_laps),
          drivers_titles: toNumber(values.drivers_titles),
          constructors_titles: toNumber(values.constructors_titles),
          notes: { it: notesIt, en: notesEn },
        },
      },
      { onSuccess: onDone },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminField
        label="Campionato"
        value={championship}
        placeholder="Formula 1"
        onChange={(event) => setChampionship(event.target.value)}
        error={errors?.championship?.[0]}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {numbers.map(([field, label]) => (
          <AdminField
            key={field}
            label={label}
            type="number"
            inputMode="numeric"
            min={field.startsWith('season') ? 1947 : 0}
            value={values[field]}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                [field]: event.target.value,
              }))
            }
            error={errors?.[field]?.[0]}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminTextarea
          label="Note in italiano"
          value={notesIt}
          onChange={(event) => setNotesIt(event.target.value)}
          className="[&_textarea]:min-h-24"
          error={errors?.['notes.it']?.[0]}
        />
        <AdminTextarea
          label="Note in inglese"
          value={notesEn}
          onChange={(event) => setNotesEn(event.target.value)}
          className="[&_textarea]:min-h-24"
          error={errors?.['notes.en']?.[0]}
        />
      </div>

      {save.isError && !errors && (
        <p role="alert" className="text-errore text-[0.8125rem]">
          Impossibile salvare il campionato. Riprova.
        </p>
      )}

      <div className="flex gap-2.5">
        <AdminButton onClick={submit} disabled={save.isPending}>
          {save.isPending
            ? 'Salvataggio…'
            : record
              ? 'Salva il campionato'
              : 'Aggiungi il campionato'}
        </AdminButton>
        {record && (
          <AdminButton variant="outline" onClick={onDone}>
            Annulla
          </AdminButton>
        )}
      </div>
    </div>
  )
}
