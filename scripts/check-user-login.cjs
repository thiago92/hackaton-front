const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const ts = require(path.join(root, 'node_modules/typescript'));
const axios = require(path.join(root, 'node_modules/axios/dist/node/axios.cjs'));
const tenant = '00000000-0000-0000-0000-000000000001';
function harness() {
  const storage = new Map(), listeners = new Map();
  let failWrite = false, now = Date.now();
  class Clock extends Date { static now() { return now; } }
  const window = {
    sessionStorage: { getItem: k => storage.get(k) ?? null, setItem: (k,v) => { if(failWrite) throw Error('blocked'); storage.set(k,v); }, removeItem: k => storage.delete(k) },
    localStorage: { getItem: () => null },
    addEventListener: (name,fn) => { const callbacks=listeners.get(name) ?? []; callbacks.push(fn); listeners.set(name,callbacks); },
    dispatchEvent: event => { listeners.get(event.type)?.forEach(fn=>fn(event)); return true; }
  };
  const cache=new Map(), context=vm.createContext({window,Event,Date:Clock,console});
  function load(file) {
    if(file==='lib/auth-config') return {authMode:'api',apiUrl:'http://localhost:5286',prefeituraId:tenant};
    if(cache.has(file)) return cache.get(file).exports;
    const mod={exports:{}}; cache.set(file,mod);
    const code=ts.transpileModule(fs.readFileSync(path.join(root,'src',file+'.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
    vm.runInContext('(function(require,module,exports){'+code+'\n})',context)(name=>name==='axios'?axios:name.startsWith('@/')?load(name.slice(2)):require(name),mod,mod.exports);
    return mod.exports;
  }
  const session=load('lib/auth-session'), api=load('lib/api-client').api, auth=load('services/auth.service');
  const response=()=>({accessToken:'token-for-test',expiraEm:new Date(now+60000).toISOString(),usuarioId:'bbbbbbbb-0000-0000-0000-000000000001',nome:'Solicitante',email:'solicitante@example.test',papel:'Usuario',prefeituraId:tenant,tecnicoId:null});
  return {storage,session,api,auth,response,load,fail:()=>{failWrite=true;},expire:()=>{now+=60001;}};
}
async function run() {
  const h=harness(); let captured, events=0;
  h.storage.set('missao-sjp.demo-session.v1','usuario-demo');
  h.api.defaults.adapter=async config=>{captured=config;return {data:h.response(),status:200,statusText:'OK',headers:{},config};};
  await h.auth.loginUser('  SOLICITANTE@EXAMPLE.TEST  ',' Password unchanged! ');
  assert.deepEqual(JSON.parse(captured.data),{email:'solicitante@example.test',senha:' Password unchanged! ',prefeituraId:tenant});
  assert.equal(captured.url,'/api/auth/web/login');assert.equal(captured.headers.get('Authorization'),undefined);
  assert.equal(h.session.getApiSession().prefeituraId,tenant);
  assert.equal(h.storage.has('missao-sjp.demo-session.v1'),false);
  assert.ok(!h.storage.get(h.session.apiSessionKey).includes('Password unchanged'));
  assert.equal(h.load('data/access-profiles').getDemoUser().id,h.response().usuarioId);
  await h.api.get('/api/usuario/chamados');assert.equal(captured.headers.get('Authorization'),'Bearer token-for-test');
  // A sessão sobrevive a novo carregamento, mas expira sem depender de chamada HTTP.
  assert.ok(h.session.getApiSession());h.expire();assert.equal(h.session.getApiSession(),null);assert.equal(h.storage.has(h.session.apiSessionKey),false);
  const statuses=[[401,/E-mail ou senha/],[403,/perfil/],[503,/indisponível/],[400,/Confira/],[500,/entrar agora/]];
  for(const [status,pattern] of statuses) {
    const q=harness();q.api.defaults.adapter=async config=>{throw new axios.AxiosError('http','ERR_BAD_RESPONSE',config,{}, {status,data:{message:'sensitive detail'},headers:{},config,statusText:'error'});};
    await assert.rejects(()=>q.auth.loginUser('user@example.test','wrong'),pattern);assert.equal(q.session.getApiSession(),null);
  }
  for(const [code,pattern] of [['ERR_NETWORK',/conectar/],['ECONNABORTED',/demorou/]]) {
    const q=harness();q.api.defaults.adapter=async config=>{throw new axios.AxiosError('error',code,config);};
    await assert.rejects(()=>q.auth.loginUser('user@example.test','pass'),pattern);
  }
  for(const patch of [{papel:'Admin'},{papel:'Tecnico'},{prefeituraId:'00000000-0000-0000-0000-000000000002'},{expiraEm:'2000-01-01T00:00:00Z'},{accessToken:''},{usuarioId:'invalid'},{tecnicoId:'unexpected'}]) {
    const q=harness();q.api.defaults.adapter=async config=>({data:{...q.response(),...patch},status:200,headers:{},config});
    await assert.rejects(()=>q.auth.loginUser('user@example.test','pass'));assert.equal(q.session.getApiSession(),null);
  }
  const blocked=harness();blocked.fail();blocked.api.defaults.adapter=async config=>({data:blocked.response(),status:200,headers:{},config});
  await assert.rejects(()=>blocked.auth.loginUser('user@example.test','pass'),/salvar a sessão/);assert.equal(blocked.session.getApiSession(),null);
  const q=harness();q.session.saveApiSession(q.response());
  q.api.defaults.adapter=async config=>{throw new axios.AxiosError('expired','ERR_BAD_RESPONSE',config,{}, {status:401,data:{},headers:{},config});};
  await assert.rejects(()=>q.api.get('/api/usuario/chamados'));assert.equal(q.session.getApiSession(),null);
  q.session.saveApiSession(q.response());await assert.rejects(()=>q.auth.loginUser('user@example.test','wrong'));assert.ok(q.session.getApiSession());
  q.load('data/access-profiles').logoutDemo();assert.equal(q.session.getApiSession(),null);
  q.storage.set(q.session.apiSessionKey,'{broken');assert.equal(q.session.getApiSession(),null);
  void events;
  console.log('PASS: contrato/tenant, senha preservada, sessão por aba, Bearer, expiração/logout, 401/403/503/400/500, rede/timeout, perfil incompatível, resposta inválida e armazenamento indisponível.');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
