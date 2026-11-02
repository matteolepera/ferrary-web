import type { ActivityItem } from '@/types/dashboard'

const phrases: Record<string, string> = {
  created: 'ha creato',
  updated: 'ha modificato',
  deleted: 'ha spostato nel cestino',
  restored: 'ha ripristinato',
  published: 'ha pubblicato',
  scheduled: 'ha programmato',
  unpublished: 'ha riportato in bozza',
  role_changed: 'ha cambiato il ruolo di',
}

/** Le frasi sulle persone dello staff, dove "ha creato" suonerebbe strano */
const staffPhrases: Record<string, string> = {
  created: 'ha aggiunto allo staff',
  deleted: 'ha rimosso dallo staff',
  updated: 'ha modificato il profilo di',
}

/** I tipi di elemento: al singolare per le frasi, al plurale per il filtro */
export const subjectTypes: Record<string, { one: string; many: string }> = {
  car_model: { one: 'un modello', many: 'Modelli' },
  version: { one: 'una versione', many: 'Versioni' },
  version_spec: { one: 'una scheda tecnica', many: 'Schede tecniche' },
  version_powertrain: { one: 'una motorizzazione', many: 'Motorizzazioni' },
  image: { one: 'una foto', many: 'Foto' },
  engine: { one: 'un motore', many: 'Motori' },
  designer: { one: 'un designer', many: 'Designer' },
  driver: { one: 'un pilota', many: 'Piloti' },
  category: { one: 'una famiglia', many: 'Famiglie' },
  user: { one: 'una persona', many: 'Persone dello staff' },
}

/** L'azione in una frase; per un'azione che non conosciamo ancora, una frase generica */
export function phrase({
  action,
  subject_type,
}: Pick<ActivityItem, 'action' | 'subject_type'>) {
  if (subject_type === 'user' && staffPhrases[action]) {
    return staffPhrases[action]
  }

  return phrases[action] ?? 'ha modificato'
}

/** Il nome di ciò che è cambiato, o il suo tipo quando non ha un nome, come una foto */
export function subjectLabel({
  subject_name,
  subject_type,
}: Pick<ActivityItem, 'subject_name' | 'subject_type'>) {
  return subject_name ?? subjectTypes[subject_type]?.one ?? 'un elemento'
}
