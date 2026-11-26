// ===== 菜谱卡：把步骤写成人能照着做的菜谱 =====
const CNAME={pot:'锅',A:'A 碗',B:'B 碗',C:'C 盘'};
const PIECEW={cong:[15,'根'],sm:[15,'根'],xcai:[5,'根'],suan:[5,'瓣'],jiang:[3,'片'],bj:[2,'颗'],xy:[.3,'片'],gp:[3,'块'],cg:[4,'个'],jd:[50,'个'],xmj:[3,'个'],dx:[.1,'粒'],gla:[.4,'个']};
const CUTW={'液':'打散','整':'整个','整条':'整条','末':'剁末'};const cutTxt=c=>CUTW[c]||('切'+c);
const fmtG=g=>g>=100?String(Math.round(g)):g>=10?String(Math.round(g*2)/2).replace(/\.0$/,''):String(Math.round(g*10)/10);
function measure(id,g){const d=IT[id];if(!d)return'';if(PIECEW[id]){const [w,u]=PIECEW[id];const n=g/w;if(n>=.5&&n<=40)return`约 ${Math.round(n*2)/2} ${u}`}
  if(d.water||d.oil&&g>=60)return g>=50?`约 ${Math.round(g/10)*10}ml`:'';
  const gran=['salt','bt','wj','jj','nrf','bingt','ht','jy'].includes(id),pow=['dian','mf','ljm','hjm','bhj','hhj','wxf','ssx','zr','gl'].includes(id);
  const sp=gran?9:pow?5:10;const ts=sp/3;
  if(g>=sp*.8){const n=g/sp;return`约 ${Math.round(n*2)/2} 勺`}if(g>=ts*.4){const n=g/ts;return`约 ${Math.round(n*2)/2} 茶勺`}if(g<1)return'少许';return''}
function oilCue(T){return T<110?'':T<140?'约三四成热，筷子插进去冒小泡':T<170?'约五成热，筷子周围冒密集小泡':T<195?'约六成热，油面微动':T<215?'约七成热，微冒青烟':'冒烟，八成热以上'}
function recipeCard(steps,opts){opts=opts||{};const k=opts.scale||1;steps=JSON.parse(JSON.stringify(steps));const sim=simulate(steps);const marks=sim.marks;
  // 用料分组
  const lastHeat=steps.reduce((a,s,i)=>s.t==='heat'?i:a,-1);
  const groups={'主料':[],'腌料（A 碗）':[],'碗汁（B 碗）':[],'调料':[],'出锅时':[]};
  const seen={};
  steps.forEach((s,i)=>{if(s.t!=='add')return;const d=FD[s.id]||IT[s.id];if(!d)return;let g='调料';
    if(FD[s.id])g=s.c==='A'?'腌料（A 碗）':'主料';else if(s.c==='A')g='腌料（A 碗）';else if(s.c==='B')g='碗汁（B 碗）';else if(i>lastHeat)g='出锅时';
    const key=g+'|'+s.id+'|'+(s.cut||'');if(seen[key]){seen[key][1]+=s.g*k;return}const row=[d.name,s.g*k,s.id,(FD[s.id]?(s.cut||d.cut)+(s.prep==='blanch'?'，焯水':s.prep==='preboil'?'，煮熟':''):'')+(s.est?(FD[s.id]?'，':'')+'估':'')];seen[key]=row;groups[g].push(row)});
  const ing=Object.entries(groups).filter(([,r])=>r.length).map(([t,rows])=>({t,rows:rows.map(r=>({name:r[0],g:fmtG(r[1]),m:FD[r[2]]?'':measure(r[2],r[1]),note:r[3]}))}));
  // 步骤
  const out=[];let buf=[];let bufC='pot';
  let aPending=false;
  const flush=(tail)=>{if(!buf.length&&!tail)return;let s='';if(buf.length){s=(bufC==='pot'?'锅里下':`${CNAME[bufC]}里放`)+buf.join('、');if(!tail&&bufC==='B')s+='，调匀成碗汁';if(!tail&&bufC==='A')s+='，抓匀'}if(tail)s+=(s?'，':'')+tail;out.push(s+'。');buf=[]};
  const T=i=>{const m=marks[i+1];const p=sim.potLog[Math.max(0,(m?m.t:sim.t)-1)];return p?p.T:22};
  const W=i=>{const m=marks[i+1];const h=sim.hist;let best=h[0];for(const x of h)if(x.t<=(m?m.t:sim.t))best=x;return best};
  steps.forEach((s,i)=>{
    if(s.t==='add'){const d=FD[s.id]||IT[s.id];if(!d)return;const c=s.c||'pot';if(buf.length&&c!==bufC)flush();bufC=c;if(c==='A')aPending=true;
      let txt=`${d.name} ${fmtG(s.g*k)}g`;if(FD[s.id])txt+=`（${cutTxt(s.cut||d.cut)}${s.prep==='blanch'?'，先焯水':s.prep==='preboil'?'，先煮熟':''}）`;buf.push(txt)}
    else if(s.t==='heat'){const f=['','小火','中火','大火'][+s.f||2];const t1=T(i);const w=W(i);let dur=s._ran!=null?s._ran:s.s;let h;
      const nx=steps[i+1];if(nx&&nx.t==='heat'&&!nx.u&&!s.u&&+nx.f===+s.f&&!!nx.lid===!!s.lid&&(nx.m||'wok')===(s.m||'wok')){nx._carry=(nx._carry||0)+dur+(s._carry||0);return}
      dur+=s._carry||0;delete s._carry;if(dur<5&&!s.u)return;
      if(s.m==='steam')h=`上锅隔水${f}蒸 ${fmtT(dur)}`;
      else if(s.u==='boil')h=`${f}烧开${dur>20?'（约 '+fmtT(dur)+'）':''}`;
      else if(s.u==='temp')h=`${f}把油烧到约 ${Math.round(t1)}°C（${oilCue(t1)}）`;
      else if(s.u==='reduce')h=`开盖${f}收汁到浓稠${dur>20?'（约 '+fmtT(dur)+'）':''}`;
      else{const m=marks[i+1];const pl=sim.potLog[Math.max(0,(m?m.t:sim.t)-1)]||{};const wet=!!pl.wet;const onlyOil=!pl.food&&!pl.items;
        if(onlyOil&&!wet)h=`${f}把油烧热约 ${fmtT(dur)}（约 ${Math.round(t1)}°C，${oilCue(t1)||'温油'}）`;
        else{h=`${s.lid?'盖盖':''}${f}${wet?(dur>=600?'炖':'煮'):pl.food?(pl.oil>150?'炸':dur>=150?'煸炒':'翻炒'):'炒香'} ${fmtT(dur)}`;if(!wet&&t1>110)h+=`（锅温约 ${Math.round(t1)}°C）`}}
      if(buf.length&&bufC!=='pot')flush();flush(h)}
    else if(s.t==='rest'){const lastC=bufC;if(buf.length&&bufC!=='pot')flush();const heated=steps.slice(0,i).some(x=>x.t==='heat');
      if(aPending){out.push(`A 碗的料抓匀，腌 ${fmtT(s.s)}。`);aPending=false}
      else if(lastC==='B'||lastC==='C'){out.push(`拌匀，静置 ${fmtT(s.s)} 入味。`)}
      else if(!heated){if(buf.length)flush('抓匀，腌 '+fmtT(s.s));else out.push(`腌 ${fmtT(s.s)}。`)}
      else out.push(`关火${s.lid?'盖盖':''}静置 ${fmtT(s.s)}。`)}
    else if(s.t==='pour'){flush();const from=CNAME[s.from],to=CNAME[s.to||'pot'];out.push(s.what==='foods'?`把 ${from}里的食材盛到 ${to}，汤汁留着。`:s.from==='B'?`${from}的料汁搅匀，倒进${to}。`:s.from==='A'?`把 ${from}腌好的料下${to}。`:(s.from==='pot'&&!sim.cs.pot.foods.length&&i>0&&steps[i-1].t==='heat'?`把热油浇到${to}上。`:`把 ${from}里的东西倒进${to}。`))}
    else if(s.t==='drain'){flush();out.push(s.kind==='water'?(+s.keep?`倒掉多余汤汁，只留约 ${s.keep}g。`:'倒掉蒸出来的汤汁。'):`倒出多余的油，留底油约 ${s.keep}g。`)}
    else if(s.t==='remove'){flush();out.push(`捞出${(IT[s.id]||{name:'料'}).name}。`)}});
  flush();
  return{ing,steps:out.filter(x=>x&&x!=='。'),total:sim.t}}
function cardText(name,card,extra){let t=`【${name}】\n`;if(extra)t+=extra+'\n';t+='\n用料\n';for(const g of card.ing){t+=`· ${g.t}：`+g.rows.map(r=>`${r.name} ${r.g}g${r.m?'（'+r.m+'）':''}${r.note?'〔'+r.note+'〕':''}`).join('，')+'\n'}
  t+=`\n做法（约 ${fmtT(card.total)}）\n`+card.steps.map((s,i)=>`${i+1}. ${s}`).join('\n');return t}
if(typeof module!=='undefined')module.exports={recipeCard,cardText};
