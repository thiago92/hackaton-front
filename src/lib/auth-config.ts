// Configuração pública da instalação; não contém credenciais ou chave JWT.
export const authMode = import.meta.env.VITE_AUTH_MODE === 'demo' ? 'demo' : 'api'
export const apiUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5286'
export const prefeituraId = import.meta.env.VITE_PREFEITURA_ID?.trim() || '00000000-0000-0000-0000-000000000001'
