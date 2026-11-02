import { roleLabels } from '@/components/admin/adminNav'
import type { UserRole } from '@/types/auth'

const dateTime = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** I nomi dei campi più comuni, in italiano; gli altri restano con il nome tecnico */
const fieldLabels: Record<string, string> = {
  name: 'Nome',
  first_name: 'Nome',
  last_name: 'Cognome',
  slug: 'Slug',
  description: 'Descrizione',
  published_at: 'Data di pubblicazione',
  category_id: 'Famiglia',
  predecessor_id: 'Predecessore',
  role: 'Ruolo',
  email: 'Email',
  alt_text: 'Testo alternativo',
  is_cover: 'Copertina',
  sort_order: 'Posizione',
  vehicle_type: 'Tipo di veicolo',
  body_type: 'Carrozzeria',
  year_start: 'Anno di inizio',
  year_end: 'Anno di fine',
  in_production: 'In produzione',
  production_type: 'Tipo di produzione',
  units_produced: 'Esemplari prodotti',
  code: 'Codice',
  country: 'Paese',
  nationality: 'Nazionalità',
  birth_date: 'Data di nascita',
}

export function fieldLabel(field: string) {
  return fieldLabels[field] ?? field
}

/**
 * Un valore del registro, leggibile: date per esteso, sì e no, ruoli, testi con la loro lingua.
 */
export function formatValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'

  if (typeof value === 'boolean') return value ? 'Sì' : 'No'

  if (field === 'role' && typeof value === 'string' && value in roleLabels) {
    return roleLabels[value as UserRole]
  }

  // Una data con l'ora, come la salva Laravel: 2026-10-30T09:00:00.000000Z
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return dateTime.format(new Date(value))
  }

  // Un testo tradotto: { it: '...', en: '...' }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([language, text]) => `${language.toUpperCase()}: ${String(text)}`)
      .join(' · ')
  }

  return String(value)
}
