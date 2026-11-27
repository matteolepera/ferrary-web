import { useState } from 'react'
import { validationErrors } from '@/api/errors'
import {
  engineValues,
  toEnginePayload,
  type EngineValues,
} from '@/components/admin/engines/engineValues'
import { useEngineActions } from '@/hooks/useAdminEngines'
import type { AdminEngine } from '@/types/admin'

/**
 * Lo stato di un motore mentre lo si modifica, e il suo salvataggio.
 * Come per modelli e versioni: ogni finestra parte dai dati salvati.
 */
export function useEngineDraft(engine?: AdminEngine) {
  const { save } = useEngineActions()
  // Lo stato di partenza, per capire se qualcosa è cambiato
  const [initial] = useState(() => engineValues(engine))
  const [values, setValues] = useState(initial)

  /** Cambia un campo del motore */
  function update<K extends keyof EngineValues>(
    field: K,
    value: EngineValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  return {
    values,
    update,
    dirty: JSON.stringify(values) !== JSON.stringify(initial),
    errors: validationErrors(save.error),
    save,
    /** Salva il motore intero; onSuccess riceve il motore salvato */
    submit: (onSuccess?: (saved: AdminEngine) => void) =>
      save.mutate(
        { id: engine?.id, payload: toEnginePayload(values) },
        { onSuccess },
      ),
  }
}
