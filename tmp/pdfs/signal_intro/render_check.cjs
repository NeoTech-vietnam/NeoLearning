const fs=require('fs');
const path=require('path');
const katex=require('./qa/node_modules/katex');
(async()=>{
const {marked}=await import('file:///C:/Users/daveb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js');
const root='D:/workspace/NeoLearning/07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/00_intro';
const files=fs.readdirSync(root).filter(f=>/^\d\d_.*\.md$/.test(f));let mathCount=0;const errors=[];
for(const f of files){
 const math=[];let md=fs.readFileSync(path.join(root,f),'utf8');
 md=md.replace(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g,(_whole,block,inline)=>{
  const tex=(block??inline).trim();let rendered='';
  try{rendered=katex.renderToString(tex,{displayMode:block!==undefined,throwOnError:true,strict:'warn'});}catch(e){errors.push({file:f,tex,error:e.message});}
  mathCount++;const token=`MATHPLACEHOLDER${math.length}END`;math.push({token,rendered});return token;
 });
 let html=marked.parse(md);
 for(const {token,rendered} of math)html=html.replace(token,rendered);
 const doc=`<!doctype html><html><head><meta charset="utf-8"><base href="/07_mechatronics_engineering_master_program/04_Signal-Processing-For-Mechatronic-System/01_learning/00_intro/"><link rel="stylesheet" href="/tmp/pdfs/signal_intro/qa/node_modules/katex/dist/katex.min.css"><style>body{font:17px/1.65 system-ui;background:#f1f4f7;color:#172d3c;margin:0}main{max-width:1050px;margin:30px auto;background:white;padding:45px 60px}h1{font-size:30px;line-height:1.3}h2{margin-top:42px;border-bottom:2px solid #d9e3ec}h3{margin-top:42px}table{border-collapse:collapse;width:100%;font-size:15px}td,th{border:1px solid #ccd8e3;padding:10px;text-align:left}th{background:#edf4f9}img{display:block;max-width:100%;height:auto;margin:20px auto;border:1px solid #ddd}a{color:#1267a5}.katex-display{overflow-x:auto;padding:8px 0}code{background:#eef2f4}p{margin:15px 0}</style></head><body><main>${html}</main></body></html>`;
 fs.writeFileSync(path.join(__dirname,`preview-${f.replace('.md','.html')}`),doc);
}
console.log(JSON.stringify({files:files.length,mathExpressions:mathCount,errors},null,2));
if(errors.length)process.exitCode=1;
})();
