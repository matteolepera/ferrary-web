import { useState } from 'react'
import { backendMessage } from '@/api/errors'
import { DesignerForm } from '@/components/admin/designers/DesignerForm'
import { designerTypes } from '@/components/admin/designers/options'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Icon } from '@/components/admin/ui/Icon'
import { labelOf } from '@/components/admin/versions/options'
import {
  useAdminDesigners,
  useDesignerActions,
} from '@/hooks/useAdminDesigners'
import { countryName } from '@/lib/countryName'

const iconButton =
  'flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'

/**
 * I designer: studi e persone che hanno disegnato le Ferrari.
 */
export function DesignersPage() {
  const { data: designers, isPending, isError } = useAdminDesigners()
  const { remove } = useDesignerActions()
  const [editing, setEditing] = useState<number | null>(null)
  const [confirming, setConfirming] = useState<number | null>(null)

  const sorted = [...(designers ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name, 'it'),
  )
  const current = sorted.find((designer) => designer.id === editing)

  return (
    <>
      <title>Designer – Ferrary</title>

      <header>
        <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
          Catalogo
        </p>
        <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
          Designer
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-neutral-400">
          Gli studi e le persone che hanno disegnato le Ferrari: si collegano
          alle versioni, con il loro ruolo.
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
              Impossibile caricare i designer.
            </p>
          )}

          {designers && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <caption className="sr-only">Designer del catalogo</caption>
                <thead>
                  <tr className="border-linea border-b">
                    {['Designer', 'Tipo', 'Paese', 'Versioni', ''].map(
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
                  {sorted.map((designer) => (
                    <tr
                      key={designer.id}
                      aria-current={
                        designer.id === editing ? 'true' : undefined
                      }
                      className={[
                        'border-linea border-b last:border-b-0',
                        designer.id === editing ? 'bg-white/[0.04]' : '',
                      ].join(' ')}
                    >
                      <td className="py-4 pr-5 pl-6">
                        <p className="font-display font-bold">
                          {designer.name}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {designer.slug}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-neutral-300">
                        {labelOf(designerTypes, designer.type)}
                      </td>
                      <td className="px-5 py-4 text-neutral-300">
                        {countryName(designer.country) ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-neutral-300 tabular-nums">
                        {designer.versions_count ?? 0}
                      </td>
                      <td className="px-5 py-4">
                        {confirming === designer.id ? (
                          <div
                            role="alertdialog"
                            aria-label={`Eliminare ${designer.name}?`}
                            className="flex items-center gap-2"
                          >
                            <AdminButton
                              disabled={remove.isPending}
                              onClick={() =>
                                remove.mutate(designer.id, {
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
                              aria-label={`Modifica ${designer.name}`}
                              onClick={() => setEditing(designer.id)}
                              className={iconButton}
                            >
                              <Icon
                                path="M4 20l4-1 11-11-3-3L5 16z"
                                size={15}
                              />
                            </button>
                            <button
                              type="button"
                              aria-label={`Elimina ${designer.name}`}
                              onClick={() => {
                                remove.reset()
                                setConfirming(designer.id)
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

              {sorted.length === 0 && (
                <p className="px-6 py-12 text-center text-sm text-neutral-400">
                  Nessun designer nel catalogo: crea il primo.
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
                'Impossibile eliminare il designer. Riprova.'}
            </p>
          )}
        </AdminCard>

        <AdminCard
          aria-labelledby="designer-form"
          delay={60}
          className="col-span-6 self-start p-6 lg:col-span-4"
        >
          <h2
            id="designer-form"
            className="font-display text-xl font-extrabold tracking-[-0.03em]"
          >
            {current ? `Modifica: ${current.name}` : 'Nuovo designer'}
          </h2>
          <DesignerForm
            key={current?.id ?? 'nuovo'}
            designer={current}
            onDone={() => setEditing(null)}
          />
        </AdminCard>
      </div>
    </>
  )
}
