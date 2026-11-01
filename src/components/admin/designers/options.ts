import type { Option } from '@/components/admin/versions/options'
import type { DesignerRole, DesignerType } from '@/types/admin'

export const designerTypes: Option<DesignerType>[] = [
  { value: 'studio', label: 'Studio' },
  { value: 'persona', label: 'Persona' },
]

/** Il ruolo nel collegamento con una versione: servirà nel commit dei collegamenti */
export const designerRoles: Option<DesignerRole>[] = [
  { value: 'design', label: 'Design' },
  { value: 'carrozzeria', label: 'Carrozzeria' },
]
