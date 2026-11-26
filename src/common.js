// ===== 三个模式共用 =====
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtT=s=>{s=Math.round(s);const m=Math.floor(s/60),x=s%60;return m?(x?`${m}分${x}秒`:`${m}分钟`):`${x}秒`};
const clock=s=>{s=Math.round(s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const DN=Object.fromEntries(DIMS.concat(NEG));
const tgtCache={};
function dishTarget(d){if(!d)return null;if(!tgtCache[d.id]){const s=simulate(d.steps);const e=evaluate(s,d.fin,d.eat);
  const ids=new Set();for(const st of d.steps)if(st.t==='add')ids.add(st.id);tgtCache[d.id]={D:e.D,tex:e.tex,ids}}return tgtCache[d.id]}
// 与经典菜比：味道 75% + 用料重合 25%
function nearestDishes(D,steps){const mine=new Set(steps.filter(s=>s.t==='add').map(s=>s.id));
  return DISHES.map(d=>{const T=dishTarget(d);const c=compare(D,T.D);let inter=0;for(const i of mine)if(T.ids.has(i))inter++;
    const foodsT=[...T.ids].filter(i=>FD[i]),foodsM=[...mine].filter(i=>FD[i]);const fo=foodsT.filter(i=>mine.has(i)).length;
    const jac=(inter/Math.max(1,new Set([...mine,...T.ids]).size))*.5+(foodsT.length?fo/foodsT.length:0)*.5;
    return{d,flavor:c.score,ing:Math.round(jac*100),score:Math.round(c.score*.75+jac*100*.25),diffs:c.diffs}}).sort((a,b)=>b.score-a.score)}
function radarSVG(svg,dims,D,T,opt){opt=opt||{};const W=svg.clientWidth,H=svg.clientHeight;if(!W)return;
  const n=dims.length,cx=W/2,cy=H/2,R=Math.min(W*.34,H/2-30);const ang=i=>-Math.PI/2+i*2*Math.PI/n;
  const pt=(i,v)=>[cx+Math.cos(ang(i))*R*Math.max(0,v)/10,cy+Math.sin(ang(i))*R*Math.max(0,v)/10];
  let g='';for(const lv of[2.5,5,7.5,10])g+=`<polygon points="${dims.map((d,i)=>pt(i,lv).join(',')).join(' ')}" fill="none" stroke="var(--line)"/>`;
  dims.forEach((d,i)=>{const [x,y]=pt(i,10);g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)"/>`;
    const [lx,ly]=pt(i,11.5);const anc=Math.abs(lx-cx)<8?'middle':lx>cx?'start':'end';const lab=W<420&&d[1].length>3?d[1].slice(0,2):d[1];
    g+=`<text x="${lx}" y="${ly+5}" text-anchor="${anc}" font-size="${W<420?12:13.5}" fill="var(--ink)">${lab}</text>`});
  if(T)g+=`<polygon points="${dims.map((d,i)=>pt(i,T[d[0]]).join(',')).join(' ')}" fill="none" stroke="var(--tgt)" stroke-width="2" stroke-dasharray="5 4"/>`;
  const c=opt.color||'var(--red2)';
  g+=`<polygon points="${dims.map((d,i)=>pt(i,D[d[0]]).join(',')).join(' ')}" fill="${c}" fill-opacity=".22" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>`;
  dims.forEach((d,i)=>{const [x,y]=pt(i,D[d[0]]);g+=`<circle cx="${x}" cy="${y}" r="3.5" fill="${c}"/>`});
  svg.innerHTML=g}
// 自配香料包：注册成调料
function registerMix(id,spec){S(id,spec.name,'香料',spec);IT[id].mix=1}
let MIXES=[];try{MIXES=JSON.parse(localStorage.getItem('tw.mixes')||'[]')}catch(e){}
for(const m of MIXES)registerMix(m.id,m.spec);
function saveMixes(){try{localStorage.setItem('tw.mixes',JSON.stringify(MIXES))}catch(e){}}

// 香料复合香味面板（锅里只有香料或有香料时）
function aromaPanel(box,c){const pa=potAroma(c);if(!pa){box.hidden=true;return null}box.hidden=false;const i=pa.info;const noFood=pa.mf<=50;
  const svg=box.querySelector('svg');
  box.querySelector('.ad').textContent=(pa.heated?'':'香料还没加热，整粒香料几乎不出味；')+describe(i);
  box.querySelector('.al').innerHTML=Object.entries(i.layers).map(([k,v])=>`<div><b>${k}</b>${v.length?v.map(x=>`${x[0]} <span class="note">${x[1].toFixed(1)}</span>`).join('<br>'):'<span class="note">—</span>'}</div>`).join('');
  box.querySelector('.am').innerHTML=pa.near.map((n,j)=>`<div class="ncard${j?'':' first'}"><b>${n.b.name}</b><span class="big2">${n.score}</span><span class="note">${esc(n.b.use)}</span></div>`).join('');
  const dishes=[];const seen=new Set();for(const n of pa.near)if(n.score>=55)for(const d of n.b.dishes)if(!seen.has(d)){seen.add(d);dishes.push(d)}
  box.querySelector('.ads').innerHTML=dishes.slice(0,8).map(d=>`<span class="tag">${esc(d)}</span>`).join('')||'<span class="note">和经典香型差别较大，参考下面的方向。</span>';
  const R=dishRules(i).map(r=>`<li><b>${r[0]}</b>：${r[1]}</li>`);
  if(noFood)R.push(`<li><b>用量</b>：锅里共 ${+pa.totalG.toFixed(1)}g 香料，按“${pa.near[0].b.name}”的常用比例，约够 ${pa.supportKg<.2?'不到 0.2':pa.supportKg.toFixed(1)} kg 主料。</li>`);
  else R.push(`<li><b>当前浓度</b>：${+pa.totalG.toFixed(1)}g 香料配 ${Math.round(pa.mf)}g 食材，约 ${(pa.totalG/pa.kg).toFixed(1)}g/kg。</li>`);
  if(pa.info.D.bitter>2.5)R.push('<li><b>注意</b>：香料已经出苦（焦糊或久煮），可减时长或降火。</li>');
  box.querySelector('.ar').innerHTML=R.join('');
  box._draw=()=>radarSVG(svg,NOTES,i.D,null,{color:'var(--soy)'});box._draw();
  if(!box._ro){box._ro=new ResizeObserver(()=>box._draw&&box._draw());box._ro.observe(svg)}
  return pa}
const AROMA_HTML=`<h2>香料复合香味</h2><p class="ad" style="margin:0 0 4px"></p>
 <div class="fig" style="height:280px"><svg role="img" aria-label="香气轮"></svg></div><div class="layers al"></div>
 <h3>最像的香型</h3><div class="near am"></div><h3>适配的菜</h3><div class="tags ads"></div><ul class="hint ar"></ul>`;
