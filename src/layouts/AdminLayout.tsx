import { NavLink, Outlet } from 'react-router'

/**
 * Cornice dell'area admin: barra laterale con le sezioni e contenuto a destra.
 */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      <aside className="w-60 border-r border-neutral-200 bg-white p-4">
        <p className="mb-6 text-lg font-bold">Ferrary Admin</p>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `rounded px-3 py-2 ${isActive ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'}`
            }
          >
            Pannello
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
