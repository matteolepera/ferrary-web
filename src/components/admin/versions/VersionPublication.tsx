import { PublicationCard } from '@/components/admin/models/PublicationCard'
import { useVersionPublication } from '@/hooks/useAdminVersion'
import type { AdminVersion } from '@/types/admin'

type VersionPublicationProps = {
  version: AdminVersion
  canPublish: boolean
  hasUnsavedChanges: boolean
  delay?: number
  className?: string
}

/** La pubblicazione di una versione: collega il blocco all'hook delle versioni */
export function VersionPublication({
  version,
  ...props
}: VersionPublicationProps) {
  const publication = useVersionPublication(version.id, version.car_model_id)

  return (
    <PublicationCard
      status={version.status}
      publishedAt={version.published_at}
      subject="La versione"
      isPending={publication.isPending}
      isError={publication.isError}
      onChange={(change, done) =>
        publication.mutate(change, { onSuccess: done })
      }
      {...props}
    />
  )
}
