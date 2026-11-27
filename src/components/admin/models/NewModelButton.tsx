import { useState, type FormEvent } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import {
  ModelDescriptionFields,
  ModelMainFields,
} from '@/components/admin/models/ModelFields'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { FormAlert } from '@/components/admin/ui/FormAlert'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { useModelDraft } from '@/hooks/useModelDraft'

const subtitle =
  'mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'

/**
 * La finestra per creare un modello: i dati principali e la descrizione.
 * Creato, si va alla sua pagina, dove si aggiungono le versioni.
 */
function NewModelModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  // Senza modello: lo stato di partenza è vuoto, e il salvataggio lo crea
  const draft = useModelDraft()
  const { values, errors, save } = draft

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    draft.submit((created) =>
      navigate(`/admin/modelli/${created.id}`, { state: { created: true } }),
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title="Nuovo modello"
      description="Nasce come bozza: non compare sul sito finché non viene pubblicato."
      dirty={draft.dirty}
      size="lg"
      onSubmit={handleSubmit}
      submitLabel="Crea modello"
      pending={save.isPending}
    >
      {save.isError && !errors && (
        <FormAlert className="mb-5">
          Impossibile creare il modello in questo momento. Riprova.
        </FormAlert>
      )}

      <div className="flex flex-col gap-7">
        <section>
          <h3 className={subtitle}>Dati principali</h3>
          <ModelMainFields
            values={values}
            onChange={draft.update}
            errors={errors}
          />
        </section>
        <section>
          <h3 className={subtitle}>Descrizione</h3>
          <ModelDescriptionFields
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
 * «Nuovo modello», con la sua finestra: sta nell'elenco dei modelli e nel pannello.
 * La finestra si monta solo quando serve: ogni volta parte vuota.
 */
export function NewModelButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={adminButtonClass('primary')}
      >
        <PlusIcon aria-hidden="true" size={16} />
        Nuovo modello
      </button>
      {open && <NewModelModal onClose={() => setOpen(false)} />}
    </>
  )
}
