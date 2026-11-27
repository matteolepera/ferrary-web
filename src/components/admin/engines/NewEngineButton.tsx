import { useState, type FormEvent } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import {
  EngineDescriptionFields,
  EngineTechFields,
} from '@/components/admin/engines/EngineFields'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { useEngineDraft } from '@/hooks/useEngineDraft'

const subtitle =
  'mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'

/**
 * La finestra per creare un motore: i dati tecnici e la descrizione.
 * Creato, si va alla sua pagina.
 */
function NewEngineModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  // Senza motore: lo stato di partenza è vuoto, e il salvataggio lo crea
  const draft = useEngineDraft()
  const { values, errors, save } = draft

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    draft.submit((created) =>
      navigate(`/admin/motori/${created.id}`, { state: { created: true } }),
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title="Nuovo motore"
      description="Una volta creato, si sceglie nella motorizzazione delle versioni."
      dirty={draft.dirty}
      size="lg"
      onSubmit={handleSubmit}
      submitLabel="Crea motore"
      pending={save.isPending}
    >
      {save.isError && !errors && (
        <p
          role="alert"
          className="border-errore/40 bg-errore/10 text-errore mb-5 rounded-2xl border px-4 py-3 text-[0.8125rem]"
        >
          Impossibile creare il motore in questo momento. Riprova.
        </p>
      )}

      <div className="flex flex-col gap-7">
        <section>
          <h3 className={subtitle}>Dati tecnici</h3>
          <EngineTechFields
            values={values}
            onChange={draft.update}
            errors={errors}
          />
        </section>
        <section>
          <h3 className={subtitle}>Descrizione</h3>
          <EngineDescriptionFields
            values={values}
            onChange={draft.update}
            errors={errors}
          />
        </section>
      </div>
    </AdminModal>
  )
}

/**
 * «Nuovo motore», con la sua finestra, nell'elenco dei motori.
 * La finestra si monta solo quando serve: ogni volta parte vuota.
 */
export function NewEngineButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={adminButtonClass('primary')}
      >
        <PlusIcon aria-hidden="true" size={16} />
        Nuovo motore
      </button>
      {open && <NewEngineModal onClose={() => setOpen(false)} />}
    </>
  )
}
