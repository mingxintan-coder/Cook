// ===== 从零下厨：实时灶台 =====
{
const $=id=>document.getElementById(id);
const CN={pot:'锅',A:'A 碗',B:'B 碗',C:'C 盘'};
let L=liveNew(),fire=0,lid=0,mode='wok',run=false,speed=5,acc=0,to='pot',eat='all',log=[],cur=null,shelfCat='常用',dirty=true,lastEv=null,served=null;
const COMMON=['cy','zy','salt','ls','lc','bt','xc','lj','cong','jiang','suan','gla','hj','db','dian','qs','hy','xyou'];

// 货架
const SC=['常用'].concat(FCATS.map(c=>'食材：'+c),CATS);
function shelf(){const q=$('sq').value.trim();let Ls;
  if(q)Ls=[...Object.values(FD),...Object.values(IT)].filter(d=>d.name.includes(q)||(d.note||'').includes(q));
  else if(shelfCat==='常用')Ls=COMMON.map(i=>IT[i]);else if(shelfCat.startsWith('食材：'))Ls=Object.values(FD).filter(d=>d.cat===shelfCat.slice(3));else Ls=Object.values(IT).filter(d=>d.cat===shelfCat);
  $('scats').innerHTML=SC.map(c=>`<button data-c="${c}" aria-pressed="${c===shelfCat&&!q}">${c}</button>`).join('');
  $('sgrid').innerHTML=Ls.map(d=>`<button data-id="${d.id}" aria-pressed="${cur&&cur.id===d.id}">${esc(d.name)}</button>`).join('')||'<span class="note">没有找到</span>'}
$('scats').onclick=e=>{const b=e.target.closest('button');if(!b)return;shelfCat=b.dataset.c;$('sq').value='';shelf()};
$('sq').oninput=shelf;
$('sgrid').onclick=e=>{const b=e.target.closest('button[data-id]');if(!b)return;const id=b.dataset.id;const d=FD[id]||IT[id];
  cur={id,g:FD[id]?300:d.def,cut:FD[id]?d.cut:null,prep:''};shelf();pickPanel()};
function pickPanel(){const p=$('spick');if(!cur){p.innerHTML='<p class="note">从上面选一样东西。</p>';return}
  const d=FD[cur.id]||IT[cur.id];const chips=(FD[cur.id]?[100,200,300,500]:d.oil?[10,20,40,80]:d.water?[50,100,300,800]:[.5,1,2,5,10,20]);
  p.innerHTML=`<div class="fl"><b style="font-size:18px">${esc(d.name)}</b><input type="number" id="pg" min="0" step="${cur.g<5?.5:5}" value="${cur.g}" aria-label="克数"><span class="unit">g</span>${chips.map(c=>`<button class="btn sm" data-g="${c}">${c}g</button>`).join('')}</div>
  ${FD[cur.id]?`<div class="fl" style="margin-top:6px"><select id="pcut">${Object.keys(CUTS).map(c=>`<option${c===cur.cut?' selected':''}>${c}</option>`).join('')}</select><select id="pprep"><option value="">直接用</option><option value="blanch">先焯水</option><option value="preboil">先煮熟</option></select></div>`:''}
  <p class="note" style="margin:6px 0">${esc(FD[cur.id]?'食材 · '+d.cat:(d.note||d.cat))}</p>
  <button class="btn pri" id="pgo" style="width:100%">放进${CN[to]}</button>`;
  $('pg').oninput=e=>cur.g=Math.max(0,+e.target.value||0);
  p.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{cur.g=+b.dataset.g;$('pg').value=cur.g});
  if($('pcut'))$('pcut').onchange=e=>cur.cut=e.target.value;if($('pprep'))$('pprep').onchange=e=>cur.prep=e.target.value;
  $('pgo').onclick=()=>{if(!(cur.g>0))return;const s={t:'add',c:to,id:cur.id,g:cur.g};if(cur.cut)s.cut=cur.cut;if(cur.prep)s.prep=cur.prep;act(s,`${CN[to]}里放 ${nameOf(cur.id)} ${cur.g}g`)}}
const nameOf=id=>(IT[id]||FD[id]||{name:'?'}).name;
$('sto').onclick=e=>{const b=e.target.closest('button');if(!b)return;to=b.dataset.v;$('sto').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));pickPanel()};

function act(s,text){liveApply(L,s,true);note(text);served=null;dirty=true;paint()}
function note(t){log.unshift([L.t,t,Math.round(L.cs.pot.T)]);log=log.slice(0,40)}

// 控制
$('sfire').onclick=e=>{const b=e.target.closest('button');if(!b)return;fire=+b.dataset.v;$('sfire').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));note(fire?['','开小火','开中火','开大火'][fire]:'关火');if(fire&&!run)setRun(true);paint()};
$('slid').onclick=()=>{lid=lid?0:1;$('slid').setAttribute('aria-pressed',!!lid);$('slid').textContent=lid?'盖着盖':'没盖盖';note(lid?'盖上锅盖':'揭开锅盖');paint()};
$('smode').onchange=e=>{mode=e.target.value;note(mode==='steam'?'改为隔水蒸':'改为锅中加热')};
function setRun(v){run=v;$('splay').textContent=run?'❚❚ 暂停':'▶ 开始计时';$('splay').setAttribute('aria-pressed',run)}
$('splay').onclick=()=>setRun(!run);
$('sspeed').onclick=e=>{const b=e.target.closest('button');if(!b)return;speed=+b.dataset.v;$('sspeed').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b))};
$('sskip').onclick=e=>{const b=e.target.closest('button');if(!b)return;liveRun(L,+b.dataset.s,fire,mode,lid,true);served=null;dirty=true;paint()};
$('smove').onclick=e=>{const b=e.target.closest('button');if(!b)return;const o=b.dataset;
  if(o.from)act({t:'pour',from:o.from,to:o.to,what:o.what||'all'},b.textContent);
  else if(o.drain){const keep=+$('skeep').value||0;act({t:'drain',c:'pot',kind:o.drain,keep},o.drain==='oil'?`沥油，留 ${keep}g`:`倒掉汤汁，留 ${keep}g`)}};
$('seat').onchange=e=>{eat=e.target.value;dirty=true;paint()};
$('sreset').onclick=()=>{L=liveNew();fire=0;lid=0;setRun(false);log=[];served=null;$('sfire').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v==='0'));$('slid').setAttribute('aria-pressed',false);$('slid').textContent='没盖盖';$('sreport').hidden=true;dirty=true;paint()};

// 循环
setInterval(()=>{if(!run||document.body.dataset.mode!=='stove')return;acc+=.1*speed;const n=Math.floor(acc);if(n>0){acc-=n;liveRun(L,n,fire,mode,lid,true);dirty=true}},100);
setInterval(()=>{if(dirty&&document.body.dataset.mode==='stove'){dirty=false;paint()}},250);

function finalC(){const c=L.cs;if(c.pot.foods.length||c.pot.items.length)return'pot';for(const k of['C','A','B'])if(c[k].foods.length)return k;return'pot'}
function paint(){
  const fin=finalC();const ev=evaluate(L,fin,eat);lastEv=ev;const p=L.cs.pot;const T=p.T;
  $('sclock').textContent=clock(L.t);$('stemp').textContent=Math.round(T)+'°C';$('swat').textContent=Math.round(p.water)+' g';$('soil').textContent=Math.round(p.oil)+' g';
  const z=T<95?'温':T<101&&p.water>3?'沸腾':T<110?'微热':T<160?'爆香区':T<190?'易糊区':'冒烟';$('szone').textContent=z;
  $('smark').style.bottom=Math.min(100,T/260*100)+'%';
  drawWok(p,T,ev);contents();
  $('slog').innerHTML=log.slice(0,8).map(l=>`<li><b>${clock(l[0])}</b> ${esc(l[1])} <span class="note">${l[2]}°</span></li>`).join('')||'<li class="note">空锅。先选油，放进锅，再开火。</li>';
  radarSVG($('sradar').querySelector('svg'),DIMS,ev.D,null);
  const types=flavorTypes(ev.D,ev.flags);$('stypes').innerHTML=types.map((t,i)=>`<span class="tag${i?'':' main'}">${esc(t[0])}</span>`).join('');
  const W=warnings(L,ev).filter(w=>w[0]>=1).slice(0,4);
  const live=[];for(const e of p.items){const d=IT[e.id];if(e.burn>.05&&T>d.burnT)live.push([2,`${d.name}正在焦糊！`]);else if(d.burnT<900&&T>d.burnT-10&&e.burn<.05)live.push([1,`锅温 ${Math.round(T)}°C 接近${d.name}的焦化点`])}
  aromaPanel($('saroma'),L.cs[fin]);
  $('swarn').innerHTML=live.concat(W).slice(0,5).map(w=>`<li class="l${w[0]}">${esc(w[1])}</li>`).join('')||'<li class="ok">暂时一切正常。</li>';
}
function contents(){const out=[];
  for(const k of['pot','A','B','C']){const c=L.cs[k];if(!c.foods.length&&!c.items.length&&c.water<1)continue;
    const rows=[];for(const f of c.foods){const t=texture(f,FD[f.id]);rows.push(`<li><b>${esc(t.name)}</b> ${Math.round(f.g)}g ${t.cut}<span class="note"> · ${t.lab}${t.surf?' · '+t.surf:''} · 熟 ${Math.round(Math.min(1,f.done)*100)}% · 入味 ${Math.round(f.abs*100)}%</span></li>`)}
    for(const e of c.items){const d=IT[e.id];if(d.water&&!d.tas.umami&&!d.sugar)continue;const bits=[];
      if(d.oil){if(Object.keys(d.raw).length)bits.push(`生油味剩 ${Math.round(e.rawLeft*100)}%`)}else if(d.rOil||d.rWater)bits.push(`出香 ${Math.round((e.ro+e.rw)*100)}%`);if(Object.keys(d.raw).length&&!d.oil)bits.push(`生味剩 ${Math.round(e.rawLeft*100)}%`);
      if(d.sugar)bits.push(`焦化 ${Math.round(Math.min(1.7,e.car)/1*100)}%`);if(d.alc)bits.push(`酒精剩 ${Math.round(e.alc/(e.g*d.alc+1e-9)*100)}%`);if(d.tv)bits.push(`酸味剩 ${Math.round((1-e.tl)*100)}%`);
      if(e.burn>.02)bits.push(`<span style="color:var(--bad)">焦 ${Math.round(e.burn*100)}%</span>`);
      rows.push(`<li>${esc(d.name)} ${+e.g.toFixed(1)}g${bits.length?`<span class="note"> · ${bits.join(' · ')}</span>`:''}</li>`)}
    out.push(`<div><h3>${CN[k]} <span class="note">${Math.round(c.T)}°C · 水 ${Math.round(c.water)}g · 油 ${Math.round(c.oil)}g</span></h3><ul class="clist">${rows.join('')}</ul></div>`)}
  $('scont').innerHTML=out.join('')||'<p class="note">锅碗都是空的。</p>'}

// 锅的样子
const FCOL={'肉':'#d98b84','禽':'#e8c3a6','水产':'#efe7dc','蛋':'#f2cf4a','豆制品':'#f4efe2','蔬菜':'#5d9c4a','菌菇':'#8a6a4f','其他':'#d8d0c0'};
const SCOL={gla:'#b3241a',xmj:'#d22',pj:'#d44',dj:'#c33',ljm:'#a32',cong:'#4c9a3c',sm:'#4c9a3c',xcai:'#3f8f3a',suan:'#f1e6c8',jiang:'#e3c27a',hj:'#7b2f1f',qhj:'#4a6b2a',db:'#9b2b17',ds:'#2b1d17',bj:'#6b3a1e',gp:'#7a4a2a',xy:'#5a6b3a',cg:'#5a3a2a',zr:'#8a6a3a',hs:'#c68a4a',zm:'#efe3c6'};
function mix(a,b,t){const p=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16));const A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function rnd(i){const x=Math.sin(i*99.13+7.7)*43758.5;return x-Math.floor(x)}
function drawWok(p,T,ev){const s=$('wok');const W=s.clientWidth||400;const H=s.clientHeight||300;
  const cx=200,cy=150;let g=`<defs><radialGradient id="iron" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#5a504b"/><stop offset="1" stop-color="#1c1816"/></radialGradient><linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2d6bd8"/><stop offset=".45" stop-color="#f2a33a"/><stop offset="1" stop-color="#e8452c" stop-opacity="0"/></linearGradient></defs>`;
  // 火
  if(fire){for(let i=0;i<5+fire*3;i++){const x=150+i*(100/(4+fire*3));const h=18+fire*14+rnd(i+L.t%7)*10;g+=`<path class="flame" d="M${x-7},262 Q${x},${262-h*1.3} ${x+7},262Z" fill="url(#fl)" opacity=".9"/>`}}
  g+=`<rect x="110" y="262" width="180" height="10" rx="4" fill="#3a3330"/>`;
  // 锅
  g+=`<path d="M60,120 Q200,300 340,120Z" fill="url(#iron)"/><ellipse cx="200" cy="120" rx="140" ry="26" fill="#2a2421"/><ellipse cx="200" cy="120" rx="132" ry="22" fill="#3b3330"/>`;
  g+=`<rect x="330" y="112" width="62" height="12" rx="6" fill="#4a3b2f"/>`;
  // 液体与油
  const lvl=Math.min(1,(p.water+p.oil*.6)/700);if(p.water>2||p.oil>2){const ry=6+lvl*12,rx=60+lvl*66,yy=176-lvl*50;
    const base=p.water>2?mix('#c9b48a',ev.color.hex,.6):'#d9a531';g+=`<ellipse cx="${cx}" cy="${yy}" rx="${rx}" ry="${ry}" fill="${base}" opacity="${p.water>2?.85:.55}"/>`;
    if(p.oil>2)g+=`<ellipse cx="${cx-rx*.25}" cy="${yy-ry*.3}" rx="${rx*.4}" ry="${ry*.35}" fill="#ffe08a" opacity="${Math.min(.6,p.oil/120)}"/>`}
  // 食材块
  let k=0;p.foods.forEach((f,fi)=>{const d=FD[f.id];let col=FCOL[d.cat]||'#ccc';if(d.cat==='肉'||d.cat==='禽')col=mix(col,'#c9a78c',Math.min(1,f.done));col=mix(col,'#8a4a1c',Math.min(1,f.brown*.6));if(f.burnt>.2)col=mix(col,'#1a1410',Math.min(1,f.burnt));
    const n=Math.min(22,4+Math.round(f.g/30));const sz=6+f.sf*5;for(let i=0;i<n;i++,k++){const a=rnd(k)*Math.PI*2,r=rnd(k+50)*95;const x=cx+Math.cos(a)*r,y=150+Math.sin(a)*r*.32;g+=`<rect x="${x-sz/2}" y="${y-sz/3}" width="${sz}" height="${sz*.66}" rx="${sz*.25}" fill="${col}" stroke="rgba(0,0,0,.25)" stroke-width=".6" transform="rotate(${rnd(k+9)*90} ${x} ${y})"/>`}});
  p.items.forEach((e,ei)=>{const c0=SCOL[e.id];if(!c0||e.g<.5)return;const col=e.burn>.2?mix(c0,'#120d0a',Math.min(1,e.burn*1.3)):c0;const n=Math.min(16,2+Math.round(e.g/2));for(let i=0;i<n;i++,k++){const a=rnd(k)*Math.PI*2,r=rnd(k+31)*100;g+=`<circle cx="${cx+Math.cos(a)*r}" cy="${148+Math.sin(a)*r*.3}" r="${2+rnd(k+3)*2}" fill="${col}"/>`}});
  // 蒸汽、油烟
  const burning=p.items.some(e=>e.burn>.1&&T>IT[e.id].burnT)||p.foods.some(f=>f.burnt>.2);
  if(T>=95&&p.water>3&&!lid)for(let i=0;i<4;i++){const x=140+i*40;g+=`<path class="steam" d="M${x},100 q-12,-20 0,-40 q12,-20 0,-40" stroke="#bbb" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>`}
  if(T>195||burning)for(let i=0;i<3;i++){const x=160+i*40;g+=`<path class="steam" d="M${x},96 q-16,-22 4,-44 q18,-22 -4,-44" stroke="${burning?'#444':'#999'}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".45"/>`}
  if(!p.water&&p.oil>3&&T>130&&(p.foods.length||p.items.length>1))g+=`<text x="290" y="88" font-size="18" fill="var(--red2)" font-weight="700">滋啦</text>`;
  if(lid)g+=`<path d="M70,118 Q200,10 330,118Z" fill="#9aa3a8" opacity=".9"/><rect x="188" y="52" width="24" height="12" rx="5" fill="#333"/>`;
  s.innerHTML=g}
$('saroma').innerHTML=AROMA_HTML+`<h3>存为香料包</h3><div class="fl"><input id="smixn" placeholder="给锅里这包料起个名" style="flex:1;border:1px solid var(--line);border-radius:8px;padding:8px;min-height:44px;background:var(--bg);font-size:16px"><button class="btn" id="smix">加入调料架</button></div><p class="note" id="smixmsg"></p>`;
$('smix').onclick=()=>{const r=potToBlend(L.cs[finalC()]);if(!r){$('smixmsg').textContent='锅里没有可识别的香料。';return}const nm=($('smixn').value.trim()||'锅里这包料').slice(0,16);const spec=blendToSeasoning(nm,r.items,r.m,blendInfo(r.items,r.m));const id='mx'+Date.now().toString(36);registerMix(id,spec);MIXES.push({id,spec});saveMixes();$('smixn').value='';$('smixmsg').textContent=`已加入调料架：“自配·${nm}”（按${METHODS[r.m.method]}计）。`;shelf()};
const roW=new ResizeObserver(()=>{dirty=true});roW.observe($('wok'));

// 出锅
$('sserve').onclick=()=>{setRun(false);const fin=finalC();const ev=evaluate(L,fin,eat);
  if(foodMass(L.cs[fin])<=50){const pa=potAroma(L.cs[fin]);$('sreport').hidden=false;
    $('srep').innerHTML=pa?`<p>锅里没有食材，只有香料（${pa.used.map(u=>esc(u[0])+' '+(+u[1].toFixed(1))+'g').join('、')}）。这是一锅<b>${esc(pa.near[0].b.name)}</b>风格的料：${esc(describe(pa.info))}</p><p class="note">适配的菜、香型匹配和用量见上方“香料复合香味”。想看它下菜的效果，可以继续往锅里加食材再出锅；或者存为香料包，在其他菜里用。</p>`:'<p>锅里没有食材，也没有香料，还没什么可评的。</p>';
    $('sreport').scrollIntoView({behavior:'smooth',block:'start'});return}const near=nearestDishes(ev.D,L.steps).slice(0,3);served={fin,ev,near};
  const tex=ev.tex.map(t=>`${t.name}：${t.lab}${t.surf?'（'+t.surf+'）':''}`).join('；')||'没有食材';
  $('srep').innerHTML=`<p>${esc(describeDish(ev))}</p><p class="note">口感：${esc(tex)}</p>
   <h3>最像哪道经典菜</h3><div class="near">${near.map((n,i)=>`<div class="ncard${i?'':' first'}"><b>${n.d.name}</b><span class="big2">${n.score}</span><span class="note">味道 ${n.flavor} · 用料 ${n.ing}</span>
    <span class="note">${n.diffs.slice(0,2).map(([k,d])=>`${DN[k]}${d>0?'多':'少'} ${Math.abs(d).toFixed(1)}`).join('，')||'味道很接近'}</span></div>`).join('')}</div>
   <div class="fl" style="margin-top:10px"><button class="btn pri" id="sopen">在编辑器里打开这份记录</button><span class="note">会以“${near[0].d.name}”作对照，可逐步修改。</span></div>`;
  $('sreport').hidden=false;$('sreport').scrollIntoView({behavior:'smooth',block:'start'});
  $('sopen').onclick=()=>{window.openInEditor({dish:near[0].d.id,steps:JSON.parse(JSON.stringify(L.steps)),fin,eat,custom:'我的灶台记录'});location.hash='remix'}};
function describeDish(ev){const t=flavorTypes(ev.D,ev.flags)[0][0];const top=DIMS.map(([k,n])=>[n,ev.D[k]]).filter(x=>x[1]>=3).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
  const salt=ev.D.salt<2.5?'偏淡':ev.D.salt>6.8?'偏咸':'咸淡合适';return `成菜判定为${t}，${salt}，色泽${ev.color.name}，${ev.sauce}${top.length?'，突出'+top.join('、'):''}。`+(ev.D.burnt>2?' 有糊味。':'')+(ev.D.off>2.5?' 腥膻没压住。':'')}

function potToBlend(c){const acc={};let ro=0,rw=0,ws=0,n=0;
  for(const e of c.items){const parts=spxOf(e.id);if(!parts)continue;for(const [sid,f] of parts)acc[sid]=(acc[sid]||0)+e.g*f;ro+=e.ro;rw+=e.rw;ws+=e.wetSec;n++}
  if(!n)return null;const items=Object.entries(acc).map(([id,g])=>({id,g:+g.toFixed(2)}));
  const m=rw>ro&&rw>.1?{method:'water',kg:1,min:Math.round(ws/n/60),lid:1,form:'whole'}:ro>.1?{method:'oil',kg:1,oilT:140,sec:60,form:'whole'}:{method:'powder',kg:1};
  return{items,m}}
window.stoveShow=()=>{shelf();pickPanel();dirty=true;paint()};
}
