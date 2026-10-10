import type { Priority, Ticket } from '@/data/tickets'

export const priorityPoints: Record<Priority, number> = { Baixa: 10, Normal: 20, Alta: 40 }
export const scoringRule = 'prioridade-v1' as const
export type ScoreState = 'provisorio' | 'confirmado' | 'em_revisao'
export interface ScoreRevision {
  at: string
  actorId: string
  actor: string
  state: ScoreState
  technicianId: string
  points: number
  reason: string
}
export interface TicketScore {
  technicianId: string
  technicianName: string
  points: number
  priority: Priority
  rule: typeof scoringRule
  completedAt: string
  confirmedAt?: string
  state: ScoreState
  revisions: ScoreRevision[]
}
export function validTicketScore(value: unknown): value is TicketScore {
  if (!value || typeof value !== 'object') return false
  const s = value as TicketScore
  const states = ['provisorio', 'confirmado', 'em_revisao']
  return typeof s.technicianId === 'string' && typeof s.technicianName === 'string'
    && s.rule === scoringRule && Object.prototype.hasOwnProperty.call(priorityPoints, s.priority) && s.points === priorityPoints[s.priority]
    && Number.isFinite(Date.parse(s.completedAt)) && states.includes(s.state)
    && (s.confirmedAt === undefined || Number.isFinite(Date.parse(s.confirmedAt)))
    && (s.state !== 'confirmado' || Boolean(s.confirmedAt))
    && Array.isArray(s.revisions) && s.revisions.every(r => r && Number.isFinite(Date.parse(r.at)) && typeof r.actorId === 'string' && typeof r.actor === 'string' && states.includes(r.state) && typeof r.technicianId === 'string' && Number.isSafeInteger(r.points) && r.points >= 0 && typeof r.reason === 'string')
}
// Reconcilia somente exemplos/atendimentos antigos, com conclusão registrada.
export function withLegacyScore(ticket: Ticket): Ticket {
  if (ticket.score || !ticket.technicianId || !ticket.technician) return ticket
  const completion = ticket.completedAt ?? [...ticket.history].reverse().find(e => e.text.includes('Serviço concluído'))?.at
  if (!completion) return ticket
  const confirmedAt = ticket.resolvedAt ?? [...ticket.history].reverse().find(e => e.text.includes('Resolução confirmada'))?.at
  const state: ScoreState = ticket.executionState === 'Resolvido' && confirmedAt ? 'confirmado' : ticket.executionState === 'Aguardando validação' ? 'provisorio' : 'em_revisao'
  const score: TicketScore = { technicianId: ticket.technicianId, technicianName: ticket.technician, points: priorityPoints[ticket.priority], priority: ticket.priority, rule: scoringRule, completedAt: completion, ...(state === 'confirmado' ? { confirmedAt } : {}), state, revisions: [{ at: completion, actorId: 'migracao-demo', actor: 'Migração demonstrativa', state, technicianId: ticket.technicianId, points: priorityPoints[ticket.priority], reason: 'Crédito reconstruído do histórico antigo com a regra de demonstração; autoria atribuída ao responsável registrado.' }] }
  return { ...ticket, score }
}
export function concludeScore(ticket: Ticket, actor: { id: string; name: string }, at: string): Ticket {
  const score: TicketScore = { technicianId: actor.id, technicianName: actor.name, points: priorityPoints[ticket.priority], priority: ticket.priority, rule: scoringRule, completedAt: at, state: 'provisorio', revisions: [...(ticket.score?.revisions ?? []), { at, actorId: actor.id, actor: actor.name, state: 'provisorio', technicianId: actor.id, points: priorityPoints[ticket.priority], reason: ticket.score ? 'Nova entrega substitui o crédito em revisão, sem somar novamente o mesmo chamado.' : 'Serviço concluído; crédito aguardando confirmação do solicitante.' }] }
  return { ...ticket, score }
}
export function reviewScore(ticket: Ticket, actor: { id: string; name: string }, at: string, state: 'confirmado' | 'em_revisao'): Ticket {
  const previous = withLegacyScore(ticket).score
  if (!previous) return ticket
  const { confirmedAt: oldConfirmedAt, ...rest } = previous
  void oldConfirmedAt
  return { ...ticket, score: { ...rest, state, ...(state === 'confirmado' ? { confirmedAt: at } : {}), revisions: [...previous.revisions, { at, actorId: actor.id, actor: actor.name, state, technicianId: previous.technicianId, points: previous.points, reason: state === 'confirmado' ? 'Entrega confirmada pelo solicitante; crédito definitivo.' : 'Solicitante informou pendência; crédito em revisão, fora dos saldos provisório e confirmado.' }] } }
}
export function scoreMonth(at: string): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit' }).formatToParts(new Date(at))
  return parts.find(p => p.type === 'year')!.value + '-' + parts.find(p => p.type === 'month')!.value
}
