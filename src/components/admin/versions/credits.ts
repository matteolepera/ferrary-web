import type { AdminVersion, DesignerCredit, DriverCredit } from '@/types/admin'

/** I designer della versione, con il ruolo dove il backend lo mette: in role o in pivot.role */
export function designerCredits(version: AdminVersion): DesignerCredit[] {
  return (version.designers ?? []).flatMap((designer) => {
    const role = designer.role ?? designer.pivot?.role

    return role ? [{ id: designer.id, name: designer.name, role }] : []
  })
}

/** I piloti della versione, con il nome completo come il backend lo dà: intero, o in due parti */
export function driverCredits(version: AdminVersion): DriverCredit[] {
  return (version.drivers ?? []).map((driver) => ({
    id: driver.id,
    name:
      driver.name ??
      `${driver.first_name ?? ''} ${driver.last_name ?? ''}`.trim(),
  }))
}
