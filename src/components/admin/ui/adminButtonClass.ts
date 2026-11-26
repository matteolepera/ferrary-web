/**
 * Un colore, un significato: nell'admin il rosso pieno vuol dire solo "elimina per sempre".
 * - primary: l'azione principale (salva, crea, pubblica, ripristina)
 * - outline: le azioni secondarie (annulla, modifica, riprova)
 * - dangerSoft: toglie ma si può recuperare, o apre la conferma di un'eliminazione
 * - danger: elimina per sempre, senza ritorno
 */
export type AdminButtonVariant = 'primary' | 'outline' | 'dangerSoft' | 'danger'

const variants: Record<AdminButtonVariant, string> = {
  primary: 'bg-white text-notte hover:bg-neutral-200',
  outline: 'border border-white/20 text-white hover:border-white/50',
  dangerSoft:
    'border border-rosso-acceso/45 text-rosso-acceso hover:border-rosso-acceso hover:bg-rosso-acceso/10',
  danger: 'bg-rosso text-white hover:bg-rosso-scuro',
}

/**
 * Il pulsante piccolo in cima alle sezioni: «Modifica», «＋ Aggiungi foto».
 * Contornato come outline, ma più basso, per stare accanto al titolo.
 */
export const sectionButtonClass = [
  'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-4',
  'text-[0.8125rem] font-semibold transition-colors hover:border-white/50',
  'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
].join(' ')

/**
 * Classi del pulsante dell'area admin: a pillola, come nel pannello.
 * Separate dal componente per usarle anche sui Link.
 */
export function adminButtonClass(
  variant: AdminButtonVariant = 'primary',
  className = '',
) {
  return [
    'inline-flex h-12 items-center justify-center gap-2 rounded-full px-5',
    'text-sm font-semibold transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso',
    'disabled:pointer-events-none disabled:opacity-40',
    variants[variant],
    className,
  ].join(' ')
}
