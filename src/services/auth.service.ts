import axios from 'axios'
import { api } from '@/lib/api-client'
import { prefeituraId } from '@/lib/auth-config'
import { saveApiSession, validUserLogin } from '@/lib/auth-session'
import type { UserLoginRequest, UserLoginResponse } from '@/interface/auth.interface'

export async function loginUser(email: string, senha: string): Promise<UserLoginResponse> {
  const payload: UserLoginRequest = { email: email.trim().toLowerCase(), senha, prefeituraId }
  try {
    const { data } = await api.post<unknown>('/api/auth/web/login', payload)
    if (data && typeof data === 'object' && 'papel' in data && data.papel !== 'Usuario')
      throw new Error('Este acesso é exclusivo para usuários da prefeitura. Utilize o canal do seu perfil.')
    if (!validUserLogin(data, prefeituraId)) throw new Error('Não foi possível validar a resposta de acesso. Tente novamente.')
    saveApiSession(data)
    return data
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error
    if (error.response?.status === 401) throw new Error('E-mail ou senha incorretos.')
    if (error.response?.status === 403) throw new Error('Seu perfil não tem acesso ao portal do usuário.')
    if (error.response?.status === 503) throw new Error('O serviço de acesso está temporariamente indisponível. Tente novamente mais tarde.')
    if (error.response?.status === 400) throw new Error('Confira o e-mail e a senha informados.')
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') throw new Error('O serviço demorou para responder. Tente novamente.')
    if (!error.response) throw new Error('Não foi possível conectar ao serviço de acesso. Verifique sua conexão e tente novamente.')
    throw new Error('Não foi possível entrar agora. Tente novamente mais tarde.')
  }
}
