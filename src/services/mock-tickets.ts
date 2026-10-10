import { withLegacyScore, validTicketScore, concludeScore, reviewScore } from '@/lib/ticket-scoring'
import { executionStates, normalizeStoredTicket, statusForExecution, withTicketStatus } from '@/lib/ticket-status'
import { recordDemoPosition, validPosition, proximityEligible } from '@/data/mock-positions'
import { appendTicketNotices } from '@/data/notification-rules'
import { readTechnicians } from '@/data/technicians'
import { additionalDemoTickets, mockTickets, ticketStatuses, type Ticket } from '@/data/tickets'
import { demoAccounts, getDemoUser } from '@/data/access-profiles'
import { callTypes, normalizeCallType, serviceUnits } from '@/data/service-catalog'
import { executionIntervals, isAssignedTo, pauseReasons } from '@/lib/ticket-execution'

export const ticketsStorageKey = 'missao-sjp.mock-tickets.v1'
type Snapshot = { tickets: Ticket[]; error: string | null }
const listeners = new Set<() => void>()
function withCallType(ticket: Ticket): Ticket {
  const callType = normalizeCallType(ticket.callType ?? ticket.area ?? ticket.team)
  return withLegacyScore({ ...withTicketStatus(ticket), technicianId: ticket.technicianId ?? readTechnicians().technicians.find(tech => tech.name === ticket.technician)?.id ?? ({ 'Camila Santos': 'tecnico-demo', 'Pedro Almeida': 'tecnico-redes-demo', 'Equipe de estoque': 'tecnico-estoque-demo' } as Record<string, string>)[ticket.technician ?? ''], callType, area: callType, team: callType })
}
function seeds(): Ticket[] {
  return [...mockTickets, ...additionalDemoTickets].map(ticket => ({ ...withCallType(ticket), requesterId: demoAccounts.find(account => account.name === ticket.requester)?.id }))
}
function validTicket(value: unknown): value is Ticket {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return Number.isSafeInteger(item.id) && Number(item.id) > 0
    && ['title', 'description', 'createdAt', 'requester', 'extension', 'secretary', 'department', 'location', 'team', 'category'].every(key => typeof item[key] === 'string')
    && Number.isFinite(Date.parse(String(item.createdAt)))
    && (item.score === undefined || validTicketScore(item.score))
    && ticketStatuses.includes(item.status as Ticket['status'])
    && executionStates.includes(item.executionState as Ticket['executionState'])
    && item.status === statusForExecution(item.executionState as Ticket['executionState'])
    && ['Baixa', 'Normal', 'Alta'].includes(String(item.priority))
    && (item.technician === null || typeof item.technician === 'string')
    && (item.blocker === null || typeof item.blocker === 'string')
    && (item.equipment === null || (typeof item.equipment === 'object' && ['label', 'category', 'brand', 'model', 'asset', 'serial'].every(key => typeof (item.equipment as Record<string, unknown>)[key] === 'string')))
    && (item.intervals === undefined || (Array.isArray(item.intervals) && item.intervals.every(interval => interval && Number.isFinite(Date.parse(interval.startedAt)) && (interval.endedAt === null || (Number.isFinite(Date.parse(interval.endedAt)) && Date.parse(interval.endedAt) >= Date.parse(interval.startedAt))))))
    && (item.validations === undefined || (Array.isArray(item.validations) && item.validations.every(entry => entry && Number.isFinite(Date.parse(entry.at)) && typeof entry.authorId === 'string' && typeof entry.author === 'string' && typeof entry.text === 'string' && ['confirmado', 'pendencia'].includes(entry.result) && (entry.result !== 'confirmado' || (Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5)))))
    && (item.review === undefined || item.review === null || (typeof item.review === 'object' && Number.isFinite(Date.parse((item.review as Record<string, string>).requestedAt)) && typeof (item.review as Record<string, unknown>).reason === 'string'))
    && (item.notices === undefined || (Array.isArray(item.notices) && item.notices.every(notice => notice && typeof notice.id === 'string' && typeof notice.recipientId === 'string' && typeof notice.title === 'string' && typeof notice.message === 'string' && notice.ticketId === item.id && Number.isFinite(Date.parse(notice.at)) && ['novo', 'vinculo', 'conclusao', 'pendencia', 'devolucao'].includes(notice.kind))))
    && (item.positions === undefined || (Array.isArray(item.positions) && item.positions.every(validPosition)))
    && (item.proximityInvitees === undefined || (Array.isArray(item.proximityInvitees) && item.proximityInvitees.every(id => typeof id === 'string')))
    && Array.isArray(item.history) && item.history.every(entry => entry && typeof entry.author === 'string' && typeof entry.text === 'string' && Number.isFinite(Date.parse(entry.at)))
}
function readSnapshot(): Snapshot {
  try {
    const saved = window.localStorage.getItem(ticketsStorageKey)
    if (!saved) return { tickets: seeds(), error: null }
    const raw: unknown = JSON.parse(saved)
    const parsed: unknown = Array.isArray(raw) ? raw.map(normalizeStoredTicket) : raw
    if (!Array.isArray(parsed) || !parsed.every(validTicket) || new Set(parsed.map(ticket => ticket.id)).size !== parsed.length) throw new Error('invalid')
    // Acrescenta os novos exemplos uma única vez, sem substituir chamados existentes
    // nem recriar exemplos cujo status o usuário já alterou.
    const missing = additionalDemoTickets.filter(example => !parsed.some(ticket => ticket.demoSeedKey === example.demoSeedKey))
    if (missing.length) {
      const usedIds = new Set(parsed.map(ticket => ticket.id))
      let nextId = Math.max(14141, ...usedIds) + 1
      const additions = missing.map(example => {
        let id = example.id
        if (usedIds.has(id)) { while (usedIds.has(nextId)) nextId++; id = nextId++ }
        usedIds.add(id)
        return { ...example, id }
      })
      const merged = [...parsed, ...additions]
      window.localStorage.setItem(ticketsStorageKey, JSON.stringify(merged))
      return { tickets: merged.map(withCallType), error: null }
    }
    const normalized = parsed.map(withCallType)
    if (JSON.stringify(normalized) !== saved) window.localStorage.setItem(ticketsStorageKey, JSON.stringify(normalized))
    return { tickets: normalized, error: null }
  } catch {
    return { tickets: seeds(), error: 'Não foi possível ler os chamados salvos. A amostra inicial está sendo exibida; as alterações estão bloqueadas para preservar os dados. Verifique o armazenamento do navegador.' }
  }
}
let snapshot = readSnapshot()
export function getTicketsSnapshot() { return snapshot }
export function subscribeTickets(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } }
function refresh() { snapshot = readSnapshot(); listeners.forEach(listener => listener()) }
window.addEventListener('storage', event => { if (event.key === ticketsStorageKey || event.key === null) refresh() })
export interface NewTicketInput {
  title: string
  description: string
  requesterId: string
  unitId: string
  callType: string
  nature: 'Hardware' | 'Software'
  modality: 'Presencial' | 'Remoto'
  contact: string
  impact: string
  urgency: string
  material: string
  pickupLocation: string
  priority: Ticket['priority']
  equipment: NonNullable<Ticket['equipment']> | null
}
export function createMockTicket(input: NewTicketInput): Ticket {
  const author = getDemoUser()
  if (!author || author.role === 'tecnico') throw new Error('Seu perfil não pode cadastrar chamados.')
  const latest = readSnapshot()
  if (latest.error) throw new Error(latest.error)
  const requester = demoAccounts.find(account => account.id === input.requesterId)
  const unit = serviceUnits.find(item => item.id === input.unitId)
  if (!requester || requester.role === 'tecnico' || (author.role === 'usuario' && requester.id !== author.id)) throw new Error('Solicitante inválido para este perfil.')
  if (!unit || (author.role === 'usuario' && unit.secretary !== author.secretary)) throw new Error('Selecione uma unidade da secretaria autorizada.')
  if (!callTypes.includes(input.callType as typeof callTypes[number]) || !['Hardware', 'Software'].includes(input.nature) || !['Presencial', 'Remoto'].includes(input.modality)) throw new Error('Classificação inválida.')
  if (!input.title.trim() || input.title.trim().length > 120 || input.description.trim().length < 10 || input.description.trim().length > 4000 || !input.contact.trim() || !input.impact.trim() || !input.urgency.trim()) throw new Error('Preencha título, descrição (10 a 4000 caracteres), contato, impacto e urgência.')
  if (!['Baixa', 'Normal', 'Alta'].includes(input.priority)) throw new Error('Prioridade inválida.')
  const now = new Date().toISOString()
  let ticket: Ticket = {
    id: Math.max(14141, ...latest.tickets.map(item => item.id)) + 1,
    title: input.title.trim(), description: input.description.trim(), createdAt: now,
    requester: requester.name, requesterId: requester.id, authorId: author.id,
    extension: input.contact.trim(), secretary: unit.secretary, department: unit.department, location: unit.location,
    team: input.callType, area: input.callType, callType: input.callType, category: input.nature, nature: input.nature, modality: input.modality,
    impact: input.impact.trim(), urgency: input.urgency.trim(), material: input.material.trim(), pickupLocation: input.pickupLocation.trim(),
    priority: author.role === 'administrador' ? input.priority : 'Normal', technician: null, status: 'Em aberto', executionState: 'Aberto', blocker: null,
    equipment: input.equipment,
    history: [{ at: now, author: author.name, text: `Chamado cadastrado para ${requester.name}. Encaminhado para ${input.callType}.` }],
  }
  ticket = appendTicketNotices(ticket, 'novo', now, latest.tickets)
  try { window.localStorage.setItem(ticketsStorageKey, JSON.stringify([ticket, ...latest.tickets])) }
  catch { throw new Error('Não foi possível salvar o chamado. Verifique espaço e permissões do armazenamento; seus campos foram preservados.') }
  snapshot = { tickets: [ticket, ...latest.tickets], error: null }
  listeners.forEach(listener => listener())
  return ticket
}
export type TechnicianAction = 'assumir' | 'iniciar' | 'evento' | 'pausar' | 'bloquear' | 'retomar' | 'concluir'
export interface TechnicianActionInput { action: TechnicianAction; text?: string; pauseCategory?: string }
let actionQueue: Promise<unknown> = Promise.resolve()
export async function actOnMockTicket(id: number, input: TechnicianActionInput): Promise<Ticket> {
  const actor = getDemoUser()
  if (!actor || actor.role !== 'tecnico') throw new Error('Somente o técnico pode realizar esta ação.')
  function mutate() {
    if (getDemoUser()?.id !== actor!.id) throw new Error('Sua sessão mudou. Entre novamente para continuar.')
    const latest = readSnapshot()
    if (latest.error) throw new Error(latest.error)
    const original = latest.tickets.find(ticket => ticket.id === id)
    if (!original) throw new Error('Chamado não encontrado.')
    const now = new Date().toISOString()
    let ticket: Ticket = { ...original, intervals: executionIntervals(original).map(interval => ({ ...interval })), history: [...original.history] }
    let message = ''
    const text = input.text?.trim() ?? ''
    if (['evento', 'pausar', 'bloquear', 'concluir'].includes(input.action) && (text.length < 5 || text.length > 2000)) throw new Error('Informe uma descrição entre 5 e 2000 caracteres.')
    if (input.action === 'assumir') {
      const tech = readTechnicians().technicians.find(item => item.id === actor!.id)
      if (!tech || tech.availability !== 'Disponível') throw new Error('Seu cadastro está indisponível ou fora do expediente.')
      if (ticket.executionState !== 'Aberto' || ticket.technician || ticket.technicianId) throw new Error('Este chamado já foi assumido ou não está disponível.')
      const sameSecretary = (actor!.secretaries ?? [actor!.secretary]).includes(ticket.secretary)
      if (!actor!.callTypes?.includes(ticket.callType ?? ticket.team) || (!sameSecretary && (!ticket.proximityInvitees?.includes(actor!.id) || !proximityEligible(ticket, actor!.id, actor!.callTypes ?? [], latest.tickets)))) throw new Error('Convite expirado ou chamado fora das suas permissões. Consulte os avisos atualizados.')
      ticket.technician = actor!.name; ticket.technicianId = actor!.id; ticket.executionState = 'Vinculado'
      message = sameSecretary ? 'Chamado assumido e incluído na fila do técnico. Atendimento ainda não iniciado.' : 'Convite voluntário por proximidade aceito. Secretaria original preservada; atendimento ainda não iniciado.'
    } else {
      if (!isAssignedTo(ticket, actor!)) throw new Error('Você não é o técnico responsável por este chamado.')
      ticket.technicianId = actor!.id
      if (input.action === 'iniciar' || input.action === 'retomar') {
        const tech = readTechnicians().technicians.find(item => item.id === actor!.id)
        if (!tech || tech.availability !== 'Disponível') throw new Error('Seu cadastro está indisponível ou fora do expediente.')
        const valid = input.action === 'iniciar' ? ticket.executionState === 'Vinculado' : ['Pausado', 'Bloqueado'].includes(ticket.executionState)
        if (!valid) throw new Error('O estado do chamado não permite iniciar ou retomar.')
        if (latest.tickets.some(other => other.id !== id && other.executionState === 'Em andamento' && isAssignedTo(other, actor!))) throw new Error('Você já possui um atendimento em andamento. Pause ou conclua antes de iniciar outro.')
        ticket.executionState = 'Em andamento'; ticket.startedAt ??= ticket.intervals?.[0]?.startedAt ?? now
        ticket.intervals!.push({ startedAt: now, endedAt: null }); ticket.blocker = null; ticket.pauseReason = null
        message = input.action === 'iniciar' ? 'Atendimento iniciado.' : 'Atendimento retomado. Impedimento/pausa anterior permanece no histórico.'
      } else if (input.action === 'evento') {
        if (!['Em andamento', 'Pausado', 'Bloqueado'].includes(ticket.executionState)) throw new Error('Registre eventos durante o atendimento ou sua interrupção.')
        message = `Evento de atendimento: ${text}`
      } else if (['pausar', 'bloquear', 'concluir'].includes(input.action)) {
        if (ticket.executionState !== 'Em andamento') throw new Error('Esta ação exige um atendimento em andamento.')
        if (input.action === 'pausar' && !pauseReasons.includes(input.pauseCategory as typeof pauseReasons[number])) throw new Error('Selecione o motivo da pausa.')
        ticket.intervals!.forEach(interval => { if (!interval.endedAt) interval.endedAt = now })
        if (input.action === 'pausar') {
          ticket.executionState = 'Pausado'; ticket.pauseReason = `${input.pauseCategory}: ${text}`
          message = `Atendimento pausado — ${ticket.pauseReason}`
        } else if (input.action === 'bloquear') {
          ticket.executionState = 'Bloqueado'; ticket.blocker = text; ticket.pauseReason = null
          message = `Atendimento bloqueado — ${text}`
        } else {
          ticket.executionState = 'Aguardando validação'; ticket.completedAt = now; ticket.blocker = null; ticket.pauseReason = null
          message = `Serviço concluído pelo técnico: ${text}. Aguardando confirmação do solicitante.`
        }
      } else { throw new Error('Ação inválida.') }
    }
    ticket = recordDemoPosition(ticket, Date.parse(now))
    ticket.history.push({ at: now, author: actor!.name, text: message })
    if (input.action === 'assumir') ticket = appendTicketNotices(ticket, 'vinculo', now)
    if (input.action === 'concluir') { ticket = concludeScore(ticket, actor!, now); ticket = appendTicketNotices(ticket, 'conclusao', now) }
    const updated = latest.tickets.map(item => item.id === id ? withTicketStatus(ticket) : item)
    try { window.localStorage.setItem(ticketsStorageKey, JSON.stringify(updated)) }
    catch { throw new Error('Não foi possível salvar a alteração. O estado anterior foi preservado; tente novamente.') }
    snapshot = { tickets: updated, error: null }; listeners.forEach(listener => listener())
    return withTicketStatus(ticket)
  }
  const run = () => navigator.locks ? navigator.locks.request(ticketsStorageKey, mutate) : Promise.resolve().then(mutate)
  const result = actionQueue.then(run, run)
  actionQueue = result.catch(() => undefined)
  return result
}
export interface ValidationInput { action: 'confirmar' | 'pendencia' | 'devolver'; text?: string; rating?: number }
export async function validateMockTicket(id: number, input: ValidationInput): Promise<Ticket> {
  const actor = getDemoUser()
  if (!actor) throw new Error('Entre novamente para continuar.')
  function mutate() {
    if (getDemoUser()?.id !== actor!.id) throw new Error('Sua sessão mudou. Entre novamente para continuar.')
    const latest = readSnapshot()
    if (latest.error) throw new Error(latest.error)
    const original = latest.tickets.find(ticket => ticket.id === id)
    if (!original) throw new Error('Chamado não encontrado.')
    const now = new Date().toISOString()
    const text = input.text?.trim() ?? ''
    if (text.length > 2000) throw new Error('A descrição deve ter no máximo 2000 caracteres.')
    let ticket: Ticket = { ...original, history: [...original.history], validations: [...(original.validations ?? [])] }
    let event: string
    if (input.action === 'devolver') {
      if (actor!.role !== 'administrador') throw new Error('Somente o administrador pode analisar e devolver a pendência.')
      if (ticket.executionState !== 'Aguardando análise' || !ticket.review || ticket.review.reviewedAt) throw new Error('Este chamado não tem pendência para análise.')
      if (text.length < 5) throw new Error('Descreva o encaminhamento em pelo menos 5 caracteres.')
      ticket.review = { ...ticket.review, reviewedAt: now, reviewedBy: actor!.name, response: text }
      ticket.executionState = ticket.technician ? 'Vinculado' : 'Aberto'
      ticket.pauseReason = null; ticket.blocker = null
      event = `Pendência analisada pelo administrador: ${text}. Chamado devolvido ${ticket.technician ? 'à fila do técnico responsável' : 'para atribuição'}.`
    } else {
      const owner = ticket.requesterId ? ticket.requesterId === actor!.id : ticket.requester === actor!.name
      if (actor!.role === 'tecnico' || !owner) throw new Error('Somente o solicitante deste chamado pode validar a entrega.')
      if (ticket.executionState !== 'Aguardando validação') throw new Error('Este chamado não está aguardando validação.')
      if (input.action === 'confirmar') {
        if (!Number.isInteger(input.rating) || input.rating! < 1 || input.rating! > 5) throw new Error('Selecione uma avaliação de 1 a 5.')
        ticket.executionState = 'Resolvido'; ticket.resolvedAt = now
        ticket.validations!.push({ at: now, authorId: actor!.id, author: actor!.name, result: 'confirmado', rating: input.rating, text })
        event = `Resolução confirmada pelo solicitante. Avaliação: ${input.rating}/5.${text ? ` Comentário: ${text}` : ''}`
      } else if (input.action === 'pendencia') {
        if (text.length < 5) throw new Error('Descreva o problema que continua em pelo menos 5 caracteres.')
        ticket.executionState = 'Aguardando análise'; ticket.review = { requestedAt: now, reason: text }
        ticket.validations!.push({ at: now, authorId: actor!.id, author: actor!.name, result: 'pendencia', text })
        event = `Solicitante informou pendência: ${text}. Encaminhado para análise do administrador.`
      } else { throw new Error('Ação de validação inválida.') }
    }
    ticket.history.push({ at: now, author: actor!.name, text: event })
    if (input.action === 'confirmar' || input.action === 'pendencia') ticket = reviewScore(ticket, actor!, now, input.action === 'confirmar' ? 'confirmado' : 'em_revisao')
    if (input.action === 'pendencia') ticket = appendTicketNotices(ticket, 'pendencia', now)
    if (input.action === 'devolver') ticket = appendTicketNotices(ticket, 'devolucao', now)
    const updated = latest.tickets.map(item => item.id === id ? withTicketStatus(ticket) : item)
    try { window.localStorage.setItem(ticketsStorageKey, JSON.stringify(updated)) }
    catch { throw new Error('Não foi possível salvar a validação. O estado anterior e sua descrição foram preservados; tente novamente.') }
    snapshot = { tickets: updated, error: null }; listeners.forEach(listener => listener())
    return withTicketStatus(ticket)
  }
  const run = () => navigator.locks ? navigator.locks.request(ticketsStorageKey, mutate) : Promise.resolve().then(mutate)
  const result = actionQueue.then(run, run)
  actionQueue = result.catch(() => undefined)
  return result
}
export async function assignMockTicket(id: number, technicianId: string, reason: string): Promise<Ticket> {
  const actor = getDemoUser()
  if (actor?.role !== 'administrador') throw new Error('Somente o administrador pode atribuir ou transferir chamados.')
  function mutate() {
    if (getDemoUser()?.id !== actor!.id) throw new Error('Sua sessão mudou; entre novamente.')
    const latest = readSnapshot(), catalog = readTechnicians()
    if (latest.error || catalog.error) throw new Error(latest.error ?? catalog.error!)
    const ticket = latest.tickets.find(item => item.id === id), tech = catalog.technicians.find(item => item.id === technicianId)
    if (!ticket || !tech) throw new Error('Chamado ou técnico não encontrado.')
    if (!['Aberto', 'Vinculado', 'Pausado', 'Bloqueado'].includes(ticket.executionState)) throw new Error('Pause o atendimento antes de transferir. Entregas aguardando validação/análise e resolvidas não podem ser transferidas aqui.')
    if (ticket.technicianId === tech.id || (!ticket.technicianId && ticket.technician === tech.name)) throw new Error('Este técnico já é o responsável.')
    if (tech.availability !== 'Disponível') throw new Error('O técnico está indisponível ou fora do expediente.')
    if (!tech.secretaries.includes(ticket.secretary) || !tech.callTypes.includes(ticket.callType ?? ticket.team)) throw new Error('O técnico deve atender a secretaria e o tipo deste chamado. Cooperação voluntária será implementada depois.')
    const justification = reason.trim()
    if (justification.length < 5 || justification.length > 2000) throw new Error('Informe justificativa de 5 a 2000 caracteres.')
    const now = new Date().toISOString()
    let updatedTicket: Ticket = { ...ticket, technicianId: tech.id, technician: tech.name, executionState: ticket.executionState === 'Aberto' ? 'Vinculado' : ticket.executionState === 'Pausado' || ticket.executionState === 'Bloqueado' ? ticket.executionState : 'Vinculado', intervals: executionIntervals(ticket).map(interval => ({ ...interval })), history: [...ticket.history, { at: now, author: actor!.name, text: `${ticket.technician ? `Responsabilidade transferida de ${ticket.technician}` : 'Chamado atribuído'} para ${tech.name}. Justificativa: ${justification}. Nenhum atendimento iniciado automaticamente.` }] }
    updatedTicket = appendTicketNotices(updatedTicket, 'vinculo', now)
    const updated = latest.tickets.map(item => item.id === id ? withTicketStatus(updatedTicket) : item)
    try { window.localStorage.setItem(ticketsStorageKey, JSON.stringify(updated)) } catch { throw new Error('Não foi possível salvar a atribuição. Estado anterior preservado.') }
    snapshot = { tickets: updated, error: null }; listeners.forEach(listener => listener())
    return withTicketStatus(updatedTicket)
  }
  const run = () => navigator.locks ? navigator.locks.request(ticketsStorageKey, mutate) : Promise.resolve().then(mutate)
  const result = actionQueue.then(run, run); actionQueue = result.catch(() => undefined); return result
}
// Simulação enquanto há uma tela aberta. Sem GPS ou execução em segundo plano.
export async function refreshMockPositions() {
  const actor = getDemoUser()
  if (!actor || !['administrador', 'tecnico'].includes(actor.role)) return
  const mutate = () => {
    if (getDemoUser()?.id !== actor.id) return
    const latest = readSnapshot()
    if (latest.error) throw new Error(latest.error)
    const updated = latest.tickets.map(ticket => recordDemoPosition(ticket))
    if (updated.every((ticket, i) => ticket === latest.tickets[i])) return
    try { window.localStorage.setItem(ticketsStorageKey, JSON.stringify(updated)) }
    catch { throw new Error('Não foi possível salvar as posições simuladas.') }
    snapshot = { tickets: updated, error: null }; listeners.forEach(listener => listener())
  }
  const run = () => navigator.locks ? navigator.locks.request(ticketsStorageKey, mutate) : Promise.resolve().then(mutate)
  const result = actionQueue.then(run, run)
  actionQueue = result.catch(() => undefined)
  await result
}
