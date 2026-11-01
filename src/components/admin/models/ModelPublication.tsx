import { PublicationCard } from '@/components/admin/models/PublicationCard'
import { useModelPublication } from '@/hooks/useAdminModel'
import type { AdminCarModel } from '@/types/admin'

type ModelPublicationProps = {
  model: AdminCarModel
  canPublish: boolean
  hasUnsavedChanges: boolean
  delay?: number
  className?: string
}

/** La pubblicazione di un modello: collega il blocco all'hook dei modelli */
export function ModelPublication({ model, ...props }: ModelPublicationProps) {
  const publication = useModelPublication(model.id)

  return (
    <PublicationCard
      status={model.status}
      publishedAt={model.published_at}
      subject="Il modello"
      isPending={publication.isPending}
      isError={publication.isError}
      onChange={(change, done) =>
        publication.mutate(change, { onSuccess: done })
      }
      {...props}
    />
  )
}
