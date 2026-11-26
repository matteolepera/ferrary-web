import type { FormEvent } from 'react'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { DescriptionFields } from '@/components/admin/versions/DescriptionFields'
import { IdentityFields } from '@/components/admin/versions/IdentityFields'
import { PowertrainFields } from '@/components/admin/versions/PowertrainFields'
import { ProductionFields } from '@/components/admin/versions/ProductionFields'
import { SpecsFields } from '@/components/admin/versions/SpecsFields'
import {
  sectionOf,
  versionSections,
  type VersionSection,
} from '@/components/admin/versions/versionSections'
import { useVersionDraft } from '@/hooks/useVersionDraft'
import type { AdminVersion } from '@/types/admin'

type VersionSectionModalProps = {
  modelId: number
  version: AdminVersion
  section: VersionSection
  onClose: () => void
}

const alertClass =
  'border-errore/40 bg-errore/10 text-errore mb-5 rounded-2xl border px-4 py-3 text-[0.8125rem]'

/**
 * La finestra di una sezione della versione. Parte dai dati salvati, cambia solo i campi
 * della sua sezione e salva la versione intera: le altre sezioni arrivano come sono.
 */
export function VersionSectionModal({
  modelId,
  version,
  section,
  onClose,
}: VersionSectionModalProps) {
  const draft = useVersionDraft(modelId, version)
  const { values, powertrain, specs, errors, save } = draft
  const { title, submitLabel, size } = versionSections[section]

  // Il backend controlla la versione intera: un errore può riguardare un'altra sezione,
  // e lì non c'è un campo che lo mostri. Lo diciamo in cima alla finestra
  const otherError = errors
    ? Object.entries(errors).find(([key]) => sectionOf(key) !== section)?.[1][0]
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
      description={version.name}
      dirty={draft.dirty}
      size={size}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      pending={save.isPending}
    >
      {save.isError && !errors && (
        <p role="alert" className={alertClass}>
          Impossibile salvare in questo momento. Riprova.
        </p>
      )}
      {otherError && (
        <p role="alert" className={alertClass}>
          Da sistemare in un’altra sezione: {otherError}
        </p>
      )}

      {section === 'identita' && (
        <IdentityFields
          values={values}
          onChange={draft.update}
          errors={errors}
        />
      )}
      {section === 'produzione' && (
        <ProductionFields
          values={values}
          onChange={draft.update}
          errors={errors}
        />
      )}
      {section === 'descrizione' && (
        <DescriptionFields
          values={values}
          onChange={draft.update}
          errors={errors}
        />
      )}
      {section === 'motorizzazione' && (
        <PowertrainFields
          values={powertrain}
          onChange={draft.updatePowertrain}
          errors={errors}
        />
      )}
      {section === 'scheda' && (
        <SpecsFields
          values={specs}
          onChange={draft.updateSpecs}
          errors={errors}
        />
      )}
    </AdminModal>
  )
}
