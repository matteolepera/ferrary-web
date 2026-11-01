import {
  assignableRoles,
  canManage,
  canTransferMaster,
} from '@/components/admin/staff/permissions'
import type { User } from '@/types/auth'

const person = (id: number, role: User['role']): User => ({
  id,
  name: `Persona ${id}`,
  email: `${id}@ferrary.test`,
  role,
})

test('rispetta la gerarchia dello staff, come la policy del backend', () => {
  const master = person(1, 'master')
  const admin = person(2, 'admin')
  const otherAdmin = person(3, 'admin')
  const moderator = person(4, 'moderator')

  expect(canManage(master, admin)).toBe(true)
  expect(canManage(master, master)).toBe(false)
  expect(canManage(admin, moderator)).toBe(true)
  expect(canManage(admin, otherAdmin)).toBe(false)
  expect(canManage(moderator, moderator)).toBe(false)

  expect(assignableRoles(master)).toEqual(['admin', 'moderator'])
  expect(assignableRoles(admin)).toEqual(['moderator'])

  expect(canTransferMaster(master, admin)).toBe(true)
  expect(canTransferMaster(admin, moderator)).toBe(false)
})
