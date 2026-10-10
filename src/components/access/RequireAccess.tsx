import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { roleHome, type AccessRole } from '@/data/access-profiles'

import { useSessionUser } from '@/hooks/use-session-user'

export default function RequireAccess({ roles }: { roles?: AccessRole[] }) {
  const user = useSessionUser()
  const { pathname } = useLocation()
  if (!user) return <Navigate to="/login" replace />
  if (user.authSource === 'api' && !['/meus-chamados', '/perfil'].includes(pathname)) return <Navigate to="/meus-chamados" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={roleHome[user.role]} replace />
  return <Outlet />
}