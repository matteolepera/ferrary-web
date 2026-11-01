import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changeStaffRole,
  createStaff,
  deleteStaff,
  fetchStaff,
  transferMaster,
  updateStaff,
  type StaffPayload,
} from '@/api/admin'
import { currentUserKey } from '@/hooks/useAuth'
import type { UserRole } from '@/types/auth'

/**
 * Le persone dello staff, il Master per primo. Solo per Master e Admin: ai moderatori il backend risponde 403.
 */
export function useStaff() {
  return useQuery({
    queryKey: ['admin', 'staff'],
    queryFn: fetchStaff,
    // Lo staff cambia di rado
    staleTime: 5 * 60_000,
    // Un 403 non migliora riprovando
    retry: false,
  })
}

/**
 * Tutte le operazioni sullo staff. Dopo ognuna si aggiornano l'elenco e il pannello, che mostra lo staff.
 */
export function useStaffActions() {
  const queryClient = useQueryClient()

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
  }

  const create = useMutation({
    mutationFn: (payload: StaffPayload) => createStaff(payload),
    onSuccess: refresh,
  })

  const update = useMutation({
    mutationFn: ({
      id,
      ...changes
    }: { id: number } & Partial<Omit<StaffPayload, 'role'>>) =>
      updateStaff(id, changes),
    onSuccess: refresh,
  })

  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) =>
      changeStaffRole(id, role),
    onSuccess: refresh,
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteStaff(id),
    onSuccess: refresh,
  })

  const transfer = useMutation({
    mutationFn: (id: number) => transferMaster(id),
    onSuccess: () => {
      refresh()
      // Chi ha passato il ruolo ora è Admin: la barra e i permessi devono saperlo subito
      queryClient.invalidateQueries({ queryKey: currentUserKey })
    },
  })

  return { create, update, changeRole, remove, transfer }
}
