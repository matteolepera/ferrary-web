import type { User, UserRole } from '@/types/auth'

/**
 * Le stesse regole della UserPolicy del backend, per mostrare solo le azioni possibili.
 * Il permesso vero lo decide comunque il backend, a ogni richiesta.
 */

/** Chi può essere gestito da chi: il Master tutti tranne se stesso, l'Admin solo i moderatori */
export function canManage(me: User, target: User) {
  if (me.role === 'master') return target.role !== 'master'
  if (me.role === 'admin') return target.role === 'moderator'
  return false
}

/** I ruoli che si possono assegnare: mai quello di Master, che si passa e non si assegna */
export function assignableRoles(me: User): UserRole[] {
  if (me.role === 'master') return ['admin', 'moderator']
  if (me.role === 'admin') return ['moderator']
  return []
}

/** Solo il Master può passare il suo ruolo, e non a se stesso */
export function canTransferMaster(me: User, target: User) {
  return me.role === 'master' && me.id !== target.id
}
