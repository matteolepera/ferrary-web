import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { validationErrors } from '@/api/errors'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { useAdminCategories } from '@/hooks/useAdminModels'
import { useSaveModel } from '@/hooks/useAdminModel'
import { slugify } from '@/lib/slugify'
import type { AdminCarModel } from '@/types/admin'

const dateFormat = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** I titoli dei blocchi, come nel pannello */
const cardTitle = 'font-display text-xl font-extrabold tracking-[-0.03em]'

/**
 * Il form del modello: senza model ne crea uno nuovo, con model lo modifica.
 * I valori iniziali vengono dal modello: la pagina lo monta solo quando è arrivato.
 */
export function ModelForm({ model }: { model?: AdminCarModel }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: categories } = useAdminCategories()
  const save = useSaveModel(model?.id)

  const [values, setValues] = useState({
    name: model?.name ?? '',
    slug: model?.slug ?? '',
    category_id: model ? String(model.category_id) : '',
    description_it: model?.description.it ?? '',
    description_en: model?.description.en ?? '',
  })
  const [saved, setSaved] = useState(false)

  // Arrivati qui subito dopo la creazione: la pagina precedente ce lo dice nello stato della navigazione
  const justCreated =
    (location.state as { created?: boolean } | null)?.created === true

  const errors = validationErrors(save.error)
  const slugPreview = values.slug || slugify(values.name)

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    save.mutate(
      {
        name: values.name.trim(),
        // Vuoto: in creazione il backend lo genera dal nome, in modifica resta quello di prima
        slug: values.slug.trim() || undefined,
        category_id: values.category_id ? Number(values.category_id) : null,
        // Il predecessore arriva nel prossimo commit: per ora resta quello che c'era
        predecessor_id: model?.predecessor_id ?? null,
        description: { it: values.description_it, en: values.description_en },
      },
      {
        onSuccess: (result) => {
          if (model) {
            setSaved(true)
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
          </div>
        </AdminCard>

        <AdminCard
          aria-labelledby="modello-riepilogo"
          delay={60}
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
              Il modello nasce come bozza: non comparirà sul sito finché non
              verrà pubblicato.
            </p>
          )}
        </AdminCard>

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
      </div>
    </form>
  )
}
