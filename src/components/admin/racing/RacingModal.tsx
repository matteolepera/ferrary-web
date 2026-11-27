import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { FormAlert } from '@/components/admin/ui/FormAlert'
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'
import { useRacingActions } from '@/hooks/useVersionRacing'
import type { AdminRacingRecord } from '@/types/admin'

/** I campi numerici, divisi nei gruppi della finestra */
const groups = [
  {
    title: 'Stagioni',
    fields: [
      ['season_start', 'Stagione'],
      ['season_end', 'Fino alla stagione'],
    ],
  },
  {
    title: 'Risultati',
    fields: [
      ['races', 'Gare'],
      ['wins', 'Vittorie'],
      ['poles', 'Pole'],
      ['podiums', 'Podi'],
      ['fastest_laps', 'Giri veloci'],
    ],
  },
  {
    title: 'Titoli',
    fields: [
      ['drivers_titles', 'Titoli piloti'],
      ['constructors_titles', 'Titoli costruttori'],
    ],
  },
] as const

type NumberField = (typeof groups)[number]['fields'][number][0]

const subtitle =
  'mb-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'

function toNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}

/** I valori di partenza, come testo per i campi: quelli del campionato, o vuoti */
function initialValues(record?: AdminRacingRecord) {
  const numbers = Object.fromEntries(
    groups.flatMap((group) =>
      group.fields.map(([field]) => [
        field,
        record?.[field] === null || record?.[field] === undefined
          ? ''
          : String(record[field]),
      ]),
    ),
  ) as Record<NumberField, string>

  return {
    championship: record?.championship ?? '',
    numbers,
    notesIt: record?.notes?.it ?? '',
    notesEn: record?.notes?.en ?? '',
  }
}

type RacingModalProps = {
  versionId: number
  /** Il campionato da modificare; senza, la finestra ne aggiunge uno */
  record?: AdminRacingRecord
  onClose: () => void
}

/**
 * La finestra di un campionato: le stagioni, i risultati, i titoli e le note.
 * Salvata, si chiude e la tabella si aggiorna.
 */
export function RacingModal({ versionId, record, onClose }: RacingModalProps) {
  const { save } = useRacingActions(versionId)
  const [initial] = useState(() => initialValues(record))
  const [values, setValues] = useState(initial)
  const errors = validationErrors(save.error)

  function setNumber(field: NumberField, value: string) {
    setValues((current) => ({
      ...current,
      numbers: { ...current.numbers, [field]: value },
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { numbers } = values

    save.mutate(
      {
        id: record?.id,
        payload: {
          championship: values.championship.trim(),
          season_start: toNumber(numbers.season_start),
          season_end: toNumber(numbers.season_end),
          races: toNumber(numbers.races),
          wins: toNumber(numbers.wins),
          poles: toNumber(numbers.poles),
          podiums: toNumber(numbers.podiums),
          fastest_laps: toNumber(numbers.fastest_laps),
          drivers_titles: toNumber(numbers.drivers_titles),
          constructors_titles: toNumber(numbers.constructors_titles),
          notes: { it: values.notesIt, en: values.notesEn },
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title={record ? record.championship : 'Nuovo campionato'}
      description="Un campionato per riga, come nella scheda tecnica del sito."
      dirty={JSON.stringify(values) !== JSON.stringify(initial)}
      size="lg"
      onSubmit={handleSubmit}
      submitLabel={record ? 'Salva il campionato' : 'Aggiungi il campionato'}
      pending={save.isPending}
    >
      {save.isError && !errors && (
        <FormAlert className="mb-5">
          Impossibile salvare il campionato. Riprova.
        </FormAlert>
      )}

      <div className="flex flex-col gap-7">
        <AdminField
          label="Campionato"
          required
          value={values.championship}
          placeholder="Formula 1"
          onChange={(event) =>
            setValues({ ...values, championship: event.target.value })
          }
          error={errors?.championship?.[0]}
        />

        {groups.map((group) => (
          <section key={group.title}>
            <h3 className={subtitle}>{group.title}</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {group.fields.map(([field, label]) => (
                <AdminField
                  key={field}
                  label={label}
                  required={field === 'season_start'}
                  type="number"
                  inputMode="numeric"
                  min={field.startsWith('season') ? 1947 : 0}
                  value={values.numbers[field]}
                  onChange={(event) => setNumber(field, event.target.value)}
                  error={errors?.[field]?.[0]}
                  // Le stagioni sono due anni: un po' più larghe dei numeri
                  className={group.title === 'Risultati' ? '' : 'sm:col-span-2'}
                />
              ))}
            </div>
          </section>
        ))}

        <section>
          <h3 className={subtitle}>Note</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminTextarea
              label="In italiano"
              optional
              value={values.notesIt}
              onChange={(event) =>
                setValues({ ...values, notesIt: event.target.value })
              }
              className="[&_textarea]:min-h-24"
              error={errors?.['notes.it']?.[0]}
            />
            <AdminTextarea
              label="In inglese"
              optional
              value={values.notesEn}
              onChange={(event) =>
                setValues({ ...values, notesEn: event.target.value })
              }
              className="[&_textarea]:min-h-24"
              error={errors?.['notes.en']?.[0]}
            />
          </div>
        </section>
      </div>
    </AdminModal>
  )
}
