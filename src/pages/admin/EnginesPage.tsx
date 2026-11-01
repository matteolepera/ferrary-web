import { useState } from 'react'
import { Link } from 'react-router'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminSearch } from '@/components/admin/ui/AdminSearch'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { Icon } from '@/components/admin/ui/Icon'
import {
  aspirations,
  displacement,
  engineSummary,
} from '@/components/admin/engines/options'
import { labelOf } from '@/components/admin/versions/options'
import { useAdminEngines } from '@/hooks/useAdminEngines'

const columns = [
  'Motore',
  'Configurazione',
  'Cilindrata',
  'Aspirazione',
  'Versioni',
]

/**
 * I motori del catalogo, con una ricerca che filtra nel browser: sono qualche decina.
 */
export function EnginesPage() {
  const { data: engines, isPending, isError } = useAdminEngines()
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const visible = (engines ?? []).filter(
    (engine) =>
      !query ||
      engine.code.toLowerCase().includes(query) ||
      engine.name?.toLowerCase().includes(query),
  )

  return (
    <>
      <title>Motori – Ferrary</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
            Catalogo
          </p>
          <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            Motori
          </h1>
        </div>
        <Link to="/admin/motori/nuovo" className={adminButtonClass('primary')}>
          <Icon path="M12 5v14M5 12h14" size={16} />
          Nuovo motore
        </Link>
      </header>

      <div className="mt-7">
        <AdminSearch
          label="Cerca un motore"
          placeholder="Codice o nome"
          value={search}
          onSearch={setSearch}
        />
      </div>

      <AdminCard className="mt-4 overflow-hidden">
        {isPending && (
          <div
            aria-busy="true"
            className="m-6 h-48 animate-pulse rounded-2xl bg-white/5"
          />
        )}
        {isError && (
          <p className="p-6 text-sm text-neutral-400">
            Impossibile caricare i motori.
          </p>
        )}

        {engines && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">Motori del catalogo</caption>
              <thead>
                <tr className="border-linea border-b">
                  {columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-5 py-4 text-[0.6875rem] font-semibold tracking-[0.18em] whitespace-nowrap text-neutral-400 uppercase first:pl-6"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((engine) => (
                  <tr
                    key={engine.id}
                    className="border-linea border-b last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="py-4 pr-5 pl-6">
                      <Link
                        to={`/admin/motori/${engine.id}`}
                        className="font-display hover:text-rosso-acceso font-bold tracking-[-0.01em]"
                      >
                        {engine.code}
                      </Link>
                      {engine.name && (
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {engine.name}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-neutral-300">
                      {engineSummary(engine)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-neutral-300 tabular-nums">
                      {displacement(engine.displacement_cc)}
                    </td>
                    <td className="px-5 py-4 text-neutral-300">
                      {labelOf(aspirations, engine.aspiration)}
                    </td>
                    <td className="px-5 py-4 text-neutral-300 tabular-nums">
                      {engine.versions_count ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visible.length === 0 && (
              <p className="px-6 py-12 text-center text-sm text-neutral-400">
                {query
                  ? 'Nessun motore con questa ricerca.'
                  : 'Nessun motore nel catalogo: crea il primo.'}
              </p>
            )}
          </div>
        )}
      </AdminCard>
    </>
  )
}
