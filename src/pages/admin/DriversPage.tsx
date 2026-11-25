import { useState } from 'react'
import { backendMessage } from '@/api/errors'
import { DriverModal } from '@/components/admin/drivers/DriverModal'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Icon } from '@/components/admin/ui/Icon'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { useAdminDrivers, useDriverActions } from '@/hooks/useAdminDrivers'
import { birthDate } from '@/lib/birthDate'
import { countryName } from '@/lib/format'

const iconButton =
  'flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'

/**
 * I piloti che hanno guidato le Ferrari da corsa, in ordine di cognome.
 */
export function DriversPage() {
  const { data: drivers, isPending, isError } = useAdminDrivers()
  const { remove } = useDriverActions()
  // La finestra aperta: "new" per un pilota nuovo, l'id per modificarne uno, null se chiusa
  const [modal, setModal] = useState<number | 'new' | null>(null)
  const [confirming, setConfirming] = useState<number | null>(null)

  // Per cognome, e a parità di cognome per nome: come negli annuari
  const sorted = [...(drivers ?? [])].sort(
    (a, b) =>
      a.last_name.localeCompare(b.last_name, 'it') ||
      a.first_name.localeCompare(b.first_name, 'it'),
  )
  const current =
    typeof modal === 'number'
      ? sorted.find((driver) => driver.id === modal)
      : undefined

  return (
    <>
      <title>Piloti – Ferrary</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
            Catalogo
          </p>
          <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            Piloti
          </h1>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-neutral-400">
            Chi ha guidato le Ferrari da corsa: si collegano alle versioni che
            hanno portato in pista.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal('new')}
          className={adminButtonClass('primary')}
        >
          <span aria-hidden="true">＋</span> Nuovo pilota
        </button>
      </header>

      <div className="mt-7">
        <AdminCard className="overflow-hidden">
          {isPending && (
            <div
              aria-busy="true"
              className="m-6 h-48 animate-pulse rounded-2xl bg-white/5"
            />
          )}
          {isError && (
            <p className="p-6 text-sm text-neutral-400">
              Impossibile caricare i piloti.
            </p>
          )}

          {drivers && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] text-left text-sm">
                <caption className="sr-only">Piloti del catalogo</caption>
                <thead>
                  <tr className="border-linea border-b">
                    {['Pilota', 'Nazionalità', 'Nato il', 'Versioni', ''].map(
                      (column, index) => (
                        <th
                          key={column || index}
                          scope="col"
                          className="px-5 py-4 text-[0.6875rem] font-semibold tracking-[0.18em] whitespace-nowrap text-neutral-400 uppercase first:pl-6"
                        >
                          {column || <span className="sr-only">Azioni</span>}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((driver) => {
                    const name = `${driver.first_name} ${driver.last_name}`

                    return (
                      <tr
                        key={driver.id}
                        className="border-linea border-b last:border-b-0"
                      >
                        <td className="py-4 pr-5 pl-6">
                          <p className="font-display font-bold">{name}</p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {driver.slug}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-neutral-300">
                          {countryName(driver.nationality) ?? '—'}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-neutral-300">
                          {birthDate(driver.birth_date) ?? '—'}
                        </td>
                        <td className="px-5 py-4 text-neutral-300 tabular-nums">
                          {driver.versions_count ?? 0}
                        </td>
                        <td className="px-5 py-4">
                          {confirming === driver.id ? (
                            <div
                              role="alertdialog"
                              aria-label={`Eliminare ${name}?`}
                              className="flex items-center gap-2"
                            >
                              <AdminButton
                                variant="danger"
                                disabled={remove.isPending}
                                onClick={() =>
                                  remove.mutate(driver.id, {
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
                                aria-label={`Modifica ${name}`}
                                onClick={() => setModal(driver.id)}
                                className={iconButton}
                              >
                                <Icon
                                  path="M4 20l4-1 11-11-3-3L5 16z"
                                  size={15}
                                />
                              </button>
                              <button
                                type="button"
                                aria-label={`Elimina ${name}`}
                                onClick={() => {
                                  remove.reset()
                                  setConfirming(driver.id)
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
                    )
                  })}
                </tbody>
              </table>

              {sorted.length === 0 && (
                <p className="px-6 py-12 text-center text-sm text-neutral-400">
                  Nessun pilota nel catalogo: crea il primo.
                </p>
              )}
            </div>
          )}

          {remove.isError && (
            <p
              role="alert"
              className="border-linea text-errore border-t px-6 py-4 text-[0.8125rem]"
            >
              {backendMessage(remove.error) ??
                'Impossibile eliminare il pilota. Riprova.'}
            </p>
          )}
        </AdminCard>
      </div>

      {/* La finestra si monta solo quando serve, e si smonta alla chiusura: riparte sempre pulita */}
      {modal !== null && (
        <DriverModal
          key={modal}
          driver={current}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
