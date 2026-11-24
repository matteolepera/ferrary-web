import {
  ClipboardTextIcon,
  EngineIcon,
  GarageIcon,
  PenNibIcon,
  SquaresFourIcon,
  StackSimpleIcon,
  SteeringWheelIcon,
  TrashIcon,
  UsersThreeIcon,
  type Icon,
} from '@phosphor-icons/react'
import type { UserRole } from '@/types/auth'

export type AdminNavItem = {
  to: string
  label: string
  /** L'icona di Phosphor: sottile di solito, piena sulla voce attiva */
  icon: Icon
  /** Attiva solo sull'indirizzo esatto: serve al pannello, che è l'inizio di tutti gli altri */
  end?: boolean
  /** I ruoli che vedono la voce; se manca, la vedono tutti */
  roles?: UserRole[]
}

/** Le sezioni dell'area admin, nell'ordine della barra */
export const adminNav: AdminNavItem[] = [
  { to: '/admin', label: 'Pannello', icon: SquaresFourIcon, end: true },
  // Il garage, come "Archivio" nel sito: è lo stesso catalogo, visto da dentro
  { to: '/admin/modelli', label: 'Modelli', icon: GarageIcon },
  { to: '/admin/famiglie', label: 'Famiglie', icon: StackSimpleIcon },
  { to: '/admin/motori', label: 'Motori', icon: EngineIcon },
  { to: '/admin/designer', label: 'Designer', icon: PenNibIcon },
  { to: '/admin/piloti', label: 'Piloti', icon: SteeringWheelIcon },
  {
    to: '/admin/staff',
    label: 'Staff',
    icon: UsersThreeIcon,
    roles: ['master', 'admin'],
  },
  {
    to: '/admin/registro',
    label: 'Registro attività',
    icon: ClipboardTextIcon,
    roles: ['master', 'admin'],
  },
  {
    to: '/admin/cestino',
    label: 'Cestino',
    icon: TrashIcon,
    roles: ['master', 'admin'],
  },
]

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
