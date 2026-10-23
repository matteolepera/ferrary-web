import { Link, NavLink, Outlet } from 'react-router'

/**
 * Cornice del sito pubblico: intestazione, contenuto e piè di pagina.
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <header className="border-b border-neutral-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold">
            Ferrary
          </Link>
          <NavLink
            to="/modelli"
            className={({ isActive }) =>
              isActive ? 'font-semibold' : 'text-neutral-600'
            }
          >
            Archivio
          </NavLink>
        </nav>
      </header>

      {/* Qui React Router inserisce la pagina corrente */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500">
        Ferrary · Archivio delle Ferrari
      </footer>
    </div>
  )
}
