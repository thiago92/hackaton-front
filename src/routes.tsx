import Ranking from '@/pages/ranking/Index'
import TechnicianMap from '@/pages/technician-map/Index'
import Notifications from '@/pages/notifications/Index'
import Technicians from '@/pages/technicians/Index'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '@/layout/Index'
import DashboardLayout from '@/layout/Dashboard'
import Dashboard from '@/pages/dashboard/Index'
import Tickets from '@/pages/tickets/Index'
import Login from '@/pages/login/Index'
import RequireAccess from '@/components/access/RequireAccess'
import MyTickets from '@/pages/my-tickets/Index'
import Profile from '@/pages/profile/Index'
import NewTicket from '@/pages/new-ticket/Index'
import ExampleOne from '@/pages/example-one/Index'
import ExampleTwo from '@/pages/example-two/Index'
import NotFound from '@/pages/not-found/Index'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAccess />}>
          <Route element={<DashboardLayout />}>
            <Route element={<RequireAccess roles={['tecnico', 'administrador']} />}><Route path="/ranking" element={<Ranking />} /></Route>
            <Route path="/notificacoes" element={<Notifications />} /><Route path="/perfil" element={<Profile />} /><Route element={<RequireAccess roles={['usuario', 'administrador']} />}><Route path="/novo-chamado" element={<NewTicket />} /></Route>
            <Route element={<RequireAccess roles={['administrador']} />}>
              <Route path="/mapa-tecnicos" element={<TechnicianMap />} /><Route path="/tecnicos" element={<Technicians />} /><Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chamados" element={<Tickets />} />
            </Route>
            <Route element={<RequireAccess roles={['usuario']} />}>
              <Route path="/meus-chamados" element={<MyTickets />} />
            </Route>
            <Route element={<RequireAccess roles={['tecnico']} />}>
              <Route path="/dashboard-tecnico" element={<Ranking dashboard />} /><Route path="/minhas-missoes" element={<MyTickets />} />
            </Route>
          </Route>
        </Route>
        <Route element={<MainLayout />}>
          <Route path="exemplo-1" element={<ExampleOne />} />
          <Route path="exemplo-2" element={<ExampleTwo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
