// ===== 按口味改良 + 菜谱卡 + 我的菜谱 =====
{
const $=id=>document.getElementById(id);
const PD=[['salt','咸'],['sweet','甜'],['sour','酸'],['spicy','辣'],['numb','麻'],['umami','鲜'],['wok','爆香'],['spice','香料'],['fresh','清香'],['roast','焦香'],['rich','油润']];
const CONS=[['lowSalt','少盐'],['lowOil','少油'],['lowSugar','控糖'],['noSpicy','不吃辣'],['noAlcohol','不用酒'],['noMSG','不用味精鸡精']];
let P={delta:{},meat:'',veg:'',cons:{},missing:[]};let last=null;
try{const s=JSON.parse(localStorage.getItem('tw.prefs')||'null');if(s&&s.delta)P=Object.assign(P,s,{missing:[]})}catch(e){}
function save(){try{localStorage.setItem('tw.prefs',JSON.stringify(Object.assign({},P,{missing:[]})))}catch(e){}}
function render(){
  $('pdims').innerHTML=PD.map(([k,n],j)=>`<div class="prow${j>=6?' xd':''}"><span>${n}</span><span class="seg" data-k="${k}">${[-2,-1,0,1,2].map(v=>`<button data-v="${v}" aria-pressed="${(P.delta[k]||0)===v}" aria-label="${n}${['少很多','少一点','原样','多一点','多很多'][v+2]}">${['−−','−','原样','+','++'][v+2]}</button>`).join('')}</span></div>`).join('')+`<button class="btn sm" id="pmore">${document.body.classList.contains('showxd')?'收起':'更多口味：爆香、香料、清香、焦香、油润'}</button>`;
  $('pmore').onclick=()=>{document.body.classList.toggle('showxd');render()};
  $('ptex').innerHTML=`<div class="prow"><span>肉</span><span class="seg" data-t="meat">${[['','原样'],['嫩','更嫩'],['烂','更软烂']].map(([v,n])=>`<button data-v="${v}" aria-pressed="${P.meat===v}">${n}</button>`).join('')}</span></div>
   <div class="prow"><span>蔬菜</span><span class="seg" data-t="veg">${[['','原样'],['脆','更脆'],['软','更软']].map(([v,n])=>`<button data-v="${v}" aria-pressed="${P.veg===v}">${n}</button>`).join('')}</span></div>`;
  $('pcons').innerHTML=CONS.map(([k,n])=>`<button class="chip" data-c="${k}" aria-pressed="${!!P.cons[k]}">${n}</button>`).join('');
  const st=window.wsGet();const ids=[...new Set(st.steps.filter(s=>s.t==='add'&&IT[s.id]&&!IT[s.id].water).map(s=>s.id))];P.missing=P.missing.filter(i=>ids.includes(i));
  $('pmiss').innerHTML=ids.map(id=>`<button class="chip" data-m="${id}" aria-pressed="${P.missing.includes(id)}">${esc(IT[id].name)}</button>`).join('')||'<span class="note">配方里还没有调料</span>'}
window.impRender=render;
$('improve').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const seg=b.closest('.seg');
  if(seg&&seg.dataset.k){P.delta[seg.dataset.k]=+b.dataset.v;if(!P.delta[seg.dataset.k])delete P.delta[seg.dataset.k]}
  else if(seg&&seg.dataset.t){P[seg.dataset.t]=b.dataset.v}
  else if(b.dataset.c){P.cons[b.dataset.c]=!P.cons[b.dataset.c]}
  else if(b.dataset.m){const i=P.missing.indexOf(b.dataset.m);if(i>=0)P.missing.splice(i,1);else P.missing.push(b.dataset.m)}
  else return;save();render()});
$('preset').onclick=()=>{P={delta:{},meat:'',veg:'',cons:{},missing:[]};save();render();$('pres').hidden=true};
$('prun').onclick=()=>{const st=window.wsGet();if(!st.steps.length)return;$('prun').disabled=true;$('pstat').textContent='正在一步步试算…';
  setTimeout(()=>{let r;try{r=improve(st.steps,st.fin,st.eat,P,2500)}catch(err){console.error(err);$('pstat').textContent='改良失败';$('prun').disabled=false;return}
    last={r,from:JSON.parse(JSON.stringify(st))};$('prun').disabled=false;$('pstat').textContent=`试算用时 ${(r.ms/1000).toFixed(1)} 秒`;show(r)},30)};
function show(r){$('pres').hidden=false;const B=r.before.ev,A=r.after.ev;
  radarSVG($('pradar').querySelector('svg'),DIMS,A.D,B.D);
  const keys=PD.map(x=>x[0]).concat(['bitter','off','burnt']);
  $('pcmp').innerHTML=keys.filter(k=>Math.abs(A.D[k]-B.D[k])>=.3||P.delta[k]).map(k=>{const d=A.D[k]-B.D[k];return `<span class="tag">${DN[k]} ${B.D[k].toFixed(1)} → <b>${A.D[k].toFixed(1)}</b> <span style="color:${(['off','burnt','bitter'].includes(k)?d<0:d*(P.delta[k]||0)>=0)?'var(--ok)':'var(--warn)'}">${d>0?'+':''}${d.toFixed(1)}</span></span>`}).join('')||'<span class="note">味道几乎没变</span>';
  const tb=B.tex.map(t=>t.name+'：'+t.lab).join('，'),ta=A.tex.map(t=>t.name+'：'+t.lab).join('，');
  $('ptexr').textContent=tb===ta?`口感：${ta||'—'}`:`口感：${tb} → ${ta}`;
  const G={};for(const [t,x] of r.log)(G[t]=G[t]||[]).push(x);
  $('plog').innerHTML=Object.keys(G).length?Object.entries(G).map(([t,L])=>`<li><b>${t}</b>：${L.map(esc).join('；')}</li>`).join(''):'<li>不需要改动，原配方已经符合你的口味。</li>';
  const w=r.after.W.filter(x=>x[0]>=1).map(x=>x[1]);$('pwarn').textContent=w.length?'仍有提醒：'+w.slice(0,3).join(' '):'';}
$('papply').onclick=()=>{if(!last)return;const st=window.wsGet();const nm=(st.custom||(recipeById(st.dish)||{name:'我的菜'}).name).replace(/（改良版）$/,'')+'（改良版）';window.wsSet(last.r.steps,nm);$('pres').hidden=true;window.scrollTo({top:0,behavior:'smooth'})};
$('pcard').onclick=()=>{if(!last)return;const st=window.wsGet();openCard((st.custom||(recipeById(st.dish)||{name:'我的菜'}).name)+'（改良版）',last.r.steps,st.fin,st.eat,prefsText())};
$('psave').onclick=()=>{if(!last)return;const st=window.wsGet();bookSave({name:(st.custom||(recipeById(st.dish)||{name:'我的菜'}).name).replace(/（改良版）$/,'')+'（改良版）',steps:last.r.steps,fin:st.fin,eat:st.eat,base:st.dish,note:prefsText()});$('pstat').textContent='已存进“我的菜谱”'};
function prefsText(){const a=[];for(const [k,n] of PD){const v=P.delta[k];if(v)a.push(n+['少很多','少一点','','多一点','多很多'][v+2])}if(P.meat)a.push('肉'+(P.meat==='嫩'?'更嫩':'更软烂'));if(P.veg)a.push('菜'+(P.veg==='脆'?'更脆':'更软'));for(const [k,n] of CONS)if(P.cons[k])a.push(n);if(P.missing.length)a.push('没有'+P.missing.map(i=>IT[i].name).join('、'));return a.length?'口味：'+a.join('，'):''}

// ---- 菜谱卡 ----
let C=null;
function openCard(name,steps,fin,eat,note){C={name,steps,fin,eat,note,k:1};const mainG=Math.max(0,...steps.filter(s=>s.t==='add'&&FD[s.id]).map(s=>+s.g));C.main=mainG;
  $('cname').value=name;$('cmain').value=Math.round(mainG);$('cmainl').textContent=mainG?`主料（${(FD[(steps.find(s=>s.t==='add'&&FD[s.id]&&+s.g===mainG)||{}).id]||{name:''}).name}）重量`:'';$('cardm').classList.add('on');paintCard()}
window.openCard=openCard;
function paintCard(){const card=recipeCard(C.steps,{scale:C.k});const ev=evaluate(simulate(C.steps),C.fin,C.eat);const types=flavorTypes(ev.D,ev.flags).map(t=>t[0]).join(' · ');
  C.card=card;C.summary=`${types}｜${ev.color.name}｜${ev.sauce}｜约 ${fmtT(card.total)}${C.k!==1?'｜用料已按主料换算 ×'+C.k.toFixed(2)+'，时间仍按原量':''}`;
  $('csum').textContent=C.summary+(C.note?'\n'+C.note:'');
  $('cing').innerHTML=cardHTML(card);$('csteps').innerHTML=''}
$('cmain').oninput=e=>{if(!C||!C.main)return;const v=+e.target.value;if(v>0){C.k=v/C.main;paintCard()}};
$('cclose').onclick=()=>$('cardm').classList.remove('on');$('cardm').onclick=e=>{if(e.target.id==='cardm')$('cardm').classList.remove('on')};
$('ccopy').onclick=async()=>{const t=cardText($('cname').value||C.name,C.card,C.summary+(C.note?'\n'+C.note:''));try{await navigator.clipboard.writeText(t);$('cmsg').textContent='已复制'}catch(e){$('ctext').hidden=false;$('ctext').value=t;$('cmsg').textContent='复制被拦截，文字已放在下面'}};
$('csave').onclick=()=>{const k=C.k;const steps=k===1?C.steps:C.steps.map(s=>s.t==='add'?Object.assign({},s,{g:Math.round(s.g*k*10)/10}):s);bookSave({name:$('cname').value||C.name,steps,fin:C.fin,eat:C.eat,base:(window.wsGet()||{}).dish,note:C.note});$('cmsg').textContent='已存进“我的菜谱”'};
$('wcard').onclick=()=>{const st=window.wsGet();openCard(st.custom||(recipeById(st.dish)||{name:'我的菜'}).name,st.steps,st.fin,st.eat,'')};

// ---- 我的菜谱 ----
function book(){try{return JSON.parse(localStorage.getItem('tw.book')||'[]')}catch(e){return[]}}
function bookPut(B){try{localStorage.setItem('tw.book',JSON.stringify(B));return true}catch(e){return false}}
function bookSave(o){const B=book();B.unshift(Object.assign({id:'b'+Date.now().toString(36),t:Date.now()},o));bookPut(B);bookRender()}
window.bookSave=bookSave;
let openFb='';
function bookRender(){const B=book();const box=$('blist');let dirty=false;for(const b of B)if(rateOf(b)&&!b.snap){try{b.snap=snapOf(b);dirty=true}catch(e){}}if(dirty)bookPut(B);profRender(B);
  box.innerHTML=B.length?B.map(b=>{let info='';try{const ev=evaluate(simulate(b.steps),b.fin,b.eat);info=flavorTypes(ev.D,ev.flags)[0][0]+' · 咸 '+ev.D.salt.toFixed(1)+' · 甜 '+ev.D.sweet.toFixed(1)+' · 辣 '+ev.D.spicy.toFixed(1)}catch(e){}
    const base=recipeById(b.base);const r=rateOf(b);const s=r?r.s:0;
    return `<div class="bcard" data-id="${b.id}"><b>${esc(b.name)}</b><span class="note">${new Date(b.t).toLocaleDateString()}${base?' · 基于 '+esc(base.name):''}</span><span>${esc(info)}</span>${b.note?`<span class="note">${esc(b.note)}</span>`:''}
     <div class="fl" style="gap:6px"><span class="stars" role="group" aria-label="打分">${[1,2,3,4,5].map(k=>`<button data-star="${k}" class="${k<=s?'on':''}" aria-label="${k} 星">★</button>`).join('')}</span><span class="note">${r?`${['','难吃','一般偏差','还行','好吃','超好吃'][s]} · 打过 ${b.rates.length} 次`:'做过了？打个分'}</span></div>
     ${r||openFb===b.id?`<details ${openFb===b.id?'open':''}><summary>哪里不对？点选反馈${r&&r.tags&&r.tags.length?`（${esc(r.tags.join('、'))}）`:''}</summary><div class="fbk">${FB.map(x=>`<button data-tag="${x[0]}" aria-pressed="${!!(r&&r.tags&&r.tags.includes(x[0]))}">${x[0]}</button>`).join('')}</div></details>`:''}
     <div class="fl"><button class="btn sm" data-a="open">在工坊打开</button><button class="btn sm" data-a="card">菜谱卡</button>${r&&(r.tags&&r.tags.length||r.s<=3)?'<button class="btn sm pri" data-a="fix">按打分改良</button>':''}<button class="btn sm" data-a="del">删除</button></div></div>`}).join(''):'<p class="note">还没有保存的菜谱。在“菜谱工坊”里改良后点“存进我的菜谱”，或在菜谱卡里保存。</p>'}
$('blist').addEventListener('click',e=>{const st=e.target.closest('button[data-star],button[data-tag]');if(!st)return;e.stopPropagation();const id=st.closest('.bcard').dataset.id;const B=book();const r=B.find(x=>x.id===id);if(!r)return;
  r.rates=r.rates||[];let last=r.rates[r.rates.length-1];const today=new Date().toDateString();if(!last||new Date(last.t).toDateString()!==today){last={s:3,tags:[],t:Date.now()};r.rates.push(last);if(r.rates.length>20)r.rates.shift()}
  if(st.dataset.star){last.s=+st.dataset.star;openFb=id}else{const t=st.dataset.tag;const i=last.tags.indexOf(t);if(i>=0)last.tags.splice(i,1);else{const f=FB.find(x=>x[0]===t);last.tags=last.tags.filter(o=>{const g=FB.find(x=>x[0]===o);return !(g&&f&&g[1]===f[1]&&g[1]!=='tex'&&g[2]!==f[2])});last.tags.push(t)}openFb=id}
  last.t=Date.now();try{r.snap=snapOf(r)}catch(err){}bookPut(B);bookRender()},true);
function profRender(B){const L=learnProfile(B);const box=$('bprof');if(!L.n){box.innerHTML='';return}const T=profileText(L);
  const tx={嫩:'肉要嫩',烂:'肉要软烂',脆:'菜要脆',软:'菜要软'};
  box.innerHTML=`<div class="prof"><b>我的口味画像</b><span class="note"> · 从 ${L.n} 道打过分的菜学来</span><div style="margin-top:6px">${T.lines.length?T.lines.map(x=>`<span class="tg${x.strong?' s':''}">${esc(x.w)}${x.strong?'很多':'一点'}</span>`).join(''):'<span class="note">口味和标准做法差不多，再多打几道就更准了</span>'}${[T.meat,T.veg].filter(Boolean).map(v=>`<span class="tg">${tx[v]}</span>`).join('')}</div>
   ${T.likes.length?`<div class="note" style="margin-top:4px">爱吃：${esc(T.likes.join('、'))}${T.foods.length?' · 爱吃的食材：'+esc(T.foods.join('、')):''}</div>`:''}${T.dislikes.length?`<div class="note">不太爱：${esc(T.dislikes.join('、'))}</div>`:''}
   <div class="fl" style="margin-top:8px"><button class="btn sm pri" id="plearn">按我的口味设计新菜</button></div></div>`;
  $('plearn').onclick=()=>{if(window.useLearn)window.useLearn();location.hash='ai'}}
window.bookAll=book;
$('blist').onclick=e=>{const b=e.target.closest('button[data-a]');if(!b)return;const id=b.closest('.bcard').dataset.id;const B=book();const r=B.find(x=>x.id===id);if(!r)return;
  if(b.dataset.a==='open'){window.openInEditor({dish:r.base||'',steps:JSON.parse(JSON.stringify(r.steps)),fin:r.fin,eat:r.eat,custom:r.name});location.hash='remix'}
  if(b.dataset.a==='card')openCard(r.name,r.steps,r.fin,r.eat,r.note||'');
  if(b.dataset.a==='fix'){const rr=rateOf(r);const P=Object.assign(rateToPrefs(rr));b.disabled=true;b.textContent='改良中…';
    setTimeout(()=>{try{const x=improve(r.steps,r.fin,r.eat,P,2500);const log=x.log.slice(0,5).map(l=>l[1]).join('；');openCard(r.name.replace(/（改良版）$/,'')+'（改良版）',x.steps,r.fin,r.eat,`按你的打分（${rr.s} 星${rr.tags&&rr.tags.length?'，'+rr.tags.join('、'):''}）改良：${log||'原配方已经很接近，只做了微调'}`)}catch(err){console.error(err)}b.disabled=false;b.textContent='按打分改良'},30)}
  if(b.dataset.a==='del'){if(b.dataset.sure){bookPut(B.filter(x=>x.id!==id));bookRender()}else{b.dataset.sure=1;b.textContent='再点一次删除'}}};
$('bcopy').onclick=async()=>{const t=JSON.stringify(book());try{await navigator.clipboard.writeText(t);$('bmsg').textContent='已复制全部菜谱'}catch(e){$('bimp').value=t;$('bmsg').textContent='复制被拦截，已放进文本框'}};
$('bdoimp').onclick=()=>{try{const L=JSON.parse($('bimp').value);if(!Array.isArray(L))throw 0;const ok=L.filter(b=>b&&b.name&&Array.isArray(b.steps)&&b.steps.every(s=>s.t!=='add'||IT[s.id]||FD[s.id])).map(b=>({id:'b'+Math.random().toString(36).slice(2,8),t:+b.t||Date.now(),name:String(b.name).slice(0,60),steps:b.steps,fin:['pot','A','B','C'].includes(b.fin)?b.fin:'pot',eat:b.eat==='drain'?'drain':'all',base:b.base||'',note:String(b.note||'').slice(0,200),style:STYLES[b.style]?b.style:'',method:METHODS_D.includes(b.method)?b.method:'',rates:Array.isArray(b.rates)?b.rates.filter(x=>x&&x.s>=1&&x.s<=5).map(x=>({s:Math.round(x.s),t:+x.t||Date.now(),tags:(Array.isArray(x.tags)?x.tags:[]).filter(t=>FB.some(f=>f[0]===t))})).slice(-20):undefined}));bookPut(ok.concat(book()));bookRender();$('bmsg').textContent=`导入 ${ok.length} 个`}catch(e){$('bmsg').textContent='无法识别'}};
window.bookShow=bookRender;
try{render()}catch(e){}
}
