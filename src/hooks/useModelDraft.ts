import { useState } from 'react'
import { validationErrors } from '@/api/errors'
import {
  modelValues,
  toModelPayload,
  type ModelValues,
} from '@/components/admin/models/modelValues'
import { useSaveModel } from '@/hooks/useAdminModel'
import type { AdminCarModel } from '@/types/admin'

/**
 * Lo stato di un modello mentre lo si modifica, e il suo salvataggio.
 * Come useVersionDraft: ogni finestra parte dai dati salvati e cambia solo i suoi campi.
 */
export function useModelDraft(model?: AdminCarModel) {
  const save = useSaveModel(model?.id)
  // Lo stato di partenza, per capire se qualcosa è cambiato
  const [initial] = useState(() => modelValues(model))
  const [values, setValues] = useState(initial)

  /** Cambia un campo del modello */
  function update<K extends keyof ModelValues>(
    field: K,
    value: ModelValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  return {
    values,
    update,
    dirty: JSON.stringify(values) !== JSON.stringify(initial),
    errors: validationErrors(save.error),
    save,
    /** Salva il modello intero; onSuccess riceve il modello salvato */
    submit: (onSuccess?: (saved: AdminCarModel) => void) =>
      save.mutate(toModelPayload(values), { onSuccess }),
  }
}
