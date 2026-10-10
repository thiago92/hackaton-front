# Perfis de acesso — demonstração do frontend

Todas as contas são fictícias e as credenciais são públicas, exclusivas do protótipo. Estas contas funcionam somente com `VITE_AUTH_MODE=demo`. No modo padrão `api`, o login usa uma conta real de papel Usuario cadastrada no backend. Configure a API e a prefeitura conforme o README. Para demonstração, reinicie o Vite com esse modo e abra `/login`:

| Perfil | Nome | E-mail | Senha | Página inicial |
|---|---|---|---|---|
| Usuário da prefeitura | Ana Silva | usuario@demo.sjp | Usuario123! | /meus-chamados |
| Técnico | Camila Santos | tecnico@demo.sjp | Tecnico123! | /dashboard-tecnico |
| Administrador | Administrador Demo | admin@demo.sjp | Admin123! | /dashboard |

## Comportamento implementado

- E-mail ignora maiúsculas e espaços nas extremidades; senha diferencia maiúsculas/minúsculas.
- Credenciais incorretas exibem mensagem e não liberam acesso.
- Sessão guarda somente o ID da conta em `sessionStorage`, persiste ao recarregar na mesma aba e termina ao sair ou encerrar a sessão da aba.
- Sem sessão, rotas de trabalho redirecionam para login; perfil incompatível redireciona para sua página inicial.
- Usuário vê os chamados fictícios cujo solicitante é Ana Silva.
- Técnico vê seus chamados e abertos da Saúde, sua secretaria. Acesso a detalhes respeita a mesma seleção.
- Administrador acessa dashboard e todos os chamados existentes.
- Todos acessam “Meu perfil”, somente leitura. Nome e papel aparecem no cabeçalho; menus desktop/mobile seguem o perfil.
- “Sair da plataforma” remove a sessão; login com sessão ativa retorna à página inicial do perfil.

## Dados mockados no código

Contas, credenciais, rótulos e páginas iniciais: `src/data/access-profiles.ts`.
Chamados: `src/data/tickets.ts`. Por compatibilidade com os fixtures atuais, filtros usam nomes; migrar para IDs quando unificar os contratos.
Guarda de rotas: `src/components/access/RequireAccess.tsx`.

## O que ainda falta

Cadastro de chamado e ordem digital já foram entregues com persistência local. Aceite, fila operacional, eventos, início/pausa/bloqueio/retomada, cronômetro e conclusão também já foram entregues. Validação/avaliação do solicitante e análise/devolução administrativa também estão implementadas. Edição de perfil/foto, evidências, cooperação, lembretes, push/GPS e ranking por equipe continuam pendentes. Ranking individual e dashboard técnico já estão implementados com mocks. Itens sem implementação aparecem como “Em breve”. Dashboard administrativo e listas utilizam a mesma base local compartilhada.

Essas guardas simulam a experiência e não oferecem segurança real: dados e senhas estão disponíveis no navegador. Futuramente, autenticação e autorização deverão ser aplicadas pelo backend. Não usar senhas reais neste protótipo.
## Cadastro e persistência

Usuário e administrador têm “Novo chamado” (`/novo-chamado`); técnico não tem essa permissão. Usuário cadastra para si em unidades da Saúde, com prioridade inicial Normal. Administrador pode cadastrar para Ana Silva ou para si em qualquer unidade fictícia, escolhendo prioridade.

Teste sugerido: entrar como usuário, cadastrar no Hospital Municipal de demonstração, abrir a ordem digital e atualizar a página. Sair e entrar como técnico: chamado aparece em Disponíveis. Entrar como administrador: o mesmo número aparece em Chamados e nos indicadores do período.

Dados ficam no `localStorage` deste navegador e continuam após logout; a sessão de acesso continua em `sessionStorage`. Para testar compartilhamento entre abas, usar o mesmo endereço/origem. Nenhum dado chega a outro celular/dispositivo sem backend. Utilizar apenas informações fictícias.
## Testar ações do técnico

Entrar como técnico, abrir ordem de serviço e usar Assumir → Iniciar → Registrar evento → Pausar/Bloquear → Retomar → Concluir. Pausa/bloqueio exigem justificativa; conclusão exige descrição e fica Aguardando validação. Tempo ativo e eventos persistem após recarga, sem backend.

A amostra já tem o chamado 14144 em andamento de Camila: pause ou conclua antes de iniciar outro. Assumir um novo chamado coloca na fila, sem iniciar cronômetro. Usuário e administrador consultam os novos estados, mas não executam ações do técnico. Confirmação/avaliação e indicação de pendência pelo usuário já estão implementadas.
## Testar validação e pendência

- Usuário Ana Silva: abrir chamado em Aguardando validação; confirmar com nota 1–5 ou informar problema persistente com justificativa.
- Administrador: pendência aparece em Aguardando análise; abrir e Devolver para atendimento com orientação.
- Técnico: chamado devolvido volta à Minha fila; iniciar novo intervalo e concluir para nova validação, respeitando apenas um atendimento ativo.
- Usuário: confirmar a nova entrega; histórico preserva a pendência, análise e respostas anteriores.

Só o solicitante valida sua entrega. Administrador analisa e encaminha pendências, sem confirmar chamados de terceiros. Estados/resultados permanecem no armazenamento local após recarga/logout. Encerramento administrativo excepcional, lembretes e pontos ficam para etapas futuras.
## Gestão de técnicos e novas contas

Administrador acessa Técnicos para cadastrar/editar credenciais fictícias, secretarias, tipos e disponibilidade. Contas cadastradas entram pelo mesmo login e veem seus chamados por ID. E-mail alterado passa a ser a credencial vigente; senha editada substitui a anterior.

| Conta adicional inicial | E-mail | Senha | Atendimento |
|---|---|---|---|
| Pedro Almeida | pedro@demo.sjp | Tecnico123! | Saúde/Educação; Redes e TI |
| Estoque (conta fictícia de compatibilidade) | estoque@demo.sjp | Tecnico123! | Secretarias do catálogo; Aquisição/Estoque |

Na ordem de serviço, administrador atribui ou transfere com justificativa. Candidatos devem atender secretaria e tipo e estar disponíveis no cadastro; ocupado pode receber na fila. Pausa/bloqueio e tempos anteriores são preservados. Chamado ativo exige pausa antes da transferência. Novas contas e alterações ficam no navegador; o quadro inicial de credenciais deste documento descreve os valores de fábrica, que podem ser editados.
## Notificações por conta

Todas as contas têm Notificações e atalho Avisos com contador de não lidas. Cada conta consulta/marca somente seus avisos. Usuário recebe conclusão; administrador recebe pendência; técnico recebe abertura da secretaria/tipo, vínculo e devolução. Técnicos novos usam os vínculos cadastrados para receber eventos futuros.

Para testar, gerar novo chamado e alternar entre contas no mesmo navegador. Avisos/leitura persistem após logout; exemplos antigos não recebem avisos retroativos. Clicar abre a ordem apenas se o perfil ainda tiver autorização. A central é simulada: não envia push para celular ou outro dispositivo.

## Status atuais do chamado

Somente Em aberto, Em análise e Resolvido. A execução e a validação seguem etapas internas; concluir pelo técnico mantém Em análise e confirmar pelo solicitante marca Resolvido. Filtros de chamados usam os três status; ações continuam respeitando papel, responsabilidade e etapa interna.


## Acesso ao ranking — 09/10/2026

- Usuário: sem menu, rota ou consulta autorizada de ranking.
- Técnico: página inicial /dashboard-tecnico; Ranking /ranking com placar agregado e detalhamento somente dos próprios pontos/chamados.
- Administrador: Ranking /ranking com todos os resultados e filtros por técnico e mês, acessível pelo dashboard e pelo menu.

Baixa 10, Normal 20, Alta 40 pontos; provisórios na conclusão, confirmados pelo solicitante, em revisão quando há pendência. Repetir entrega não duplica pontos do chamado. Aplicar somente a dados fictícios; segurança operacional depende do backend.


## Patentes

Técnico vê sua progressão e as patentes no placar; administrador consulta todos e filtra técnico; usuário não tem acesso. Faixas vigentes: Soldado raso (0–99), Soldado (100–249), Cabo (250–499), Sargento (500–799), Subtenente (800–1.199), Tenente (1.200–1.799), Capitão (1.800–2.599), Major (2.600–3.599), Coronel (3.600–4.999), General (5.000 ou mais). Somente pontos confirmados acumulados, sem reinício mensal. Patente não altera perfil, cargo ou permissões.
