/** I ruoli dello staff, gli stessi dell'enum UserRole del backend */
export type UserRole = 'master' | 'admin' | 'moderator'

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
}

export type Credentials = {
  email: string
  password: string
}
