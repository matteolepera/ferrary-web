import { createBrowserRouter, type RouteObject } from 'react-router'
import { PageLoader } from '@/components/layout/PageLoader'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { HomePage } from '@/pages/public/HomePage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { RequireStaff } from './components/admin/RequireStaff'

/**
 * Mappa del sito. La home e i layout sono nel file principale;
 * le altre pagine si scaricano solo quando servono, con lazy.
 */
export const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorPage />,
    // Mostrato solo al primo caricamento, mentre arriva il file della pagina
    hydrateFallbackElement: <PageLoader />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'modelli',
        lazy: async () => ({
          Component: (await import('@/pages/public/ArchivePage')).ArchivePage,
        }),
      },
      {
        path: 'modelli/:slug',
        lazy: async () => ({
          Component: (await import('@/pages/public/ModelPage')).ModelPage,
        }),
      },
      {
        path: 'storia',
        lazy: async () => ({
          Component: (await import('@/pages/public/HistoryPage')).HistoryPage,
        }),
      },
      {
        path: 'motori',
        lazy: async () => ({
          Component: (await import('@/pages/public/catalogs/EnginesPage'))
            .EnginesPage,
        }),
      },
      {
        path: 'motori/:id',
        lazy: async () => ({
          Component: (await import('@/pages/public/catalogs/EnginePage'))
            .EnginePage,
        }),
      },
      {
        path: 'designer',
        lazy: async () => ({
          Component: (await import('@/pages/public/catalogs/DesignersPage'))
            .DesignersPage,
        }),
      },
      {
        path: 'designer/:slug',
        lazy: async () => ({
          Component: (await import('@/pages/public/catalogs/DesignerPage'))
            .DesignerPage,
        }),
      },
      {
        path: 'piloti',
        lazy: async () => ({
          Component: (await import('@/pages/public/catalogs/DriversPage'))
            .DriversPage,
        }),
      },
      {
        path: 'piloti/:slug',
        lazy: async () => ({
          Component: (await import('@/pages/public/catalogs/DriverPage'))
            .DriverPage,
        }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    // Fuori dal layout dell'admin: chi non è collegato non deve vederne la struttura
    path: 'admin/login',
    hydrateFallbackElement: <PageLoader />,
    lazy: async () => ({
      Component: (await import('@/pages/admin/LoginPage')).LoginPage,
    }),
  },
  {
    path: 'admin',
    element: (
      <RequireStaff>
        <AdminLayout />
      </RequireStaff>
    ),
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <PageLoader />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/pages/admin/DashboardPage'))
            .DashboardPage,
        }),
      },
      {
        path: 'modelli',
        lazy: async () => ({
          Component: (await import('@/pages/admin/ModelsPage')).ModelsPage,
        }),
      },
      { path: '*', element: <NotFoundPage backTo="/admin" /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
