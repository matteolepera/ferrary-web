import { useState } from 'react'
import { useLocation } from 'react-router'
import { EngineSectionModal } from '@/components/admin/engines/EngineSectionModal'
import { EngineUsageCard } from '@/components/admin/engines/EngineUsageCard'
import {
  engineSections,
  type EngineSection,
} from '@/components/admin/engines/engineSections'
import { engineSectionSummary } from '@/components/admin/engines/engineSummary'
import { displacement, engineSummary } from '@/components/admin/engines/options'
import { BackLink } from '@/components/admin/ui/BackLink'
import {
  SectionIndex,
  type SectionIndexItem,
} from '@/components/admin/ui/SectionIndex'
import { SectionCard } from '@/components/admin/ui/SectionCard'
import { summaryStatus } from '@/components/admin/versions/versionSummary'
import { useActiveSection } from '@/hooks/useActiveSection'
import type { AdminEngine } from '@/types/admin'

/**
 * La pagina di un motore, come quelle di modelli e versioni: si legge, e «Modifica» apre
 * la sezione in una finestra. A destra, ferma, l'utilizzo con l'indice.
 */
export function EnginePage({ engine }: { engine: AdminEngine }) {
  const location = useLocation()
  // La sezione aperta in una finestra, o nessuna
  const [editing, setEditing] = useState<EngineSection | null>(null)

  // Arrivati qui subito dopo la creazione: la pagina precedente ce lo dice nello stato della navigazione
  const justCreated =
    (location.state as { created?: boolean } | null)?.created === true

  const summary = (section: EngineSection) =>
    engineSectionSummary(section, engine)

  const index: SectionIndexItem[] = [
    {
      id: 'motore-dati',
      label: 'Dati tecnici',
      status: summaryStatus(summary('dati')),
    },
    {
      id: 'motore-descrizione',
      label: 'Descrizione',
      status: summaryStatus(summary('descrizione')),
    },
  ]
  const active = useActiveSection(index.map((item) => item.id))

  // Sotto il codice, il motore in poche parole: "V8 biturbo · V8 a 90°, 3990 cm³"
  const inBrief = `${engineSummary(engine)}, ${displacement(engine.displacement_cc)}`

  return (
    <div>
      <title>{`${engine.code} – Ferrary`}</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <BackLink to="/admin/motori" label="Motori" />
          <h1 className="font-display mt-4 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            {engine.code}
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            {engine.name ? `${engine.name} · ${inBrief}` : inBrief}
          </p>
        </div>

        <p role="status" className="text-sm text-neutral-300">
          {justCreated && 'Motore creato.'}
        </p>
      </header>

      {/* Due colonne: le sezioni a sinistra, a destra la colonna che resta ferma */}
      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-4">
          {(['dati', 'descrizione'] as const).map((section, position) => (
            <SectionCard
              key={section}
              id={`motore-${section}`}
              title={engineSections[section].title}
              items={summary(section)}
              empty={
                section === 'descrizione' ? 'Ancora nessun testo.' : undefined
              }
              onEdit={() => setEditing(section)}
              delay={position * 60}
            />
          ))}
        </div>

        {/* Sotto i 1024 pixel va in cima, prima delle sezioni */}
        <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-7 lg:order-none">
          <EngineUsageCard engine={engine} delay={60} />
          <SectionIndex
            items={index}
            active={active}
            className="max-lg:hidden"
          />
        </aside>
      </div>

      {/* Montata solo quando serve, con la sezione come chiave: ogni volta parte dai dati salvati */}
      {editing && (
        <EngineSectionModal
          key={editing}
          engine={engine}
          section={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
