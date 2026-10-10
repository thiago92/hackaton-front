import { useTickets } from '@/hooks/use-tickets'
import { useTechnicians } from '@/hooks/use-technicians'
import { getRankingView } from '@/services/mock-ranking'
export function useRanking(month: string, technicianId = '') {
  const { tickets, error: ticketsError } = useTickets()
  const { technicians, error: techniciansError } = useTechnicians()
  return { ...getRankingView(tickets, technicians, month, technicianId), tickets, technicians, error: ticketsError ?? techniciansError }
}
