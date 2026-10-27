import logoOnDark from '@/assets/brand/ferrary-cartella-colori-su-scuro.svg'

type LogoProps = {
  className?: string
  /** Testo alternativo; vuoto se il logo sta in un link che ha già il suo nome */
  alt?: string
}

/**
 * Il logo completo di Ferrary, nella versione per fondi scuri.
 */
export function Logo({ className = '', alt = 'Ferrary' }: LogoProps) {
  return <img src={logoOnDark} alt={alt} className={className} />
}
