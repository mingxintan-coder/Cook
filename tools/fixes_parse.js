// 手工校正表：每道菜一行  id | fin eat | 步骤；步骤用 ; 分隔
// A:jx 1200 厚片 [blanch|preboil]   加料（容器:编号 克数 切法）
// h3 120 [lid] [steam] [T190] [boil] [reduce] [煎]   加热（火力 秒数）
// r600 [cold] [lid]  静置   pA / p pot>C foods / p C>pot  倒   dw0 / do20 倒水/倒油（留量）  x pot:xy 捞出
const {IT,FD}=require('./engine.js');
function parseFix(line){const [id,hd,body]=line.split('|').map(s=>s.trim());if(/^skip/.test(hd))return{id,skip:hd.replace(/^skip\s*/,'')||'不适合模拟',steps:[]};const [fin,eat,flag]=hd.split(/\s+/);const S=[];
  for(let tok of body.split(';').map(s=>s.trim()).filter(Boolean)){let m;
    if(m=/^(A|B|C|pot):(\w+)\s+([\d.]+)(?:\s+(\S+))?(?:\s+(\S+))?$/.exec(tok)){const [,c,id2,g,x1,x2]=m;if(!IT[id2]&&!FD[id2])throw new Error(id+': 未知编号 '+id2);const s={t:'add',c,id:id2,g:+g};
      for(const x of [x1,x2])if(x){if(x==='blanch'||x==='preboil')s.prep=x;else s.cut=x}S.push(s)}
    else if(m=/^h([123])\s+(\d+)(.*)$/.exec(tok)){const s={t:'heat',f:+m[1],s:+m[2]};const fl=m[3];if(/lid/.test(fl))s.lid=1;if(/steam/.test(fl))s.m='steam';if(/bake/.test(fl))s.m='bake';if(/press/.test(fl))s.m='press';
      let t;if(t=/T(\d+)/.exec(fl)){s.u='temp';s.v=+t[1]}if(/boil/.test(fl))s.u='boil';if(/reduce/.test(fl))s.u='reduce';s.how=/煎/.test(fl)?'煎':'o';S.push(s)}
    else if(m=/^r(\d+)(.*)$/.exec(tok)){const s={t:'rest',s:+m[1]};if(/cold/.test(m[2]))s.cold=1;if(/lid/.test(m[2]))s.lid=1;S.push(s)}
    else if(m=/^p([ABC])$/.exec(tok))S.push({t:'pour',from:m[1],to:'pot',what:'all'});
    else if(m=/^p\s+(\w+)>(\w+)(?:\s+(foods))?$/.exec(tok))S.push({t:'pour',from:m[1],to:m[2],what:m[3]||'all'});
    else if(m=/^d([wo])(\d+)$/.exec(tok))S.push({t:'drain',c:'pot',kind:m[1]==='w'?'water':'oil',keep:+m[2]});
    else if(tok==='dx')S.push({t:'drain',c:'pot',kind:'all',keep:0});
    else if(m=/^x\s+(\w+):(\w+)$/.exec(tok))S.push({t:'remove',c:m[1],id:m[2]});
    else throw new Error(id+': 看不懂 '+tok)}
  return{id,fin,eat,batch:flag==='batch'?1:0,steps:S}}
function loadFixes(file){const fs=require('fs');if(!fs.existsSync(file))return{};const out={};for(const ln of fs.readFileSync(file,'utf8').split('\n')){const l=ln.trim();if(!l||l.startsWith('#'))continue;const f=parseFix(l);out[f.id]=f}return out}
module.exports={parseFix,loadFixes};
