import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo'
import { CatalogsMenu } from '@/components/layout/CatalogsMenu'
import { useScrolled } from '@/hooks/useScrolled'
import { useSectionInView } from '@/hooks/useSectionInView'

/** Una voce della pillola: piena di bianco se attiva, come una scelta fatta */
const itemClass = (active: boolean) =>
    [
        'rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase transition-colors',
        'focus-visible:outline-rosso-acceso focus-visible:outline-2',
        active ? 'bg-rosso text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white',
    ].join(' ')

/**
 * L'intestazione del sito pubblico: il logo, la pillola delle voci al centro dal desktop, e la lingua.
 * Su mobile e tablet le voci stanno nel dock.
 */
export function SiteHeader() {
    const { t } = useTranslation()
    const { pathname } = useLocation()
    const scrolled = useScrolled()
    // Nella home, "Famiglie" si accende quando la sezione arriva al centro dello schermo
    const familiesActive = useSectionInView('famiglie', pathname === '/')

    return (
        // Su mobile scorre via con la pagina; dal desktop resta ferma in alto
        <header className="absolute inset-x-0 top-0 z-30 lg:fixed">
            {/* Dal desktop, appena si scorre: un velo scuro dietro il logo e la lingua, che non hanno un fondo */}
            <div
                aria-hidden="true"
                className={[
                    'from-notte via-notte/70 pointer-events-none absolute inset-x-0 top-0 hidden h-32 bg-linear-to-b to-transparent transition-opacity duration-300 lg:block',
                    scrolled ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
            />

            {/* Tre colonne: la pillola resta al centro della pagina, qualunque sia la larghezza del logo */}
            <div className="relative mx-auto grid max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center px-5 py-5 md:px-10 md:py-6">
                <Link to="/" aria-label={t('nav.home')} className="justify-self-start">
                    <Logo className="h-7 w-auto md:h-8" />
                </Link>

                <nav aria-label={t('nav.main')} className="hidden lg:block">
                    <ul className="flex items-center gap-1 rounded-full border border-white/12 bg-neutral-900/70 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                        <li>
                            <NavLink to="/modelli" className={({ isActive }) => itemClass(isActive)}>
                                {t('nav.archive')}
                            </NavLink>
                        </li>
                        <li>
                            {/* NavLink ignora l'ancora: la voce si accende quando la sezione è sullo schermo */}
                            <Link
                                to="/#famiglie"
                                aria-current={familiesActive ? 'true' : undefined}
                                className={itemClass(familiesActive)}
                            >
                                {t('nav.families')}
                            </Link>
                        </li>
                        <li>
                            <NavLink to="/storia" className={({ isActive }) => itemClass(isActive)}>
                                {t('nav.story')}
                            </NavLink>
                        </li>
                        <li>
                            <CatalogsMenu itemClass={itemClass} />
                        </li>
                    </ul>
                </nav>

                <div className="justify-self-end">
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    )
}