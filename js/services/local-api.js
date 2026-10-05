// GitHub Pages edition. Durable device-local data; no passwords or OAuth tokens.
export const EMPTY = () => ({snapshot:null,leagues:[],rounds:[],payments:[],balances:[]});
const initial = () => ({version:1,selected:null,snapshots:{},rounds:[],payments:[]});
const key = s => `${s.source}:${s.season}:${s.league.id}`;
const scope = s => `${s.source}:${s.season}:${s.league.id}`;
const names=['Javier','Luis','Moises','Alfredo','Ezequiel','David','Adrián','Miguel','Jorge','Rober','Raid','Fernando'];
export function demo(id='demo-trabajo') {
 const members=names.map((name,i)=>({id:`demo-${i}`,name,points:480-i*13,value:92000000-i*2500000}));
 const matchdays=Array.from({length:8},(_,index)=>{const number=index+1,points=number===8?[19,26,66,55,48,42,31,60,51,39,45,57]:members.map((_,i)=>22+((i*11+number*7)%47));return {number,final:true,results:members.map((m,i)=>({memberId:m.id,points:points[i]}))};});
 const roster=[['Courtois','POR','Real Madrid',12000000,48],['Le Normand','DEF','Atlético',9000000,41],['Vivian','DEF','Athletic',8000000,43],['Cubarsí','DEF','Barcelona',10000000,51],['Pedri','MED','Barcelona',22000000,72],['Valverde','MED','Real Madrid',21000000,69],['Isco','MED','Betis',17000000,62],['Baena','MED','Atlético',16000000,59],['Mbappé','DEL','Real Madrid',42000000,83],['Julián Álvarez','DEL','Atlético',28000000,76],['Oyarzabal','DEL','Real Sociedad',18000000,57]].map(([name,position,club,value,points],i)=>({id:`p${i}`,name,position,club,value,points,status:'Disponible',starter:true}));
 return {source:'demo',season:'2026/27',syncedAt:new Date().toISOString(),account:{name:'Adrián · ejemplo'},league:{id,name:id==='demo-trabajo'?'Compañeros de trabajo':'Liga amigos · ejemplo',members},team:{name:'Ferrer FC · ejemplo',formation:'3-4-3',balance:6500000,value:roster.reduce((n,p)=>n+p.value,0),points:402,players:roster},market:roster.slice(4,8).map(p=>({...p,owner:'Mercado',price:p.value})),matchdays};
}
const text = (v,max=120) => typeof v==='string'&&v.trim()&&v.length<=max;
const numeric = v => typeof v==='number'&&Number.isFinite(v)?v:null;
const str = (v,fallback='No disponible') => typeof v==='string'?v.slice(0,120):fallback;
function players(raw,market=false){if(!Array.isArray(raw)||raw.length>500)throw Error('Lista de jugadores inválida.');return raw.map(p=>{if(!p||!text(p.name))throw Error('Jugador inválido.');return {id:str(p.id,''),name:p.name,position:str(p.position,'—'),club:str(p.club),value:numeric(p.value),points:numeric(p.points),status:str(p.status),starter:p.starter===true,...(market?{price:numeric(p.price),owner:str(p.owner)}:{})};});}
export function normalize(raw){
 if(!raw||typeof raw!=='object'||!text(raw.season,30)||!text(raw.league?.id)||!text(raw.league?.name))throw Error('Faltan temporada, identificador y nombre de liga.');
 const members=raw.league.members;if(!Array.isArray(members)||members.length<3||members.length>100)throw Error('Se necesitan entre 3 y 100 participantes.');
 const ids=new Set();for(const m of members){if(!m||!text(m.id)||ids.has(m.id)||!text(m.name)||numeric(m.points??0)===null)throw Error('Cada manager necesita id único, nombre y puntos válidos.');ids.add(m.id);}
 if(!Array.isArray(raw.matchdays)||raw.matchdays.length>100)throw Error('Jornadas inválidas.');
 const days=new Set(),matchdays=raw.matchdays.map(d=>{if(!d||!Number.isInteger(d.number)||d.number<1||d.number>100||days.has(d.number))throw Error('Número de jornada inválido o repetido.');days.add(d.number);if(!Array.isArray(d.results)||d.results.length!==members.length)throw Error('Incluye a todos los participantes de cada jornada.');const seen=new Set();for(const r of d.results){if(!r||!ids.has(r.memberId)||seen.has(r.memberId)||numeric(r.points)===null)throw Error('Puntuaciones incompletas o repetidas.');seen.add(r.memberId);}return {number:d.number,final:d.final===true,results:d.results.map(r=>({memberId:r.memberId,points:r.points}))};}).sort((a,b)=>a.number-b.number);
 let team=null;if(raw.team!=null){if(typeof raw.team!=='object')throw Error('Equipo inválido.');team={name:str(raw.team.name,'Mi equipo'),formation:str(raw.team.formation,''),balance:numeric(raw.team.balance),value:numeric(raw.team.value),points:numeric(raw.team.points),players:players(raw.team.players??[])};}
 return {source:'import',season:raw.season,syncedAt:new Date().toISOString(),account:{name:str(raw.account?.name,'Mi cuenta')},league:{id:raw.league.id,name:raw.league.name,members:members.map(m=>({id:m.id,name:m.name,points:m.points??0,value:numeric(m.value)}))},matchdays,team,market:players(raw.market??[],true)};
}
function penalties(s,number){const day=s.matchdays.find(d=>d.number===number);if(!day?.final)throw Error('Solo se pueden confirmar jornadas finalizadas.');const sorted=[...day.results].sort((a,b)=>a.points-b.points);if(sorted.slice(0,3).some(r=>sorted.filter(x=>x.points===r.points).length>1))throw Error('Hay empate en los últimos puestos; acordad el desempate antes de generar deuda.');return sorted.slice(0,3).map((r,i)=>({...r,cents:[300,200,100][i],name:s.league.members.find(m=>m.id===r.memberId).name}));}
function state(db){const snapshot=db.snapshots[db.selected]??null,leagues=Object.entries(db.snapshots).map(([key,s])=>({key,name:s.league.name,source:s.source}));if(!snapshot)return {...EMPTY(),leagues};const rounds=db.rounds.filter(r=>r.scope===scope(snapshot)).map(({scope,...r})=>r).sort((a,b)=>b.number-a.number),payments=db.payments.filter(p=>p.scope===scope(snapshot)).map(({scope,...p})=>p).reverse();const balances=snapshot.league.members.map(m=>{const due=rounds.reduce((n,r)=>n+r.penalties.filter(p=>p.memberId===m.id).reduce((v,p)=>v+p.cents,0),0),paid=payments.filter(p=>p.member===m.id).reduce((n,p)=>n+p.cents,0);return {id:m.id,name:m.name,due,paid,remaining:due-paid};});return {snapshot,leagues,rounds,payments,balances};}
export function apply(db,path,body={}) {
 db??=initial();const current=db.snapshots[db.selected];
 switch(path){
 case 'state':case 'export':return {db,result:state(db)};
 case 'demo':for(const id of ['demo-trabajo','demo-amigos']){const s=demo(id);db.snapshots[key(s)]??=s;}db.selected=key(demo());break;
 case 'select':if(!Object.hasOwn(db.snapshots,body.key))throw Error('Liga no encontrada.');db.selected=body.key;break;
 case 'disconnect':db.selected=null;break;
 case 'import':{const s=normalize(body),old=db.snapshots[key(s)];if(old&&db.rounds.some(r=>r.scope===scope(s))){const oldIds=old.league.members.map(m=>m.id).sort().join('\0'),newIds=s.league.members.map(m=>m.id).sort().join('\0');if(oldIds!==newIds)throw Error('No cambies los participantes de una liga contabilizada. Usa otro identificador.');}db.snapshots[key(s)]=s;db.selected=key(s);break;}
 case 'confirm':{if(!current)throw Error('Selecciona una liga.');const exists=db.rounds.some(r=>r.scope===scope(current)&&r.number===body.number);if(!exists)db.rounds.push({scope:scope(current),number:body.number,penalties:penalties(current,body.number),created:new Date().toISOString()});return {db,result:{created:!exists,state:state(db)}};}
 case 'pay':{if(!current)throw Error('Selecciona una liga.');if(!text(body.requestId)||!Number.isInteger(body.cents)||body.cents<=0)throw Error('Pago inválido.');const existing=db.payments.find(p=>p.id===body.requestId);if(existing){if(existing.scope!==scope(current)||existing.member!==body.member||existing.cents!==body.cents||existing.note!==str(body.note,''))throw Error('Este identificador ya corresponde a otro pago.');break;}const balance=state(db).balances.find(b=>b.id===body.member);if(!balance||body.cents>balance.remaining)throw Error('El pago supera la deuda pendiente.');db.payments.push({id:body.requestId,scope:scope(current),member:body.member,cents:body.cents,note:str(body.note,''),created:new Date().toISOString()});break;}
 default:throw Error('Operación no disponible.');
 }return {db,result:state(db)};
}
const openDB=()=>new Promise((resolve,reject)=>{const r=indexedDB.open('fantasy-pages-v1:'+new URL('../../',import.meta.url).pathname,1);r.onupgradeneeded=()=>r.result.createObjectStore('workspace');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(Error('No se pudo abrir el almacenamiento del navegador. Comprueba que no esté bloqueado.'));});
export async function localRequest(path,body){
 if(path==='auth/status')return {available:false,status:'awaiting_provider_access'};
 if(path==='auth/connect')throw Error('La conexión real requiere un backend online y acceso autorizado de LALIGA. Puedes usar la demo y registrar las cuentas en GitHub Pages.');
 if(path==='sync')throw Error('No hay conexión real con LALIGA. Se conservan los datos guardados en este navegador.');
 const db=await openDB();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readwrite'),store=tx.objectStore('workspace'),r=store.get('data');let result,problem;r.onsuccess=()=>{try{const applied=apply(r.result,path,body);result=applied.result;store.put(applied.db,'data');}catch(err){problem=err;tx.abort();}};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(problem||Error('No se pudo guardar. No borres los datos del navegador; inténtalo de nuevo.'));tx.onabort=()=>reject(problem||Error('No se guardaron los cambios.'));});}finally{db.close();}
}
