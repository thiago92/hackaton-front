import { getApiSession, clearApiSession } from '@/lib/auth-session'
import { readTechnicians } from '@/data/technicians'
export type AccessRole = 'usuario' | 'tecnico' | 'administrador'
export interface DemoAccount {
  id: string
  name: string
  email: string
  password: string
  role: AccessRole
  secretary: string
  department: string
}
// Credenciais públicas e fictícias, exclusivas para demonstração no frontend.
export const demoAccounts: DemoAccount[] = [
  { id: 'usuario-demo', name: 'Ana Silva', email: 'usuario@demo.sjp', password: 'Usuario123!', role: 'usuario', secretary: 'Saúde', department: 'Departamento Regional de Saúde' },
  { id: 'tecnico-demo', name: 'Camila Santos', email: 'tecnico@demo.sjp', password: 'Tecnico123!', role: 'tecnico', secretary: 'Saúde', department: 'Suporte de TI' },
  { id: 'administrador-demo', name: 'Administrador Demo', email: 'admin@demo.sjp', password: 'Admin123!', role: 'administrador', secretary: 'Administração', department: 'Gestão de TI' },
]
export type DemoUser = Omit<DemoAccount, 'password'> & { secretaries?: string[]; callTypes?: string[]; authSource?: 'api' | 'demo'; prefeituraId?: string }
function availableAccounts(): (DemoAccount & { secretaries?: string[]; callTypes?: string[] })[] {
  const catalog = readTechnicians()
  return [...demoAccounts.filter(account => account.role !== 'tecnico'), ...(catalog.error ? [] : catalog.technicians.map(tech => ({ id: tech.id, name: tech.name, email: tech.email, password: tech.password, role: 'tecnico' as const, secretary: tech.secretaries[0], department: tech.callTypes.join(', '), secretaries: tech.secretaries, callTypes: tech.callTypes })))]
}
export const roleLabels: Record<AccessRole, string> = { usuario: 'Usuário da prefeitura', tecnico: 'Técnico', administrador: 'Administrador' }
export const roleHome: Record<AccessRole, string> = { usuario: '/meus-chamados', tecnico: '/dashboard-tecnico', administrador: '/dashboard' }
const sessionKey = 'missao-sjp.demo-session.v1'
export function getApiUser(): DemoUser | null {
  const session = getApiSession()
  return session ? { id: session.usuarioId, name: session.nome, email: session.email,
    role: 'usuario', secretary: '', department: '', authSource: 'api', prefeituraId: session.prefeituraId } : null
}
export function getDemoUser(): DemoUser | null {
  const apiUser = getApiUser()
  if (apiUser) return apiUser
  try {
    const id = window.sessionStorage.getItem(sessionKey)
    const account = availableAccounts().find(item => item.id === id)
    if (!account) return null
    return { id: account.id, name: account.name, email: account.email, role: account.role, secretary: account.secretary, department: account.department, secretaries: account.secretaries, callTypes: account.callTypes }
  } catch { return null }
}
export function loginDemo(email: string, password: string): DemoUser | null {
  const account = availableAccounts().find(item => item.email === email.trim().toLowerCase() && item.password === password)
  if (!account) return null
  // Falha de armazenamento é tratada pela tela de login, sem liberar rota.
  clearApiSession()
  window.sessionStorage.setItem(sessionKey, account.id)
  return getDemoUser()
}
export function logoutDemo() { window.sessionStorage.removeItem(sessionKey); clearApiSession() }