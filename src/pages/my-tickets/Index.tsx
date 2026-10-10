import { useState } from 'react'
import { useTickets } from '@/hooks/use-tickets'
import { Button } from '@/components/ui/button'
import { Badge, Card } from '@/components/ui/dashboard'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import TicketDetails from '@/components/tickets/TicketDetails'
import { getDemoUser } from '@/data/access-profiles'
import { isAssignedTo } from '@/lib/ticket-execution'
import { statusClasses, ticketStatuses } from '@/data/tickets'

export default function MyTickets() {
  const user = getDemoUser()
  const { tickets: mockTickets, error } = useTickets()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [filter, setFilter] = useState('Todos')
  if (!user) return null
  if (user.authSource === 'api') return <div className="space-y-6"><h1 className="text-3xl font-semibold">Meus chamados</h1><Card className="space-y-3 p-6"><h2 className="text-lg font-semibold">Olá, {user.name}</h2><p className="text-sm text-slate-600">Sua conta está conectada. O acompanhamento de chamados será disponibilizado na próxima etapa.</p></Card></div>
  const technician = user.role === 'tecnico'
  // Filtro por nomes apenas para fixtures atuais; contratos futuros devem usar IDs.
  const allowed = mockTickets.filter(ticket => technician
    ? isAssignedTo(ticket, user) || (ticket.executionState === 'Aberto' && ((user.secretaries ?? [user.secretary]).includes(ticket.secretary) || Boolean(ticket.proximityInvitees?.includes(user.id))) && Boolean(user.callTypes?.includes(ticket.callType ?? ticket.team)))
    : (ticket.requesterId ? ticket.requesterId === user.id : ticket.requester === user.name))
  const filters = ['Todos', ...ticketStatuses]
  const tickets = allowed.filter(ticket => filter === 'Todos' || ticket.status === filter)
  const selected = allowed.find(ticket => ticket.id === selectedId)
  return <div className="space-y-6">{error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{error}</p>}<div><h1 className="text-3xl font-semibold">{technician ? 'Minhas missões' : 'Meus chamados'}</h1><p className="mt-2 text-sm text-slate-600">{technician ? 'Seus atendimentos e chamados disponíveis da sua secretaria.' : 'Acompanhe os atendimentos solicitados por você.'}</p></div><p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Dados fictícios. {technician ? 'Assuma e execute seus chamados pela ordem de serviço. Alterações ficam salvas neste navegador; GPS e push ainda não estão implementados.' : 'Seus chamados ficam salvos neste navegador. Abra a ordem de serviço para confirmar e avaliar a entrega, ou informar uma pendência.'}</p><div className="flex flex-wrap gap-2" aria-label="Filtrar atendimentos">{filters.map(value => <Button key={value} variant={filter === value ? 'secondary' : 'outline'} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</Button>)}</div><div className="grid gap-4 md:grid-cols-2">{tickets.map(ticket => <Card key={ticket.id} className="p-5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-slate-500">#{ticket.id}</span><Badge className={statusClasses[ticket.status]}>{ticket.status}</Badge></div><h2 className="mt-3 font-semibold">{ticket.title}</h2><p className="mt-2 text-sm text-slate-600">{ticket.location}</p><p className="mt-2 text-xs text-slate-500">Técnico: {ticket.technician ?? 'Sem atribuição'}</p><Button variant="outline" className="mt-4" onClick={() => setSelectedId(ticket.id)}>Ver ordem de serviço</Button></Card>)}</div>{tickets.length === 0 && <p role="status" className="rounded-lg border bg-white p-6 text-sm text-slate-500">Nenhum chamado nesta visualização.</p>}<Dialog open={selected !== undefined} onOpenChange={open => { if (!open) setSelectedId(null) }}><DialogContent className="max-w-6xl">{selected && <TicketDetails ticket={selected} />}</DialogContent></Dialog></div>
}