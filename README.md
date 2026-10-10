# Missão SJP — Frontend

Frontend para atendimento de TI da Prefeitura, com visão web para usuário/administrador e visão mobile para técnico. O código atual implementa a jornada de atendimento com dados fictícios e persistência local; integração com backend, GPS e push reais ficam para uma etapa posterior.

Este README registra o estado observado do código e os próximos passos conforme as regras de negócio definidas. Plano detalhado: [análise e regras de negócio](ANALISE_FRONTEND_E_PLANO_DE_IMPLEMENTACAO.md).

## Perfis de demonstração

Veja [perfis-de-acesso.md](./perfis-de-acesso.md) para credenciais, rotas e permissões mockadas. Usuário, técnico e administrador já possuem login demonstrativo com sessão por aba, navegação por papel e perfil somente leitura.

## O que já foi feito

- [x] Base React 18, TypeScript 5.6, Vite 6, React Router 7 e Tailwind 3.
- [x] Identidade visual Missão SJP e layout com navegação desktop/mobile.
- [x] Login demonstrativo com campos obrigatórios e opção de mostrar senha.
- [x] Dashboard com contadores, gráfico, períodos de 7/30 dias, busca e filtros locais.
- [x] Chamados em Kanban e tabela, busca sem acentos, filtro por equipe/prioridade e ordenação por número.
- [x] Modal da ordem de serviço com solicitante, unidade, equipe, técnico, equipamento, impedimentos e histórico fictício.
- [x] Status dos chamados: Em aberto, Em análise e Resolvido. Etapas operacionais aparecem nos detalhes do atendimento.
- [x] Mapa Leaflet com destino, trajeto, posição e distância simulados; aviso quando o fundo não carrega.
- [x] Componentes locais Button, Input, Label, Dialog e componentes de dashboard.
- [x] Cliente Axios preparado para `VITE_API_URL`, ainda sem consumo pelas páginas.
- [x] Labels, nomes acessíveis, estados textuais e link para o conteúdo em partes da interface.
- [x] Assistente de IA retirado dos menus desktop/mobile e menção à IA removida do login. IA fora do escopo da interface nesta fase.

**Limitações atuais:** sessão e guardas são apenas simulações locais, sem segurança de backend; dashboard e listas agora usam a mesma base mockada persistida; aceite, início, eventos, pausa/bloqueio, cronômetro e conclusão já estão implementados com mocks; validação/avaliação do solicitante e análise/devolução administrativa também estão implementadas; ainda faltam cooperação, evidências, push, GPS real e ranking por equipe/configuração. Ranking individual e dashboard técnico já entregues com mocks. Técnicos está habilitado; Conquistas e Relatórios foram retirados dos menus nesta fase. Responsividade não comprova um aplicativo capaz de capturar GPS em segundo plano.

## Regras que orientam a implementação

| Conceito | Regra |
|---|---|
| Escopo inicial | Atendimento de TI; tipos vigentes Aquisição/Estoque, Suporte de TI, Redes e TI; natureza e secretaria são conceitos separados |
| Secretaria | Responsabilidade de atendimento, por exemplo Saúde e Educação; não confundir com área técnica |
| Natureza/modalidade | Hardware ou Software; remoto ou presencial |
| Usuário web | Perfil, abertura e acompanhamento dos próprios chamados; confirmação/avaliação da entrega |
| Técnico mobile | Perfil/foto, disponíveis, fila, execução, eventos, pausa/retomada, conclusão e ranking |
| Administrador web | Perfil, cadastro, gestão/atribuição, dashboard, entregas e mapa agregado dos técnicos |
| Aviso, vínculo e início | Eventos separados; receber push não assume tarefa nem inicia cronômetro |
| Avisos de abertura | Secretaria do técnico independentemente da distância; ou convite voluntário por proximidade válida e competência compatível |
| Cooperação | Chamado livre pode ser assumido; chamado já assumido permite oferecer ajuda sem trocar automaticamente o responsável |
| Execução | Um atendimento ativo por técnico; vários chamados podem ficar vinculados na fila |
| Pausa | Motivo obrigatório; para tempo ativo e localização, sem tornar técnico disponível automaticamente |
| Localização | Durante execução, envio a cada 10 minutos; pausa/conclusão interrompem coleta. Mapa mostra última posição conhecida e horário |
| Prioridade | Impacto e urgência orientam regra; alteração administrativa justificada; urgência não interrompe outro atendimento automaticamente |
| Conclusão | Técnico conclui e chamado aguarda confirmação; pendência retorna ao atendimento; ausência de resposta gera lembrete/alerta |
| Pontuação | Crédito provisório único na conclusão e definitivo na confirmação; colaboração/reabertura possuem ajustes explicáveis e auditados |

Exemplo obrigatório: novo chamado no hospital chega por push ao técnico responsável pela Saúde mesmo sem vínculo com esse chamado, estando perto ou distante. Técnico de outra secretaria próximo recebe oportunidade voluntária; recusa não gera penalidade.

Raio de proximidade, validade/precisão do GPS, expediente/plantão, prazos de escalonamento, lembretes e pesos/divisão dos pontos ainda precisam ser definidos. Monitoramento fora do atendimento não foi confirmado; a regra atual é captura apenas durante execução.

O manual original exige abertura por atendente e uma aplicação de IA. As instruções atuais autorizam abertura pelo usuário e retiram IA da interface nesta fase. Essas diferenças permanecem documentadas no plano da raiz; não considerar o protótipo automaticamente conforme a todos os requisitos do manual.

## Atualização do plano: frontend primeiro

Todo desenvolvimento desta fase usa dados mockados, sem depender do backend. Os serviços serão simulados e substituídos pela API posteriormente. Já foram entregues os três perfis, validação das credenciais fictícias, sessão por aba, guardas por papel, menus e consulta filtrada de chamados. Já foram entregues também os mocks compartilhados, cadastro por usuário/administrador, ordem de serviço digital e persistência local. As ações do técnico também já foram entregues com persistência local. Confirmação/avaliação e retorno de pendência também foram entregues. Próximas pendências: perfis editáveis/foto, evidências, disponibilidade, notificações e mapa mockados, cooperação e ranking. Edição de perfil/foto e demais ações continuam pendentes.

O roteiro abaixo preserva também tarefas futuras de integração; referências ao backend não bloqueiam a entrega mockada.

## Próximos passos, na ordem recomendada

### 1. Contratos, serviços e dados compartilhados

- [ ] Conferir contratos existentes do backend e acordar IDs, estados, permissões e erros.
- [ ] Separar interfaces de domínio dos dados fictícios de `src/data/tickets.ts`.
- [ ] Modelar secretarias, áreas, unidades, técnicos, competências, disponibilidade, chamado, participantes, eventos e intervalos de execução.
- [x] Criar serviço mockado `src/services/mock-tickets.ts` e hook `src/hooks/use-tickets.ts`; integração HTTP fica para depois do frontend.
- [x] Unificar dashboard, lista e detalhes na mesma fonte, persistida em `localStorage` no modo demonstração.
- [ ] Tratar carregamento, vazio, erro, nova tentativa e atualização após alterações.

**Conclusão desta etapa:** mesmo chamado é consistente nas telas e persiste após recarregar; falha de API não aparece como lista vazia.

### 2. Sessão e navegação por perfil

- [ ] Integrar login, identidade e logout reais.
- [ ] Criar contexto/hook de sessão e proteger rotas por usuário, técnico e administrador.
- [ ] Exibir menus/ações permitidos e tratar sessão expirada/acesso negado.
- [ ] Criar perfil e atualização de foto para técnico conforme contrato de upload.

**Conclusão desta etapa:** cada perfil acessa suas funções; backend também aplica autorização, inclusive acesso aos dados de terceiros.

### 3. Cadastro e acompanhamento do usuário

- [x] Criar formulário com resumo/descrição, solicitante, secretaria/departamento derivados da unidade, área, Hardware/Software, remoto/presencial, equipamento, impacto, urgência, contato e material/local de retirada.
- [x] Aplicar validações de cadastro e proteção contra envio repetido no formulário. Usuário recebe prioridade Normal; administrador seleciona prioridade. Matriz de impacto/urgência ainda pendente.
- [ ] Criar “Meus chamados” com abertos, em andamento e fechados, responsável, início, eventos e estados intermediários.
- [x] Permitir cadastro pelo administrador para outra conta mockada autorizada, preservando autor e solicitante.

**Conclusão desta etapa:** usuário abre e acompanha apenas suas demandas autorizadas, sem alterar livremente pontos/prioridade.

### 4. Visão do técnico e aceite

- [x] Criar filtros de disponíveis, vinculados/fila, em andamento, pausados, bloqueados e concluídos.
- [x] Reaproveitar ordem de serviço e incluir ações responsivas do técnico.
- [x] Implementar aceite dos abertos da própria secretaria; convite/cooperação entre secretarias continua pendente.
- [ ] Oferecer ajuda em chamado já assumido, com aprovação do responsável/administrador.
- [ ] Tratar disputa de aceite: servidor confirma um responsável principal, sem duplicação.

**Conclusão desta etapa:** técnico assume chamado permitido ou entra como colaborador, com papel visível e histórico preservado.

### 5. Execução, eventos, cronômetro e pausa

- [x] Implementar iniciar, registrar evento descritivo, pausar/bloquear, retomar e concluir. Anexo de evidências continua pendente.
- [x] Aplicar uma execução ativa por técnico responsável. Colaboração ativa ainda pendente.
- [x] Categorizar pausa: material/terceiros, urgência autorizada, intervalo e fim do expediente. Justificativa também obrigatória para bloqueio.
- [ ] Separar disponibilidade do técnico do estado do chamado; pausa não libera automaticamente.
- [x] Derivar cronômetro ativo de intervalos persistidos localmente. Tempo total/pausado detalhado e timestamps de servidor ficam para etapas posteriores.
- [ ] Tratar eventos repetidos, concorrência e falha de envio sem perder registro.

**Conclusão desta etapa:** fechar/reabrir app mantém tempo correto; conclusão encerra execução e move para aguardando validação.

### 6. Confirmação do usuário

- [x] Mostrar entrega e permitir confirmação com nota 1–5 ou indicação de pendência com justificativa. Upload de evidências permanece pendente.
- [x] Retornar pendência para Aguardando análise; administrador registra orientação e devolve para a fila sem apagar conclusão, tempos ou validações anteriores.
- [ ] Implementar lembretes e alerta administrativo por ausência de resposta.
- [ ] Não inferir satisfação ou encerrar automaticamente sem regra explícita.

**Conclusão desta etapa:** jornada usuário → técnico → usuário funciona com confirmação e rejeição demonstráveis.

### 7. Notificações push

- [ ] Integrar cadastro do dispositivo/inscrição, permissões e transporte escolhido.
- [ ] Implementar abertura por secretaria, convite voluntário por proximidade e aviso separado de vínculo.
- [ ] Deduplicar destinatários/eventos e respeitar política de expediente/plantão definida.
- [ ] Ao tocar, abrir estado atual do chamado, inclusive quando já assumido/resolvido.
- [ ] Manter novidades persistidas para consulta ao reconectar.

**Conclusão desta etapa:** testar caso do hospital, técnico distante da mesma secretaria e próximo de outra; toast não substitui push.

### 8. Localização e mapa do administrador

- [ ] Fazer prova de GPS em segundo plano/tela bloqueada em celular real, em paralelo às primeiras etapas.
- [ ] Escolher formato mobile a partir dessa prova, sem presumir capacidade do React responsivo atual.
- [ ] Enviar posição a cada 10 minutos durante execução; parar na pausa/conclusão, preservando histórico.
- [ ] Tratar GPS negado, sinal ausente, posição antiga e conectividade separadamente do andamento.
- [ ] Criar mapa agregado com modal: foto/nome, secretarias, chamado, estado, início, tempos e horário/precisão da posição.
- [ ] Não usar posição inválida/desatualizada para proximidade; atendimento remoto dispensa esse critério por padrão.

**Conclusão desta etapa:** cadência medida no dispositivo; administrador vê última posição conhecida sem confundir com localização instantânea.

### 9. Dashboard operacional e prioridade alta

- [ ] Conectar indicadores à mesma base das tarefas.
- [ ] Filtrar por secretaria, área, técnico, estado, prioridade e período.
- [ ] Mostrar entregas, tempo ativo/pausado, espera, impedimentos e validação pendente.
- [ ] Apresentar candidatos por disponibilidade/competência e localização válida quando pertinente.
- [ ] Alertar administrador sobre alta prioridade sem candidato ou prazo excedido.
- [ ] Exigir autorização/justificativa para interromper outro atendimento por urgência.

**Conclusão desta etapa:** indicadores refletem eventos reais e diferenciam execução de espera por material/terceiros.

### 10. Ranking e pontos

- [ ] Exibir pontos previstos por chamado e critério aplicado.
- [ ] Implementar crédito provisório/confirmado, ajustes de reabertura e contribuição dos colaboradores.
- [ ] Integrar rankings individuais/equipe e períodos, inclusive mensal, preservando histórico.
- [ ] Garantir no backend crédito idempotente, sem duplicar por retransmissão/transferência.

**Conclusão desta etapa:** pontuação é explicável; recusa voluntária e bloqueio externo não geram penalidade automática.

### 11. Validação e entrega

- [ ] Testar jornada completa e permissões em desktop/celular.
- [ ] Validar teclado, foco, contraste, zoom, leitor de tela e formulários.
- [ ] Testar aceite concorrente, pausas, confirmação/reabertura, falha de API, push e GPS em segundo plano.
- [ ] Executar lint e build; documentar limites do dispositivo e das integrações.
- [ ] Documentar implantação municipal, fallback SPA, HTTPS, dependências/licenças/custos e serviços externos.
- [ ] Preservar plano de integração bidirecional com legado e recuperação de falhas, exigidos pelo manual.

## Primeira entrega funcional

Priorizar **contratos + sessão por perfil + cadastro/acompanhamento do usuário**, depois a execução do técnico.

A primeira jornada completa será: usuário cadastra → técnico assume → inicia → registra evento → pausa/retoma → conclui → usuário confirma ou aponta pendência. Mapa e ranking vêm depois dessa base; prova de GPS em segundo plano começa cedo para orientar o aplicativo.

## Dependências do backend

Autenticação/autorização, persistência, aceite atômico, intervalos de execução, eventos, uploads, seleção de destinatários, push, posições, integração legado e pontuação precisam de suporte do backend. O frontend apresenta e coordena essas operações; não substitui regras do servidor. O backend não foi auditado neste README, portanto conferir o que já existe antes de implementar.

## Executar

Node `>=22.15.0 <23`, conforme `package.json`; `.nvmrc` indica `22.15.0`.

```powershell
cd C:\Projeto\Hackaton\Hackaton_frontend
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. `npm run preview` serve o build localmente.

## Configuração

Copiar `.env.example` para `.env.local` ao configurar integrações:

| Variável | Uso |
|---|---|
| `VITE_API_URL` | Base da API; páginas ainda não fazem chamadas |
| `VITE_MAP_TILE_URL` | Tiles do mapa; padrão externo OpenStreetMap no protótipo |
| `VITE_MAP_ATTRIBUTION` | Créditos do provedor quando substituído; o código possui valor padrão |

Variáveis `VITE_*` são públicas no navegador: não armazenar segredos. Definir provedor/configuração do mapa compatível com implantação municipal e preservar atribuição.

## Rotas atuais

| Rota | Tela |
|---|---|
| / e /login | Login demonstrativo |
| /meus-chamados | Chamados do usuário |
| /dashboard-tecnico | Dashboard do técnico com pontuação e ranking |
| /ranking | Ranking e pontos; técnico e administrador, com filtro administrativo |
| /minhas-missoes | Chamados do técnico e disponíveis da secretaria |
| /perfil | Perfil somente leitura da conta conectada |
| /tecnicos | Gestão mockada dos técnicos pelo administrador |
| /notificacoes | Central de avisos mockados por conta |
| /mapa-tecnicos | Mapa agregado e últimas posições fictícias, exclusivo do administrador |
| `/dashboard` | Dashboard fictício |
| `/chamados` | Kanban/tabela e detalhes fictícios |
| `/exemplo-1` e `/exemplo-2` | Exemplos da base, a revisar/remover quando apropriado |
| Demais rotas | Página não encontrada |

## Estrutura e convenções

- `src/pages`: páginas; `src/routes.tsx`: roteamento.
- `src/layout`: estruturas compartilhadas; `src/components`: interface, chamados e mapa.
- `src/components/ui`: componentes locais, editáveis e versionados, baseados em Radix/shadcn.
- `src/data`: fixtures de chamados, rastreamento e navegação.
- `src/interface`: contratos; `src/lib`: Axios e utilitários.
- `src/services/mock-tickets.ts` e `src/hooks/use-tickets.ts`: armazenamento compartilhado e assinatura de mudanças locais/entre abas; futuro HTTP em serviço separado.

Fluxo recomendado: página/componente → hook → serviço → cliente HTTP. Alias `@/` configurado em TypeScript/Vite. Tailwind 3 processado por PostCSS; tokens em `src/index.css` e configuração em `tailwind.config.js`. Utilizar classes completas, labels associados aos campos e nomes acessíveis em botões de ícone. Componentes shadcn são código local, sem CLI necessária para executar. Não migrar dependências automaticamente ao implementar funcionalidades.

## Cadastro e ordem de serviço digital entregues

- “Novo chamado” habilitado para usuário e administrador; técnico não acessa cadastro.
- Usuário abre para si e em unidade de sua secretaria; administrador escolhe solicitante e unidade do catálogo fictício.
- Ao salvar, recebe número, estado Aberto e evento inicial com autor/horário; consulta a ordem digital imediatamente ou pela lista.
- Chamado aparece para o solicitante, administrador e como disponível para técnico da secretaria correspondente.
- Armazenamento em `missao-sjp.mock-tickets.v1` no `localStorage`, preservado após recarga/logout. Dados não são compartilhados entre navegadores/dispositivos e não há backend.
- Cadastro inválido ou falha de escrita preserva os campos; armazenamento corrompido exibe aviso e bloqueia gravação sem sobrescrever dados existentes.
- Novas ordens sem coordenadas não recebem um mapa inventado; ordens remotas indicam que proximidade não se aplica. O mapa dos exemplos iniciais continua explicitamente simulado.
- Descrição e contato seguem a ficha em papel; classificação, impacto, urgência e material complementam a ordem digital. Autor e solicitante ficam separados no cadastro administrativo.
- Mocks atuais ainda usam nomes para vínculos antigos; novos chamados têm IDs de solicitante/autor. Aceite concorrente e conflitos de escrita entre abas serão tratados no fluxo de execução.

Validação desta entrega: lint e build aprovados; verificações do serviço passaram para cadastro, recarga/persistência, prioridade, autorização, IDs e falhas de armazenamento. Jornada visual em navegador/dispositivo ainda não foi validada nesta entrega.

## Execução do técnico entregue

Na conta `tecnico@demo.sjp`, abra a ordem de serviço em “Minhas missões”:

1. Em **Disponíveis**, “Assumir chamado” move para **Vinculado / Minha fila** sem iniciar tempo.
2. “Iniciar atendimento” move para **Em andamento** e abre intervalo do cronômetro.
3. “Registrar evento” exige descrição e preserva autor/horário no histórico.
4. “Pausar” exige categoria e justificativa; “Bloquear” exige descrição do impedimento. Ambos encerram intervalo ativo.
5. “Retomar atendimento” abre novo intervalo e mantém justificativas antigas no histórico.
6. “Concluir serviço” exige descrição da entrega, encerra intervalo e move para **Aguardando validação**, sem marcar Resolvido.

Justificativa atual de bloqueio aparece em “Pendências / Impedimentos”; pausa aparece no resumo de execução; ambas ficam no histórico. Técnico só altera chamados sob sua responsabilidade. Listas do usuário, administrador e dashboard recebem o mesmo estado local.

Um atendimento ativo impede iniciar/retomar outro; chamados adicionais podem ser assumidos para fila. A amostra inicial já contém um chamado em andamento de Camila Santos: pause ou conclua esse exemplo antes de iniciar novo atendimento. Exemplos antigos derivam tempo de horários fictícios históricos; novos atendimentos usam os intervalos reais da demonstração local.

Escritas de ações são serializadas na aba e, quando o navegador suporta Web Locks, também entre abas. Sem Web Locks não há garantia de exclusão entre abas; isso permanece limitação dos mocks, sem garantia de concorrência de backend. Categoria “urgência autorizada” registra a escolha no protótipo; aprovação administrativa ainda não está implementada.

Tempo persiste após recarga e não cresce durante pausa/bloqueio/conclusão. GPS, push, anexos, cooperação, pontuação e lembretes automáticos continuam pendentes; validação do solicitante já está disponível. Mapas antigos permanecem simulações dos exemplos; chamados operados não inventam rastreamento real.

Checks desta etapa: lint/build aprovados e verificações do serviço para autorização, aceite repetido/concorrente na aba, uma execução ativa, descrições obrigatórias, eventos, pausa/bloqueio/retomada, tempo ativo, conclusão pendente, recarga e falha de escrita. Validação visual em navegador/dispositivo ainda pendente.

## Validação e retorno de pendências entregues

No chamado em **Aguardando validação**, o solicitante tem duas opções na ordem de serviço:

- **Confirmar resolução e avaliar:** nota obrigatória de 1 a 5, comentário opcional; muda para **Resolvido** e registra autor/horário, nota e comentário.
- **O problema continua:** descrição obrigatória (5–2000 caracteres); muda para **Aguardando análise** e preserva entrega, tempo e histórico.

Em **Aguardando análise**, o administrador abre a ordem em Chamados e usa **Devolver para atendimento**, registrando orientação obrigatória. O chamado volta para **Vinculado** ao técnico anterior, ou **Aberto** se não houver responsável. Não reinicia cronômetro automaticamente. O técnico inicia um novo intervalo, conclui novamente e o solicitante pode validar a nova entrega.

Somente o solicitante valida, inclusive se for administrador que solicitou o próprio atendimento. Administrador não confirma em nome de terceiros nesta etapa; encerramento administrativo excepcional não está implementado. Técnico não valida sua entrega nem retoma chamado aguardando análise. Filtros e Kanban incluem o novo estado.

Histórico e seção “Validações do solicitante” preservam todas as respostas; seção de pendência mostra motivo e encaminhamento administrativo. A resolução possui timestamp próprio, separado da conclusão do técnico. Notificações, lembretes, pontuação e encerramento automático não foram implementados; não há fechamento automático por ausência de resposta.

Roteiro: usuário cadastra na Saúde → técnico assume/inicia/conclui → usuário informa pendência → administrador analisa/devolve → técnico inicia/conclui novamente → usuário confirma com nota. Também é possível confirmar diretamente a primeira entrega. O exemplo 14150 pertence a Ana Silva e já está aguardando validação na amostra inicial, caso ainda não tenha sido alterado.

Verificações desta etapa: lint/build aprovados; testes do serviço para permissões, nota/justificativa, análise/devolução, nova execução, confirmação duplicada, histórico persistido, recarga e falha de gravação. Validação visual no navegador/celular permanece pendente.

## Verificações

```powershell
npm run lint
npm run build
```

Lint e build passaram na alteração que retirou o Assistente de IA. Esta atualização do README é documental e não repete esses checks. Não existe script/suíte de testes instalado. Testes de navegador, jornada integrada e GPS/push em aparelho real ainda são pendências.

Atualizar este checklist após cada entrega verificada; uma regra descrita não deve ser marcada como implementada sem evidência funcional.
## Exemplos de Vinculado e Pausado

Foram adicionados quatro chamados para Ana Silva, atribuídos a Camila Santos, na Saúde:

| Número inicial | Chamado | Estado |
|---|---|---|
| 14201 | Instalação de painel na recepção | Vinculado |
| 14202 | Configuração de software de atendimento | Vinculado |
| 14203 | Verificação de impressora da recepção | Pausado — intervalo |
| 14204 | Substituição de cabo HDMI do painel | Pausado — aguardando material |

Técnico: consultar Minha fila/Pausados. Usuário: Meus chamados. Administrador: Chamados/Kanban. Pausados têm justificativa, histórico e 30 minutos de tempo ativo congelado; vinculados ainda não iniciaram. Para iniciar/retomar, interromper primeiro eventual atendimento ativo da Camila.

Os exemplos também são acrescentados automaticamente à base salva no navegador, uma única vez, preservando cadastros e alterações. Se algum número já estiver ocupado, o novo exemplo recebe outro número livre. Alterar o status de um exemplo não o recria na recarga. Dados permanecem fictícios e GPS/push não são acionados.
## Navegação horizontal do Kanban

- [x] Cursor de mão aberta; mão fechada durante arraste com mouse.
- [x] Arrastar o quadro ou sobre um cartão desloca a visualização horizontal, sem alterar status.
- [x] Clique sem arraste continua abrindo a ordem; arraste suprime a abertura acidental.
- [x] Rolagem nativa no celular, barra horizontal e navegação por teclado preservadas.

Implementação em `src/components/tickets/KanbanScroll.tsx`. Lint/build verificados; interação visual em navegador permanece pendente de validação.
## Exemplos de Aguardando análise

- **14205 — Impressora continua com falha após atendimento:** solicitante informa novo travamento após limpeza.
- **14206 — Sistema de atendimento ainda não permite acesso:** solicitante informa erro persistente após revisão de permissões.

Ambos são da Saúde, solicitados por Ana Silva e atendidos por Camila Santos. Incluem conclusão anterior, 30 minutos de execução encerrados, justificativa da pendência e validação rejeitada no histórico. Não possuem resolução confirmada nem análise já realizada.

Administrador: abrir a coluna Aguardando análise e usar Devolver para atendimento com orientação. Usuário/técnico: consultar o filtro Aguardando análise. Exemplos são acrescentados uma única vez à base existente; números podem variar se houver conflito, e alterações futuras não são sobrescritas.
## Filtro de secretaria em Chamados

- [x] Seletor Todas as secretarias, com opções extraídas da base mockada compartilhada.
- [x] Combinação com busca, equipe e prioridade alta no Kanban e na tabela.
- [x] Limpar filtros também restaura a secretaria; contadores refletem a seleção.
- [x] Secretaria identificada junto à unidade nos cartões e linhas.

Filtro preservado ao alternar Kanban/tabela. Lint e build verificados; validação visual permanece pendente.
## Classificação atual: Tipo de chamado

O cadastro, filtro de Chamados, ordem de serviço e distribuição do dashboard utilizam **Tipo de chamado**: Aquisição/Estoque, Suporte de TI, Redes e TI. Hardware/Software permanece como natureza; secretaria identifica o órgão atendido.

Tipos não representam equipes ou pessoas. O item de gestão foi renomeado para Técnicos e agora está habilitado para o administrador. A nomenclatura anterior de área/equipe neste README é histórica; esta seção define o catálogo vigente.

Novos cadastros gravam `callType`. Dados antigos são normalizados sem perder IDs, estados ou histórico: Suporte → Suporte de TI; Telecom → Redes; TI / Sistemas → TI; Aquisições / Estoque → Aquisição/Estoque. Campos antigos `area`/`team` permanecem compatíveis nesta fase mockada. Todas as quatro opções aparecem no filtro mesmo sem chamados cadastrados do tipo.
## Gestão de técnicos e atribuição entregues

- [x] Menu Técnicos (`/tecnicos`), exclusivo do administrador, com busca e filtro por secretaria.
- [x] Cadastro e edição de nome, e-mail/senha fictícios, múltiplas secretarias, tipos autorizados e disponibilidade com motivo.
- [x] Técnicos novos/alterados conseguem entrar com as credenciais cadastradas; identidade e permissões vêm do cadastro local.
- [x] Ocupação mostrada a partir do atendimento ativo, separada da disponibilidade informada (Disponível, Indisponível ou Fora do expediente).
- [x] Atribuição e transferência pela ordem de serviço, com justificativa e registro de autor/horário/responsáveis no histórico.
- [x] Seleção exige secretaria e tipo compatíveis e disponibilidade informada; técnico ocupado pode receber uma fila, sem iniciar outro atendimento.
- [x] Transferência preserva pausa/bloqueio, motivo, intervalos e histórico. Em andamento deve ser pausado antes de transferir; aguardando validação/análise e resolvido não são transferidos por essa ação.
- [x] Dados salvos em `missao-sjp.mock-technicians.v1`; mudanças se refletem no catálogo local e no acesso por ID aos chamados.

Credenciais adicionais iniciais: Pedro Almeida (`pedro@demo.sjp`, `Tecnico123!`), Saúde/Educação, Redes/TI; conta fictícia de estoque (`estoque@demo.sjp`, `Tecnico123!`), todas as secretarias do catálogo, Aquisição/Estoque. A conta de estoque representa temporariamente os exemplos antigos; a gestão definitiva de membros de equipe é pendente.

Técnico indisponível/fora do expediente não assume ou inicia/retoma novas execuções; continua podendo registrar eventos e interromper/concluir atendimento já em curso. Cadastro não interrompe automaticamente uma execução ativa. Mudanças de nome preservam IDs e registros históricos; textos históricos não são reescritos.

Pausa não altera o valor de disponibilidade informado. O cartão pode mostrar Ocupado e, separadamente, Indisponível/Fora do expediente se o cadastro mudou durante execução. Automação de turnos e motivo de pausa orientando disponibilidade continuam pendentes.

Pendências: cooperação voluntária entre secretarias, fotos/perfis editáveis pelo próprio técnico, anexos, notificações/mapa mockados, ranking, histórico de edições do cadastro, simulação de plantão/escalonamento e backend futuro. Credenciais são públicas e fictícias no navegador. Cadastro de técnicos não utiliza senha real.

Checks: lint/build e verificações de cadastro, autorização, login e atribuição/transferência. Validação visual no navegador ainda pendente.
## Central de notificações mockadas entregue

- [x] Central `/notificacoes` disponível para todas as contas, com somente os avisos do destinatário conectado.
- [x] Atalho Avisos no cabeçalho desktop/mobile, contador de não lidas e item no menu.
- [x] Filtro de não lidas, marcar individualmente e marcar todas as próprias como lidas.
- [x] Novo chamado: técnicos cadastrados na secretaria e no tipo correspondente recebem aviso independentemente da distância ou ocupação.
- [x] Assunção/atribuição/transferência: aviso de vínculo ao técnico responsável.
- [x] Conclusão: solicitante recebe aviso para confirmar/avaliar ou indicar pendência.
- [x] Pendência: administrador recebe aviso para analisar.
- [x] Devolução administrativa: técnico responsável recebe aviso para continuar.
- [x] Clique abre ordem atual somente quando a conta tem acesso; chamado assumido por outro/transferido pode ficar indisponível ao destinatário de aviso antigo.
- [x] Eventos e avisos salvos juntos na base de chamados; falha ao gravar não deixa aviso de uma ação não salva.
- [x] Histórico de leitura persiste em `missao-sjp.mock-notification-reads.v1`; sessão continua separada por aba.

Avisos são gerados somente por eventos novos, sem notificações retroativas para exemplos existentes. Destinatários ficam registrados no momento do evento. IDs por chamado/evento/tipo/destinatário evitam repetição do mesmo aviso; uma nova conclusão após pendência gera novo aviso legítimo. Um aviso de abertura não vincula nem inicia atendimento.

Nesta fase todos os técnicos elegíveis por secretaria/tipo recebem abertura, inclusive ocupados ou fora do expediente; política de turno/plantão ainda não foi definida. Preferências, lembretes, escalonamento e proximidade/convites voluntários permanecem pendentes. Não há push real, permissão de notificação do sistema operacional ou envio para outro dispositivo. Dados são compartilhados somente por abas da mesma origem/navegador.

Roteiro de teste: usuário cadastra na Saúde/Suporte de TI → sair/entrar como Camila e consultar Avisos → assumir/iniciar/concluir → usuário recebe aviso de conclusão → informar pendência → administrador recebe aviso → devolver → Camila recebe aviso de continuidade. O exemplo inicial já ativo exige pausa/conclusão antes de outro início. Atribuição administrativa também gera aviso; marcar lido não altera estado do chamado.

Checks: lint/build aprovados e verificações do serviço para destinatários, ciclo de avisos, leitura exclusiva por conta, deduplicação, persistência após recarga e falha de armazenamento. Validação visual em navegador/dispositivo permanece pendente. Build reporta aviso de tamanho do bundle; divisão por rotas pode ser avaliada na etapa de otimização.

A etapa de mapa e posições mockados foi entregue abaixo, incluindo convites por proximidade. Próximas etapas: colaboração aprovada em chamado já assumido, fotos/perfis editáveis, evidências e ranking. Push real continua reservado à integração futura.
## Mapa administrativo e posições mockadas

- Mapa dos técnicos em /mapa-tecnicos, exclusivo do administrador; filtro por secretaria, lista acessível e modal com responsável, unidade, estado, disponibilidade, tempos e última posição/precisão. Foto permanece pendente.
- Coordenadas das unidades são fictícias e explícitas. Posições são persistidas junto dos chamados; início/retomada registra ponto e a simulação observa outro a cada 10 minutos enquanto a plataforma está aberta. Não preenche retroativamente períodos com a aplicação fechada.
- Pausa/bloqueio/conclusão interrompem novas capturas, mantendo histórico. Sem posição, o técnico aparece apenas na lista. Registro antigo/impreciso é sinalizado.
- Novas aberturas presenciais geram convite voluntário para técnico de outra secretaria com tipo compatível, disponibilidade informada e posição válida próxima. Aceite revalida elegibilidade, mantém secretaria original e inclui na fila sem iniciar atendimento. Chamado já assumido não permite segundo responsável; colaboração em chamado ocupado permanece pendente.
- Parâmetros apenas de demonstração: raio 2 km, idade máxima 15 minutos e precisão até 100 m. Regras municipais definitivas ainda pendentes. Remoto não gera convite por proximidade.
- Avisos da própria secretaria continuam independentes da distância/ocupação. GPS real, push, segundo plano, fotos e colaboração aprovada ficam para próximas etapas.

Roteiro: entrar como técnico e iniciar/retomar atendimento presencial; administrador abre Mapa dos técnicos e verifica registro; pausar e conferir que horário fica congelado. Para convite entre secretarias, cadastrar técnico com tipo compatível, gerar posição em atendimento presencial e abrir chamado próximo em outra secretaria; consultar Avisos e aceitar voluntariamente. Posição vencida impede aceite.

Validação desta etapa: lint e build aprovados; verificações de comportamento passaram para cadência, interrupção/retomada, expiração/precisão, autoria após transferência, modalidade remota, competência, convites/deduplicação, ciclo integrado, persistência e falha de armazenamento. Interface em navegador/celular ainda não validada. O build mantém aviso de bundle acima de 500 kB.

## Próxima etapa acordada e regras de cooperação — 09/10/2026

Regras e critérios de aceite registrados na [seção 9 do plano de negócio](ANALISE_FRONTEND_E_PLANO_DE_IMPLEMENTACAO.md#9-atualização-do-produto-e-próximas-entregas--09102026). Essa atualização prevalece sobre checklists históricos desta fase.

Antes de avançar, validar visualmente mapa e convites em desktop/celular. Próxima entrega: oferecer ajuda em chamado já assumido, obter aprovação do responsável/administrador e vincular colaborador sem substituir responsável ou secretaria. Cada participante terá eventos e tempo próprios; uma execução ativa por técnico, inclusive como colaborador. Oferta/vínculo não inicia atendimento. Recusa voluntária não gera penalidade automática. Preservar histórico, acesso por papel, persistência e separação entre conclusão e validação. Efeito da pausa/conclusão do responsável sobre colaboradores deve ser definido antes das transições.

Sequência posterior: **cooperação → perfil/foto → evidências → ranking e pontos**. Implementação com mocks e persistência local; integração operacional futura. Esses itens continuam pendentes.


## Retomada do frontend — 09/10/2026

Estado: mapa administrativo e convites por proximidade entregues com mocks. Cooperação em chamado já assumido continua pendente; nenhuma funcionalidade de cooperação foi entregue nesta retomada.

- [x] Código do mapa, posições, convites, permissões, execução e notificações revisado na retomada.
- [x] npm run lint aprovado novamente.
- [x] Verificações de comportamento existentes executadas novamente (C:/Users/Micro/hackaton-map-stage/check.cjs): cadência de 10 minutos; interrupção/retomada; expiração e precisão; autoria da posição após transferência; modalidade remota; competência; convites e deduplicação; cadastro → convite → aceite → execução → conclusão; persistência; rejeição de segundo aceite; falha de armazenamento.
- [ ] Validar visualmente mapa/modal e convites em desktop e celular. Nenhuma ferramenta de navegador foi disponibilizada nesta sessão; verificações do serviço não substituem essa validação.
- [ ] Definir política de pausa/conclusão em cooperação e quem encerra a entrega global. Pergunta enviada ao usuário; resposta ainda pendente no momento deste registro.
- [ ] Implementar oferta → aprovação pelo responsável/administrador → vínculo como colaborador, com eventos e intervalos próprios, sem substituir responsável/secretaria e sem iniciar automaticamente.
- [ ] Entregas posteriores: perfil/foto → evidências → ranking e pontos.

Build desta retomada: aprovado; permanece o aviso de bundle acima de 500 kB. Preservadas as alterações locais preexistentes. GPS, push, segundo plano e integração com backend continuam futuros.


## Status do chamado — atualização de 09/10/2026

Catálogo vigente: **Em aberto, Em análise e Resolvido**. Cadastro → Em aberto; assumir/atribuir → Em análise; confirmar pelo solicitante → Resolvido. Execução, pausa/bloqueio, espera de validação e análise administrativa são etapas internas do atendimento, separadas em executionState. Conclusão do técnico mantém Em análise até a confirmação. Kanban tem três colunas e filtros de status usam somente esse catálogo.

Dados locais antigos são migrados preservando a etapa original, histórico, intervalos, responsáveis e avisos. Referências anteriores aos oito estados são históricas ou descrevem etapas de atendimento. Regras completas na seção 11 do plano. Validação desta mudança: lint, build e npm run check:statuses aprovados (migração dos oito estados, recarga, dados inválidos/falha de gravação, permissões, uma execução ativa, pausa/bloqueio, posições, conclusão, pendência, devolução e confirmação). Verificação visual em navegador/celular permanece pendente; build mantém aviso de bundle acima de 500 kB.


## Menus de Conquistas e Relatórios — 09/10/2026

Conquistas e Relatórios removidos dos menus desktop/mobile por decisão do usuário. O dashboard continua como acompanhamento inicial. Pontos e ranking permanecem planejados; a remoção do menu não conclui nem cancela a gamificação. Ranking do técnico era Em breve nesta etapa; agora foi habilitado conforme a entrega abaixo.


## Planejamento do jogo interno e ranking — 09/10/2026

Regras alinhadas ao plano do backend (commit 98e24e0) na [seção 13 do plano](ANALISE_FRONTEND_E_PLANO_DE_IMPLEMENTACAO.md#13-ranking-e-gamificação-como-jogo-interno--alinhamento-com-backend-09102026). Gamificação prevista: crédito provisório na conclusão, confirmado pelo solicitante, rankings individual/equipe por período, histórico preservado e ajustes sem duplicação. Registro anterior ao desenvolvimento: o commit do backend consultado adiciona documentação, sem comprovar API operacional. Ranking individual implementado posteriormente conforme a entrega abaixo. Pesos demonstrativos e empate definidos na entrega abaixo; equipes, divisão de colaboração e configuração operacional continuam pendentes. Conquistas/Relatórios continuam fora dos menus; Ranking do técnico foi habilitado na entrega abaixo.


## Ranking e dashboard técnico entregues — 09/10/2026

Ranking habilitado para técnico/administrador; usuário solicitante não tem acesso. Técnico entra em /dashboard-tecnico e vê seus pontos por chamado, posição no placar agregado e meta visual de 100 pontos confirmados/mês. /ranking oferece a mesma visão; administrador consulta todos os créditos e filtra por técnico e mês.

Baixa = 10, Normal = 20, Alta = 40 pontos. Concluir gera provisório; confirmação do solicitante confirma; pendência coloca em revisão. Reconclusão substitui crédito do mesmo chamado sem duplicar. Período é o mês da conclusão (America/Sao_Paulo); placar por confirmados, com empate compartilhado. Crédito guarda executor, prioridade e regra; transferência não muda autoria da entrega pontuada. Histórico/revisões persistem na base de chamados.

Exemplos antigos recebem crédito de demonstração reconstruído do histórico, identificado nas revisões. Cooperação, fotos, evidências, ranking por equipe e API operacional permanecem futuros. Conquistas/Relatórios continuam fora dos menus. Esta atualização prevalece sobre notas anteriores de Ranking Em breve. Regras detalhadas na seção 14 do plano.

Validação: npm run lint, npm run build, npm run check:ranking e npm run check:statuses aprovados. Verificações cobrem pesos, período/fuso, acesso por papel, detalhamento próprio, filtros/empates, provisório/confirmado/revisão, reconclusão sem duplicação, autoria e persistência/falhas. Build mantém aviso de bundle acima de 500 kB.


## Patentes do jogo interno — 09/10/2026

Dez patentes: Soldado raso (0–99), Soldado (100–249), Cabo (250–499), Sargento (500–799), Subtenente (800–1.199), Tenente (1.200–1.799), Capitão (1.800–2.599), Major (2.600–3.599), Coronel (3.600–4.999), General (5.000 ou mais). Patente é calculada pelos pontos confirmados de todo o histórico e não reinicia com o mês. Dashboard/ranking mostram patente, progresso e pontos faltantes; administrador vê tudo e filtra técnico. Usuário não acessa. Créditos provisórios/em revisão não contam; ajustes podem alterar a faixa. General continua acumulando pontos. Regras completas na seção 15 do plano. Validação: npm run check:ranking, npm run lint e npm run build aprovados; verificados limiares exatos, progresso, faixa máxima, independência do mês e exclusão de créditos provisórios/em revisão. Build mantém aviso de bundle acima de 500 kB.


Ampliação aprovada: dez patentes, conforme catálogo da seção 15 do plano. Pontos existentes preservados; patente e progresso são recalculados com os novos limiares. Validação: npm run check:ranking, npm run lint e npm run build aprovados, incluindo limites inferiores/superiores das dez faixas, progresso e General em 5.000 pontos. Validação visual em navegador/celular permanece pendente.
