/* Rasterize the vector masters. Usage: node render_png.cjs <resvg-module-path> */
const fs=require('node:fs');
const path=require('node:path');
const {Resvg}=require(process.argv[2]||'@resvg/resvg-js');
const root=path.resolve(__dirname,'..');
const jobs=[
 ['svg/ficphone-icon.svg','png/ficphone-icon-2048.png',2048],
 ['svg/ficphone-wordmark.svg','png/ficphone-wordmark-3200.png',3200],
 ['svg/ficphone-horizontal.svg','png/ficphone-horizontal-4096.png',4096],
 ['svg/ficphone-stacked.svg','png/ficphone-stacked-3072.png',3072],
 ['source/brand-preview.svg','brand-preview.png',1800],
 ...[32,64,128,256,512].map(size=>['svg/ficphone-icon.svg',`png/ficphone-icon-${size}.png`,size])
];
for(const [input,output,width] of jobs){
 const svg=fs.readFileSync(path.join(root,input),'utf8');
 const image=new Resvg(svg,{fitTo:{mode:'width',value:width},font:{loadSystemFonts:false,fontFiles:['/System/Library/Fonts/Supplemental/Arial.ttf']}}).render();
 fs.writeFileSync(path.join(root,output),image.asPng());
 process.stdout.write(`${output}: ${image.width} x ${image.height}\n`);
}
