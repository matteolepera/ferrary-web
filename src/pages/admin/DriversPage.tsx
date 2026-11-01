import { useState } from 'react'
import { backendMessage } from '@/api/errors'
import { DriverForm } from '@/components/admin/drivers/DriverForm'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Icon } from '@/components/admin/ui/Icon'
import { useAdminDrivers, useDriverActions } from '@/hooks/useAdminDrivers'
import { birthDate } from '@/lib/birthDate'
import { countryName } from '@/lib/countryName'

const iconButton =
  'flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'

/**
 * I piloti che hanno guidato le Ferrari da corsa, in ordine di cognome.
 */
export function DriversPage() {
  const { data: drivers, isPending, isError } = useAdminDrivers()
  const { remove } = useDriverActions()
  const [editing, setEditing] = useState<number | null>(null)
  const [confirming, setConfirming] = useState<number | null>(null)

  // Per cognome, e a parità di cognome per nome: come negli annuari
  const sorted = [...(drivers ?? [])].sort(
    (a, b) =>
      a.last_name.localeCompare(b.last_name, 'it') ||
      a.first_name.localeCompare(b.first_name, 'it'),
  )
  const current = sorted.find((driver) => driver.id === editing)

  return (
    <>
      <title>Piloti – Ferrary</title>

      <header>
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
                        aria-current={
                          driver.id === editing ? 'true' : undefined
                        }
                        className={[
                          'border-linea border-b last:border-b-0',
                          driver.id === editing ? 'bg-white/[0.04]' : '',
                        ].join(' ')}
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
                                onClick={() => setEditing(driver.id)}
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

        <AdminCard
          aria-labelledby="pilota-form"
          delay={60}
          className="col-span-6 self-start p-6 lg:col-span-4"
        >
          <h2
            id="pilota-form"
            className="font-display text-xl font-extrabold tracking-[-0.03em]"
          >
            {current
              ? `Modifica: ${current.first_name} ${current.last_name}`
              : 'Nuovo pilota'}
          </h2>
          <DriverForm
            key={current?.id ?? 'nuovo'}
            driver={current}
            onDone={() => setEditing(null)}
          />
        </AdminCard>
      </div>
    </>
  )
}
