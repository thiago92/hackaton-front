# Regras de negócio e plano de implementação — Missão SJP

Análise inicial e consolidação: 09/10/2026. Documento compartilhado de regras para **backend, frontend web e aplicativo mobile**, mantido em `Hackaton_frontend/ANALISE_FRONTEND_E_PLANO_DE_IMPLEMENTACAO.md`. Base do frontend: commit `f8a63e5`; simplificação dos status aplicada após `fd74597`, conforme seção 11.

## 1. Escopo e diagnóstico

O produto atende inicialmente demandas de TI dos órgãos municipais. Este documento define o comportamento de negócio comum aos três projetos. O frontend já demonstra a jornada operacional com serviços mockados e persistência no navegador. Isso não comprova implementação no backend ou no aplicativo mobile: esses projetos não foram auditados nesta revisão.

Referências originais: [manual do hackathon](../Manual_Hackathon_SJP_A5%20(1).pdf) e foto da ordem de serviço na pasta superior. As regras informadas pelo usuário prevalecem sobre a análise inicial; diferenças frente ao manual permanecem registradas. O [README](README.md) registra execução e andamento do frontend e [perfis-de-acesso.md](perfis-de-acesso.md) descreve contas de demonstração.

**Como manter:** atualizar regra e situação no mesmo momento da entrega. Marcar como entregue apenas o comportamento verificado, indicando a camada e se usa mocks. Decisão proposta não é decisão aprovada; checklist de integração não deve ser concluído por uma simulação local. As seções 4A–4C definem regras; 4B e 9 registram implementação; 5–7 orientam entrega operacional e apresentação.

## 2. O que foi implementado no frontend

| Área | Comportamento entregue | Evidência | Limite atual |
|---|---|---|---|
| Base e navegação | React/TypeScript/Vite, layout responsivo, menus por perfil e rotas protegidas na demonstração | `src/routes.tsx`, `src/components/access/RequireAccess.tsx` | Sem segurança operacional aplicada pelo backend |
| Sessão | Credenciais fictícias verificadas, sessão por aba, logout e página inicial por papel | `src/data/access-profiles.ts` | Sessão demonstrativa; senhas públicas no navegador |
| Cadastro e ordem digital | Usuário abre para si; administrador abre para solicitante autorizado; dados da unidade, classificação, impacto, urgência, equipamento/material | `src/pages/new-ticket/Index.tsx`, `src/services/mock-tickets.ts` | Catálogo fictício; matriz de prioridade ainda pendente |
| Dados compartilhados | Cadastro, dashboard, chamados e missões usam a mesma base local | `src/hooks/use-tickets.ts` | Compartilhamento entre abas da mesma origem/navegador, não entre dispositivos |
| Consulta | Kanban/tabela, busca, filtros por secretaria/tipo/prioridade e número; missões e chamados do próprio usuário | `src/pages/tickets/Index.tsx`, `src/pages/my-tickets/Index.tsx` | Arraste desloca a visualização do Kanban, não muda estado do chamado |
| Execução | Assumir, fila, início, eventos, pausa categorizada, bloqueio, retomada, tempo ativo e conclusão | `src/components/tickets/TechnicianActions.tsx`, `src/lib/ticket-execution.ts` | Uma execução ativa por responsável; colaboradores ainda não implementados |
| Validação | Confirmação com nota 1–5, pendência com justificativa, análise/devolução administrativa | `src/components/tickets/ValidationActions.tsx` | Sem fechamento automático, lembretes ou encerramento excepcional |
| Técnicos | Cadastro/edição, múltiplas secretarias, tipos autorizados e disponibilidade; atribuição/transferência auditada no chamado | `src/services/mock-technicians.ts`, `src/components/tickets/AssignmentActions.tsx` | Sem auditoria completa das edições do cadastro; perfil próprio somente leitura |
| Avisos | Central por destinatário, não lidos e leitura persistida; avisos de abertura/vínculo/conclusão/pendência/devolução | `src/data/notification-rules.ts`, `src/services/mock-notifications.ts` | Não há push para outro dispositivo |
| Mapa e proximidade | Mapa administrativo, filtro/modal/lista, posições fictícias e convites voluntários em novos chamados presenciais | `src/data/mock-positions.ts`, `src/pages/technician-map/Index.tsx` | Sem GPS real/segundo plano; captura apenas com plataforma aberta |

## 3. Atendimento aos requisitos obrigatórios

Referência histórica: manual, páginas 21–23. Esta avaliação é do frontend; não é inventário de funcionalidades do backend.

| Requisito | Situação demonstrada | Pendência operacional |
|---|---|---|
| Aplicação genérica/cadastro autorizado | Papéis, cadastro, unidades e tipos fictícios | Configuração persistida de catálogo/fluxos; modo atendente quando exigido pelo manual; exemplo fora da TI |
| Integração bidirecional | Não demonstrada pelo frontend | Origem/ID externo, entrada/saída, deduplicação e recuperação com legado |
| Web/mobile com push | Jornada responsiva e central local | Aplicativo validado em aparelho, push e captura em segundo plano |
| Rastreabilidade, validação e acesso | Histórico, intervalos, validação/avaliação e guardas demonstrativos | Autorização no servidor, persistência operacional, evidências e auditoria |
| Gamificação configurável | Ranking individual, pontos por prioridade, provisório/confirmado/revisão e períodos com persistência mockada | Ranking por equipe, regras configuráveis, divisão de colaboração e integração operacional |
| IA demonstrável | Não implementada | Auxílio útil e revisável, conforme passo 10; implantação compatível |
| Hospedagem municipal/código-fonte | Build e instruções do frontend disponíveis | Documentação integrada, infraestrutura, dependências/licenças/custos e tiles do mapa |

## 4. Limitações concretas atuais

1. Dados, credenciais e guardas são demonstrativos; a API não é consumida pela jornada. Não usar dados ou senhas reais.
2. Persistência local não sincroniza outro dispositivo. Backend/mobile precisam ser conferidos e integrar as mesmas regras, sem presumir que faltam funcionalidades nesses projetos.
3. Cooperação aprovada em chamado já assumido, foto/perfil editável, anexos/evidências, ranking por equipe/configuração e IA permanecem pendentes. Ranking individual por técnico foi entregue no mock (seção 14). Relatórios completos ficam para etapa posterior; o dashboard atende ao acompanhamento inicial.
4. GPS real, push, tratamento de segundo plano e política de plantão/escalonamento não foram demonstrados. Posições fictícias não comprovam deslocamento ou execução.
5. Contrato atual ainda contém campos legados em texto; unidades, catálogos, participantes e timestamps precisam de contrato operacional com IDs e validação no servidor.
6. Matriz de prioridade por impacto/urgência não está implementada: usuário abre com Normal; administrador escolhe Baixa/Normal/Alta no cadastro.
7. Mapa depende de tiles externos por padrão; configurar/documentar o funcionamento municipal. Lint/build e verificações de serviço não substituem validação visual em desktop/celular, ainda pendente.
8. Build aprovado com aviso de bundle acima de 500 kB; otimização por rotas permanece avaliação futura.

## 4A. Regras de negócio atualizadas

Esta seção consolida as regras de negócio atuais para backend, web e mobile. Distingue comportamento já aplicado no frontend, regra operacional futura e decisão pendente. A situação de entrega está nas seções 4B e 9.

### Classificação: tipo de chamado, natureza e local

- **Tipo de chamado:** catálogo vigente **Aquisição/Estoque, Suporte de TI, Redes e TI**. Classifica o serviço; não identifica equipe, técnico ou secretaria. O cadastro, filtro, ordem e distribuição do dashboard usam esse conceito.
- **Natureza:** Hardware ou Software, independente do tipo. Demanda mista permanece decisão pendente.
- **Secretaria:** órgão atendido e vínculo de responsabilidade do técnico. Um técnico pode atender várias secretarias e vários tipos.
- **Departamento/unidade:** subdivisão e local físico da secretaria. O solicitante escolhe uma unidade autorizada, da qual vêm secretaria e departamento.
- **Modalidade:** Presencial ou Remoto. Proximidade não é critério de convite em atendimento remoto.

Nomenclaturas anteriores são históricas. Migração do frontend: Suporte → Suporte de TI; Telecom → Redes; TI / Sistemas → TI; Aquisições / Estoque → Aquisição/Estoque. Campo vigente: `callType`; `area`/`team` permanecem compatíveis nesta fase, sem representar membros de equipe. Normalizar sem perder IDs, estado ou histórico. Todas as quatro opções aparecem no filtro mesmo sem chamados do tipo.

Secretarias/unidades atuais são fictícias: Saúde, Educação, Administração e Cultura. Não representam lista oficial municipal. Catálogos operacionais devem ser configuráveis, com IDs e coordenadas válidas para unidades presenciais; cadastros desses catálogos ainda não foram entregues no frontend.

### Papéis e canais

| Papel | Canal principal | Permissões e responsabilidades |
|---|---|---|
| Usuário da prefeitura/secretaria | Web | Login/perfil; cadastrar; consultar seus chamados abertos, em andamento e fechados; ver técnico, início e eventos; confirmar/avaliar entrega e indicar pendência |
| Técnico | Aplicativo | Login/perfil com foto; disponíveis, vinculados, em andamento, pausados e concluídos; aceitar chamado autorizado; ordem de serviço; eventos; início/pausa/retomada/conclusão; localização; push; ranking |
| Administrador | Web | Login/perfil; cadastrar; gerenciar técnicos, secretarias e tipos; atribuir/reencaminhar; dashboard e entregas; filtros; mapa agregado com modal; regras de pontos e notificações |

As permissões devem ser aplicadas no backend. Pertencer a outra secretaria não libera todo o histórico ou dados de usuários: um técnico elegível para cooperação recebe apenas os dados necessários à oportunidade e ao atendimento autorizado.

**Diferença em relação ao manual:** o usuário agora solicita abertura direta pelo usuário da prefeitura. O manual reserva abertura ao atendente e distingue demandante. O produto deve seguir a instrução nova, documentando essa diferença; se a entrega precisar cumprir literalmente o manual, manter modo configurável de abertura por atendente/autorizado e apresentar o conflito à organização. Os três papéis do produto não apagam a separação entre quem registra, quem executa e quem confirma.

### Cadastro do chamado

Campos: descrição; impacto no serviço (pessoas/unidades afetadas e existência de alternativa); urgência informada; contato disponível; necessidade de material/equipamento e local de retirada quando conhecidos; solicitante (usuário); secretaria; departamento; unidade/local e coordenadas para atendimento presencial; tipo de chamado; Hardware/Software; atendimento remoto/presencial; equipamento quando pertinente; prioridade; pontos previstos; identificadores de origem quando integrado. Usuário autenticado é solicitante por padrão; administrador pode abrir para outra pessoa, registrando autor e solicitante separadamente.

Prioridade e pontos devem seguir regra configurada, sem permitir que o solicitante manipule livremente pontuação ou prioridade alta. Um chamado de software pode não ter equipamento físico. Local deve apontar para unidade cadastrada, evitando distância calculada a partir de nome em texto.

### Vínculo, execução, pausa e tempo

**Status vigentes do chamado: Em aberto, Em análise e Resolvido.** Cadastro inicia Em aberto; assunção/atribuição passa para Em análise; confirmação do solicitante passa para Resolvido. Vínculo, execução, pausa, bloqueio, espera de validação e análise administrativa são etapas internas do atendimento, não novos status. O fluxo operacional permanece **Aberto → Vinculado → Em andamento ↔ Pausado/Bloqueado → Aguardando validação → Resolvido**, separado do status do chamado. Bloqueado interrompe execução e registra impedimento. Se o solicitante informa pendência: **Aguardando validação → Aguardando análise → Vinculado** (com responsável) ou **Aberto** (sem responsável), após análise/devolução administrativa. Devolução não inicia atendimento automaticamente.

- Vincular/aceitar não inicia automaticamente o cronômetro nem a captura; ação “Iniciar” abre sessão de execução.
- Tela de disponíveis permite assumir chamado da responsabilidade do técnico ou oportunidade de cooperação autorizada.
- Assunção é atômica no servidor: dois técnicos não podem virar responsáveis principais simultaneamente pelo mesmo chamado.
- Regra adotada: um atendimento em execução por técnico, inclusive participação ativa em cooperação; outros chamados podem ficar vinculados na fila. Participantes registram seus próprios intervalos de trabalho, papéis e contribuição, sem compartilhar um cronômetro indistinto.
- Eventos incluem descrição, tipo, autor e horário, preservados após pausa, transferência, conclusão e reabertura.
- Tempo ativo é soma dos intervalos iniciar/retomar até pausar/concluir; tempo pausado e tempo total são indicadores separados. Na operação integrada, relógio visual deve derivar dos timestamps do servidor e não zerar após fechar/reabrir o app. No mock atual, os intervalos usam o relógio do navegador e persistem após recarga.
- Pausa exige motivo categorizado e descrição quando necessária: material/terceiros, urgência autorizada, intervalo ou fim de expediente. O motivo fica registrado para indicadores; no frontend atual nenhuma pausa altera a disponibilidade informada. Automação de disponibilidade por motivo/turno continua pendente. Pausa interrompe contagem ativa e coleta/envio de novas posições. Retomada cria novo intervalo. Dados já capturados permanecem no histórico; envio tardio deve manter timestamp original e ser identificado como histórico.
- Conclusão encerra cronômetro/coleta e deixa a etapa interna Aguardando validação; o status do chamado permanece Em análise. A futura pontuação seguirá a política provisória/confirmada; pontos provisórios já são registrados no mock do frontend conforme seção 14. Resolução confirmada permanece etapa distinta.

### Monitoramento, localização e mapa

Adota-se provisoriamente a regra operacional mais específica fornecida: **monitorar durante chamados em andamento**, com posição enviada a cada **10 minutos**, interrompendo ao pausar ou concluir. A expressão “monitorar o tempo todo” foi interpretada como acompanhar todo o atendimento ativo, não coletar durante pausa ou fora dele. A abrangência fora do atendimento permanece decisão pendente.

Mapa do administrador mostra última posição conhecida, nunca garante posição instantânea. Modal deve conter técnico/foto, secretarias, chamado, unidade, estado, início, tempo ativo/pausado e horário/precisão da posição. Sinalizar dados antigos; sem posição, exibir “localização indisponível”. Raio de proximidade, validade máxima da posição e precisão aceitável devem ser parâmetros configuráveis. No mock: raio de 2 km, idade máxima de 15 minutos e precisão até 100 m; são valores de demonstração, não políticas municipais aprovadas.

Coleta de 10 minutos pode não detectar rapidamente a chegada ao hospital. É possível enviar posição na abertura/retomada e oferecer atualização contextual ao técnico, sem prometer localização contínua. Push por secretaria independe desse dado e resolve o caso principal mesmo quando não há GPS válido.

Captura em segundo plano é requisito a verificar em aparelho real. Não se pressupõe que a atual aplicação React responsiva consiga manter GPS com tela bloqueada; escolher solução mobile após prova funcional e registrar limitações.

### Nova regra: notificar por secretaria OU por proximidade

Em todas as linhas abaixo, exigir tipo compatível. Para convite de outra secretaria, exigir também disponibilidade informada Disponível; isso não impede estar ocupado e aceitar para fila.

**Receber aviso de abertura não significa receber atribuição obrigatória.** São eventos distintos: novo chamado da responsabilidade, oportunidade de ajuda e vínculo confirmado.

| Mesma secretaria do técnico? | Próximo com posição válida? | Resultado |
|---|---|---|
| Sim | Sim ou não, inclusive GPS indisponível | Notificar abertura independentemente da distância; informar que pertence à sua secretaria |
| Não | Sim, chamado presencial | Notificar oportunidade de cooperação; aceitar é voluntário e não há penalidade por recusa/ausência de resposta |
| Não | Não ou posição indisponível/desatualizada | Não notificar por proximidade; pode haver atribuição explícita pelo administrador, que gera seu próprio aviso |
| Sim e próximo | Sim | Uma notificação de abertura, com ambos os motivos; não duplicar aviso |

Cada técnico pode pertencer a uma ou mais secretarias cadastradas e deve ter tipo compatível. Para abertura, usar a união: **mesma secretaria e tipo autorizado OU outra secretaria, tipo autorizado e proximidade válida em chamado presencial**. No frontend, aviso da própria secretaria independe de disponibilidade/ocupação, inclusive Fora do expediente; convite entre secretarias exige disponibilidade informada Disponível. Política operacional de turno/plantão ainda deve ser definida. O técnico ocupado continua recebendo aviso da sua secretaria; estar ocupado afeta início/atribuição, não elimina a informação. Políticas de turno e avisos fora do expediente permanecem pendentes; não bloquear silenciosamente o caso do hospital.

Exemplo obrigatório: técnico da Saúde está atendendo no hospital; abre outro chamado no mesmo hospital. Ele recebe push de abertura por pertencer à Saúde, mesmo sem estar vinculado ao novo chamado ou sem GPS disponível. Se estiver distante, também recebe. Um técnico da Educação próximo recebe convite de ajuda voluntária; só passa a responsável/participante depois de aceitar e o servidor confirmar. Se já estiver ocupado, poderá aceitar para fila ou participar conforme política, sem iniciar dois atendimentos ativos simultaneamente.

Implementação necessária:

- [ ] Backend identifica secretarias responsáveis e candidatos próximos em cada nova abertura presencial.
- [ ] Deduplicar destinatários da união dos dois grupos por chamado/evento/técnico, inclusive em retransmissões.
- [ ] Push informa número, unidade, prioridade e motivo do aviso sem expor dados desnecessários na tela bloqueada.
- [ ] App abre detalhes com indicação “Sua secretaria” ou “Ajuda voluntária”; botão de aceite só quando elegível e disponível para assunção.
- [ ] Aceite de convite em chamado livre mantém secretaria original e registra um responsável principal, motivo e horário. Colaborador em chamado já assumido exige oferta e aprovação separadas. O primeiro caso já é simulado no frontend; o segundo permanece pendente.
- [ ] Proximidade usa distância entre posição válida do técnico e unidade, não rota fictícia nem endereço textual.
- [ ] App mostra aviso persistido/lista de novidades ao reconectar; push é transporte de aviso, não fonte única do chamado.
- [ ] Se chamado já foi assumido, atualizar tela e substituir assunção por “Oferecer ajuda”, quando autorizado. Responsável ou administrador aceita a colaboração; não trocar automaticamente o responsável e não gerar vínculo principal duplicado.
- [ ] Emitir push separado para vínculo/atribuição confirmada, inclusive quando realizada pelo administrador.

### Prioridade alta e disponibilidade

Quando surge prioridade alta, iniciar triagem de atendimento: localizar técnicos responsáveis disponíveis, avaliar competência/área, fila/atividade e posição válida quando atendimento presencial. Proximidade pode ajudar a escolher atendimento ou retirada de material; não substitui responsabilidade, competência ou disponibilidade.

Proposta: notificar responsáveis, sugerir ao administrador candidatos disponíveis e oferecer ajuda aos próximos autorizados; não interromper automaticamente atendimento em curso nem impor cooperação entre secretarias. Prazo de resposta, escalonamento e possibilidade de atribuição automática precisam de definição. Se não houver candidato, manter chamado visível como alta prioridade sem atribuição e alertar administrador.

Se houver retirada de equipamento/material, registrar necessidade e local de retirada; mostrar isso ao responsável. Critério de deslocamento considera retirada e destino somente com dados válidos; algoritmo de otimização de rota não foi solicitado nem está implementado.

### Pontuação e ranking

A gamificação é um jogo interno de reconhecimento das contribuições dos técnicos, com pontos e rankings individual e por equipe. Regras consolidadas a partir do plano do backend no commit 98e24e0; ver seção 13. Cada chamado terá pontos previstos segundo regras configuradas; técnico recebe crédito provisório ao concluir. Pontuação individual já implementada com mocks: Baixa 10, Normal 20 e Alta 40; detalhamento, acesso e limites na seção 14. Para conciliar com qualidade e confirmação exigidas pelo manual, adota-se crédito provisório na conclusão e definitivo na confirmação, com ajuste auditável em reabertura. Essa política passa a ser adotada nesta revisão; pesos, divisão de crédito e tratamento da ausência de resposta ainda devem ser configurados. Repetir conclusão, retransmitir evento ou transferir chamado não duplica pontos. Cooperação deve registrar contribuição e regra de divisão/bonificação explícita; não penalizar recusa voluntária nem pausa por dependência externa. Ranking individual e por equipe, períodos e histórico permanecem requisitos do manual.

### Decisões pendentes sem bloquear a documentação

- Catálogo operacional configurável de tipos/competências e tratamento de Hardware/Software misto. A nomenclatura atual já está definida: Aquisição/Estoque, Suporte de TI, Redes e TI.
- Raio de proximidade, idade/precisão máxima do GPS e política de turno/fora do expediente.
- Monitoramento fora do atendimento, pois conflita com pausa interrompendo captura.
- Limite de chamados vinculados em fila e procedimento de aprovação da colaboração; uma execução ativa por técnico e oferta de ajuda sem troca de responsável já são regras adotadas.
- Prazos/escalonamento de prioridade alta e atribuição automática versus decisão do administrador.
- Matriz de impacto/urgência, pesos de pontuação, divisão/bonificação de colaboração e tratamento de ausência de confirmação; confirmação definitiva e ajustes auditáveis na reabertura já são regras adotadas.
- Formato do app após validar GPS em segundo plano; ponto/local de retirada de equipamento.

## 4B. Regras aplicadas no frontend e responsabilidades das outras camadas

| Regra | Frontend atual | Backend e mobile operacional |
|---|---|---|
| Três papéis e acesso | Sessão por ID em sessionStorage; menus/rotas por papel; usuário vê seus chamados; técnico vê próprios e livres elegíveis; administrador vê todos | Autenticar/autorizar cada consulta e transição no servidor; sessão/token e logout operacional |
| Cadastro | Usuário abre para si em sua secretaria; administrador abre para conta não técnica e unidade do catálogo; técnico não cadastra | Validar autor/solicitante separadamente, unidade, tipo, campos e prioridade; gerar identificação no servidor |
| Tipos | Quatro tipos vigentes, normalização legada e filtro combinado com secretaria/busca/alta prioridade | Contrato único, catálogo configurável e competência por ID |
| Técnicos/disponibilidade | Administrador cadastra/edita; múltiplas secretarias/tipos; disponibilidade com motivo; identidade por ID | Persistência, credenciais protegidas, auditoria de cadastro, turnos/plantões |
| Aceite/fila | Revalida disponibilidade/tipo/secretaria ou convite; somente chamado Aberto sem responsável; vínculo não inicia tempo | Assunção atômica e transições autorizadas; concorrência entre dispositivos |
| Atribuição/transferência | Admin com justificativa; destinatário disponível e compatível com secretaria/tipo; ocupado recebe fila; ativo exige pausa | Aplicar invariantes no servidor, preservar histórico/intervalos e emitir evento de vínculo |
| Execução/tempo | Uma execução ativa por técnico responsável; intervalos persistidos, pausa/bloqueio encerram intervalo, retomada abre outro | Timestamps do servidor, autoria, idempotência e restrição incluindo futuros colaboradores |
| Validação/pendência | Somente solicitante confirma com nota 1–5 ou rejeita com justificativa; administrador analisa/devolve sem confirmar por terceiros | Mesmas permissões/estados; lembretes, alertas e eventual encerramento excepcional ainda a definir |
| Avisos | Destinatário fixado no evento; leitura por conta; deduplicação; avisos de abertura/vínculo/conclusão/pendência/devolução | Persistir eventos e leitura no servidor; push como transporte; validar acesso atual ao abrir |
| Mapa/proximidade | Últimas posições fictícias; 10 minutos com plataforma aberta; convite entre secretarias em abertura presencial | GPS real, precisão/idade, cadência em aparelho, segundo plano, envio e parâmetros configurados |
| Cooperação em chamado assumido | Não implementada | Oferta, aprovação, participantes, tempos próprios e política global de pausa/conclusão |
| Ranking individual | Entregue no mock, com dashboard técnico e filtros administrativos; usuário sem acesso | Autoridade de cálculo/persistência operacional, equipes e regras configuráveis |
| Foto/evidências/IA | Não implementados | Contratos, armazenamento, acesso e regras conforme próximas etapas |

Não marcar backend/mobile como entregues com base nesta tabela. Conferir o que já existe nesses projetos antes de implementar a integração.

### Regras detalhadas de cadastro, técnicos e transferências

Cadastro exige título, descrição (10–4000 caracteres), contato, impacto, urgência, unidade, tipo, natureza e modalidade. Equipamento é opcional, inclusive em Software. Material e local de retirada são registrados quando conhecidos. Usuário inicia com prioridade Normal; administrador pode escolher Baixa/Normal/Alta no cadastro. Matriz automática e alteração posterior de prioridade com justificativa permanecem planejadas.

Administrador gerencia nome, e-mail único, senha fictícia, pelo menos uma secretaria e um tipo autorizado, disponibilidade e motivo. E-mail é normalizado; nome alterado não muda o ID nem reescreve eventos históricos. Credenciais editadas passam a valer no login demonstrativo. Perfil/foto editáveis pelo próprio técnico e histórico completo de edições do cadastro ainda não existem.

Somente administrador atribui/transfere nesta etapa, com justificativa de 5–2000 caracteres. O técnico precisa atender secretaria e tipo e estar Disponível no cadastro, mesmo que já esteja ocupado. Estados permitidos: Aberto, Vinculado, Pausado e Bloqueado. Em andamento deve ser pausado antes; Aguardando validação, Aguardando análise e Resolvido não admitem essa ação. Transferência preserva impedimentos, motivos, intervalos e histórico; não inicia cronômetro.

### Regras detalhadas de avisos e persistência

| Evento novo | Destinatário do aviso |
|---|---|
| Abertura | Técnicos de secretaria/tipo compatíveis, mais convidados de outra secretaria elegíveis por proximidade |
| Assunção, atribuição ou transferência | Responsável confirmado |
| Conclusão | Solicitante, para confirmar/avaliar ou informar pendência |
| Pendência do solicitante | Administrador, para analisar |
| Devolução administrativa | Responsável, para continuar |

Não gerar avisos retroativos para amostras antigas. Deduplicar por chamado/evento/tipo/destinatário; nova conclusão após pendência é novo evento legítimo. Marcar lido não altera estado do chamado. Aviso antigo não concede acesso permanente: ao abrir, conferir estado atual e permissão; chamado assumido por outro ou transferido pode ficar indisponível ao destinatário anterior. Não há oferta de ajuda nesse caso enquanto cooperação não for implementada.

Chamados, eventos, avisos e posições usam `missao-sjp.mock-tickets.v1`; técnicos usam `missao-sjp.mock-technicians.v1`; leitura de avisos usa `missao-sjp.mock-notification-reads.v1`, em localStorage. Sessão guarda apenas ID por aba em sessionStorage; logout encerra sessão, preservando dados e leituras. Falha de gravação não deve publicar mudança ou aviso de ação não salva; dados ilegíveis bloqueiam alterações para preservar o conteúdo. As ações de chamados usam fila e Web Locks quando disponíveis; isso não substitui atomicidade/transações no servidor para múltiplos dispositivos.

## 4C. Refinamentos adotados após revisão das regras

Esta seção complementa as regras consolidadas. Algumas já são simuladas no frontend (seção 4B); outras permanecem futuras. Parâmetros operacionais não fornecidos e decisões de cooperação permanecem explicitamente pendentes.

### Aviso, responsabilidade e execução são eventos separados

1. **Aviso:** informa abertura ou oportunidade; não cria vínculo nem obrigação de cooperação.
2. **Vínculo:** aceite confirmado pelo servidor ou atribuição autorizada define responsável principal e fila; gera seu próprio aviso.
3. **Início:** abre intervalo de execução, cronômetro e coleta de localização.

Registrar cada evento com chamado, autor/origem, destinatário ou responsável e horário. Entrega do push não comprova leitura, aceite ou atendimento. Não usar quantidade de notificações como indicador de trabalho executado.

### Disponibilidade independente do estado do chamado

Separar **disponibilidade informada** (Disponível, Indisponível ou Fora do expediente, com motivo nos dois últimos casos) de **ocupação**, derivada da execução ativa. Ocupado não é valor editável de disponibilidade. O técnico pode estar ocupado e simultaneamente cadastrado como Indisponível/Fora do expediente. Pausa não altera a disponibilidade informada; não inferir plantão ou expediente do motivo da pausa. Alterar cadastro não interrompe automaticamente execução existente. Indisponível/Fora do expediente impede assumir, iniciar ou retomar, mas permite registrar eventos e pausar/bloquear/concluir atendimento em curso.

Na demonstração atual, receber aviso de secretaria/tipo independe de ocupação, distância ou disponibilidade informada; inclui técnicos fora do expediente. A política fora do expediente e eventual plantão deve ser configurada, sem inferir disponibilidade a partir de GPS ou aplicativo conectado. Aplicativo desconectado também não prova indisponibilidade profissional; mostrar separadamente conectividade e disponibilidade.

Uma execução ativa por técnico; múltiplos vínculos em fila são permitidos. Convite voluntário não tem penalidade por recusa ou ausência de resposta.

### Notificações úteis e cooperação

Convites por proximidade exigem atendimento presencial, posição recente/com precisão aceitável e competência cadastrada compatível. Sem esses dados, não presumir elegibilidade por proximidade. Aviso da secretaria continua independente do GPS; secretaria pode conter técnicos habilitados para tipos distintos; exigir tipo compatível para ambos os grupos e indicar o tipo no aviso.

Deduplicar por evento/chamado/técnico, agrupar avisos comuns quando configurado e evitar repetir convites sem mudança relevante. Alta prioridade deve seguir sua política própria de destaque/escalonamento. Persistir novidades no sistema para consulta quando o dispositivo reconectar.

Para chamado já assumido, “Oferecer ajuda” cria solicitação de colaboração. Responsável ou administrador aceita; o responsável principal permanece até transferência explícita e auditada. Registrar colaboradores e atividades realizadas. Recusar colaboração não reduz pontuação. Notificações pendentes devem abrir o estado atual, inclusive se chamado já foi resolvido ou transferido.

### Prioridade por impacto e urgência

Solicitante informa impacto e urgência; regra configurada sugere prioridade e administrador confirma/altera com justificativa. Considerar interrupção de serviço essencial, quantidade de usuários afetados e alternativa operacional. Não atribuir alta prioridade apenas porque o usuário selecionou “urgente”.

Configurar prazo de resposta/assunção, alerta por ausência de candidato e escalonamento ao administrador/plantão. Distinguir prazo até primeiro atendimento de duração de execução. Atraso do push não muda o timestamp de abertura.

Não interromper automaticamente outra tarefa. Administrador autoriza eventual troca por urgência, registra justificativa e mantém responsável/plano de continuidade do chamado interrompido. Cooperação entre secretarias permanece voluntária. Atribuição automática é possibilidade futura configurável, não regra adotada neste plano.

### Pausa e indicadores de tempo

Motivos mínimos: **aguardando material/terceiros**, **interrupção por urgência autorizada**, **intervalo** e **fim de expediente**. Impedimento exige registro do que falta e de quem pode atuar; gestor acompanha pendências.

Medir separadamente tempo ativo, pausado, espera até início, espera por material, espera por confirmação e tempo total desde abertura. Pausa nunca apaga tempo já consumido nem faz o chamado sumir do dashboard. Exibir andamento e impedimentos sem atribuir ao técnico atraso causado exclusivamente por terceiros.

Timestamps e intervalos pertencem ao servidor; app deriva cronômetro desses registros. Eventos repetidos não abrem/fecham duas vezes o mesmo intervalo. Colaboradores têm tempo próprio, e tempo total do chamado não é simplesmente a soma dos tempos de todas as pessoas.

### Localização e proteção contra decisões com dados antigos

Mapa usa rótulo “Última posição conhecida”, horário e precisão; posição desatualizada não entra no cálculo de proximidade. Sem GPS válido, manter elegibilidade/notificação por secretaria. Atendimento remoto não usa proximidade por padrão.

Manter envio a cada 10 minutos durante execução, com interrupção na pausa e conclusão. Não deduzir que técnico não trabalhou porque o aparelho não enviou posição. Falha de GPS, conectividade e horário do último evento devem ficar visíveis ao administrador separadamente do estado do serviço.

### Conclusão, confirmação e pontuação

Conclusão do técnico encerra execução/localização e move a etapa interna para “Aguardando validação”, mantendo status Em análise. Usuário confirma ou aponta pendência. Configurar lembretes e alertar administrador quando não houver resposta; sem regra expressa, **não fechar automaticamente nem inferir satisfação**. Eventual encerramento administrativo deve ter permissão, justificativa e distinguir-se de confirmação pelo usuário.

Conceder pontos provisórios únicos na conclusão e definitivos na confirmação; regra para ausência de resposta deve ser definida antes de utilizar ranking oficial. Reabertura aplica ajuste auditável, sem apagar entrega ou deduzir fraude automaticamente. Distribuição entre principal e colaboradores considera complexidade, qualidade e contribuição e deve aparecer de forma explicável. Separar saldo provisório e confirmado no ranking. Impedimentos externos e recusa voluntária não geram penalidade automática.

### Parâmetros obrigatórios antes de operar

- [ ] Política de expediente/plantão, destinatários e tratamento de avisos fora do horário.
- [ ] Raio de proximidade e limites de idade/precisão da posição.
- [ ] Matriz de impacto/urgência, prazos de resposta e destinatários de escalonamento.
- [ ] Aprovação de interrupção por urgência e continuidade da tarefa pausada.
- [ ] Pesos, divisão de crédito entre colaboradores e tratamento de validação sem resposta.
- [ ] Prazo/frequência de lembretes e possibilidade de encerramento administrativo com motivo.

### Pendências de implementação adicionais

| Melhoria adotada | Situação atual | Implementar |
|---|---|---|
| Eventos separados de aviso/vínculo/início | Sem persistência operacional | Contratos/eventos auditados e transições autorizadas |
| Disponibilidade independente | Cadastro e ocupação separados no mock | Turnos/plantão, conectividade e sincronização operacional |
| Cooperação em chamado assumido | Não implementada | Oferta, aprovação, participantes e transferência explícita |
| Prioridade por impacto/urgência | Campos registrados; Normal para usuário e escolha administrativa no cadastro | Matriz configurável, alteração justificada e escalonamento |
| Pausa categorizada | Motivos, intervalos e tempo ativo persistidos no mock | Persistência operacional e indicadores ampliados de espera/execução |
| Confirmação sem resposta | Não implementada | Lembretes, alerta administrativo e estado pendente |
| Crédito provisório/confirmado | Crédito único por chamado e revisões persistidos no mock; ranking individual com saldos separados | Backend, divisão de colaboradores e regras configuráveis |

## 5. Passo a passo das pendências

P0: jornada e infraestrutura de atendimento. P1: demais requisitos obrigatórios e entrega. P2: diferenciais. P1 não significa opcional. Este checklist é da entrega operacional integrada: itens sem marca não significam ausência da simulação no frontend. Conferir seções 2/4B/9 antes de repetir trabalho. Nomenclaturas antigas de área/equipe nesta sequência devem ser lidas como tipo de chamado quando classificam o serviço.

### Passo 1 — Definir contratos e fluxo [P0]

- [ ] Conferir o que o backend já oferece antes de implementar serviços; incorporar eventos separados de aviso/vínculo/início, disponibilidade do técnico e regras da seção 4C.
- [ ] Definir IDs de usuário, solicitante, setor, unidade, equipe e executor.
- [ ] Acrescentar origem/ID externo, eventos tipados, anexos, impedimentos e validação ao contrato.
- [ ] Definir transições autorizadas e quem pode realizá-las: aberto → atribuído/iniciado → em andamento → bloqueado/retomado → aguardando validação → resolvido.
- [ ] Definir atribuição e reabertura como estados ou eventos, preservando responsáveis e horários.
- [ ] Estabelecer que pendência do demandante retorna ao atendimento para análise e continuidade.

**Arquivos:** extrair domínio de `src/data/tickets.ts`, por exemplo para `src/interface/ticket.interface.ts`.

**Aceite:** contratos e exemplos de entrada/saída documentados e acordados com backend; conclusão e confirmação são operações distintas.

### Passo 2 — Implementar autenticação e permissões [P0]

- [ ] Integrar login, identidade e sessão ao backend.
- [ ] Implementar os três papéis do produto: usuário da prefeitura, técnico e administrador. Mapear responsabilidades de atendente/demandante para o usuário autorizado e de gestor para o administrador, conforme seção 4A; preservar auditoria e permitir acumulação explicitamente autorizada.
- [ ] Proteger rotas e apresentar menus/ações segundo permissões.
- [ ] Implementar logout, sessão expirada, credencial inválida e acesso negado.
- [ ] Separar explicitamente modo demonstração e autenticação operacional.

**Arquivos:** login, `src/routes.tsx`, layout, cliente HTTP e novos hooks/serviços de sessão.

**Dependência:** backend deve aplicar autorização. Esconder botões não protege os dados.

**Aceite:** acesso direto sem sessão é tratado; usuário não realiza ação fora de seu papel; sair invalida sessão conforme contrato.

### Passo 3 — Consumir API e compartilhar a fonte dos dados [P0]

- [ ] Configurar `VITE_API_URL` e criar serviços em `src/services` e hooks em `src/hooks`.
- [ ] Substituir arrays locais por fonte compartilhada entre dashboard, chamados e detalhes.
- [ ] Tratar carregamento, vazio, erro, nova tentativa e indisponibilidade.
- [ ] Definir filtros, busca, ordenação e paginação conforme API.
- [ ] Atualizar lista e indicadores após mutações; manter fixtures apenas no modo demo.

**Arquivos:** `src/lib/api-client.ts`, páginas de dashboard/chamados e detalhes.

**Aceite:** chamado mantém dados iguais nas telas e após recarregar; erro de API não aparece como lista vazia.

### Passo 4 — Cadastrar e atribuir demandas; configurar equipes [P0]

- [ ] Criar formulário para usuário da prefeitura e administrador autorizados: descrição, solicitante, secretaria, departamento, unidade/local, área de atendimento, hardware/software, modalidade remota/presencial, equipamento quando aplicável e prioridade conforme permissão.
- [ ] Validar campos e impedir envio duplicado; incluir impacto, urgência, contato, necessidade de material e retirada; aplicar matriz de prioridade com alteração administrativa justificada.
- [ ] Criar configuração mínima de setores, equipes, membros, tipos de tarefa e fluxos.
- [ ] Permitir atribuição a pessoa ou equipe e registrar mudanças de responsável.
- [ ] Demonstrar chamados nos tipos Aquisição/Estoque, Suporte de TI, Redes e TI, em secretarias diferentes. Preservar configuração genérica para a exigência do manual; a demonstração fora da TI permanece pendência de compatibilidade, não escopo confirmado do produto.

**Arquivos:** chamados, novo formulário e página de equipes/configurações; habilitar menu ao concluir funcionalidade.

**Aceite:** usuário cadastra e acompanha apenas seus chamados; administrador pode cadastrar para outro solicitante com auditoria; técnico assume chamado permitido ou recebe atribuição. A abertura pelo usuário é alteração explícita em relação ao manual, registrada na seção 4A.

### Passo 5 — Construir a jornada do executor no celular [P0]

- [ ] Criar login e perfil do técnico com foto; listas de chamados disponíveis, vinculados/em andamento, pausados e concluídos; permitir assumir chamado aberto autorizado, sem atribuição duplicada.
- [ ] Implementar iniciar, registrar evento descritivo, pausar com motivo, registrar impedimento, solicitar apoio, retomar e concluir com descrição; exibir cronômetro de tempo ativo e interromper contagem/coleta durante pausa.
- [ ] Anexar e consultar evidências, com limites acordados com backend.
- [ ] Exibir envio em andamento, sucesso/erro e histórico atualizado; implementar disponibilidade independente, pausa categorizada e oferta/aprovação de ajuda em chamado já assumido.
- [ ] Tratar alterações concorrentes sem sobrescrever ações de terceiros silenciosamente.
- [ ] Conclusão deve levar a “Aguardando validação”, sem resolver automaticamente.

**Arquivos:** nova página de missões e componentes de ações; reutilizar detalhes e serviços.

**Aceite:** executor realiza atendimento no celular; gestor vê eventos persistidos com autor e horário.

### Passo 6 — Demonstrar push verdadeiro [P0]

- [ ] Escolher app ou web mobile, formatos permitidos pelo manual.
- [ ] Para web push: implementar service worker, inscrição do dispositivo, pedido contextual de permissão e registro da inscrição no backend.
- [ ] Integrar três notificações distintas: novo chamado da secretaria independentemente da distância, oportunidade voluntária por proximidade e vínculo/atribuição confirmada. Ao tocar, abrir o chamado correto e suas ações autorizadas; ver regras da seção 4A.
- [ ] Tratar permissão negada, dispositivo incompatível, inscrição inválida e logout; aplicar expediente/plantão, competência para cooperação, deduplicação, atualização de convite antigo e escalonamento da prioridade alta.
- [ ] Documentar transporte de push, dependências e compatibilidade com implantação municipal.

**Dependência:** backend de envio, ambiente seguro e dispositivo/navegador compatível.

**Aceite:** abertura na secretaria notifica técnico mesmo distante; abertura próxima em outra secretaria oferece aceite voluntário; atribuição notifica o vinculado. Testar técnico da Saúde atendendo no hospital quando surge outro chamado naquela unidade. Tocar abre tarefa respeitando acesso. Toast, badge e temporizador não comprovam push.

### Passo 7 — Implementar confirmação e avaliação do demandante [P0]

- [ ] Criar perfil do usuário e “Meus atendimentos”, restrito às demandas autorizadas, com abertos/em andamento/fechados, responsável, início e eventos, incluindo indicação de pausa e conclusão aguardando confirmação.
- [ ] Mostrar entrega e evidências permitidas.
- [ ] Permitir confirmar resolução e avaliar o atendimento.
- [ ] Permitir informar problema persistente com descrição da pendência.
- [ ] Encaminhar pendência para análise/continuidade preservando a conclusão anterior; implementar lembretes e alerta por ausência de confirmação, sem fechamento automático não configurado.

**Aceite:** demonstrar confirmação em uma tarefa e rejeição em outra; só confirmação gera resolução validada.

### Passo 8 — Demonstrar integração bidirecional e recuperação [P0]

- [ ] Preparar com backend um legado simulado para enviar demandas e receber eventos.
- [ ] Exibir origem e ID original; mostrar sincronização/falhas aos perfis autorizados.
- [ ] Retornar andamento, impedimentos, conclusão e validação conforme recursos do contrato.
- [ ] Garantir identificação única por origem + ID externo e idempotência de eventos no backend.
- [ ] Preservar eventos em armazenamento durável e reenviar após falha de comunicação.

**Dependência:** conector, idempotência e fila são principalmente responsabilidades do backend; frontend acompanha resultados.

**Aceite:** entrada repetida não duplica chamado; legado indisponível recebe eventos pendentes quando volta, sem perda/duplicação.

### Passo 9 — Implementar gamificação configurável [P1, obrigatório]

- [ ] Criar pontos/conquistas e rankings individual e por equipe, com setor e período.
- [ ] Configurar pesos de qualidade, complexidade e colaboração por perfil autorizado.
- [ ] Definir pontos por chamado e exibir justificativa. Conclusão do técnico concede pontuação provisória única; confirmação torna definitiva e rejeição aplica ajuste auditável. Essa política foi adotada na revisão; pesos, divisão entre colaboradores e ausência de resposta permanecem parâmetros a definir. Cooperação entre secretarias deve ter crédito explícito sem duplicar integralmente pontos.
- [ ] Implementar crédito provisório/confirmado separado, divisão explicável entre colaboradores e ajustes idempotentes; definir tratamento justo de impedimentos externos e evitar premiar apenas volume/velocidade.
- [ ] Implementar períodos, inclusive mensal, com novo placar sem apagar histórico.

**Dependência:** cálculo e histórico persistidos no backend.

**Aceite:** regras ajustáveis alteram resultado demonstrável; novo período reinicia placar e mantém consulta ao anterior.

### Passo 10 — Integrar aplicação útil de IA [P1, obrigatório no manual; fora da interface nesta fase]

Decisão atual do produto: assistente de IA retirado dos menus desktop/mobile e menção removida do login. Não reintroduzir IA nesta fase do frontend apenas por este checklist. O manual exige uma aplicação útil de IA; manter essa diferença documentada e alinhar o escopo da entrega final antes de implementar. Os itens abaixo são o caminho de compatibilidade futura com o manual.

- [ ] Escolher função concreta, como sugerir categoria/equipe e apontar dados faltantes no cadastro.
- [ ] Exibir sugestão, justificativa e opções aceitar/editar/recusar, com erro/carregamento.
- [ ] Exigir conferência humana para alterações de prioridade, encaminhamento ou avaliação.
- [ ] Chamar pelo backend; não expor credenciais em variáveis `VITE_*`.
- [ ] Documentar dados utilizados, componente e execução compatível com infraestrutura municipal.
- [ ] Identificar componentes simulados e plano de implementação definitiva.

**Aceite:** descrição gera auxílio útil e revisável; apresentação distingue funcional de simulado. Menu/texto promocional não comprova IA.

### Passo 11 — Corrigir e ampliar indicadores [P1]

- [ ] Usar dados compartilhados, datas/eventos reais, períodos e fuso definidos.
- [ ] Calcular estados, tempo até início, execução, confirmação, motivos de bloqueio, reaberturas e satisfação conforme dados disponíveis.
- [ ] Explicar cada cálculo, distinguindo recebidos no período e resolvidos no período.
- [ ] Tratar zero registros, divisão por zero e ausência de avaliações.
- [ ] Permitir abrir atendimento a partir dos pontos de atenção do dashboard; filtrar por secretaria, área, técnico, prioridade, estado e período; mostrar entregas dos técnicos e tempo ativo versus pausado.

**Aceite:** conclusão, confirmação e reabertura alteram indicadores coerentemente, sem apagar histórico.

### Passo 12 — Validar interface e comportamento [P1]

- [ ] Verificar fluxo completo em desktop e celular real.
- [ ] Validar teclado, foco/modal, labels, mensagens, contraste, zoom e leitor de tela.
- [ ] Garantir descrição textual do mapa e identificação dos estados além das cores.
- [ ] Oferecer lista/cartões para execução mobile sem depender do Kanban largo.
- [ ] Adicionar testes de comportamento para permissões, conclusão versus validação, reabertura e falha de API; testar aceite concorrente, cooperação sem troca de principal, uma execução ativa, pausa sem disponibilidade automática, aviso sem GPS e pontuação sem duplicação.
- [ ] Executar lint, TypeScript, build e roteiro integrado com backend/push.

**Aceite:** jornada e cenários de falha funcionam no dispositivo da demonstração, sem perda de informações ou ações indevidas.

### Passo 13 — Documentar e preparar implantação [P1, obrigatório]

- [ ] Atualizar README com pasta correta, rotas, papéis, variáveis e limites reais.
- [ ] Documentar instalação, configuração, build e publicação SPA com fallback para `index.html`.
- [ ] Documentar HTTPS, push/service worker e atualização de versão/caches quando aplicável.
- [ ] Relacionar dependências, licenças, custos e serviços externos; definir tiles/configuração municipal do mapa.
- [ ] Entregar código e instruções integradas de sistema/banco com backend.
- [ ] Identificar componentes funcionais, simulados e futuros.
- [ ] Preparar dados fictícios e roteiro; não usar nomes/contatos reais da foto.

**Aceite:** outra pessoa instala e executa seguindo documentação e entende como hospedar no datacenter municipal.

### Passo 14 — Implementar monitoramento e mapa administrativo [P0 nas novas regras]

- [ ] Implementar captura real de localização durante atendimento, com envio a cada 10 minutos; obter posição ao iniciar/retomar e registrar horário e precisão. Coleta ao iniciar/retomar é proposta para evitar uma janela inicial sem posição.
- [ ] Tratar permissão negada, aparelho sem sinal, app em segundo plano e eventos offline; suspender coleta na pausa e conclusão, sem apagar histórico. Alertar quando posição estiver desatualizada e não exibi-la como posição atual.
- [ ] Criar mapa agregado do administrador, com última posição conhecida dos técnicos autorizados; clique abre modal com foto/nome, secretarias, chamado atual, estado, tempo ativo/pausado, horário e precisão da posição. Técnicos sem posição válida aparecem em lista, sem coordenada inventada.
- [ ] Encerrar rastreamento por evento real de pausa/conclusão, não pelo fim do trajeto calculado; administrar sessão ativa no servidor.
- [ ] Validar em dispositivo real a captura em segundo plano e a cadência de 10 minutos; não considerar temporizador JavaScript de página suficiente. Escolha do formato do app depende dessa validação.
- [ ] Deixar offline completo, QR Code e voz como diferenciais P2.

**Aceite:** durante execução, o app envia localização a cada 10 minutos nas condições suportadas e medidas no aparelho; pausa interrompe captura/envio e cronômetro; retomada inicia novo intervalo; conclusão encerra sessão. Mapa indica última atualização e abre informações corretas do técnico. Localização era negociável no manual, mas passa a obrigatória no produto pelas novas regras; offline completo permanece diferencial.

## 6. Ordem recomendada de entregas

1. Contratos, sessão e dados comuns: passos 1–3.
2. Cadastro, atribuição/aceite, execução, cronômetro, localização, mapa, push e validação: passos 4–7 e 14.
3. Integração de entrada/saída e recuperação: passo 8.
4. Gamificação, IA e indicadores: passos 9–11.
5. Validação e implantação documentada: passos 12–13.
6. Diferenciais posteriores: offline completo, QR Code e voz. O monitoramento do passo 14 é P0 nas novas regras.

Todos os requisitos obrigatórios precisam ser demonstrados no conjunto final. Evitar refinar apenas aparência enquanto faltam operações da jornada.

## 7. Checklist da apresentação

- [ ] Atendente registra uma demanda fictícia no legado simulado.
- [ ] Plataforma recebe e mantém origem/ID.
- [ ] Administrador atribui e técnico recebe push de vínculo no celular.
- [ ] Técnico da Saúde recebe abertura no hospital e também quando distante, sem depender de proximidade.
- [ ] Técnico da Educação próximo recebe convite voluntário, aceita sem alterar secretaria original; recusa não penaliza.
- [ ] Dois técnicos disputando aceite não geram responsáveis duplicados.
- [ ] Pausa interrompe tempo ativo e localização; retomada continua histórico; mapa administrativo mostra horário da última posição.
- [ ] Executor inicia, registra falta de material e gestor acompanha.
- [ ] Executor retoma, conclui e anexa evidência.
- [ ] Demandante confirma/avalia; outro exemplo rejeita e retorna ao atendimento.
- [ ] Legado recebe atualizações; repetição/falha temporária comprovam recuperação.
- [ ] Pontos e indicadores atualizam; novo período preserva histórico anterior.
- [ ] IA auxilia uma decisão com revisão humana.
- [ ] Chamados de Saúde e Educação demonstram vínculo por secretaria; configuração para outros setores preserva arquitetura genérica. Demonstração fora da TI continua pendência específica do manual.
- [ ] Equipe explica implantação, dependências e limitações.

- [ ] Prioridade deriva de impacto/urgência; ausência de candidato e prazo excedido alertam administrador.
- [ ] Chamado já assumido permite oferta de ajuda sem substituir responsável.
- [ ] Falta de confirmação gera lembrete/alerta, sem resolução automática.
- [ ] Ranking distingue pontos provisórios e confirmados; eventos repetidos não duplicam crédito.

## 8. Verificações e limites desta análise

- `npm run lint`: aprovado, sem erros reportados.
- `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json`: aprovado.
- `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.node.json`: aprovado.
- Código das páginas, rotas, layout, dados, detalhes, mapa, HTTP e configurações inspecionado.
- Registro inicial: build e testes visuais não executados naquela análise. Atualização: build e verificações de serviço passaram na retomada; interface em navegador/celular continua pendente. Pasta dist isoladamente não comprova correspondência com código atual.
- Backend, integrações externas e segurança em execução não auditados.
- Nenhum arquivo de implementação foi alterado nesta análise ou na revisão de regras. Os resultados de lint/TypeScript acima pertencem à análise inicial; não foram repetidos nesta alteração apenas documental.

Verificações estáticas aprovadas não comprovam os fluxos de negócio exigidos pelo manual. O documento é um plano técnico baseado nesta versão do frontend; atualizar o checklist conforme implementação.



## 9. Atualização do produto e próximas entregas — 09/10/2026

Esta seção registra o estado mais recente e a sequência acordada para o frontend. As seções 1–4C foram consolidadas nesta revisão com as regras atuais para os três projetos; checklists operacionais das seções 5–7 não devem confundir simulação entregue com integração concluída. Integração operacional com backend/mobile permanece futura para a jornada do frontend.

### Estado atual e validação antes da próxima entrega

A jornada cadastro → aceite/atribuição → início → eventos → pausa/bloqueio/retomada → conclusão → confirmação/avaliação ou pendência → análise/devolução administrativa já funciona com mocks e persistência local. Também foram entregues sessão demonstrativa por papel, gestão de técnicos/disponibilidade, central de avisos por conta e mapa administrativo de últimas posições fictícias.

O mapa oferece filtro por secretaria, lista textual e modal com técnico, atendimento, disponibilidade, tempos e horário/precisão da posição. Capturas simuladas são persistidas durante execução com a aplicação aberta, respeitando intervalo de 10 minutos; pausa, bloqueio e conclusão interrompem novas capturas. Histórico permanece disponível, e posições antigas/imprecisas são sinalizadas. Sem posição, não inventar coordenadas do técnico. Foto ainda pendente.

Chamado presencial livre pode gerar convite voluntário por proximidade a técnico de outra secretaria, com tipo compatível, disponibilidade e posição válida. O aceite revalida elegibilidade, preserva a secretaria original e vincula sem iniciar atendimento. Não há colaboração aprovada em chamado já assumido nesta entrega. Parâmetros de demonstração: 2 km, idade máxima de 15 minutos e precisão até 100 m; não representam regras municipais definitivas. Atendimento remoto não usa proximidade. Avisos da própria secretaria independem de distância e ocupação.

- [x] Lint, build e verificações de comportamento do mapa/convites e ciclo integrado aprovados na entrega.
- [ ] Validar visualmente mapa, modal, posições antigas/indisponíveis e convites em navegador desktop e celular antes de avançar.
- [ ] Conferir pausa/retomada/conclusão e acesso por papel no roteiro visual.

GPS real, execução em segundo plano, push para outro dispositivo e integração operacional do frontend com backend não foram entregues. O backend não foi auditado nesta revisão. Persistência é local ao navegador; guardas e credenciais são demonstrativas. O build mantém aviso de bundle acima de 500 kB.

### Próxima etapa: cooperação em chamado já assumido

Implementar primeiro com serviços mockados e persistência local, mantendo a futura substituição pela API. Cooperação não deve substituir automaticamente o responsável principal nem alterar a secretaria de origem.

- [ ] Permitir que técnico elegível ofereça ajuda em chamado já assumido, respeitando competência/tipo e acesso autorizado.
- [ ] Permitir aprovação da oferta pelo responsável principal ou administrador; oferta pendente não cria vínculo nem inicia execução.
- [ ] Ao aprovar, registrar o técnico como colaborador, com papel explícito; manter um único responsável principal.
- [ ] Cada participante registra eventos com autoria e intervalos próprios de trabalho; não compartilhar um cronômetro indistinto.
- [ ] Aplicar uma execução ativa por técnico, inclusive como colaborador; vínculo em fila não inicia tempo.
- [ ] Aplicar pausa/retomada e interrupção de captura ao intervalo do participante, preservando histórico e disponibilidade independente.
- [ ] Persistir oferta, decisão, participantes, eventos e tempos; impedir duplicação de vínculo e avisos em ações repetidas.
- [ ] Recusa voluntária ou ausência de resposta ao convite não gera penalidade automática.
- [ ] Restringir consulta e ações aos participantes/perfis autorizados e emitir avisos mockados separados para oferta e decisão.
- [ ] Preservar conclusão e validação como operações distintas; colaboração não autoriza o técnico a confirmar a resolução em nome do solicitante.

Critério de aceite: demonstrar oferta → aprovação → vínculo como colaborador → execução com eventos e tempo próprios, preservando responsável/secretaria/histórico. Mostrar oferta pendente sem execução, tentativa de segunda execução ativa bloqueada e recarga sem perda ou duplicação. Validar em desktop/celular, executar lint/build e verificações de comportamento.

Antes de implementar transições, explicitar o efeito da pausa/conclusão do responsável sobre colaboradores ativos e quem pode encerrar a entrega global. A política precisa preservar intervalos, autorização e uma execução ativa por técnico; não presumir encerramento silencioso de sessões de terceiros.

### Ordem das entregas seguintes

1. Cooperação aprovada em chamado já assumido, conforme critérios acima.
2. Perfil editável e foto do técnico: persistência mockada, validação do arquivo e exibição no perfil/mapa; upload operacional futuro.
3. Evidências do atendimento: anexar e consultar com autoria, horário, limites e acesso por perfil; preservar vínculo ao atendimento/histórico.
4. Ranking e jogo interno, conforme seção 13: crédito provisório na conclusão e confirmado na validação; contribuição dos colaboradores e ajustes de reabertura explicáveis, auditáveis e sem duplicação; rankings individual/equipe por período, preservando histórico.

Pesos, divisão de crédito, tratamento de ausência de confirmação e parâmetros operacionais continuam pendentes de definição. Estas etapas são planejadas, não funcionalidades concluídas. A sequência não remove requisitos futuros de backend, GPS/push reais, integração com legado e implantação, nem a divergência de IA: fora da interface nesta fase, embora exigida pelo manual para a entrega final.


## Retomada do frontend — 09/10/2026

Estado: mapa administrativo e convites por proximidade entregues com mocks. Cooperação em chamado já assumido continua pendente; nenhuma funcionalidade de cooperação foi entregue nesta retomada.

- [x] Código do mapa, posições, convites, permissões, execução e notificações revisado na retomada.
- [x] npm run lint aprovado novamente.
- [x] Verificações de comportamento existentes executadas novamente (C:/Users/Micro/hackaton-map-stage/check.cjs): cadência de 10 minutos; interrupção/retomada; expiração e precisão; autoria da posição após transferência; modalidade remota; competência; convites e deduplicação; cadastro → convite → aceite → execução → conclusão; persistência; rejeição de segundo aceite; falha de armazenamento.
- [ ] Validar visualmente mapa/modal e convites em desktop e celular. Nenhuma ferramenta de navegador foi disponibilizada nesta sessão; verificações do serviço não substituem essa validação.
- [ ] Definir política de pausa/conclusão em cooperação e quem encerra a entrega global. Pergunta enviada ao usuário; resposta ainda pendente no momento deste registro.
- [ ] Implementar oferta → aprovação pelo responsável/administrador → vínculo como colaborador, com eventos e intervalos próprios, sem substituir responsável/secretaria e sem iniciar automaticamente.
- [ ] Entregas posteriores: perfil/foto → evidências → ranking e pontos.

Build desta retomada: aprovado; permanece o aviso de bundle acima de 500 kB. Preservadas as alterações locais preexistentes. GPS, push, segundo plano e integração com backend continuam futuros para o frontend; não é avaliação da implementação do backend.


## 10. Registro da consolidação das regras — 09/10/2026

Documento movido pelo usuário para a raiz do frontend e definido como referência de negócio para backend, web e mobile. Atualizados catálogo de tipos, papéis, cadastro, fluxo de pendência/análise, disponibilidade versus ocupação, atribuição/transferência, destinatários dos avisos, proximidade e persistência/falhas. Corrigidos diagnósticos antigos que descreviam o frontend como consulta sem sessão ou operações. Requisitos operacionais do manual e próximas entregas foram preservados.

Cooperação ainda não implementada. Tempos independentes e conclusão global pelo responsável após todos encerrarem são recomendação, não decisão aprovada. Efeito de pausa/conclusão sobre colaboradores e autorização para encerrar entrega continuam pendentes.

Revisão documental baseada no código, sem mudanças de implementação e sem novos testes de aplicação. Últimas verificações registradas: lint/build e roteiro de serviços aprovados; validação visual ainda pendente. Backend/mobile não auditados. Links do README passam a apontar para o plano na mesma pasta.


## 11. Simplificação dos status do chamado — 09/10/2026

Nova instrução do usuário: chamados têm somente **Em aberto, Em análise e Resolvido**. Regra comum para backend, web e mobile. Não usar Vinculado, Em andamento, Pausado, Bloqueado, Aguardando validação ou Aguardando análise como status públicos do chamado.

| Acontecimento | Status do chamado | Informação interna do atendimento |
|---|---|---|
| Cadastro | Em aberto | Sem responsável; aguardando assunção/atribuição |
| Assumir/atribuir | Em análise | Vinculado à fila; tempo ainda não iniciado |
| Iniciar/retomar | Em análise | Execução ativa; cronômetro e posição |
| Pausar/bloquear | Em análise | Execução interrompida com motivo, sem novas posições |
| Concluir pelo técnico | Em análise | Entrega aguardando confirmação do solicitante |
| Solicitar análise/devolver | Em análise, ou Em aberto se devolvido sem responsável | Pendência e encaminhamento preservados no histórico |
| Confirmar pelo solicitante | Resolvido | Entrega confirmada e avaliação registrada |

Mantida a confirmação do solicitante já adotada no produto; simplificar status não elimina permissões, tempos, pausa, impedimentos ou validação. Contrato do frontend separa status de executionState (etapa interna). Backend/mobile devem manter a mesma separação e validar a coerência dos dois campos.

Migração: Aberto → Em aberto; Resolvido → Resolvido; demais status antigos → Em análise. A etapa original permanece em executionState; preservar IDs, vínculos, intervalos, histórico, posições, avisos e validações. Não descartar chamados existentes nem apagar armazenamento. Kanban passa a três colunas; filtros de status e indicadores usam apenas o catálogo novo. Detalhes exibem a etapa de execução para orientar ações.

Trechos anteriores com estados antigos descrevem etapas internas ou histórico de entregas e não ampliam o catálogo vigente. Cooperação, perfis/fotos, evidências e ranking por equipe seguem pendentes; ranking individual posteriormente entregue na seção 14. Validação desta mudança: lint, build e npm run check:statuses aprovados (migração dos oito estados, recarga, dados inválidos/falha de gravação, permissões, uma execução ativa, pausa/bloqueio, posições, conclusão, pendência, devolução e confirmação). Verificação visual em navegador/celular permanece pendente; build mantém aviso de bundle acima de 500 kB.


## 12. Menus desta fase — 09/10/2026

Decisão do usuário: retirar Conquistas e Relatórios dos menus do frontend, em desktop e mobile. Itens eram desabilitados e não possuíam rotas próprias. O dashboard permanece para acompanhamento inicial. Relatórios detalhados ficam para depois; pontos e rankings individual/equipe continuam no planejamento e no requisito de gamificação do manual. A remoção não altera permissões, chamados, indicadores ou contratos de backend/mobile. Ranking do técnico era Em breve nesta entrega; foi habilitado posteriormente na seção 14.

Entregue: removidas as duas entradas do catálogo compartilhado de navegação administrativa. Validação: revisão do catálogo e das referências; lint aprovado. Não realizada validação visual em navegador.


## 13. Ranking e gamificação como jogo interno — alinhamento com backend, 09/10/2026

### Fonte e alcance desta atualização

Fonte: [plano de regras do backend](../Hackaton-backend/ANALISE_FRONTEND_E_PLANO_DE_IMPLEMENTACAO.md), incluído no commit **98e24e0 — add regra ranking**, especialmente Pontuação e ranking, Conclusão/confirmação/pontuação e Passo 9 — Gamificação configurável. O pedido atual define a experiência como um **jogo interno** para reconhecer o atendimento e a colaboração dos técnicos.

Registro do alinhamento anterior: o commit do backend consultado adiciona documentação, sem comprovar endpoints. Naquele momento não havia ranking no frontend; a implementação posterior está registrada na seção 14. As regras abaixo também orientam backend e mobile. Preservar as regras mais recentes do frontend: status públicos Em aberto, Em análise e Resolvido; etapas internas de atendimento separadas; Conquistas e Relatórios fora dos menus nesta fase. Não copiar de volta os diagnósticos e catálogos antigos presentes no documento do backend.

### Regras de pontuação e reconhecimento

1. Cada chamado terá pontos previstos, definidos por regras configuráveis. Solicitante não escolhe livremente pontos ou prioridade para aumentar crédito.
2. Conclusão pelo técnico concede **crédito provisório único**. O chamado continua Em análise, com entrega aguardando confirmação; pontuação não resolve o chamado automaticamente.
3. Confirmação/avaliação do solicitante torna o crédito **definitivo** e o chamado Resolvido. Mostrar separadamente saldo provisório e saldo confirmado.
4. Pendência/reabertura produz ajuste auditável conforme política configurada, preservando entrega, avaliação e lançamentos anteriores. Não presumir fraude ou aplicar penalidade automática pela rejeição.
5. Repetição de conclusão, retransmissão de evento e transferência não duplicam pontos. Uma reconclusão após pendência deve tratar o mesmo atendimento e seus ajustes de forma explicável, sem recriar integralmente o crédito.
6. Cooperação registra papel, contribuição e divisão/bonificação explícita entre responsável e colaboradores. Não conceder integralmente o mesmo crédito a todos sem regra de distribuição.
7. Regras consideram **qualidade, complexidade e colaboração**; pesos são configuráveis por perfil autorizado. Não premiar somente volume ou velocidade.
8. Pausa por dependência externa, recusa voluntária e ausência de resposta a convite não geram penalidade automática. Falha de GPS não comprova ausência de trabalho.
9. Ausência de confirmação exige política definida antes de ranking oficial; não converter automaticamente provisório em confirmado, fechar chamado ou inferir satisfação sem regra aprovada.

### Rankings e períodos

- Rankings **individual e por equipe**, com setor e período; incluir período mensal.
- Novo período reinicia o placar daquele período sem apagar histórico; períodos anteriores continuam consultáveis.
- Pontos provisórios e confirmados devem ser distinguíveis. A política exata de ordenação do placar e desempates ainda precisa ser definida; não presumir fórmula ou prioridade de desempate.
- Tipo de chamado não é equipe. A gestão atual cadastra técnicos, secretarias e tipos autorizados, mas não demonstra um cadastro operacional de equipes e seus membros; definir esse vínculo antes de calcular ranking por equipe.
- Cada resultado deve explicar de quais atendimentos, regras e ajustes veio. Preservar rastreabilidade da contribuição do principal e de colaboradores.

### Experiência prevista no frontend e no mobile

O jogo interno será apresentado por uma futura área **Ranking**, com placar individual/equipe, seleção de período e acompanhamento da própria contribuição. A apresentação deve distinguir previsto, provisório e confirmado e permitir entender o histórico dos lançamentos e ajustes. O planejamento individual foi entregue na seção 14; equipe e configuração continuam futuras.

Menu Ranking habilitado para técnico e administrador na entrega da seção 14. A área administrativa de regras e o acesso aos rankings de equipe devem seguir permissões a definir. Usuário solicitante continua responsável por confirmar/avaliar a entrega; não recebe poder de editar pontos.

Não reintroduzir automaticamente os menus Conquistas ou Relatórios: sua retirada foi autorizada e continua vigente. O plano do backend menciona conquistas como possibilidade da gamificação, mas critérios, formatos e acesso ainda não estão definidos. Eventual reconhecimento poderá ser apresentado dentro da experiência de Ranking após definição, sem exigir uma tela separada. Níveis, XP, medalhas, recompensas e metas não constam como regras especificadas na fonte consultada; não tratá-los como implementados ou aprovados.

### Responsabilidade do backend e contrato a integrar

O backend operacional deve calcular crédito, validar permissões, persistir regras/lançamentos, evitar duplicação e manter períodos/histórico. Web/mobile exibem esses resultados e decisões, sem calcular pontuação oficial de forma independente. Na fase atual, uma futura simulação local deve ser claramente identificada como mock.

Antes de integrar, conferir o que o backend efetivamente oferece. O contrato deverá permitir representar período, participante/equipe, chamado e contribuição, pontos previstos/provisórios/confirmados, origem/motivo do lançamento, ajustes e regra aplicada. Esses são dados necessários ao planejamento, não nomes de endpoints ou DTOs existentes.

### Decisões ainda pendentes

- [ ] Valores de pontos por chamado e pesos de qualidade, complexidade e colaboração.
- [ ] Cadastro de equipes/membros e regras de agregação do ranking de equipe.
- [ ] Divisão/bonificação de colaboradores e ajuste em pendência/reabertura/reconclusão.
- [ ] Ordenação do placar, desempates e tratamento de participantes sem pontos.
- [ ] Datas, fuso e fechamento de períodos; período mensal é requisito, mas limites exatos não foram acordados.
- [ ] Tratamento da ausência de confirmação e eventual encerramento excepcional.
- [ ] Permissões de consulta/configuração e critérios de eventuais conquistas.
- [ ] Se níveis, recompensas ou outros elementos de jogo farão parte de entrega futura.

### Entregas e critérios de aceite

- [x] Regras de ranking e gamificação do documento do backend incorporadas ao plano do frontend com referência à fonte.
- [x] Preservados três status públicos, confirmação do solicitante e retirada de Conquistas/Relatórios.
- [ ] Implementar primeiro com mocks identificados, conforme sequência da seção 9, depois integrar ao contrato conferido do backend.
- [ ] Exibir saldo provisório/confirmado, placares individual/equipe, período e histórico explicável.
- [ ] Demonstrar conclusão → provisório → confirmação → definitivo; pendência/reabertura mantém histórico e aplica ajuste auditável.
- [ ] Demonstrar repetição/retransmissão/transferência sem crédito duplicado e cooperação sem duplicação integral.
- [ ] Demonstrar novo período sem apagar placar anterior e regras ajustáveis com resultado explicável.
- [ ] Validar permissões, cálculo, falhas, estados vazios e interface desktop/mobile antes de considerar entregue.

Validação desta atualização: leitura e comparação dos documentos; nenhuma mudança no código ou novo teste de aplicação. A sequência atual permanece cooperação → perfil/foto → evidências → ranking/jogo interno. Remoção de menus feita anteriormente permanece como alteração local ainda não commitada.


## 14. Ranking entregue no frontend — 09/10/2026

Nova instrução: usuário solicitante não acessa ranking; técnico tem dashboard com pontos por chamado e placar; administrador acessa todos os resultados e filtra por técnico. Esta seção prevalece sobre planejamentos anteriores que deixavam Ranking como Em breve ou o colocavam apenas após as demais etapas. Cooperação, foto e evidências continuam pendentes.

### Política adotada com autorização do usuário

- Baixa: **10 pontos**; Normal: **20 pontos**; Alta: **40 pontos**. Regra demonstrativa prioridade-v1, sem prêmio por velocidade ou punição por pausa.
- Crédito provisório na conclusão; confirmado na confirmação pelo solicitante. Pendência coloca crédito em revisão, fora dos dois saldos ativos, preservando lançamentos.
- Reconclusão substitui o crédito em revisão do mesmo chamado, sem somar novamente. Um crédito corrente por chamado; auditoria preserva autor, beneficiário, horário, motivo e valor de cada revisão.
- Crédito registra o técnico que concluiu e a prioridade/regra daquele momento. Transferência ou alteração de nome não transfere/recalcula crédito antigo; nova entrega registra seu executor.
- Placar individual ordenado por pontos confirmados, com posições compartilhadas nos empates; nomes ordenam apenas a apresentação dos empatados. Técnicos sem pontos aparecem sem posição conquistada.
- Período mensal definido pela data da conclusão em America/Sao_Paulo. Confirmação posterior confirma o crédito no mês da entrega. Todo o histórico continua consultável. Reconclusão usa sua nova data; revisão anterior permanece na auditoria.
- Meta visual de incentivo: **100 pontos confirmados por mês**, sem penalidade e sem limitar acúmulo. Não é moeda ou recompensa operacional.

### Acesso e experiência entregues

- [x] Dashboard técnico /dashboard-tecnico, nova página inicial após login; saldo confirmado/provisório, entregas confirmadas, posição e progresso do mês.
- [x] Ranking /ranking apenas para técnico/administrador; usuário redirecionado pela guarda e serviço rejeita consulta desse papel.
- [x] Técnico vê placar agregado dos técnicos e somente seu detalhamento de créditos por chamado; sem filtro para investigar chamados de terceiros.
- [x] Administrador vê tudo, filtra técnico e mês e consulta histórico de créditos. Filtro por técnico preserva posição no placar geral.
- [x] Ranking habilitado nos menus desktop/mobile do técnico e administrador; acesso pelo dashboard administrativo. Conquistas e Relatórios continuam removidos.
- [x] Pontos, versões e revisões persistidos junto ao chamado, na mesma gravação dos eventos/avisos. Falha de armazenamento preserva estado anterior.
- [x] Exemplos e entregas anteriores com conclusão registrada recebem crédito demonstrativo reconstruído do histórico, explicitamente identificado. Autoria histórica atribuída ao responsável registrado; não é cálculo oficial ou inferência de colaboração.

### Limites e próximas entregas

Ranking individual entregue com mocks locais. Não implementados: ranking por equipe (cadastro de membros ainda pendente), divisão de colaboradores, configuração administrativa dos pesos, backend de pontuação, notificações de pontos, recompensas e calendário operacional configurável. Patentes foram implementadas posteriormente conforme seção 15. Credenciais/guardas continuam demonstrativas; não oferecem segurança de servidor. A API precisa persistir/corroborar regras e lançamentos antes de uso operacional.

Validação desta etapa: npm run lint, npm run build, npm run check:ranking e npm run check:statuses aprovados. Verificações cobrem pesos, período/fuso, acesso por papel, detalhamento próprio, filtros/empates, provisório/confirmado/revisão, reconclusão sem duplicação, autoria e persistência/falhas. Build mantém aviso de bundle acima de 500 kB. Interface em navegador/celular continua pendente de validação visual.


## 15. Patentes do jogo interno — 09/10/2026

Catálogo ampliado e aprovado pelo usuário: **dez patentes militares**. Esta tabela substitui as quatro faixas iniciais. Limiares vigentes para a demonstração:

| Patente | Pontos confirmados acumulados |
|---|---|
| Soldado raso | 0–99 |
| Soldado | 100–249 |
| Cabo | 250–499 |
| Sargento | 500–799 |
| Subtenente | 800–1.199 |
| Tenente | 1.200–1.799 |
| Capitão | 1.800–2.599 |
| Major | 2.600–3.599 |
| Coronel | 3.600–4.999 |
| General | 5.000 ou mais |

Patente usa a soma dos créditos confirmados de todo o histórico do técnico; não reinicia mensalmente e não depende do filtro de período do placar. Pontos provisórios e em revisão não contam. Crédito ajustado/revisado pode alterar a classificação: patente reflete o saldo confirmado atual, não um título irrevogável. Reconclusão não duplica crédito. A regra de prioridade permanece Baixa 10, Normal 20 e Alta 40.

Técnico vê patente atual, pontos acumulados, progresso dentro da faixa e quantidade faltante para a próxima no dashboard/ranking. General é a faixa máxima, mas os pontos continuam acumulando. Placar mostra patente e saldo histórico de cada técnico junto aos resultados do período. Administrador consulta todas as patentes e, ao filtrar técnico, vê sua progressão; usuário solicitante continua sem acesso.

Faixas/insígnias representam reconhecimento no jogo interno, não cargo, autorização ou hierarquia funcional municipal. Símbolos e cores têm rótulos textuais; progressão tem descrição acessível. Configuração operacional de limiares e validação no backend permanecem futuras. Não há novo menu de Conquistas ou Relatórios.

- [x] Faixas e progresso implementados no frontend com dados mockados.
- [x] Pontos históricos separados dos saldos mensais; filtros não reiniciam patente.
- [x] Acesso por perfil preservado; administrador filtra técnico.
- [ ] Integrar regra/cálculo ao backend e permitir configuração dos limiares quando necessário.

Validação: npm run check:ranking, npm run lint e npm run build aprovados; verificados limiares exatos, progresso, faixa máxima, independência do mês e exclusão de créditos provisórios/em revisão. Build mantém aviso de bundle acima de 500 kB. Interface em navegador/celular permanece pendente de validação visual.


### Ampliação das patentes — 09/10/2026

Aplicadas dez faixas aprovadas pelo usuário: Soldado raso → Soldado → Cabo → Sargento → Subtenente → Tenente → Capitão → Major → Coronel → General. Catálogo, insígnias, progresso, testes e os três documentos de regras atualizados. General exige 5.000 pontos confirmados; os limiares anteriores foram substituídos, sem alterar os créditos dos chamados. A patente é recalculada automaticamente sobre o saldo existente. Validação desta ampliação: npm run check:ranking, npm run lint e npm run build aprovados, incluindo limites inferiores/superiores das dez faixas, progresso e General em 5.000 pontos. Validação visual em navegador/celular permanece pendente.
