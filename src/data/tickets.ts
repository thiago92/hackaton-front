import type { TicketNotice } from '@/data/notification-rules'
import { statusForExecution, type ExecutionState } from '@/lib/ticket-status'
export const ticketStatuses = ['Em aberto', 'Em análise', 'Resolvido'] as const
export type TicketStatus = typeof ticketStatuses[number]
export type Priority = 'Baixa' | 'Normal' | 'Alta'
export interface Ticket {
  score?: import('@/lib/ticket-scoring').TicketScore
  positions?: import('@/data/mock-positions').MockPosition[]
  proximityInvitees?: string[]
  notices?: TicketNotice[]
  id: number
  demoSeedKey?: string
  technicianId?: string
  startedAt?: string
  validations?: { at: string; authorId: string; author: string; result: 'confirmado' | 'pendencia'; rating?: number; text: string }[]
  review?: { requestedAt: string; reason: string; reviewedAt?: string; reviewedBy?: string; response?: string } | null
  resolvedAt?: string
  completedAt?: string
  pauseReason?: string | null
  intervals?: { startedAt: string; endedAt: string | null }[]
  requesterId?: string
  authorId?: string
  callType?: string
  area?: string
  nature?: 'Hardware' | 'Software'
  modality?: 'Presencial' | 'Remoto'
  impact?: string
  urgency?: string
  material?: string
  pickupLocation?: string
  title: string
  description: string
  createdAt: string
  requester: string
  extension: string
  secretary: string
  department: string
  location: string
  team: string
  technician: string | null
  category: string
  priority: Priority
  status: TicketStatus
  executionState: ExecutionState
  equipment: { label: string; category: string; brand: string; model: string; asset: string; serial: string } | null
  blocker: string | null
  history: { at: string; author: string; text: string }[]
}
const units = [
  { secretary: 'Saúde', department: 'Departamento Regional de Saúde', location: 'Unidade de Saúde Borda do Campo' },
  { secretary: 'Educação', department: 'Departamento de Ensino', location: 'Escola Municipal Araucária' },
  { secretary: 'Administração', department: 'Atendimento ao Público', location: 'Prefeitura · Recepção' },
  { secretary: 'Cultura', department: 'Departamento de Cultura', location: 'Biblioteca Municipal' },
]
const samples: { title: string; description: string; team: string; category: string; executionState: ExecutionState; priority: Priority; blocker?: string }[] = [
  { title: 'Cabo HDMI para instalação de painel', description: 'Solicitação de um cabo HDMI de 15 metros para instalar um painel na unidade. Conferir disponibilidade e compatibilidade antes da entrega.', team: 'Aquisições / Estoque', category: 'Auxílio ao usuário', executionState: 'Em andamento', priority: 'Normal' },
  { title: 'Computador não inicia', description: 'Computador da recepção não liga após tentativa de reinício. Verificar alimentação e equipamento.', team: 'Suporte de TI', category: 'Computador', executionState: 'Aberto', priority: 'Alta' },
  { title: 'Impressora com papel preso', description: 'Impressora apresenta atolamento recorrente na bandeja de entrada.', team: 'Suporte de TI', category: 'Impressora', executionState: 'Em andamento', priority: 'Normal' },
  { title: 'Monitor não liga', description: 'Monitor sem imagem e sem indicador de energia. Solicitante já conferiu a tomada.', team: 'Suporte de TI', category: 'Monitor', executionState: 'Bloqueado', priority: 'Alta', blocker: 'Aguardando monitor de substituição no estoque.' },
  { title: 'Ponto de rede sem conexão', description: 'Ponto de rede da sala de atendimento sem conexão. Cabo substituído; aguardando confirmação do solicitante.', team: 'Redes', category: 'Conectividade', executionState: 'Aguardando validação', priority: 'Alta' },
  { title: 'Configuração de impressora', description: 'Configurar impressora compartilhada na estação de trabalho.', team: 'Suporte de TI', category: 'Impressora', executionState: 'Resolvido', priority: 'Baixa' },
  { title: 'Entrega de teclado', description: 'Substituição de teclado com teclas danificadas.', team: 'Aquisições / Estoque', category: 'Auxílio ao usuário', executionState: 'Aberto', priority: 'Baixa' },
  { title: 'Rede instável na unidade', description: 'Interrupções de conexão durante o atendimento ao público.', team: 'Redes', category: 'Conectividade', executionState: 'Em andamento', priority: 'Alta' },
  { title: 'Computador com lentidão', description: 'Aplicativos demoram para abrir e estação apresenta travamentos.', team: 'Suporte de TI', category: 'Computador', executionState: 'Aguardando validação', priority: 'Normal' },
  { title: 'Reposição de toner', description: 'Impressora sem toner para emissão de documentos.', team: 'Aquisições / Estoque', category: 'Suprimentos', executionState: 'Bloqueado', priority: 'Normal', blocker: 'Aguardando recebimento do material.' },
  { title: 'Instalação de ponto de rede', description: 'Instalação e teste de ponto de rede para estação de atendimento.', team: 'Redes', category: 'Conectividade', executionState: 'Resolvido', priority: 'Normal' },
  { title: 'Mouse com falha', description: 'Mouse não responde de forma consistente. Verificar e substituir se necessário.', team: 'Suporte de TI', category: 'Periféricos', executionState: 'Aberto', priority: 'Baixa' },
]
export const mockTickets: Ticket[] = samples.map((sample, index) => {
  const unit = units[index % units.length]
  const createdAt = `2026-10-${String(9 - Math.floor(index / 3)).padStart(2, '0')}T09:30:00-03:00`
  const requester = ['Ana Silva', 'Bruno Costa', 'Carla Souza', 'Diego Lima'][index % 4]
  const technician = sample.executionState === 'Aberto' ? null : sample.team === 'Aquisições / Estoque' ? 'Equipe de estoque' : sample.team === 'Redes' ? 'Pedro Almeida' : 'Camila Santos'
  const history = [{ at: createdAt, author: 'Atendente de demonstração', text: 'Chamado registrado e encaminhado à equipe responsável.' }]
  if (technician) history.push({ at: createdAt.replace('09:30', '10:15'), author: technician, text: 'Atendimento iniciado.' })
  if (sample.blocker) history.push({ at: createdAt.replace('09:30', '11:00'), author: technician ?? 'Equipe', text: sample.blocker })
  if (sample.executionState === 'Aguardando validação' || sample.executionState === 'Resolvido') history.push({ at: createdAt.replace('09:30', '11:30'), author: technician ?? 'Equipe', text: 'Serviço concluído pelo técnico. Aguardando confirmação do solicitante.' })
  if (sample.executionState === 'Resolvido') history.push({ at: createdAt.replace('09:30', '12:00'), author: requester, text: 'Resolução confirmada pelo solicitante.' })
  return { ...sample, status: statusForExecution(sample.executionState), ...unit, id: 14142 + index, createdAt, requester, technician, extension: '0000 (fictício)', blocker: sample.blocker ?? null, equipment: ['Computador', 'Monitor', 'Impressora'].includes(sample.category) ? { label: `DEMO-${String(index + 1).padStart(4, '0')}`, category: sample.category, brand: 'Marca de demonstração', model: 'Modelo padrão', asset: `PAT-DEMO-${index + 1}`, serial: `SERIE-DEMO-${index + 1}` } : null, history }
})
export const statusClasses: Record<TicketStatus, string> = {
  'Em aberto': 'border-slate-200 bg-slate-100 text-slate-700',
  'Em análise': 'border-blue-200 bg-blue-50 text-blue-800',
  'Resolvido': 'border-emerald-200 bg-emerald-50 text-emerald-800',
}
export const priorityClasses: Record<Priority, string> = { Baixa: 'border-slate-200 bg-white text-slate-600', Normal: 'border-slate-200 bg-white text-slate-600', Alta: 'border-rose-200 bg-rose-50 text-rose-800' }

// Exemplos adicionais com fila e pausa, sem execução ativa extra.
export const additionalDemoTickets: Ticket[] = [
  { key: 'vinculado-painel', title: 'Instalação de painel na recepção', executionState: 'Vinculado' as const, location: 'Hospital Municipal (demonstração)', reason: null },
  { key: 'vinculado-software', title: 'Configuração de software de atendimento', executionState: 'Vinculado' as const, location: 'Unidade de Saúde Borda do Campo', reason: null },
  { key: 'pausado-intervalo', title: 'Verificação de impressora da recepção', executionState: 'Pausado' as const, location: 'Hospital Municipal (demonstração)', reason: 'Intervalo: atendimento interrompido para intervalo do técnico; retomar a verificação da impressora.' },
  { key: 'pausado-material', title: 'Substituição de cabo HDMI do painel', executionState: 'Pausado' as const, location: 'Unidade de Saúde Borda do Campo', reason: 'Aguardando material / terceiros: aguardando liberação do cabo HDMI no estoque para continuar a instalação.' },
].map((sample, index): Ticket => {
  const createdAt = '2026-10-09T08:00:00-03:00'
  const assignedAt = '2026-10-09T08:15:00-03:00'
  const startedAt = '2026-10-09T08:30:00-03:00'
  const pausedAt = '2026-10-09T09:00:00-03:00'
  const paused = sample.executionState === 'Pausado'
  return {
    id: 14201 + index, demoSeedKey: sample.key,
    title: sample.title, description: `${sample.title}. Exemplo fictício para consultar a ordem de serviço e testar ${paused ? 'a retomada do atendimento' : 'a fila do técnico'}.`,
    createdAt, requester: 'Ana Silva', requesterId: 'usuario-demo', authorId: 'usuario-demo',
    extension: '0000 (fictício)', secretary: 'Saúde', department: 'Departamento Regional de Saúde', location: sample.location,
    team: 'Suporte', area: 'Suporte', category: index === 1 ? 'Software' : 'Hardware', nature: index === 1 ? 'Software' : 'Hardware', modality: index === 1 ? 'Remoto' : 'Presencial',
    technician: 'Camila Santos', technicianId: 'tecnico-demo', executionState: sample.executionState, status: statusForExecution(sample.executionState), priority: 'Normal', equipment: null, blocker: null,
    pauseReason: sample.reason, intervals: paused ? [{ startedAt, endedAt: pausedAt }] : [],
    ...(paused ? { startedAt } : {}),
    history: [
      { at: createdAt, author: 'Ana Silva', text: 'Chamado de demonstração cadastrado para atendimento na Saúde.' },
      { at: assignedAt, author: 'Camila Santos', text: 'Chamado assumido e incluído na fila. Atendimento ainda não iniciado.' },
      ...(paused ? [{ at: startedAt, author: 'Camila Santos', text: 'Atendimento iniciado.' }, { at: pausedAt, author: 'Camila Santos', text: `Atendimento pausado — ${sample.reason}` }] : []),
    ],
  }
})
additionalDemoTickets.push(...[
  { key: 'analise-impressora', title: 'Impressora continua com falha após atendimento', reason: 'A impressora voltou a travar ao emitir documentos. O problema continua mesmo após a limpeza realizada.', delivery: 'Limpeza da bandeja e teste de impressão realizados.', nature: 'Hardware' as const, location: 'Hospital Municipal (demonstração)' },
  { key: 'analise-software', title: 'Sistema de atendimento ainda não permite acesso', reason: 'O acesso foi liberado, mas o sistema continua exibindo erro ao abrir o cadastro de pacientes.', delivery: 'Permissões de acesso revisadas e sessão do sistema testada.', nature: 'Software' as const, location: 'Unidade de Saúde Borda do Campo' },
].map((sample, index): Ticket => {
  const createdAt = '2026-10-09T08:00:00-03:00'
  const assignedAt = '2026-10-09T08:15:00-03:00'
  const startedAt = '2026-10-09T08:30:00-03:00'
  const completedAt = '2026-10-09T09:00:00-03:00'
  const requestedAt = '2026-10-09T09:15:00-03:00'
  return {
    id: 14205 + index, demoSeedKey: sample.key,
    title: sample.title, description: `${sample.title}. Exemplo fictício de retorno para análise administrativa.`,
    createdAt, startedAt, completedAt, requester: 'Ana Silva', requesterId: 'usuario-demo', authorId: 'usuario-demo',
    extension: '0000 (fictício)', secretary: 'Saúde', department: 'Departamento Regional de Saúde', location: sample.location,
    team: 'Suporte', area: 'Suporte', category: sample.nature, nature: sample.nature, modality: sample.nature === 'Software' ? 'Remoto' : 'Presencial',
    technician: 'Camila Santos', technicianId: 'tecnico-demo', executionState: 'Aguardando análise', status: 'Em análise', priority: 'Normal', equipment: null, blocker: null,
    intervals: [{ startedAt, endedAt: completedAt }],
    review: { requestedAt, reason: sample.reason },
    validations: [{ at: requestedAt, authorId: 'usuario-demo', author: 'Ana Silva', result: 'pendencia', text: sample.reason }],
    history: [
      { at: createdAt, author: 'Ana Silva', text: 'Chamado de demonstração cadastrado para atendimento na Saúde.' },
      { at: assignedAt, author: 'Camila Santos', text: 'Chamado assumido e incluído na fila.' },
      { at: startedAt, author: 'Camila Santos', text: 'Atendimento iniciado.' },
      { at: completedAt, author: 'Camila Santos', text: `Serviço concluído pelo técnico: ${sample.delivery} Aguardando confirmação do solicitante.` },
      { at: requestedAt, author: 'Ana Silva', text: `Solicitante informou pendência: ${sample.reason} Encaminhado para análise do administrador.` },
    ],
  }
}))