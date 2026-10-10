import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginDemo, roleHome } from '@/data/access-profiles'
import { useSessionUser } from '@/hooks/use-session-user'
import { authMode } from '@/lib/auth-config'
import { loginUser } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const pending = useRef(false)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const form = new FormData(event.currentTarget)
    pending.current = true
    setSubmitting(true)
    setMessage('')
    try {
      const email = String(form.get('email') ?? ''), password = String(form.get('password') ?? '')
      const user = authMode === 'demo' ? loginDemo(email, password) : await loginUser(email, password).then(() => ({ role: 'usuario' as const }))
      if (!user) { setMessage('E-mail ou senha de demonstração incorretos.'); return }
      navigate(roleHome[user.role], { replace: true })
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.') }
    finally { pending.current = false; setSubmitting(false) }
  }
  const currentUser = useSessionUser()
  if (currentUser) return <Navigate to={roleHome[currentUser.role]} replace />
  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-900 selection:bg-emerald-200">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative isolate hidden overflow-hidden bg-[#103c32] p-12 text-white lg:flex lg:flex-col xl:p-16" aria-label="Sobre a plataforma">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-56 -right-48 h-[680px] w-[680px] rounded-full border border-white/10 bg-white/[0.02]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -right-28 h-[520px] w-[520px] rounded-full border border-white/10" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300 text-xl font-bold text-[#103c32]" aria-hidden="true">M</span>
            <div><p className="text-xl font-semibold tracking-tight">Missão SJP</p><p className="text-xs text-emerald-100/80">Gestão pública em movimento</p></div>
          </div>
          <div className="relative my-auto max-w-lg py-16">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-emerald-200">Cada entrega faz a diferença</p>
            <h1 className="text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">Conecte pessoas.<br />Resolva desafios.<br /><span className="text-emerald-300">Transforme serviços.</span></h1>
            <p className="mt-7 max-w-sm text-base leading-7 text-emerald-50/75">Um só lugar para organizar chamados, acompanhar missões e cuidar de quem precisa do serviço público.</p>
            <div className="mt-10 space-y-4 border-t border-white/15 pt-7">
              {['Chamados organizados em um só lugar', 'Equipes conectadas durante a execução', 'Cada contribuição reconhecida'].map((text) => (
                <div key={text} className="flex items-center gap-3 text-sm text-emerald-50/90"><span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">✓</span>{text}</div>
              ))}
            </div>
          </div>
          <p className="relative text-xs text-emerald-100/65">São José dos Pinhais · Inovação a serviço das pessoas</p>
        </aside>
        <section className="flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:px-16">
          <div className="flex items-center gap-2.5 lg:justify-end">
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#103c32] text-sm font-bold text-emerald-200 lg:hidden">M</span>
            <p className="text-sm font-medium text-slate-600"><span className="lg:hidden">Missão SJP · </span>Portal do servidor</p>
          </div>
          <div className="mx-auto flex w-full max-w-[420px] flex-1 items-center py-12">
            <div className="w-full">
              <div className="space-y-3 pb-9">
                <div aria-hidden="true" className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-[#103c32]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></svg>
                </div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Bem-vindo de volta</h2>
                <p className="text-base leading-6 text-slate-600">Acesse sua conta para acompanhar seus chamados e missões.</p>
              </div>
              {authMode === 'demo' && <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Modo demonstração: entre com uma das contas de usuário, técnico ou administrador listadas em perfis-de-acesso.md.</p>}
              <form onSubmit={handleSubmit} aria-busy={submitting} className="space-y-6">
                <div className="space-y-2"><Label htmlFor="email">E-mail institucional</Label><Input disabled={submitting} id="email" name="email" type="email" autoComplete="username" placeholder="voce@sjp.pr.gov.br" required maxLength={254} className="h-12 rounded-lg bg-white px-4 focus-visible:ring-emerald-700" onChange={() => setMessage('')} /></div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative"><Input disabled={submitting} maxLength={200} id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Digite sua senha" required className="h-12 rounded-lg bg-white pl-4 pr-24 focus-visible:ring-emerald-700" onChange={() => setMessage('')} /><Button type="button" variant="ghost" size="sm" aria-controls="password" aria-pressed={showPassword} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1.5 text-xs text-slate-600">{showPassword ? 'Ocultar' : 'Mostrar'}</Button></div>
                </div>
                <Button type="submit" disabled={submitting} className="h-12 w-full rounded-lg bg-[#103c32] text-sm font-semibold text-white hover:bg-[#185443] focus-visible:ring-emerald-700">{submitting ? 'Entrando…' : 'Entrar na plataforma'} <span aria-hidden="true" className="ml-3">→</span></Button>
                <p role="status" aria-live="polite" className={message ? 'rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950' : 'sr-only'}>{message}</p>
              </form>
              <div className="mt-8 border-t border-slate-200 pt-6 text-center"><p className="text-sm text-slate-600">Precisa de ajuda para acessar?</p><p className="mt-1 text-sm font-medium text-[#103c32]">Entre em contato com o suporte de TI.</p></div>
            </div>
          </div>
          <footer className="text-center text-xs leading-6 text-slate-500">Missão SJP · Prefeitura de São José dos Pinhais<br />Acesso exclusivo a usuários autorizados.</footer>
        </section>
      </div>
    </main>
  )
}
