import { Link, NavLink } from 'react-router'
import monogram from '@/assets/brand/ferrary-y-rosso.svg'
import { LogoutButton } from '@/components/admin/LogoutButton'
import { Icon } from '@/components/admin/ui/Icon'
import { logoutIcon, navFor, roleLabels } from '@/components/admin/adminNav'
import { useCurrentUser } from '@/hooks/useAuth'

/** Il cerchio di ogni voce: bianco quando è la pagina attuale, come nella bozza */
function itemClass(active = false) {
  return [
    'group relative flex size-12 shrink-0 items-center justify-center rounded-full transition-colors',
    // Sugli schermi bassi, come quelli dei portatili, le voci si stringono un po'
    '[@media(max-height:800px)]:size-10',
    active
      ? 'bg-white text-notte'
      : 'text-neutral-400 hover:bg-white/10 hover:text-white',
  ].join(' ')
}

/** L'etichetta accanto all'icona: compare col mouse e con Tab, ed è il nome del link */
function Tooltip({ children }: { children: string }) {
  return (
    <span
      className={[
        'pointer-events-none absolute top-1/2 left-[3.875rem] z-10 -translate-y-1/2 rounded-lg bg-white px-2.5 py-1.5',
        'text-notte text-xs font-semibold whitespace-nowrap opacity-0 transition-opacity',
        'group-hover:opacity-100 group-focus-visible:opacity-100',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

/** Le iniziali del nome, per l'avatar: "Matteo Le Pera" diventa "ML" */
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

/**
 * La barra a pillola dell'area admin, dal desktop: la sorella verticale del dock del sito.
 */
export function AdminRail() {
  const { data: user } = useCurrentUser()

  if (!user) {
    return null
  }

  return (
    <nav
      aria-label="Area staff"
      className="sticky top-0 hidden h-dvh shrink-0 p-4 lg:block"
    >
      <div className="border-linea bg-ombra flex h-full w-[4.5rem] flex-col items-center rounded-[2.5rem] border py-[1.125rem]">
        <Link
          to="/"
          aria-label="Ferrary, vai al sito"
          className="border-rosso mb-[1.125rem] flex size-12 shrink-0 items-center justify-center rounded-full border shadow-[0_0_22px_rgb(212_0_0/0.35)] [@media(max-height:800px)]:mb-3"
        >
          <img src={monogram} alt="" className="h-5 w-auto" />
        </Link>

        <ul className="senza-barra flex min-h-0 flex-col gap-1.5 overflow-y-auto [@media(max-height:800px)]:gap-1">
          {navFor(user.role).map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => itemClass(isActive)}
              >
                <Icon path={item.icon} />
                <Tooltip>{item.label}</Tooltip>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex shrink-0 flex-col items-center gap-2.5 pt-2.5">
          <LogoutButton className={itemClass()}>
            <Icon path={logoutIcon} />
            <Tooltip>Esci</Tooltip>
          </LogoutButton>

          <span
            role="img"
            aria-label={`${user.name}, ${roleLabels[user.role]}`}
            title={`${user.name} · ${roleLabels[user.role]}`}
            className="bg-rosso font-display flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold [@media(max-height:800px)]:size-10"
          >
            {initials(user.name)}
          </span>
        </div>
      </div>
    </nav>
  )
}
