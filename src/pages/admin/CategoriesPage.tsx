import { useState } from 'react'
import { backendMessage } from '@/api/errors'
import { CategoryModal } from '@/components/admin/categories/CategoryModal'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Icon } from '@/components/admin/ui/Icon'
import { useAdminCategories } from '@/hooks/useAdminModels'
import { useCategoryActions } from '@/hooks/useCategoryActions'

const iconButton =
  'flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'

/**
 * Le famiglie dell'archivio: l'elenco a tutta larghezza, e la finestra per crearne una o modificarla.
 */
export function CategoriesPage() {
  const { data: categories, isPending, isError } = useAdminCategories()
  const { remove } = useCategoryActions()
  // La finestra aperta: "new" per una famiglia nuova, l'id per modificarne una, null se chiusa
  const [modal, setModal] = useState<number | 'new' | null>(null)
  // La famiglia di cui si sta confermando l'eliminazione
  const [confirming, setConfirming] = useState<number | null>(null)

  const sorted = [...(categories ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const current =
    typeof modal === 'number'
      ? sorted.find((category) => category.id === modal)
      : undefined
  const nextPosition = (sorted.at(-1)?.sort_order ?? 0) + 1

  return (
    <>
      <title>Famiglie – Ferrary</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
            Catalogo
          </p>
          <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            Famiglie
          </h1>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-neutral-400">
            Dividono l'archivio, come la classificazione ufficiale Ferrari: ogni
            modello appartiene a una famiglia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal('new')}
          // Finché le famiglie non arrivano non sappiamo la posizione da proporre
          disabled={!categories}
          className={adminButtonClass('primary')}
        >
          <span aria-hidden="true">＋</span> Nuova famiglia
        </button>
      </header>

      <div className="mt-7 grid grid-cols-6 gap-4 lg:grid-cols-12">
        <AdminCard className="col-span-6 overflow-hidden lg:col-span-8">
          {isPending && (
            <div
              aria-busy="true"
              className="m-6 h-48 animate-pulse rounded-2xl bg-white/5"
            />
          )}
          {isError && (
            <p className="p-6 text-sm text-neutral-400">
              Impossibile caricare le famiglie.
            </p>
          )}

          {categories && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <caption className="sr-only">Famiglie dell'archivio</caption>
                <thead>
                  <tr className="border-linea border-b">
                    {['Famiglia', 'Slug', 'Modelli', 'Posizione', ''].map(
                      (column, index) => (
                        <th
                          key={column || index}
                          scope="col"
                          className="px-5 py-4 text-[0.6875rem] font-semibold tracking-[0.18em] text-neutral-400 uppercase first:pl-6"
                        >
                          {column || <span className="sr-only">Azioni</span>}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((category) => (
                    <tr
                      key={category.id}
                      className="border-linea border-b last:border-b-0"
                    >
                      <td className="py-4 pr-5 pl-6">
                        <p className="font-display font-bold">
                          {category.name.it}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {category.name.en ?? '—'}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-neutral-400">
                        {category.slug}
                      </td>
                      <td className="px-5 py-4 text-neutral-300 tabular-nums">
                        {category.car_models_count ?? 0}
                      </td>
                      <td className="px-5 py-4 text-neutral-300 tabular-nums">
                        {category.sort_order}
                      </td>
                      <td className="px-5 py-4">
                        {confirming === category.id ? (
                          <div
                            role="alertdialog"
                            aria-label={`Eliminare ${category.name.it}?`}
                            className="flex items-center gap-2"
                          >
                            <AdminButton
                              variant="danger"
                              disabled={remove.isPending}
                              onClick={() =>
                                remove.mutate(category.id, {
                                  onSuccess: () => setConfirming(null),
                                })
                              }
                              className="h-8 px-3 text-xs"
                            >
                              Elimina
                            </AdminButton>
                            <AdminButton
                              variant="outline"
                              onClick={() => setConfirming(null)}
                              className="h-8 px-3 text-xs"
                            >
                              Annulla
                            </AdminButton>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              aria-label={`Modifica ${category.name.it}`}
                              onClick={() => setModal(category.id)}
                              className={iconButton}
                            >
                              <Icon
                                path="M4 20l4-1 11-11-3-3L5 16z"
                                size={15}
                              />
                            </button>
                            <button
                              type="button"
                              aria-label={`Elimina ${category.name.it}`}
                              onClick={() => {
                                remove.reset()
                                setConfirming(category.id)
                              }}
                              className={`${iconButton} hover:bg-rosso`}
                            >
                              <Icon
                                path="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"
                                size={15}
                              />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {remove.isError && (
            <p
              role="alert"
              className="border-linea text-errore border-t px-6 py-4 text-[0.8125rem]"
            >
              {backendMessage(remove.error) ??
                'Impossibile eliminare la famiglia. Riprova.'}
            </p>
          )}
        </AdminCard>
      </div>

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
