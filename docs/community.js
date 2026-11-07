(() => {
 if(location.hash.startsWith('#guide-')){location.replace('studio.html'+location.hash);return;}
 if(location.hash==='#works'&&!document.querySelector('#community-works')){location.replace('works.html');return;}
 const endpoint = window.FicPhonePublishingURL.replace(/\/$/, '');
 const list = document.querySelector('#community-works');
 const status = document.querySelector('#community-status');
 if (!endpoint || !list || !status) return;
 const empty = status.innerHTML;
 status.textContent = '正在载入作品…';
 fetch(endpoint + '/works').then(response => {
  if (!response.ok) throw Error();
  return response.json();
 }).then(({works}) => {
  if (!works.length) { status.innerHTML = empty; return; }
  status.hidden = true;
  for (const work of works) {
   const card = document.createElement('article');
   card.className = 'work-card';
   const title = document.createElement('h3');
   title.textContent = work.title;
   const author = document.createElement('small');
   author.textContent = work.author;
   const byline = document.createElement('div');
   byline.className = 'work-byline';
   byline.append(author);
   if (/^\d{4}-\d{2}-\d{2}/.test(work.created || '')) {
    const date = document.createElement('time');
    date.dateTime = work.created.slice(0, 10);
    date.textContent = date.dateTime;
    byline.append(date);
   }
   const summary = document.createElement('p');
   summary.textContent = work.summary;
   const link = document.createElement('a');
   link.href = 'play.html?work=' + encodeURIComponent(work.id);
   link.textContent = '开始阅读 →';
   card.append(title, byline, summary, link);
   list.append(card);
  }
 }).catch(() => { status.textContent = '作品列表暂时无法载入。请稍后再试。'; });
})();
