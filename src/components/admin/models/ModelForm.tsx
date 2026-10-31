import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { validationErrors } from '@/api/errors'
import {
  PredecessorPicker,
  type ModelOption,
} from '@/components/admin/models/PredecessorPicker'
import { PublicationCard } from '@/components/admin/models/PublicationCard'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { useAdminCategories } from '@/hooks/useAdminModels'
import { useSaveModel } from '@/hooks/useAdminModel'
import { useCurrentUser } from '@/hooks/useAuth'
import { slugify } from '@/lib/slugify'
import type { AdminCarModel } from '@/types/admin'

const dateFormat = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** I titoli dei blocchi, come nel pannello */
const cardTitle = 'font-display text-xl font-extrabold tracking-[-0.03em]'

/** I valori dei campi, come li tiene il form: i numeri come testo, perché i campi lavorano con il testo */
type FormValues = {
  name: string
  slug: string
  category_id: string
  predecessor: ModelOption | null
  description_it: string
  description_en: string
}

/**
 * Il form del modello: senza model ne crea uno nuovo, con model lo modifica.
 * I valori iniziali vengono dal modello: la pagina lo monta solo quando è arrivato.
 */
export function ModelForm({ model }: { model?: AdminCarModel }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const { data: categories } = useAdminCategories()
  const save = useSaveModel(model?.id)

  const [values, setValues] = useState<FormValues>({
    name: model?.name ?? '',
    slug: model?.slug ?? '',
    category_id: model ? String(model.category_id) : '',
    predecessor: model?.predecessor
      ? { id: model.predecessor.id, name: model.predecessor.name }
      : null,
    description_it: model?.description.it ?? '',
    description_en: model?.description.en ?? '',
  })
  const [saved, setSaved] = useState(false)
  // Ci sono modifiche nei campi non ancora salvate: la pubblicazione deve dirlo
  const [dirty, setDirty] = useState(false)

  // Arrivati qui subito dopo la creazione: la pagina precedente ce lo dice nello stato della navigazione
  const justCreated =
    (location.state as { created?: boolean } | null)?.created === true

  const errors = validationErrors(save.error)
  const slugPreview = values.slug || slugify(values.name)

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setSaved(false)
    setDirty(true)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    save.mutate(
      {
        name: values.name.trim(),
        // Vuoto: in creazione il backend lo genera dal nome, in modifica resta quello di prima
        slug: values.slug.trim() || undefined,
        category_id: values.category_id ? Number(values.category_id) : null,
        predecessor_id: values.predecessor?.id ?? null,
        description: { it: values.description_it, en: values.description_en },
      },
      {
        onSuccess: (result) => {
          if (model) {
            setSaved(true)
            setDirty(false)
          } else {
            navigate(`/admin/modelli/${result.id}`, {
              replace: true,
              state: { created: true },
            })
          }
        },
      },
    )
  }

  /** Il riepilogo: per un modello nuovo sta accanto ai dati, per uno esistente accanto alla descrizione */
  const summary = (
    <AdminCard
      aria-labelledby="modello-riepilogo"
      delay={180}
      className="col-span-6 p-6 lg:col-span-4"
    >
      <h2 id="modello-riepilogo" className={cardTitle}>
        Riepilogo
      </h2>
      {model ? (
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <dt className="text-neutral-400">Versioni</dt>
          <dd className="text-right font-semibold tabular-nums">
            {model.versions_count ?? 0}
          </dd>
          <dt className="text-neutral-400">Creato il</dt>
          <dd className="text-right">
            {dateFormat.format(new Date(model.created_at))}
          </dd>
          <dt className="text-neutral-400">Ultima modifica</dt>
          <dd className="text-right">
            {dateFormat.format(new Date(model.updated_at))}
          </dd>
        </dl>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-neutral-400">
          Il modello nasce come bozza: non comparirà sul sito finché non verrà
          pubblicato.
        </p>
      )}
    </AdminCard>
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <title>{`${model?.name ?? 'Nuovo modello'} – Ferrary`}</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Link
            to="/admin/modelli"
            className="text-xs font-semibold text-neutral-400 transition-colors hover:text-white"
          >
            <span aria-hidden="true">← </span>Modelli
          </Link>
          <h1 className="font-display mt-3 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            {model?.name ?? 'Nuovo modello'}
          </h1>
          {model && (
            <div className="mt-3">
              <StatusBadge
                status={model.status}
                publishedAt={model.published_at}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* I messaggi di esito, letti dai lettori di schermo appena compaiono */}
          <p role="status" className="text-sm text-neutral-300">
            {saved && 'Modifiche salvate.'}
            {justCreated &&
              !saved &&
              !save.isPending &&
              'Modello creato: è una bozza.'}
          </p>
          <button
            type="submit"
            disabled={save.isPending}
            className={adminButtonClass('primary')}
          >
            {save.isPending
              ? 'Salvataggio…'
              : model
                ? 'Salva modifiche'
                : 'Crea modello'}
          </button>
        </div>
      </header>

      {save.isError && !errors && (
        <p
          role="alert"
          className="border-errore/40 bg-errore/10 text-errore mt-5 rounded-2xl border px-4 py-3 text-[0.8125rem]"
        >
          Impossibile salvare in questo momento. Riprova.
        </p>
      )}

      <div className="mt-7 grid grid-cols-6 gap-4 lg:grid-cols-12">
        <AdminCard
          aria-labelledby="modello-dati"
          className="col-span-6 p-6 lg:col-span-8"
        >
          <h2 id="modello-dati" className={cardTitle}>
            Dati principali
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <AdminField
              label="Nome"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              error={errors?.name?.[0]}
            />
            <AdminField
              label="Slug"
              value={values.slug}
              placeholder={slugify(values.name)}
              onChange={(event) => update('slug', event.target.value)}
              hint={`Nell'indirizzo del sito: /modelli/${slugPreview || '…'}`}
              error={errors?.slug?.[0]}
            />
            <AdminSelect
              label="Famiglia"
              value={values.category_id}
              onChange={(event) => update('category_id', event.target.value)}
              error={errors?.category_id?.[0]}
            >
              <option value="">Scegli una famiglia</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name.it}
                </option>
              ))}
            </AdminSelect>
            <PredecessorPicker
              value={values.predecessor}
              onChange={(predecessor) => update('predecessor', predecessor)}
              excludeId={model?.id}
              error={errors?.predecessor_id?.[0]}
            />
          </div>
        </AdminCard>

        {/* Accanto ai dati: la pubblicazione per un modello esistente, il riepilogo per uno nuovo */}
        {model ? (
          <PublicationCard
            model={model}
            canPublish={user?.role !== 'moderator'}
            hasUnsavedChanges={dirty}
            delay={60}
            className="col-span-6 lg:col-span-4"
          />
        ) : (
          summary
        )}

        <AdminCard
          aria-labelledby="modello-descrizione"
          delay={120}
          className="col-span-6 p-6 lg:col-span-8"
        >
          <h2 id="modello-descrizione" className={cardTitle}>
            Descrizione
          </h2>
          <div className="mt-5 flex flex-col gap-5">
            <AdminTextarea
              label="In italiano"
              value={values.description_it}
              onChange={(event) => update('description_it', event.target.value)}
              error={errors?.['description.it']?.[0]}
            />
            <AdminTextarea
              label="In inglese"
              value={values.description_en}
              onChange={(event) => update('description_en', event.target.value)}
              hint="Facoltativa: si può aggiungere in un secondo momento."
              error={errors?.['description.en']?.[0]}
            />
          </div>
        </AdminCard>

        {/* Per un modello esistente, il riepilogo scende accanto alla descrizione */}
        {model && summary}
      </div>
    </form>
  )
}
