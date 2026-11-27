import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { FormAlert } from '@/components/admin/ui/FormAlert'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { vehicleTypes } from '@/components/admin/versions/options'
import type { VersionValues } from '@/components/admin/versions/versionValues'
import { useVersionDraft } from '@/hooks/useVersionDraft'

type NewVersionModalProps = {
  modelId: number
  modelName: string
  onClose: () => void
}

/**
 * La finestra per creare una versione: solo i tre dati che servono per farla nascere.
 * Creata, si va alla sua pagina, dove si completano le altre sezioni.
 */
export function NewVersionModal({
  modelId,
  modelName,
  onClose,
}: NewVersionModalProps) {
  const navigate = useNavigate()
  // Senza versione: lo stato di partenza è vuoto, e il salvataggio la crea nel modello
  const draft = useVersionDraft(modelId)
  const { values, errors, save } = draft

  function changeType(vehicleType: VersionValues['vehicle_type']) {
    draft.update('vehicle_type', vehicleType)
    // Una Formula 1 è sempre una monoposto: la carrozzeria arriva già giusta
    if (vehicleType === 'f1') draft.update('body_type', 'monoposto')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    draft.submit((created) =>
      navigate(`/admin/modelli/${modelId}/versioni/${created.id}`, {
        state: { created: true },
      }),
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title="Nuova versione"
      description={`Di ${modelName}. Il resto si completa nella sua pagina.`}
      dirty={draft.dirty}
      onSubmit={handleSubmit}
      submitLabel="Crea versione"
      pending={save.isPending}
    >
      {save.isError && !errors && (
        <FormAlert className="mb-5">
          Impossibile creare la versione in questo momento. Riprova.
        </FormAlert>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField
          label="Nome"
          required
          value={values.name}
          placeholder={`${modelName} Spider`}
          onChange={(event) => draft.update('name', event.target.value)}
          error={errors?.name?.[0]}
          className="sm:col-span-2"
        />
        <AdminSelect
          label="Tipo di veicolo"
          required
          value={values.vehicle_type}
          onChange={(event) =>
            changeType(event.target.value as VersionValues['vehicle_type'])
          }
          error={errors?.vehicle_type?.[0]}
        >
          <option value="">Scegli un tipo</option>
          {vehicleTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </AdminSelect>
        <AdminField
          label="Anno di inizio"
          required
          type="number"
          inputMode="numeric"
          min={1947}
          value={values.year_start}
          onChange={(event) => draft.update('year_start', event.target.value)}
          error={errors?.year_start?.[0]}
        />
      </div>

      <p className="mt-5 text-[0.8125rem] leading-relaxed text-neutral-400">
        Nasce come bozza: non compare sul sito finché non viene pubblicata.
      </p>
    </AdminModal>
  )
}
