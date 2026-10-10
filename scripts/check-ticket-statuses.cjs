const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = process.argv[2] ?? path.resolve(__dirname, '..');
const ts = require(path.join(root, 'node_modules/typescript'));
const key = 'missao-sjp.mock-tickets.v1';
const plain = value => JSON.parse(JSON.stringify(value));
function harness(saved, failWrite = false) {
  const data = new Map(saved === undefined ? [] : [[key, saved]]);
  const listeners = new Map();
  const localStorage = { getItem: k => data.get(k) ?? null, setItem: (k, v) => { if (failWrite) throw Error('full'); data.set(k, v); }, removeItem: k => data.delete(k) };
  const window = { localStorage, sessionStorage: { getItem: k => data.get('session:' + k) ?? null, setItem: (k, v) => data.set('session:' + k, v), removeItem: k => data.delete('session:' + k) }, addEventListener: (name, fn) => { const callbacks = listeners.get(name) ?? []; callbacks.push(fn); listeners.set(name, callbacks); } };
  const cache = new Map();
  const context = vm.createContext({ window, navigator: {}, crypto: require('node:crypto').webcrypto, Date, console });
  function load(file) {
    const full = path.join(root, 'src', file + '.ts');
    if (cache.has(full)) return cache.get(full).exports;
    const mod = { exports: {} }; cache.set(full, mod);
    const code = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    vm.runInContext('(function(require,module,exports){' + code + '\n})', context, { filename: full })(name => name.startsWith('@/') ? load(name.slice(2)) : require(name), mod, mod.exports);
    return mod.exports;
  }
  const store = load('services/mock-tickets'), access = load('data/access-profiles');
  return { data, store, access, window, load, reload: () => listeners.get('storage')?.forEach(fn => fn({ key })) };
}
async function run() {
  const initial = harness();
  assert.equal(initial.store.getTicketsSnapshot().error, null);
  assert.deepEqual(plain(initial.load('data/tickets').ticketStatuses), ['Em aberto', 'Em análise', 'Resolvido']);
  const seeds = plain(initial.store.getTicketsSnapshot().tickets);
  // Todos os estados legados são migrados, preservando os demais campos.
  const legacy = seeds.map(ticket => { const { executionState, ...old } = ticket; return { ...old, status: executionState }; });
  const migrated = harness(JSON.stringify(legacy));
  assert.equal(migrated.store.getTicketsSnapshot().error, null);
  const current = plain(migrated.store.getTicketsSnapshot().tickets);
  for (let i = 0; i < legacy.length; i++) {
    const { status, ...oldFields } = legacy[i];
    const { status: newStatus, executionState, ...newFields } = current[i];
    assert.deepEqual(newFields, oldFields);
    assert.equal(executionState, status);
    assert.equal(newStatus, status === 'Aberto' ? 'Em aberto' : status === 'Resolvido' ? 'Resolvido' : 'Em análise');
  }
  const reloaded = harness(migrated.data.get(key));
  assert.equal(reloaded.store.getTicketsSnapshot().error, null);
  assert.deepEqual(plain(reloaded.store.getTicketsSnapshot().tickets), current);
  const blockedMigration = harness(JSON.stringify(legacy), true);
  assert.ok(blockedMigration.store.getTicketsSnapshot().error);
  assert.equal(blockedMigration.data.get(key), JSON.stringify(legacy));
  const incoherent = current.map((ticket, i) => i === 0 ? { ...ticket, status: 'desconhecido' } : ticket);
  assert.ok(harness(JSON.stringify(incoherent)).store.getTicketsSnapshot().error);
  assert.ok(harness('{broken').store.getTicketsSnapshot().error);
  console.log('PASS: três status, migração integral, recarga idempotente e preservação em falha/incoerência.');

  const h = harness(JSON.stringify(current)), { store, access } = h;
  const ticketInput = { title: 'Teste dos três status', description: 'Verificação integrada do novo fluxo de status', requesterId: 'usuario-demo', unitId: 'saude-hospital', callType: 'Suporte de TI', nature: 'Hardware', modality: 'Presencial', contact: '0000', impact: 'Teste', urgency: 'Teste', material: '', pickupLocation: '', priority: 'Normal', equipment: null };
  assert.ok(access.loginDemo('usuario@demo.sjp', 'Usuario123!'));
  const created = store.createMockTicket(ticketInput);
  assert.equal(created.status, 'Em aberto'); assert.equal(created.executionState, 'Aberto');
  await assert.rejects(() => store.actOnMockTicket(created.id, { action: 'assumir' }));
  assert.ok(access.loginDemo('tecnico@demo.sjp', 'Tecnico123!'));
  const claimed = await store.actOnMockTicket(created.id, { action: 'assumir' });
  assert.equal(claimed.status, 'Em análise'); assert.equal(claimed.executionState, 'Vinculado');
  await assert.rejects(() => store.actOnMockTicket(created.id, { action: 'assumir' }));
  // Amostra inicial de Camila está ativa: a nova fila não permite segundo atendimento.
  await assert.rejects(() => store.actOnMockTicket(created.id, { action: 'iniciar' }));
  for (const ticket of store.getTicketsSnapshot().tickets.filter(t => t.technicianId === 'tecnico-demo' && t.executionState === 'Em andamento')) await store.actOnMockTicket(ticket.id, { action: 'pausar', pauseCategory: 'Intervalo', text: 'Pausa do exemplo inicial' });
  const started = await store.actOnMockTicket(created.id, { action: 'iniciar' });
  assert.equal(started.status, 'Em análise'); assert.equal(started.executionState, 'Em andamento'); assert.equal(started.positions.length, 1);
  const paused = await store.actOnMockTicket(created.id, { action: 'pausar', pauseCategory: 'Intervalo', text: 'Intervalo da verificação' });
  assert.equal(paused.status, 'Em análise'); assert.equal(paused.executionState, 'Pausado'); assert.ok(paused.intervals.every(i => i.endedAt));
  await store.refreshMockPositions();
  assert.deepEqual(plain(store.getTicketsSnapshot().tickets.find(t => t.id === created.id).positions), plain(paused.positions));
  await store.actOnMockTicket(created.id, { action: 'retomar' });
  const blocked = await store.actOnMockTicket(created.id, { action: 'bloquear', text: 'Aguardando material de demonstração' });
  assert.equal(blocked.status, 'Em análise'); assert.equal(blocked.executionState, 'Bloqueado');
  await store.actOnMockTicket(created.id, { action: 'retomar' });
  const done = await store.actOnMockTicket(created.id, { action: 'concluir', text: 'Serviço de demonstração concluído' });
  assert.equal(done.status, 'Em análise'); assert.equal(done.executionState, 'Aguardando validação');
  assert.ok(done.notices.some(n => n.kind === 'conclusao' && n.recipientId === 'usuario-demo'));
  await assert.rejects(() => store.validateMockTicket(created.id, { action: 'confirmar', rating: 5 }));
  assert.ok(access.loginDemo('usuario@demo.sjp', 'Usuario123!'));
  const rejected = await store.validateMockTicket(created.id, { action: 'pendencia', text: 'O problema continua na demonstração' });
  assert.equal(rejected.status, 'Em análise'); assert.equal(rejected.executionState, 'Aguardando análise');
  assert.ok(access.loginDemo('admin@demo.sjp', 'Admin123!'));
  await assert.rejects(() => store.validateMockTicket(created.id, { action: 'confirmar', rating: 5 }));
  const returned = await store.validateMockTicket(created.id, { action: 'devolver', text: 'Revisar o problema registrado' });
  assert.equal(returned.status, 'Em análise'); assert.equal(returned.executionState, 'Vinculado');
  assert.ok(access.loginDemo('tecnico@demo.sjp', 'Tecnico123!'));
  await store.actOnMockTicket(created.id, { action: 'iniciar' });
  await store.actOnMockTicket(created.id, { action: 'concluir', text: 'Nova verificação do serviço concluída' });
  assert.ok(access.loginDemo('usuario@demo.sjp', 'Usuario123!'));
  const confirmed = await store.validateMockTicket(created.id, { action: 'confirmar', rating: 5 });
  assert.equal(confirmed.status, 'Resolvido'); assert.equal(confirmed.executionState, 'Resolvido');
  assert.equal(confirmed.validations.length, 2);
  assert.ok(confirmed.history.some(e => e.text.includes('Pendência analisada')));
  assert.equal(harness(h.data.get(key)).store.getTicketsSnapshot().error, null);
  console.log('PASS: cadastro, permissões, aceite, execução única, pausa/GPS, bloqueio, conclusão, pendência, devolução, confirmação e persistência.');

  assert.ok(access.loginDemo('admin@demo.sjp', 'Admin123!'));
  const next = store.createMockTicket(ticketInput);
  const assigned = await store.assignMockTicket(next.id, 'tecnico-demo', 'Atribuição administrativa de teste');
  assert.equal(assigned.status, 'Em análise'); assert.equal(assigned.executionState, 'Vinculado');
  // Falha ao gravar ação não deve alterar o snapshot nem gerar evento/aviso salvo.
  const before = plain(store.getTicketsSnapshot().tickets), write = h.window.localStorage.setItem;
  assert.ok(access.loginDemo('tecnico@demo.sjp', 'Tecnico123!'));
  h.window.localStorage.setItem = () => { throw Error('full'); };
  await assert.rejects(() => store.actOnMockTicket(next.id, { action: 'iniciar' }));
  assert.deepEqual(plain(store.getTicketsSnapshot().tickets), before);
  h.window.localStorage.setItem = write;
  console.log('PASS: atribuição e falha de armazenamento sem publicar estado parcial.');
}
module.exports = { harness };
if (require.main === module) run().catch(error => { console.error(error); process.exitCode = 1; });
