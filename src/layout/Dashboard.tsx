import { refreshMockPositions } from '@/services/mock-tickets'
import { useNotifications } from '@/hooks/use-notifications'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { logoutDemo, roleLabels } from '@/data/access-profiles'

import { useSessionUser } from '@/hooks/use-session-user'

const adminItems = [
  { label: 'Dashboard', symbol: '◫', path: '/dashboard' },
  { label: 'Ranking', symbol: '☆', path: '/ranking' },
  { label: 'Chamados', symbol: '▤', path: '/chamados' },
  { label: 'Novo chamado', symbol: '+', path: '/novo-chamado' },
  { label: 'Mapa dos técnicos', symbol: '◎', path: '/mapa-tecnicos' },
  { label: 'Técnicos', symbol: '♧', path: '/tecnicos' },
]

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSessionUser()
  const { notices, readIds } = useNotifications()
  const unreadCount = notices.filter(notice => notice.recipientId === user?.id && !readIds.includes(notice.id)).length
  const [positionError, setPositionError] = useState('')
  useEffect(() => {
    const refresh = () => { void refreshMockPositions().then(() => setPositionError('')).catch(cause => setPositionError(cause instanceof Error ? cause.message : 'Falha ao atualizar posições simuladas.')) }
    refresh(); const timer = window.setInterval(refresh, 60_000)
    return () => window.clearInterval(timer)
  }, [])
  if (!user) return null
  const items: { label: string; symbol: string; path?: string }[] = [
    ...(user.role === 'administrador' ? adminItems : user.role === 'usuario'
      ? [{ label: 'Meus chamados', symbol: '▤', path: '/meus-chamados' }, { label: 'Novo chamado', symbol: '+', path: user.authSource === 'api' ? undefined : '/novo-chamado' }]
      : [{ label: 'Dashboard', symbol: '◫', path: '/dashboard-tecnico' }, { label: 'Minhas missões', symbol: '▤', path: '/minhas-missoes' }, { label: 'Ranking', symbol: '☆', path: '/ranking' }]),
    ...(user.authSource === 'api' ? [] : [{ label: 'Notificações', symbol: '♧', path: '/notificacoes' }]),
    { label: 'Meu perfil', symbol: '○', path: '/perfil' },
  ]
  const pageTitle = items.find(item => item.path === location.pathname)?.label ?? 'Área de trabalho'
  const initials = user.name.split(' ').slice(0, 2).map(word => word[0]).join('')
  function handleLogout() { logoutDemo(); navigate('/login', { replace: true }) }
  return (
    <div className="min-h-screen bg-[#f7f9f8] text-slate-900">
      <a href="#dashboard-content" className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:fixed">Ir para o conteúdo</a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-24 items-center gap-3 px-6"><span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103c32] font-bold text-emerald-200">M</span><div><p className="text-lg font-semibold tracking-tight">Missão SJP</p><p className="text-xs text-slate-500">Gestão pública em movimento</p></div></div>
        <p className="px-6 pb-3 pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Área de trabalho</p>
        <nav aria-label="Navegação principal" className="space-y-1 px-3">
          {items.map(item => item.path ? <Button key={item.label} asChild variant="ghost" className={`h-11 w-full justify-start px-3 ${location.pathname === item.path ? 'bg-emerald-50 text-[#103c32] hover:bg-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}><NavLink to={item.path} end><span aria-hidden="true" className="w-5 text-lg">{item.symbol}</span>{item.label}</NavLink></Button> : <Button key={item.label} variant="ghost" disabled className="h-11 w-full justify-start px-3 disabled:opacity-60"><span aria-hidden="true" className="w-5 text-lg">{item.symbol}</span>{item.label}<span className="ml-auto text-[9px] font-normal">Em breve</span></Button>)}
        </nav>
        <div className="mx-4 mt-auto rounded-xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-sm font-semibold text-[#103c32]">Cada missão importa.</p><p className="mt-2 text-xs leading-5 text-slate-600">Conectando pessoas para melhorar os serviços da nossa cidade.</p></div>
        <div className="mt-4 border-t border-slate-100 p-4"><p className="text-xs text-slate-500">Prefeitura de São José dos Pinhais</p><Button variant="ghost" onClick={handleLogout} className="mt-2 w-full justify-start text-slate-600">← Sair da plataforma</Button></div>
      </aside>
      <div className="min-w-0 lg:pl-64">
        <header className="border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="flex min-h-20 items-center justify-between gap-4">
            <div className="flex items-center gap-3"><Button variant="outline" size="icon" className="lg:hidden" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}><span aria-hidden="true">{menuOpen ? '×' : '☰'}</span></Button><div><p className="text-sm font-medium">{pageTitle}</p><p className="mt-0.5 text-xs text-slate-500">Seu trabalho, conectado.</p></div></div>
            <div className="flex items-center gap-3">{user.authSource !== 'api' && <Button asChild variant="outline" size="sm"><NavLink to="/notificacoes" aria-label={`Notificações: ${unreadCount} não lidas`}>Avisos {unreadCount > 0 && <span className="ml-1 rounded-full bg-emerald-700 px-2 py-0.5 text-xs text-white">{unreadCount}</span>}</NavLink></Button>}<span className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-900 sm:block">{user.authSource === 'api' ? 'Conta conectada' : 'Demonstração'}</span><span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-[#103c32]">{initials}</span><div className="hidden sm:block"><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-slate-500">{roleLabels[user.role]}</p></div></div>
          </div>
          {menuOpen && <nav id="mobile-navigation" aria-label="Navegação principal mobile" className="grid gap-1 border-t py-3 lg:hidden">{items.map(item => item.path ? <Button key={item.label} asChild variant={location.pathname === item.path ? "secondary" : "ghost"} className="justify-start"><NavLink to={item.path} onClick={() => setMenuOpen(false)}>{item.label}</NavLink></Button> : <Button key={item.label} disabled variant="ghost" className="justify-start">{item.label}<span className="ml-auto text-xs">Em breve</span></Button>)}<Button variant="outline" onClick={handleLogout}>Sair da plataforma</Button></nav>}
        </header>
        <main id="dashboard-content" tabIndex={-1} className="mx-auto max-w-[1500px] p-5 outline-none sm:p-8">{positionError && <p role="alert" className="mb-4 text-sm text-rose-800">{positionError}</p>}<Outlet /></main>
      </div>
    </div>
  )
}
