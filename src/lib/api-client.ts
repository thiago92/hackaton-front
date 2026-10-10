import axios from 'axios'
import { apiUrl } from '@/lib/auth-config'
import { clearApiSession, getApiSession } from '@/lib/auth-session'

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})
api.interceptors.request.use(config => {
  const login = config.url === '/api/auth/web/login'
  const session = login ? null : getApiSession()
  if (session) config.headers.set('Authorization', 'Bearer ' + session.accessToken)
  return config
})
api.interceptors.response.use(response => response, error => {
  // Credencial inválida no login não é expiração de uma sessão autenticada.
  if (axios.isAxiosError(error) && error.response?.status === 401
    && error.config?.url !== '/api/auth/web/login') clearApiSession()
  return Promise.reject(error)
})
