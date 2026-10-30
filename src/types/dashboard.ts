/** I dati del pannello, come li restituisce GET /api/admin/dashboard */

export type DashboardCounts = {
  published: number
  drafts: number
  scheduled: number
  trashed: number
}

export type ScheduledItem = {
  type: 'model' | 'version'
  id: number
  name: string
  /** Il nome del modello, solo per le versioni */
  model: string | null
  published_at: string
}

/** Cosa manca a una versione: bozza, senza foto, senza scheda tecnica */
export type CompletionIssue = 'draft' | 'no_photos' | 'no_specs'

export type ToCompleteItem = {
  id: number
  name: string
  model: string
  model_id: number
  cover: string | null
  issues: CompletionIssue[]
  updated_at: string
}

export type ActivityItem = {
  id: number
  log: 'catalogo' | 'staff'
  /** created, updated, deleted, restored, published, scheduled, unpublished, role_changed */
  action: string
  causer: string | null
  subject_type: string
  subject_name: string | null
  created_at: string
}

export type Dashboard = {
  counts: DashboardCounts
  scheduled: ScheduledItem[]
  to_complete: ToCompleteItem[]
  activity: ActivityItem[]
}
