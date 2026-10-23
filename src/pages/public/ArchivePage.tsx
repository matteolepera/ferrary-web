import { useModels } from '@/hooks/useModels'

export function ArchivePage() {
  const { data, isPending, isError } = useModels()

  return (
    <section>
      <h1 className="text-3xl font-bold">Archivio</h1>

      {isPending && <p className="mt-6 text-neutral-500">Caricamento…</p>}

      {isError && (
        <p role="alert" className="mt-6 text-red-700">
          Impossibile caricare l'archivio. Riprova tra qualche istante.
        </p>
      )}

      {data && (
        <ul className="mt-6 space-y-2">
          {data.data.map((model) => (
            <li key={model.id}>{model.name}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
