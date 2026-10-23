import { createBrowserRouter, type RouteObject } from 'react-router'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ArchivePage } from '@/pages/public/ArchivePage'
import { HomePage } from '@/pages/public/HomePage'

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
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
]

export const router = createBrowserRouter(routes)
