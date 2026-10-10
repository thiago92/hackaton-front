export interface UserLoginRequest { email: string; senha: string; prefeituraId: string }
export interface UserLoginResponse {
  accessToken: string
  expiraEm: string
  usuarioId: string
  nome: string
  email: string
  papel: 'Usuario'
  prefeituraId: string
  tecnicoId: null
}
export interface ApiSession extends UserLoginResponse { source: 'api' }
