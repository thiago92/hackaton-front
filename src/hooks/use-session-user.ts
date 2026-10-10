import { useSyncExternalStore } from 'react'
import { getApiUser, getDemoUser } from '@/data/access-profiles'
import { authMode } from '@/lib/auth-config'
import { apiSessionKey, authSessionEvent, getApiSession } from '@/lib/auth-session'

function subscribe(listener: () => void) {
  window.addEventListener(authSessionEvent, listener)
  window.addEventListener('storage', listener)
  // Reavalia validade mesmo sem requisições ou interação do usuário.
  const timer = window.setInterval(listener, 1000)
  return () => {
    window.removeEventListener(authSessionEvent, listener)
    window.removeEventListener('storage', listener)
    window.clearInterval(timer)
  }
}
function snapshot() {
  try {
    if (authMode === 'api') return getApiSession() ? window.sessionStorage.getItem(apiSessionKey) : null
    return window.sessionStorage.getItem('missao-sjp.demo-session.v1')
  } catch { return null }
}
export function useSessionUser() {
  useSyncExternalStore(subscribe, snapshot, () => null)
  return authMode === 'api' ? getApiUser() : getDemoUser()
}
