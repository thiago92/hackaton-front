import { getDemoUser, roleLabels } from '@/data/access-profiles'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/dashboard'

export default function Profile() {
  const user = getDemoUser()
  if (!user) return null
  return <div className="space-y-6"><h1 className="text-3xl font-semibold">Meu perfil</h1><p className="text-sm text-slate-600">{user.authSource === 'api' ? 'Dados da sua conta. Edição e foto serão disponibilizadas nas próximas etapas.' : 'Dados fictícios da conta de demonstração. Edição e upload de foto serão implementados nas próximas etapas.'}</p><Card><CardHeader><CardTitle>{user.name}</CardTitle></CardHeader><CardContent><dl className="grid gap-5 sm:grid-cols-2">{[['E-mail', user.email], ['Perfil de acesso', roleLabels[user.role]], ...(user.authSource === 'api' ? [['Identificação da prefeitura', user.prefeituraId ?? '']] : [['Secretaria', user.secretary], ['Departamento / Área', user.department]])].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl></CardContent></Card></div>
}