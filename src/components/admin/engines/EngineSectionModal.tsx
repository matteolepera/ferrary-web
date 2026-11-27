import type { FormEvent } from 'react'
import {
  EngineDescriptionFields,
  EngineTechFields,
} from '@/components/admin/engines/EngineFields'
import {
  engineSectionOf,
  engineSections,
  type EngineSection,
} from '@/components/admin/engines/engineSections'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { FormAlert } from '@/components/admin/ui/FormAlert'
import { useEngineDraft } from '@/hooks/useEngineDraft'
import type { AdminEngine } from '@/types/admin'

type EngineSectionModalProps = {
  engine: AdminEngine
  section: EngineSection
  onClose: () => void
}

/**
 * La finestra di una sezione del motore: parte dai dati salvati,
 * cambia solo i campi della sua sezione e salva il motore intero.
 */
export function EngineSectionModal({
  engine,
  section,
  onClose,
}: EngineSectionModalProps) {
  const draft = useEngineDraft(engine)
  const { values, errors, save } = draft
  const { title, submitLabel } = engineSections[section]

  // Il backend controlla il motore intero: un errore dell'altra sezione lo diciamo in cima
  const otherError = errors
    ? Object.entries(errors).find(
        ([key]) => engineSectionOf(key) !== section,
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
      description={
        engine.name ? `${engine.code} · ${engine.name}` : engine.code
      }
      dirty={draft.dirty}
      size={section === 'dati' ? 'lg' : 'md'}
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
        <EngineTechFields
          values={values}
          onChange={draft.update}
          errors={errors}
        />
      ) : (
        <EngineDescriptionFields
          values={values}
          onChange={draft.update}
          errors={errors}
        />
      )}
    </AdminModal>
  )
}
