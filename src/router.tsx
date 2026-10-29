import { createBrowserRouter, type RouteObject } from 'react-router'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ArchivePage } from '@/pages/public/ArchivePage'
import { HomePage } from '@/pages/public/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ModelPage } from '@/pages/public/ModelPage'
import { DesignerPage } from '@/pages/public/catalogs/DesignerPage'
import { DesignersPage } from '@/pages/public/catalogs/DesignersPage'
import { DriverPage } from '@/pages/public/catalogs/DriverPage'
import { DriversPage } from '@/pages/public/catalogs/DriversPage'
import { EnginePage } from '@/pages/public/catalogs/EnginePage'
import { EnginesPage } from '@/pages/public/catalogs/EnginesPage'
import { HistoryPage } from '@/pages/public/HistoryPage'

/**
 * Mappa del sito: ogni layout contiene le sue pagine.
 * Esportata a parte per poterla riusare nei test.
 */
export const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'modelli', element: <ArchivePage /> },
      { path: 'modelli/:slug', element: <ModelPage /> },
      { path: 'designer', element: <DesignersPage /> },
      { path: 'designer/:slug', element: <DesignerPage /> },
      { path: 'piloti', element: <DriversPage /> },
      { path: 'piloti/:slug', element: <DriverPage /> },
      { path: 'motori', element: <EnginesPage /> },
      { path: 'motori/:id', element: <EnginePage /> },
      { path: 'storia', element: <HistoryPage /> },
      // Qualsiasi altro indirizzo del sito pubblico
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      // Qualsiasi altro indirizzo sotto /admin
      { path: '*', element: <NotFoundPage backTo="/admin" /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
