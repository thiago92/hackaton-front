import { patentProgress } from '@/lib/ranking-patents'
import { getDemoUser } from '@/data/access-profiles'
import type { Technician } from '@/data/technicians'
import type { Ticket } from '@/data/tickets'
import { scoreMonth } from '@/lib/ticket-scoring'

export interface RankingRow { id: string; name: string; confirmed: number; provisional: number; review: number; deliveries: number; position: number; lifetimeConfirmed: number; classification: ReturnType<typeof patentProgress> }
export function getRankingView(tickets: Ticket[], technicians: Technician[], month: string, filter = '') {
  const actor = getDemoUser()
  if (!actor || actor.role === 'usuario') throw new Error('Seu perfil não tem acesso ao ranking.')
  if (actor.role === 'tecnico' && filter && filter !== actor.id) throw new Error('Você pode consultar somente o detalhamento dos seus pontos.')
  if (month !== 'todos' && !/^\d{4}-\d{2}$/.test(month)) throw new Error('Período inválido.')
  const scored = tickets.filter(t => t.score && (month === 'todos' || scoreMonth(t.score.completedAt) === month))
  const people = new Map(technicians.map(t => [t.id, t.name]))
  scored.forEach(t => { if (!people.has(t.score!.technicianId)) people.set(t.score!.technicianId, t.score!.technicianName) })
  const rows: RankingRow[] = [...people].map(([id, name]) => {
    const own = scored.filter(t => t.score!.technicianId === id)
    const sum = (state: string) => own.filter(t => t.score!.state === state).reduce((total,t) => total + t.score!.points, 0)
    const lifetimeConfirmed = tickets.filter(t => t.score?.technicianId === id && t.score.state === 'confirmado').reduce((total,t) => total + t.score!.points, 0)
    return { id, name, lifetimeConfirmed, classification: patentProgress(lifetimeConfirmed), confirmed: sum('confirmado'), provisional: sum('provisorio'), review: sum('em_revisao'), deliveries: own.filter(t => t.score!.state === 'confirmado').length, position: 0 }
  }).sort((a,b) => b.confirmed - a.confirmed || a.name.localeCompare(b.name, 'pt-BR') || a.id.localeCompare(b.id))
  rows.forEach((row,index) => { row.position = index && rows[index - 1].confirmed === row.confirmed ? rows[index - 1].position : index + 1 })
  const target = actor.role === 'tecnico' ? actor.id : filter
  const visibleRows = actor.role === 'administrador' && filter ? rows.filter(row => row.id === filter) : rows
  const own = rows.find(row => row.id === target)
  const contributions = scored.filter(t => !target || t.score!.technicianId === target).sort((a,b) => b.score!.completedAt.localeCompare(a.score!.completedAt))
  return { rows: visibleRows, own, contributions, confirmed: own?.confirmed ?? visibleRows.reduce((n,r) => n + r.confirmed,0), provisional: own?.provisional ?? visibleRows.reduce((n,r) => n + r.provisional,0), review: own?.review ?? visibleRows.reduce((n,r) => n + r.review,0), deliveries: own?.deliveries ?? visibleRows.reduce((n,r) => n + r.deliveries,0) }
}
