import { createBrowserRouter, type RouteObject } from 'react-router'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ArchivePage } from '@/pages/public/ArchivePage'
import { HomePage } from '@/pages/public/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

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
