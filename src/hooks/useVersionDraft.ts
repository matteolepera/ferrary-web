import { useState } from 'react'
import { validationErrors } from '@/api/errors'
import type { PowertrainField } from '@/components/admin/versions/powertrain'
import type { SpecsField } from '@/components/admin/versions/specs'
import {
  toVersionPayload,
  versionDraft,
  type VersionValues,
} from '@/components/admin/versions/versionValues'
import { useSaveVersion } from '@/hooks/useAdminVersion'
import type { AdminVersion } from '@/types/admin'

/**
 * Lo stato di una versione mentre la si modifica, e il suo salvataggio.
 * Lo usa ogni finestra della pagina: ognuna parte dai dati salvati e cambia solo i suoi campi.
 */
export function useVersionDraft(modelId: number, version?: AdminVersion) {
  const save = useSaveVersion(modelId, version?.id)
  // Lo stato di partenza, per capire se qualcosa è cambiato
  const [initial] = useState(() => versionDraft(version))
  const [draft, setDraft] = useState(initial)

  /** Cambia un campo della versione */
  function update<K extends keyof VersionValues>(
    field: K,
    value: VersionValues[K],
  ) {
    setDraft((current) => ({
      ...current,
      values: { ...current.values, [field]: value },
    }))
  }

  function updatePowertrain(field: PowertrainField, value: string) {
    setDraft((current) => ({
      ...current,
      powertrain: { ...current.powertrain, [field]: value },
    }))
  }

  function updateSpecs(field: SpecsField, value: string) {
    setDraft((current) => ({
      ...current,
      specs: { ...current.specs, [field]: value },
    }))
  }

  return {
    ...draft,
    update,
    updatePowertrain,
    updateSpecs,
    dirty: JSON.stringify(draft) !== JSON.stringify(initial),
    errors: validationErrors(save.error),
    save,
    /** Salva la versione intera; onSuccess riceve la versione salvata */
    submit: (onSuccess?: (saved: AdminVersion) => void) =>
      save.mutate(toVersionPayload(draft), { onSuccess }),
  }
}
