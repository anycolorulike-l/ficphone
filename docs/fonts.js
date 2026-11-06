/* Self-hosted OFL fonts. No external requests at runtime. */
window.FicFonts=(()=>{
 const catalog={jua:{name:'Jua · 圆润韩文',family:'FicJua',file:'Jua-Regular.woff2'},gamja:{name:'Gamja Flower · 手写韩文',family:'FicGamja',file:'GamjaFlower-Regular.woff2'},yomogi:{name:'Yomogi · 手写日文',family:'FicYomogi',file:'Yomogi-Regular.woff2'},kuaile:{name:'站酷快乐体 · 俏皮中文',family:'FicKuaiLe',file:'ZCOOLKuaiLe-Regular.woff2'}};
 const data={},pending={};
 const definitions=Object.entries(catalog).map(([id,f])=>`@font-face{font-family:${f.family};src:url('fonts/${f.file}') format('woff2');font-style:normal;font-weight:400;font-display:swap;}`).join('');
 const style=document.createElement('style');style.id='ficphone-local-fonts';style.textContent=definitions;document.head.append(style);
 async function prepare(){await Promise.all(Object.entries(catalog).map(async([id,f])=>{if(data[id])return;if(!pending[id])pending[id]=fetch('fonts/'+f.file).then(r=>{if(!r.ok)throw Error('字体载入失败：'+f.name);return r.blob();}).then(blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>{data[id]=reader.result;resolve();};reader.onerror=()=>reject(Error('字体读取失败'));reader.readAsDataURL(blob);})).catch(e=>{delete pending[id];throw e;});await pending[id];}));return data;}
 async function ready(id){if(!catalog[id])return;const stack=Object.values(catalog).map(f=>f.family);await Promise.all(stack.map(f=>document.fonts.load('16px '+f)));await document.fonts.ready;}
 return {catalog,data,prepare,ready};
})();
