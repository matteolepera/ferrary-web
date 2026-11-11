export type ButtonVariant =
  'primary' | 'secondary' | 'ghost' | 'cta' | 'ctaGhost'

/** Le classi di tutti i pulsanti: il testo, il focus, lo stato disattivato */
const common = [
  'inline-flex items-center justify-center',
  'text-xs font-semibold tracking-[0.18em] uppercase',
  'focus-visible:outline-2',
  'disabled:pointer-events-none disabled:opacity-40',
].join(' ')

/** I pulsanti classici, squadrati: quelli dell'area admin e dei moduli */
const classic =
  'gap-2 px-7 py-4 transition-colors focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso'

/**
 * I pulsanti con la forma della Y, per il sito pubblico: l'angolo grande in alto a sinistra,
 * il taglio in basso a destra, e il contorno del focus dentro, perché fuori lo taglierebbe il ritaglio
 */
const yShape = [
  'group/cta h-13 gap-3.5 rounded-[3px] rounded-tl-[16px] pr-9 pl-7 text-white transition duration-300',
  '[clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%)]',
  'focus-visible:-outline-offset-4',
].join(' ')

const variants: Record<ButtonVariant, string> = {
  primary: `${classic} bg-rosso text-white hover:bg-rosso-scuro`,
  secondary: `${classic} border border-white/40 text-white hover:bg-white hover:text-notte`,
  ghost: `${classic} text-white underline-offset-4 hover:underline`,
  // Rosso, con la luce in alto: l'azione principale delle pagine pubbliche
  cta: `${yShape} bg-linear-to-b from-[#E00000] to-[#B80000] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-[#F01010] hover:to-[#C80000] focus-visible:outline-white`,
  // Scuro e sfocato, con il bordo sottile: accanto al rosso, o sopra una foto. La freccia è rossa
  ctaGhost: `${yShape} bg-neutral-900/75 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] backdrop-blur-md hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] focus-visible:outline-rosso-acceso [&_[data-arrow]]:text-rosso-acceso`,
}

/**
 * Classi del pulsante, riusabili anche sui link che devono sembrare pulsanti.
 */
export function buttonClass(
  variant: ButtonVariant = 'primary',
  className = '',
) {
  return [common, variants[variant], className].join(' ')
}
