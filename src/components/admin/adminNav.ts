import type { UserRole } from '@/types/auth'

export type AdminNavItem = {
  to: string
  label: string
  /** Il tracciato SVG dell'icona */
  icon: string
  /** Attiva solo sull'indirizzo esatto: serve al pannello, che è l'inizio di tutti gli altri */
  end?: boolean
  /** I ruoli che vedono la voce; se manca, la vedono tutti */
  roles?: UserRole[]
}

/** Le sezioni dell'area admin, nell'ordine della barra */
export const adminNav: AdminNavItem[] = [
  {
    to: '/admin',
    label: 'Pannello',
    icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    end: true,
  },
  {
    to: '/admin/modelli',
    label: 'Modelli',
    icon: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  },
  { to: '/admin/famiglie', label: 'Famiglie', icon: 'M3 7h6l2 2h10v10H3z' },
  {
    to: '/admin/motori',
    label: 'Motori',
    icon: 'M4 16a8 8 0 1 1 16 0M12 16l4-5',
  },
  {
    to: '/admin/designer',
    label: 'Designer',
    icon: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
  },
  {
    to: '/admin/piloti',
    label: 'Piloti',
    icon: 'M5 19v-8a7 7 0 0 1 14 0v8zM5 14h14',
  },
  {
    to: '/admin/staff',
    label: 'Staff',
    icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6',
    roles: ['master', 'admin'],
  },
  {
    to: '/admin/registro',
    label: 'Registro attività',
    icon: 'M3 12h4l3-8 4 16 3-8h4',
    roles: ['master', 'admin'],
  },
  {
    to: '/admin/cestino',
    label: 'Cestino',
    icon: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  },
]

/** Il tracciato dell'icona per uscire */
export const logoutIcon = 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10'

/** Le voci che un ruolo può vedere */
export function navFor(role: UserRole) {
  return adminNav.filter((item) => !item.roles || item.roles.includes(role))
}

/** Il nome dei ruoli, come lo legge lo staff */
export const roleLabels: Record<UserRole, string> = {
  master: 'Master',
  admin: 'Admin',
  moderator: 'Moderatore',
}
