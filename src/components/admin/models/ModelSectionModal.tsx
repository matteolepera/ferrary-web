import type { FormEvent } from 'react'
import {
  ModelDescriptionFields,
  ModelMainFields,
} from '@/components/admin/models/ModelFields'
import {
  modelSectionOf,
  modelSections,
  type ModelSection,
} from '@/components/admin/models/modelSections'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { FormAlert } from '@/components/admin/ui/FormAlert'
import { useModelDraft } from '@/hooks/useModelDraft'
import type { AdminCarModel } from '@/types/admin'

type ModelSectionModalProps = {
  model: AdminCarModel
  section: ModelSection
  onClose: () => void
}

/**
 * La finestra di una sezione del modello. Come per le versioni: parte dai dati salvati,
 * cambia solo i campi della sua sezione e salva il modello intero.
 */
export function ModelSectionModal({
  model,
  section,
  onClose,
}: ModelSectionModalProps) {
  const draft = useModelDraft(model)
  const { values, errors, save } = draft
  const { title, submitLabel } = modelSections[section]

  // Il backend controlla il modello intero: un errore dell'altra sezione lo diciamo in cima
  const otherError = errors
    ? Object.entries(errors).find(
        ([key]) => modelSectionOf(key) !== section,
      )?.[1][0]
    : undefined

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Salvata la sezione, la finestra si chiude e la pagina mostra i dati nuovi
    draft.submit(() => onClose())
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title={title}
      description={model.name}
      dirty={draft.dirty}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      pending={save.isPending}
    >
      {save.isError && !errors && (
        <FormAlert className="mb-5">
          Impossibile salvare in questo momento. Riprova.
        </FormAlert>
      )}
      {otherError && (
        <FormAlert className="mb-5">
          Da sistemare in un’altra sezione: {otherError}
        </FormAlert>
      )}

      {section === 'dati' ? (
        <ModelMainFields
          values={values}
          onChange={draft.update}
          errors={errors}
          modelId={model.id}
        />
      ) : (
        <ModelDescriptionFields
          values={values}
          onChange={draft.update}
          errors={errors}
        />
      )}
    </AdminModal>
  )
}
