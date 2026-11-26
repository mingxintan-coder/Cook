const fs=require('fs');const s=fs.readFileSync(process.argv[2]||'../menu/index.html','utf8');
const i=s.indexOf('const DISHES=');const j=s.indexOf('\nconst CATS',i);let code=s.slice(i,j);
if(j<0)throw 'nocats';
const D=(new Function(code+';return DISHES'))();
fs.writeFileSync(process.argv[3]||'menu_dishes.json',JSON.stringify(D));
console.log(D.length);const chefs={};const ing={};const units={};
for(const d of D){chefs[d.chef||'?']=(chefs[d.chef||'?']||0)+1;for(const g of d.groups||[])for(const it of g[1]){ing[it[0]]=(ing[it[0]]||0)+1;units[it[2]]=(units[it[2]]||0)+1}}
console.log(chefs);console.log(Object.keys(ing).length);console.log(units);
console.log(Object.entries(ing).sort((a,b)=>b[1]-a[1]).map(x=>x[0]+':'+x[1]).join(' '));
console.log(D.filter(d=>d.videoOnly).length, D.map(d=>d.unit).filter(u=>u!=='g').length);
