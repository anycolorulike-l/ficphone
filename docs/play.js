(async () => {
 const status = document.querySelector('#reader-status');
 const frame = document.querySelector('#reader-frame');
 const id = new URL(location.href).searchParams.get('work');
 const endpoint = window.FicPhonePublishingURL.replace(/\/$/, '');
 try {
  if (!endpoint || !/^[a-z0-9-]{1,60}$/.test(id || '')) throw Error();
  const response = await fetch(endpoint + '/works/' + encodeURIComponent(id));
  if (!response.ok) throw Error();
  const {title, story} = await response.json();
  document.title = title + ' · FicPhone';
  const base = new URL('./', location.href).href;
  const url = path => new URL(path, base).href;
  const fonts = window.FicFonts?.catalog[story.phone.font] ? await window.FicFonts.prepare().catch(() => ({})) : {};
  const data = JSON.stringify(story).replace(/</g, '\\u003c');
  let saved = 'null';
  const progressKey = 'ficphone-community-' + id;
  try { saved = JSON.stringify(JSON.parse(localStorage.getItem(progressKey) || 'null')).replace(/</g, '\\u003c'); } catch {}
  window.addEventListener('message', event => {
   if (event.source !== frame.contentWindow || event.data?.type !== 'ficphone-progress') return;
   const journal = JSON.stringify(event.data.progress);
   if (journal?.length < 150000) {
    try { localStorage.setItem(progressKey, journal); } catch {}
   }
  });
  const nonce = crypto.randomUUID();
  frame.srcdoc = `<!doctype html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
   <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src data:; media-src data:; font-src data: ${new URL(base).origin}">
   <style>body{margin:0;background:#f4f5fa}main{display:flex;flex-direction:column;height:100dvh}#phone{width:100%;flex:1;min-height:0;display:flex;align-items:center}nav{text-align:center;padding:5px;font:13px system-ui}button{font:inherit}main.screen nav{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}main.screen nav:focus-within{width:auto;height:auto;clip-path:none;bottom:0;z-index:2}</style>
   <main><div id="phone"></div><nav><button id="reset">重新开始</button></nav></main>
   <script nonce="${nonce}" src="${url('icons.js?v=v1.0.1-beta.1-drafts')}"></script><script nonce="${nonce}" src="${url('story.js?v=v1.0.1-beta.1')}"></script><script nonce="${nonce}" src="${url('render.js?v=v1.0.1-beta.1-type-layout2')}"></script>
   <script nonce="${nonce}">const PocketFontData=${JSON.stringify(fonts)};const story=${data};if(story.phone.readerLayout==='screen')document.querySelector('main').className='screen';
   const reader=Pocket.mount(document.getElementById('phone'),story,{mode:'phone',frame:true,fitHeight:true,exported:true,resume:${saved},onJournal:progress=>parent.postMessage({type:'ficphone-progress',progress},'*')});
   document.getElementById('reset').onclick=()=>reader.reset();</script>`;
  frame.hidden = false;
  status.hidden = true;
 } catch {
  status.replaceChildren('这部作品暂时无法打开。 ');
  const back = document.createElement('a');
  back.href = 'works.html';
  back.textContent = '返回作品区';
  status.append(back);
 }
})();
