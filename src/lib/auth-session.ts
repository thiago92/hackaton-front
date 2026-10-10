import type { ApiSession, UserLoginResponse } from '@/interface/auth.interface'

export const apiSessionKey = 'missao-sjp.api-session.v1'
export const authSessionEvent = 'missao-sjp:auth-session'
const demoSessionKey = 'missao-sjp.demo-session.v1'
const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const emptyGuid = '00000000-0000-0000-0000-000000000000'
export function validUserLogin(value: unknown, tenant?: string): value is UserLoginResponse {
  if (!value || typeof value !== 'object') return false
  const data = value as UserLoginResponse
  return typeof data.accessToken === 'string' && data.accessToken.length > 0
    && typeof data.usuarioId === 'string' && guid.test(data.usuarioId) && data.usuarioId !== emptyGuid
    && typeof data.prefeituraId === 'string' && guid.test(data.prefeituraId) && data.prefeituraId !== emptyGuid
    && (!tenant || data.prefeituraId.toLowerCase() === tenant.toLowerCase())
    && typeof data.nome === 'string' && Boolean(data.nome.trim())
    && typeof data.email === 'string' && Boolean(data.email.trim())
    && data.papel === 'Usuario' && data.tecnicoId === null
    && typeof data.expiraEm === 'string' && Date.parse(data.expiraEm) > Date.now()
}
function notify() { window.dispatchEvent(new Event(authSessionEvent)) }
export function getApiSession(): ApiSession | null {
  try {
    const raw = window.sessionStorage.getItem(apiSessionKey)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    if (!validUserLogin(data) || (data as ApiSession).source !== 'api') {
      window.sessionStorage.removeItem(apiSessionKey)
      return null
    }
    return data as ApiSession
  } catch { return null }
}
export function saveApiSession(response: UserLoginResponse) {
  if (!validUserLogin(response)) throw new Error('A API retornou uma sessão inválida. Tente novamente.')
  try {
    window.sessionStorage.removeItem(demoSessionKey)
    window.sessionStorage.setItem(apiSessionKey, JSON.stringify({ ...response, source: 'api' }))
  } catch { throw new Error('Não foi possível salvar a sessão. Habilite o armazenamento do navegador e tente novamente.') }
  notify()
}
export function clearApiSession() {
  try { window.sessionStorage.removeItem(apiSessionKey) } finally { notify() }
}
