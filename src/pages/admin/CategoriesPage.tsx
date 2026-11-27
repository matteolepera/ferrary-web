import { useState } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { backendMessage } from '@/api/errors'
import { CategoryModal } from '@/components/admin/categories/CategoryModal'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { ListHeader } from '@/components/admin/ui/ListHeader'
import { ListTable, listRowClass } from '@/components/admin/ui/ListTable'
import { RowActions } from '@/components/admin/ui/RowActions'
import { useAdminCategories } from '@/hooks/useAdminModels'
import { useCategoryActions } from '@/hooks/useCategoryActions'

const columns = ['Famiglia', 'Slug', 'Modelli', 'Posizione', '']

/**
 * Le famiglie dell'archivio, nel loro ordine, e la finestra per crearne una o modificarla.
 * Sono poche: niente ricerca né filtri, e tutte in una pagina, così l'ordine si legge intero.
 */
export function CategoriesPage() {
  const { data: categories, isPending, isError } = useAdminCategories()
  const { remove } = useCategoryActions()
  // La finestra aperta: "new" per una famiglia nuova, l'id per modificarne una, null se chiusa
  const [modal, setModal] = useState<number | 'new' | null>(null)

  const sorted = [...(categories ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const current =
    typeof modal === 'number'
      ? sorted.find((category) => category.id === modal)
      : undefined
  const nextPosition = (sorted.at(-1)?.sort_order ?? 0) + 1
  const count = categories
    ? sorted.length === 1
      ? '1 famiglia'
      : `${sorted.length} famiglie`
    : undefined

  return (
    <>
      <title>Famiglie – Ferrary</title>

      <ListHeader
        eyebrow="Catalogo"
        title="Famiglie"
        count={count}
        action={
          <button
            type="button"
            onClick={() => setModal('new')}
            // Finché le famiglie non arrivano non sappiamo la posizione da proporre
            disabled={!categories}
            className={adminButtonClass('primary')}
          >
            <PlusIcon aria-hidden="true" size={16} />
            Nuova famiglia
          </button>
        }
      />

      <ListTable
        caption="Famiglie dell'archivio"
        columns={columns}
        minWidth="min-w-[36rem]"
        isPending={isPending}
        error={isError ? 'Impossibile caricare le famiglie.' : null}
        empty={
          sorted.length === 0
            ? 'Nessuna famiglia nell’archivio: crea la prima.'
            : null
        }
        footer={
          remove.isError && (
            <p
              role="alert"
              className="border-linea text-errore border-t px-6 py-4 text-[0.8125rem]"
            >
              {backendMessage(remove.error) ??
                'Impossibile eliminare la famiglia. Riprova.'}
            </p>
          )
        }
      >
        {sorted.map((category) => (
          <tr key={category.id} className={listRowClass}>
            <td className="py-4 pr-5 pl-6">
              <p className="font-display text-[0.9375rem] font-bold">
                {category.name.it}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {category.name.en ?? '—'}
              </p>
            </td>
            <td className="px-5 py-4 text-neutral-400">{category.slug}</td>
            <td className="px-5 py-4 text-neutral-300 tabular-nums">
              {category.car_models_count ?? 0}
            </td>
            <td className="px-5 py-4 text-neutral-300 tabular-nums">
              {category.sort_order}
            </td>
            <td className="px-5 py-4">
              <RowActions
                name={category.name.it}
                onEdit={() => setModal(category.id)}
                onStartDelete={() => remove.reset()}
                onDelete={(done) =>
                  remove.mutate(category.id, { onSuccess: done })
                }
                isPending={remove.isPending}
              />
            </td>
          </tr>
        ))}
      </ListTable>

      {/* La finestra si monta solo quando serve, e si smonta alla chiusura: riparte sempre pulita */}
      {modal !== null && categories && (
        <CategoryModal
          key={modal}
          category={current}
          nextPosition={nextPosition}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
