/* Browser-local editor. No account, uploads or application backend. */
(()=>{
 'use strict';
 const $=s=>document.querySelector(s),P=window.Pocket,E=P.esc;const demoMedia=window.FicDemoMedia||{};
 const defaults=()=>({format:'pocket-story',version:1,demoMediaRevision:1,demoRevision:4,title:'비가 그치기 전에',mode:'screenshot',template:'kakao',device:'iphone17pro',frame:true,time:'23:10',battery:37,owner:'미나',partner:'사나',ownerAvatar:demoMedia.mina||'',partnerAvatar:demoMedia.sana||'',drafts:{
  kakao:{script:'사나：미나야아 뭐 해? 😊\n미나：게임 중.\n사나：또? 나보다 게임이 더 좋아? ㅋㅋ\n미나：🙄\n사나：알았어 알았어 ㅎㅎ 오늘 사진 보내줘!\n미나：사진은 이미 저장했어.\n사나：역시 💜 지우면 안 돼!',date:'2026년 6월 6일 토요일',messageTime:'오후 11:08',unread:true,media:''},
  line:{script:'사나：今日はありがとう。\n미나：こちらこそ。\n사나：また明日、会える？',date:'6月6日(土)',messageTime:'23:08',unread:false,media:''},
  imessage:{script:'사나：미나야, 아직 깨어 있어?\n미나：응, 무슨 일이야?\n사나：오늘 못 한 말이 있어서.',date:'6월 6일 토요일',messageTime:'오후 11:08',unread:false,media:''},
  instagram:{handle:'mina_sr_my',body:'비가 그쳤다.\n오늘도 수고했어.',date:'6월 6일',likes:'12,406',media:demoMedia.mina||'',comments:'m.by__sana：우산 챙겨 가 ㅎㅎ\nmoonlight：오늘 하늘 너무 예쁘다'},
  x:{name:'미나',handle:'mina_story',body:'오늘 연습 끝.\n다들 푹 쉬어요.',date:'오후 8:10 · 2026년 6월 6일',likes:'12,406',reposts:'1,203',comments:'moonlight：수고했어요!\nonce：좋은 밤 보내요.',media:''},
  forum:{board:'케이돌토크',category:'잡담',title:'오늘 한강에서 본 두 사람',name:'무명의 더쿠',date:'2026.06.06 23:00',views:'8,216',body:'내가 잘못 본 걸 수도 있는데...\n\n우산 하나를 같이 쓰고 가더라.\n한 명이 계속 웃고, 옆에 있던 사람은 조용히 듣고 있었어.\n\n비가 그칠 때까지 둘이 같은 자리에 있었음.',comments:'무명의 더쿠：분위기 좋았겠다 ㅎㅎ\n무명의 더쿠：사진은 없어?\n원덬：안 찍었어. 그냥 예뻐서 기억에 남았음.',media:''}},phone:{story:P.Story.demo(),homeWidgets:{overview:true,note:true,photo:true,location:'',noteId:'',photoIndex:'2'},batteryMode:'normal',language:'ko',androidMessages:'samsung',layoutVersion:4,date:'6월 6일 토요일',intro:'오늘 찍은 사진, 아직 가지고 있어?',wallpaper:'',lockwallpaper:'',photos:[...(typeof window!=='undefined'?window.FicProvidedPhotos||[]:[])],photoCaption:'미나와 사나 · 사진',notes:'',noteItems:[{id:'daily',title:'오늘 할 일',body:'연습 영상 확인하기\n보조 배터리 챙기기\n사나한테 우산 돌려주기',date:'2026. 6. 6.'},{id:'practice',title:'내일 연습',body:'오전 10시, 연습실\n\n마지막 동선 한 번 더 맞추기.\n끝나고 같이 밥 먹기.',date:'2026. 6. 5.'}],secret:'보내지 못한 말\n\n그날을 물어보면,\n아무 일도 없었다고 말할지도 몰라.\n\n그래도 사진은 지우지 못했어.',calls:'사나 · 오후 10:48 · 부재중 전화\n매니저 · 오후 8:03 · 통화 시간 02:17',calendar:'09:00 · 안무 연습\n16:30 · 녹음\n19:00 · 개인 일정',rule:true,newMessage:'사진 봤지? ㅎㅎ 나 잘 나왔어? 💜',chatPlatform:'kakao',apps:Object.keys(P.appTypes).map(type=>({type,name:'',language:'inherit',target:type,icon:'',iconPreset:'',dock:P.defaultDock.includes(type),locked:['forum','instagram','x'].includes(type),enabled:type!=='line'}))}});
 let state=defaults(),section='appearance',player=null,db=null,saveTimer,toastTimer,saveSerial=0,queuedSave=Promise.resolve(),renderedMode=null,previewRoute=null;
 let storyOpen=new Set(['0']),contentIndex=-1,recoveryBlocked=false,exportBusy=false,undoStack=[],redoStack=[],lastHistory='',lastHistoryAt=0;
 const templateList=Object.entries(P.templates);
 const STORY_PAGE_SIZE=20;
 let storyPage=0;
 const languages=[['en','English'],['zh','中文'],['ko','한국어'],['ja','日本語']];
 function legacyAppName(value,type){const text=String(value||'').trim();const known=[P.appTypes[type],...Object.values(P.appNames).map(names=>names[type]),...(type==='forum'?['论坛','NAVER Café','네이버 카페']:[])];return known.includes(text)?'':text.slice(0,40);}
 function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),5000);}
 function openDB(){return new Promise((resolve,reject)=>{let request=indexedDB.open('pocket-story-local',1);request.onupgradeneeded=()=>request.result.createObjectStore('projects');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
 function readDB(){return new Promise((resolve,reject)=>{const r=db.transaction('projects').objectStore('projects').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
 function writeDB(snapshot){return new Promise((resolve,reject)=>{let t=db.transaction('projects','readwrite');const store=t.objectStore('projects'),previous=store.get('current');previous.onsuccess=()=>{if(previous.result)store.put({...previous.result,_libraryId:'recovery',_savedAt:new Date().toLocaleString()},'recovery');store.put(snapshot,'current');};t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});}
 function scheduleSave(){remember();clearTimeout(saveTimer);$('#save-status').textContent='● 有未保存更改';$('#save-status').dataset.status='pending';saveTimer=setTimeout(save,500);}
 function save(){clearTimeout(saveTimer);if(recoveryBlocked)return Promise.resolve();const serial=++saveSerial,snapshot=JSON.parse(JSON.stringify(syncSheets()));$('#save-status').dataset.status='saving';if(!db){$('#save-status').dataset.status='error';$('#save-status').textContent='仅保存在当前页面 · 请导出工程';return Promise.resolve();}queuedSave=queuedSave.catch(()=>{}).then(()=>writeDB(snapshot)).then(()=>{if(serial===saveSerial){$('#save-status').textContent='✓ 已保存到此浏览器';$('#save-status').dataset.status='saved';}}).catch(()=>{$('#save-status').dataset.status='error';$('#save-status').textContent='本机保存失败 · 请导出工程';toast('本机存储不可用或空间不足，请导出工程备份。');});return queuedSave;}
 function field(label,path,value,kind='text',help=''){let id='field-'+path.replaceAll('.','-');return `<label for="${id}">${label}</label>${kind==='textarea'?`<textarea id="${id}" data-path="${path}" ${path.endsWith('script')?'class="script"':''}>${E(value)}</textarea>`:`<input id="${id}" data-path="${path}" type="${kind}" value="${E(value)}" ${kind==='number'?'min="0" max="100"':kind==='range'?'min="100" max="200"':''}>`}${help?`<p class="helper">${help}</p>`:''}`;}
 function select(label,path,options,value){let id='field-'+path.replaceAll('.','-');return `<label for="${id}">${label}</label><select id="${id}" data-path="${path}">${options.map(([v,t,disabled])=>`<option value="${E(v)}" ${String(value)===String(v)?'selected':''} ${disabled?'disabled':''}>${E(t)}</option>`).join('')}</select>`;}
 function check(label,path,value){return `<label class="checkrow"><input type="checkbox" data-path="${path}" ${value?'checked':''}>${label}</label>`;}
 function file(label,path,multiple=false){return `<label>${label}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-asset="${path}" ${multiple?'multiple':''}></label>${path==='phone.photos'?(state.phone.photos.length?`<p class="helper">已添加 ${state.phone.photos.length} 张照片</p><div class="asset-thumbs">${state.phone.photos.map((src,i)=>`<div><img src="${P.image(src)}" alt="相册照片 ${i+1}"><button type="button" data-remove-album="${i}">移除相册照片 ${i+1}</button></div>`).join('')}</div><button type="button" class="assetclear" data-clear="${path}">清空照片</button>`:''):getPath(path)?`<button type="button" class="assetclear" data-clear="${path}">移除图片</button>`:''}`;}
 function setPath(path,value){if(path.split('.').some(k=>['__proto__','constructor','prototype'].includes(k)))return;let keys=path.split('.'),current=state;for(let key of keys.slice(0,-1))current=current[key];current[keys.at(-1)]=value;}
 function getPath(path){return path.split('.').reduce((v,k)=>v?.[k],state);}
 function changeField(el){const path=el.dataset.path,value=el.type==='checkbox'?el.checked:el.type==='number'?Math.max(0,Math.min(100,+el.value||0)):el.value;const match=path.match(/^phone\.apps\.(\d+)\.(\w+)$/);if(match&&match[2]==='dock'&&value&&state.phone.apps.filter((a,i)=>i!==+match[1]&&a.enabled&&a.dock).length>=4){el.checked=false;toast('Dock 最多放四个已启用应用。');return;}if(/^phone\.story\.steps\.\d+\.actions\.\d+\.app$/.test(path)&&value!==getPath(path)){
   delete getPath(path.slice(0,-4)).room;
  }
  if(path==='phone.lockCode'){
   const digits=String(value).replace(/[^0-9]/g,'').slice(0,6);
   el.value=digits;
   if(digits.length&&!/^(?:[0-9]{4}|[0-9]{6})$/.test(digits)){
    el.setCustomValidity('请输入 4 或 6 位数字。');return;
   }
   el.setCustomValidity('');
   state.phone.lockCode=digits;previewRoute='lock';scheduleSave();renderPreview();return;
  }
  if(path==='phone.readerStart')previewRoute=state.phone.lockCode?'lock':value==='home'?'home':'lock';
  setPath(path,path.startsWith('phone.story.')&&(path.endsWith('.delay')||path.endsWith('.withdrawAfter'))?Math.min(60,value):value);if(path.startsWith('phone.story.')&&path.endsWith('.type')&&['message','prepareReply'].includes(value)&&!['kakao','line','imessage'].includes(getPath(path.replace(/type$/,'app'))))setPath(path.replace(/type$/,'app'),'kakao');if(path.startsWith('phone.story.')&&path.endsWith('.trigger'))setPath(path.replace(/trigger$/,'target'),'*');if(match){const a=state.phone.apps[+match[1]];if(a.enabled&&a.dock&&state.phone.apps.filter(b=>b.enabled&&b.dock).length>4){a.dock=false;toast('已启用应用并放到桌面，Dock 保留四项。');}const summary=el.closest('details')?.querySelector('summary');if(summary)summary.textContent=P.appName(a,state.phone)+(a.enabled?' · 已启用':' · 未启用');}scheduleSave();if(path==='device'||path==='phone.font'||path==='phone.language'||path==='phone.androidMessages'||path.endsWith('.language')||path.startsWith('phone.story.')&&(path.endsWith('.trigger')||path.endsWith('.type')||path.endsWith('.app')||path.endsWith('.target')||path.endsWith('.enabled')))render();else renderPreview();}
 function settingsGroup(id,title,body){
  return `<details class="appsettings settings-group" data-settings-group="${id}"><summary>${title}</summary><div class="settings-fields">${body}</div></details>`;
 }
 function projectFields(){
  return field('工程名称','title',state.title)+
   field('手机主人','owner',state.owner)+field('联系人备注','partner',state.partner)+
   field('作者署名（选填）','phone.authorCredit',state.phone.authorCredit||'')+
   check('截图添加作者水印','phone.watermarkImage',state.phone.watermarkImage)+
   check('互动 HTML 显示作者署名','phone.watermarkHTML',state.phone.watermarkHTML);
 }
 function canvasFields(){
  const phone=state.phone;
  const android=P.devices[state.device].os==='android';
  return select('画布预设','device',Object.entries(P.devices).map(([id,device])=>[id,device.name]),state.device)+
   select('手机界面与默认应用名称','phone.language',languages,phone.language)+
   (android?select('三星短信界面','phone.androidMessages',[['samsung','Samsung Messages · 经典风格'],['google','Google Messages 风格']],phone.androidMessages):'')+
   `<div class="fieldrow">${field('状态栏时间','time',state.time)}${field('电量 %','battery',state.battery,'number')}</div>`+
   select('电池状态','phone.batteryMode',[['normal','普通'],['lowPower','低电量模式'],['charging','充电中']],phone.batteryMode)+
   check('隐藏灵动岛／前置摄像头','phone.hideCutout',phone.hideCutout)+
   check('预览显示设备外框（截图导出不含外框）','frame',state.frame);
 }
 function fontFields(){
  const phone=state.phone;
  const fonts=[['system','系统默认'],['serif','衬线字体'],['mono','等宽字体'],...Object.entries(P.fontCatalog).map(([id,font])=>[id,font.name])];
  if(phone.customFont)fonts.push(['custom','导入的字体']);
  const points=Array.from({length:24},(_,i)=>[String(i+7),String(i+7)+' pt']);
  return select('作品字体','phone.font',fonts,phone.font||'system')+
   select('作品字号','phone.textSize',[['small','小'],['normal','标准'],['large','大']],phone.textSize||'normal')+
   select('自定义字号（pt）','phone.workPoints',[['0','使用预设'],...points],phone.workPoints||0)+
   '<p class="helper">调整字号会同步更新预览和导出中的正文、评论、联系人备注和账号名称。</p>'+
   '<label>导入 WOFF2 字体<input id="custom-font-file" type="file" accept=".woff2,font/woff2"></label>'+
   (phone.customFont?'<button id="remove-custom-font" type="button">移除导入字体</button>'+
    check('在互动作品中嵌入字体（请确认许可）','phone.embedFont',phone.embedFont):'')+
   `<p class="helper font-demo" style="font-family:${P.fontStack(phone.font)}">오늘도 좋아해 ♡ / きょうも好き / 今天也喜欢你 / Love you!</p>`;
 }
 function renderNavigation(){if(state.mode==='screenshot'){$('#nav-label').textContent='截图模板';$('#navigation').innerHTML=templateList.map(([id,t])=>`<button data-template="${id}" aria-current="${state.template===id}"><span class="templateicon ${id}">${id==='instagram'&&P.image(window.PocketIcons?.instagram)?`<img alt="" src="${P.image(window.PocketIcons.instagram)}">`:t.mark}</span>${t.name}</button>`).join('');}else{$('#nav-label').textContent='手机与内容';$('#navigation').innerHTML=[['appearance','手机外观'],['apps','桌面应用'],['contents','应用内容'],['photos','相册与备忘录'],...(state.phone.story.enabled?[['rules','剧情触发']]:[])].map(([id,t])=>`<button data-section="${id}" aria-current="${section===id}">${t}</button>`).join('');}
  $('#navigation').querySelectorAll('[data-template]').forEach(b=>b.onclick=()=>{syncSheets();state.template=b.dataset.template;contentIndex=-1;render();scheduleSave();});$('#navigation').querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>{section=b.dataset.section;previewRoute=section==='photos'?'notes':section==='appearance'?((state.phone.lockCode?'lock':state.phone.readerStart||'lock')):'home';render();});}
 function chatFields(base,draft){
  const script=field('对话脚本',base+'.script',draft.script,'textarea','每行“名字：消息”；单条时间写法为“名字：[23:08] 消息”。“我”表示手机主人；单独写“[图片]”可插入下面上传的聊天图片。')+
   '<div class="actions"><button type="button" id="append-message">追加我的消息</button></div>';
  const timing=field('日期分隔文字',base+'.date',draft.date)+field('消息时间',base+'.messageTime',draft.messageTime)+
   check('我的消息尚未读',base+'.unread',draft.unread)+
   field('未读起点（0＝自动：对方最后回复之后）',base+'.unreadFrom',draft.unreadFrom||0,'number','自动模式不会把对方回复之前的消息标为未读。填写 1、2… 可手动指定起点；序号按全部消息计算，只标记我发出的消息。')+
   field('会话列表未读消息数',base+'.incomingUnread',draft.incomingUnread||0,'number')+
   field('输入状态后收到的消息（选填）',base+'.typingReply',draft.typingReply||'')+
   field('输入持续秒数（1–30）',base+'.typingDelay',draft.typingDelay||'3')+
   check('显示输入状态（互动中动画、截图中静态）',base+'.typing',draft.typing);
  return field('会话名称（留空使用对方备注）',base+'.roomTitle',draft.roomTitle||'')+
   script+settingsGroup('chat-unsent','未发送草稿',
    field('输入框里的草稿',base+'.unsentDraft',draft.unsentDraft||'','textarea','显示在输入框里，导出时也不会成为已发送消息。')+
    check('互动试玩时逐字显示',base+'.animateDraft',draft.animateDraft))+
   structuredMessages(base,draft)+memberEditor(base,draft)+
   settingsGroup('images','图片与头像',file('对方头像','partnerAvatar')+gallery(base,draft))+
   settingsGroup('chat-timing','时间、已读与输入状态',timing);
 }
 function postFields(base,draft){
  const forum=state.template==='forum',isX=state.template==='x';
  const profile=forum?field('theqoo 版面',base+'.board',draft.board)+
   field('分类（如 잡담）',base+'.category',draft.category)+field('帖子标题',base+'.title',draft.title)+field('楼主名称',base+'.name',draft.name):
   (isX?field('显示名称',base+'.name',draft.name):'')+field('账号',base+'.handle',draft.handle);
  const metadata=field('发布时间',base+'.date',draft.date)+
   (forum?field('浏览数',base+'.views',draft.views):field('点赞数',base+'.likes',draft.likes)+
    (isX?field('转帖数',base+'.reposts',draft.reposts):'')+field('个人简介',base+'.bio',draft.bio||'','textarea')+
    `<div class="fieldrow">${field('粉丝数',base+'.followers',draft.followers||'0')}${field('关注数',base+'.following',draft.following||'0')}</div>`);
  return profile+field('正文',base+'.body',draft.body,'textarea')+
   settingsGroup('images','图片与头像',(forum?'':file('作者头像','ownerAvatar'))+gallery(base,draft))+
   settingsGroup('post-comments','评论与回复',commentEditor(base,draft))+
   settingsGroup('post-meta','发布时间与互动数据',metadata);
 }
 function screenshotForm(){
  const template=P.templates[state.template],draft=currentDraft();
  const base=contentIndex<0?'drafts.'+state.template:'collections.'+state.template+'.'+contentIndex;
  const chat=template.kind==='chat';
  $('#editor-eyebrow').textContent=chat?'独立聊天截图':'独立社交截图';
  $('#editor-title').textContent=template.name;
  const example=state.owner==='미나'&&state.partner==='사나'?'<p class="helper">TWICE · 미나 × 사나 · 虚构创作示例</p>':'';
  return settingsGroup('shot-project','工程基础设置',projectFields()+sheetControls()+collectionControls()+example)+
   settingsGroup('shot-content',chat?'对话脚本设置':'帖子内容设置',chat?chatFields(base,draft):postFields(base,draft))+
   settingsGroup('shot-canvas','画布设置',canvasFields())+
   settingsGroup('shot-font','字体与字号',fontFields());
 }
 function showProgress(p,story){const step=story.steps[p.cursor],lines=[!story.enabled?'剧情流程未启用':p.ending?'已到达结局':p.choice?'等待读者选择':p.pending?'等待延迟动作':'等待：'+(step?step.title:'流程已完成'),`已完成 ${p.completed.length} / ${story.steps.length} 步`,...p.log.slice(-8)];$('#reader-debug-body').textContent=lines.join('\n');}
 function storyTargets(kind,index=state.phone.story.steps.length){const any=[['*','任意一项']];if(kind==='photo')return [...any,...state.phone.photos.map((_,i)=>[String(i),'照片 '+(i+1)])];if(kind==='note')return [...any,...state.phone.noteItems.map(n=>[n.id,n.title||'无标题']),...state.phone.story.steps.slice(0,index).flatMap(s=>s.actions.map((a,j)=>a.type==='note'?['story-'+s.id+'-'+j,'剧情生成：'+(a.title||'备忘录')]:null).filter(Boolean))];if(kind==='chat'||kind==='reply')return [...any,...Object.entries(P.templates).filter(([,t])=>t.kind==='chat').flatMap(([k,t])=>P.items(state,k).map(d=>[d.id,t.name+' · '+(d.roomTitle||state.partner)]))];if(kind==='like'||kind==='post')return [...any,...['instagram','x','forum'].flatMap(k=>P.items(state,k).map(d=>[d.id,P.templates[k].name+' · '+(d.title||d.body?.slice(0,15)||'帖子')]))];if(kind==='call')return [...any,...String(state.phone.calls).split('\n').filter(Boolean).map((line,i)=>[String(i),line.split('·')[0]])];if(kind==='app')return [...any,...Object.entries(P.appTypes)];return [['*','读者打开手机后']];}
 function storyWarnings(){if(!state.phone.story.enabled)return [];const warnings=[],steps=state.phone.story.steps,unlocked=new Set();steps.forEach((s,i)=>{if(i&&s.trigger==='start')warnings.push(`第 ${i+1} 步：作品开始只能作为第一步的触发，请改用读者行为。`);if(s.target!=='*'&&!storyTargets(s.trigger,i).some(([id])=>id===s.target))warnings.push(`第 ${i+1} 步：指定内容不存在，请重新选择。`);for(const action of s.actions){
   if(['message','prepareReply'].includes(action.type)&&action.room&&!P.items(state,action.app).some(room=>room.id===action.room))warnings.push(`第 ${i+1} 步：消息的接收会话已移除，请重新选择。`);
  }
  let app=({photo:'album',note:'notes',chat:s.target,post:s.target,call:'calls',app:s.target})[s.trigger];if(app&&app!=='*'){if(!P.activeApp(state,app))warnings.push(`第 ${i+1} 步：触发应用未启用。`);else if(state.phone.apps.some(a=>(a.target||a.type)===app&&a.locked)&&!unlocked.has(app))warnings.push(`第 ${i+1} 步：需要先在前面的步骤解锁 ${P.appTypes[app]}。`);}if(s.trigger==='note'&&s.target!=='*'&&!storyTargets('note',i).some(([id])=>id===s.target))warnings.push(`第 ${i+1} 步：目标备忘录不存在，或要到后面的步骤才会生成。`);for(const a of s.actions){if(['message','prepareReply','unlock'].includes(a.type)&&!P.activeApp(state,a.app))warnings.push(`第 ${i+1} 步：结果中的 ${P.appTypes[a.app]} 未启用。`);if(a.type==='unlock')unlocked.add(a.app);if(a.type==='choice')for(const next of [a.nextA,a.nextB])if(!['next','end'].includes(next)&&!(+next>i+1&&+next<=steps.length))warnings.push(`第 ${i+1} 步：分支只能跳到后面的有效步骤。`);}if(!s.actions.length)warnings.push(`第 ${i+1} 步没有后续结果。`);if(s.actions.filter(a=>a.type==='choice').length>1||s.actions.some(a=>a.type==='choice')&&s.actions.some(a=>a.type==='ending'))warnings.push(`第 ${i+1} 步：选择与结局请分开放在不同步骤。`);});return [...new Set(warnings)];}
 function storyForm(){const story=state.phone.story;
  const pageCount=Math.max(1,Math.ceil(story.steps.length/STORY_PAGE_SIZE));
  storyPage=Math.min(storyPage,pageCount-1);
  const start=storyPage*STORY_PAGE_SIZE;
  const triggerNames={start:'打开作品开始阅读',photo:'查看照片',note:'打开备忘录',chat:'进入聊天对话',like:'点赞指定帖子',post:'打开帖子详情',call:'查看通话详情',app:'打开应用',reply:'发送预写回复'};const actionNames={message:'追加聊天消息',prepareReply:'提供一条预写回复',note:'新增备忘录',unlock:'解锁应用',choice:'让读者作出选择',ending:'显示结局'};
  let html=select('玩家提示','phone.hintsPolicy',[['off','不提供提示'],['optional','允许提示，读者点击后展开']],state.phone.hintsPolicy||'optional')+select('提示语言','phone.hintLanguage',[['editor','跟随编辑器语言'],...languages],state.phone.hintLanguage||'editor')+`<div class="story-intro"><strong>把线索串成一个故事</strong><p class="helper">最多 ${P.Story.MAX_STEPS} 步，每步最多 3 个结果。下一步等待新的读者行为。</p></div><div class="actions"><button type="button" id="story-demo">载入 13 步示例</button><button type="button" id="story-add" ${story.steps.length>=P.Story.MAX_STEPS?'disabled':''}>添加步骤</button></div><p class="story-count">${story.steps.length} / ${P.Story.MAX_STEPS} 步</p>`;
  if(pageCount>1){
   const ranges=Array.from({length:pageCount},(_,page)=>`<option value="${page}" ${page===storyPage?'selected':''}>${page*STORY_PAGE_SIZE+1}–${Math.min((page+1)*STORY_PAGE_SIZE,story.steps.length)}</option>`).join('');
   html+=`<label for="story-page">步骤范围</label><select id="story-page">${ranges}</select>`;
  }
  html+=storyWarnings().map(w=>`<p class="story-warning">${E(w)}</p>`).join('');
  html+=story.steps.slice(start,start+STORY_PAGE_SIZE).map((s,offset)=>{const i=start+offset;const base=`phone.story.steps.${i}`,jump=[['next','紧接下一步'],...story.steps.map((v,j)=>j>i?[String(j+1),`${j+1}. ${v.title}`]:null).filter(Boolean),['end','结束故事']];let body=field('步骤名称',base+'.title',s.title)+field('轻提示（只在本步骤展示）',base+'.hint',s.hint||'','textarea')+field('进一步提示',base+'.hintMore',s.hintMore||'','textarea')+`<p class="helper">${i?'前一步完成后，等待读者：':'故事开始后，等待读者：'}</p>`+select('触发行为',base+'.trigger',Object.entries(triggerNames).filter(([key])=>i===0||key!=='start'),s.trigger)+select('指定内容',base+'.target',storyTargets(s.trigger,i),s.target)+field('触发后延迟（秒，0–60）',base+'.delay',s.delay,'number');
   const clueOptions=[['','不需要额外线索'],...['photo','note','chat','post','call'].flatMap(event=>storyTargets(event,i).map(([target,name])=>[event+':'+target,triggerNames[event]+' · '+name]))];
   body+=`<details><summary>额外前置线索（可选）</summary>${select('线索一',base+'.clues.0',clueOptions,typeof s.clues?.[0]==='string'?s.clues[0]:s.clues?.[0]?s.clues[0].event+':'+s.clues[0].target:'')}${select('线索二',base+'.clues.1',clueOptions,typeof s.clues?.[1]==='string'?s.clues[1]:s.clues?.[1]?s.clues[1].event+':'+s.clues[1].target:'')}${select('线索关系',base+'.match',[['all','两条都看过'],['any','看过任意一条']],s.match)}</details><div class="story-actions"><h3>接下来发生</h3>`;
   body+=s.actions.map((a,j)=>{const ab=base+'.actions.'+j;let fields=select('结果 '+(j+1),ab+'.type',Object.entries(actionNames),a.type);if(['message','prepareReply'].includes(a.type))fields+=select('消息应用',ab+'.app',['kakao','line','imessage'].map(k=>[k,P.templates[k].name]),a.app)+select('接收会话',ab+'.room',P.items(state,['kakao','line','imessage'].includes(a.app)?a.app:'kakao').map(d=>[d.id,d.roomTitle||d.contactName||state.partner]),a.room||a.app)+(a.type==='message'?select('发送者',ab+'.who',[['partner',state.partner],['owner',state.owner]],a.who)+field('自动撤回（秒，0＝不撤回）',ab+'.withdrawAfter',a.withdrawAfter||0,'number'):'')+field(a.type==='message'?'消息正文':'预写回复正文',ab+'.text',a.text,'textarea');if(a.type==='note')fields+=field('新备忘录标题',ab+'.title',a.title)+field('新备忘录正文',ab+'.text',a.text,'textarea');if(a.type==='unlock')fields+=select('要解锁的应用',ab+'.app',Object.entries(P.appTypes),a.app)+'<p class="helper">先在「桌面应用」启用它，并勾选「开始时锁定」。</p>';if(a.type==='choice')fields+=field('选择提示',ab+'.text',a.text,'textarea')+field('选项 A',ab+'.optionA',a.optionA)+select('A 跳转到',ab+'.nextA',jump,a.nextA)+field('选项 B',ab+'.optionB',a.optionB)+select('B 跳转到',ab+'.nextB',jump,a.nextB);if(a.type==='ending')fields+=field('结局标题',ab+'.title',a.title)+field('结局正文',ab+'.text',a.text,'textarea');return `<div class="story-action">${fields}<button type="button" class="assetclear" data-remove-action="${i}:${j}">移除此结果</button></div>`;}).join('');
   body+=`<div class="actions"><button type="button" data-add-action="${i}" ${s.actions.length>=3?'disabled':''}>添加结果</button></div></div><div class="story-controls"><button type="button" data-move-step="${i}:-1" ${i===0?'disabled':''}>上移</button><button type="button" data-move-step="${i}:1" ${i===story.steps.length-1?'disabled':''}>下移</button><button type="button" data-duplicate-step="${i}" ${story.steps.length>=P.Story.MAX_STEPS?'disabled':''}>复制步骤</button><button type="button" data-remove-step="${i}">移除此步</button></div>`;
   return `<details class="story-step" data-step="${i}" ${storyOpen.has(String(i))?'open':''}><summary><span class="step-number">${i+1}</span>${E(s.title)}</summary>${body}</details>`;
  }).join('');return html+'<p class="helper">试玩时可在右侧展开「剧情试玩记录」。修改内容会重置本次试玩；导出的读者作品会在本机保存进度。分支只能向后跳转，避免死循环。</p>';
 }
 function homeWidgetFields(phone){
  const widgets=phone.homeWidgets;
  const notes=P.noteItems(state);
  const photos=phone.photos.map((_,index)=>[String(index),'照片 '+(index+1)]);
  if(!photos.some(([value])=>value===(widgets.photoIndex||'2')))photos.push([widgets.photoIndex||'2','照片 '+(Number(widgets.photoIndex||2)+1)]);
  return check('显示时间、日期与地点','phone.homeWidgets.overview',widgets.overview)+
   field('桌面地点（选填）','phone.homeWidgets.location',widgets.location,'text','地点由作者填写。')+
   check('显示 4×2 备忘录小组件','phone.homeWidgets.note',widgets.note)+
   select('显示哪条备忘录','phone.homeWidgets.noteId',[['','第一条备忘录'],...notes.map(note=>[note.id,note.title])],widgets.noteId)+
   check('显示 2×2 相册小组件','phone.homeWidgets.photo',widgets.photo)+
   select('相册小组件预览图','phone.homeWidgets.photoIndex',photos,widgets.photoIndex||'2')+
   '<p class="helper">小组件显示在第一页。点击备忘录或照片会直接打开对应内容。</p>';
 }
 function phoneForm(){const p=state.phone;let html='';$('#editor-eyebrow').textContent='交互手机';$('#editor-title').textContent=({appearance:'手机外观',apps:'桌面应用',contents:'应用内容',photos:'相册与备忘录',rules:'剧情触发'})[section];
  if(section==='appearance'){
   const lockFields=
   '<label for="field-phone-lockCode">锁屏密码（选填）</label>'+
   `<input id="field-phone-lockCode" data-path="phone.lockCode" type="text" inputmode="numeric" maxlength="6" value="${E(p.lockCode||'')}">`+
   '<p class="helper">输入 4 或 6 位数字会从锁屏开始。留空即可直接打开手机。密码用于剧情互动。</p>'+
   select('作品起始画面','phone.readerStart',[['lock','锁屏'],['home','桌面']],p.readerStart||'lock')+
   select('开场锁屏通知','phone.lockNotification',[['','不显示'],...templateList.filter(([,t])=>t.kind==='chat').flatMap(([id,t])=>P.items(state,id).map(room=>[id+':'+room.id,t.name+' · '+(room.roomTitle||room.contactName||state.partner)]))],p.lockNotification||'')+
    field('锁屏日期','phone.date',p.date)+check('显示锁屏介绍','phone.showLockIntro',p.showLockIntro)+
    field('锁屏介绍','phone.intro',p.intro,'textarea');
   const canvas=select('读者显示方式','phone.readerLayout',[['framed','手机外框'],['screen','仅显示屏幕']],p.readerLayout||'framed')+canvasFields();
   html=settingsGroup('phone-project','工程基础设置',projectFields()+
    '<div class="actions"><button type="button" id="blank-phone">从当前设置新建空白作品</button></div>')+
    settingsGroup('phone-lock','锁屏设置',lockFields)+
    settingsGroup('phone-canvas','画布设置',canvas+
     settingsGroup('wallpaper','图片与壁纸',file('桌面壁纸','phone.wallpaper')+file('锁屏壁纸','phone.lockwallpaper')+field('桌面背景横向位置 %','phone.wallX',p.wallX??50,'number')+field('桌面背景纵向位置 %','phone.wallY',p.wallY??50,'number')+field('锁屏背景横向位置 %','phone.lockX',p.lockX??50,'number')+field('锁屏背景纵向位置 %','phone.lockY',p.lockY??50,'number')+field('桌面壁纸缩放（100–200%）','phone.wallZoom',p.wallZoom||100,'range')+field('锁屏壁纸缩放（100–200%）','phone.lockZoom',p.lockZoom||100,'range')))+
    settingsGroup('phone-font','字体与字号',fontFields());
  }
  if(section==='apps'){
   p.homeWidgets??={overview:false,note:false,photo:false,location:'',noteId:'',photoIndex:'2'};
   html=settingsGroup('app-layout','桌面与 Dock',select('默认应用名称语言','phone.language',languages,p.language)+'<p class="helper">未启用的应用不会出现在手机中，也无法通过通知或其他入口打开。截图模板仍可单独使用。</p><div class="actions"><button type="button" id="default-dock">恢复默认 Dock 四项</button></div>'+check('桌面显示日历小组件','phone.calendarWidget',p.calendarWidget))+settingsGroup('home-widgets','首页小组件',homeWidgetFields(p))+
   settingsGroup('app-list','应用配置',p.apps.map((a,i)=>`<details class="appsettings" data-app-order="${i}"><summary draggable="true">${E(P.appName(a,p))}${a.enabled?' · 已启用':' · 未启用'}</summary><div class="actions"><button type="button" data-app-move="${i}:-1" ${i===0?'disabled':''}>上移</button><button type="button" data-app-move="${i}:1" ${i===p.apps.length-1?'disabled':''}>下移</button></div>${check('启用此应用',`phone.apps.${i}.enabled`,a.enabled)}${check('开始时锁定，等待剧情解锁',`phone.apps.${i}.locked`,a.locked)}${check('放入底部 Dock',`phone.apps.${i}.dock`,a.dock)}${select('桌面页码',`phone.apps.${i}.page`,[['1','第 1 页'],['2','第 2 页']],a.page||'1')}${select('应用名称语言',`phone.apps.${i}.language`,[['inherit','跟随默认语言'],...languages],a.language||'inherit')}${field('自定义名称（留空使用语言默认名）',`phone.apps.${i}.name`,a.name)}${select('内置图标',`phone.apps.${i}.iconPreset`,[['','自动匹配设备'],...Object.entries(P.appTypes).filter(([k])=>k!=='forum')],a.iconPreset||'')}${file('上传图标（优先显示）',`phone.apps.${i}.icon`)}${select('点击后打开',`phone.apps.${i}.target`,[...Object.entries(P.appTypes),['decoration','仅作装饰']],a.target)}</details>`).join('')+'<div class="actions"><button type="button" id="add-custom">添加自定义图标</button></div>');
  }
  if(section==='contents')html=settingsGroup('phone-conversations','会话与帖子',select('主要聊天应用','phone.chatPlatform',Object.entries(P.templates).filter(([,t])=>t.kind==='chat').map(([k,t])=>[k,t.name]),p.chatPlatform)+`<p class="helper">聊天与社交内容和截图模式共用，修改一次即可用于两种作品。</p>`+templateList.map(([id,t])=>`<details class="appsettings" open><summary>${t.name} · ${P.items(state,id).length}</summary>${P.items(state,id).map((item,i)=>`<div class="subhead"><strong>${E(item.roomTitle||item.contactName||item.title||item.body?.slice(0,35)||(t.kind==='chat'?state.partner:'')||('内容 '+(i+1)))}</strong><button type="button" data-edit-template="${id}" data-edit-index="${i-1}">编辑内容</button></div>`).join('')}</details>`).join(''))+
   settingsGroup('phone-records','通话与日历',field('通话记录','phone.calls',p.calls,'textarea')+field('日历事件','phone.calendar',p.calendar,'textarea'));
  if(section==='photos')html=settingsGroup('phone-album','相册设置',file('相册照片（可多选，最多 50 张）','phone.photos',true)+field('照片说明','phone.photoCaption',p.photoCaption)+albumEditor())+
   settingsGroup('phone-notes','备忘录设置','<p class="helper">多篇显示列表；只有一篇时，直接进入该篇内容。</p>'+p.noteItems.map((n,i)=>`<details class="appsettings" open><summary>${E(n.title||'无标题')}</summary>${field('标题',`phone.noteItems.${i}.title`,n.title)}${field('正文',`phone.noteItems.${i}.body`,n.body,'textarea')}${field('修改时间',`phone.noteItems.${i}.date`,n.date)}<button class="assetclear" type="button" data-remove-note="${i}">移除此篇</button></details>`).join('')+'<div class="actions"><button type="button" id="add-note">添加备忘录</button></div>'+field('照片触发后新增的隐藏备忘录','phone.secret',p.secret,'textarea'));
  if(section==='rules')html=settingsGroup('phone-story','剧情与提示设置',storyForm());
  return html;
 }
 function renderPreview(){$('#reader-debug').hidden=state.mode!=='phone'||!state.phone.story.enabled;const previous=renderedMode===state.mode&&state.mode==='phone'?player?.getView():null;player?.destroy();let template=state.mode==='screenshot'?state.template:undefined;const d=P.devices[state.device];$('#preview').style.width=d.w+10+'px';player=P.mount($('#preview'),state.mode==='screenshot'?editingState():state,{mode:state.mode,template,frame:state.frame,fitHeight:true,authorPreview:state.mode==='phone'&&section!=='appearance',hintFallback:document.documentElement.lang.split('-')[0],onProgress:showProgress});if(state.mode==='phone'&&(previewRoute||previous))player.navigate(previewRoute||previous);previewRoute=null;renderedMode=state.mode;$('#preview-title').textContent=state.mode==='screenshot'?'截图预览':'读者试玩';$('#preview-spec').textContent=`${d.name} · ${d.pixels[0]} × ${d.pixels[1]} px`;$('#reset-reader').hidden=state.mode!=='phone';$('#preview-hint').textContent=state.mode==='screenshot'?'截图只包含作品界面，不包含编辑器与设备外框。':'轻点锁屏进入；切换左侧栏目可预览桌面和备忘录。';}
 function studioLanguage(){return document.documentElement.lang.split('-')[0];}
 $('#ui-language').addEventListener('change',()=>queueMicrotask(()=>{
  const language=studioLanguage();
  if(!recoveryBlocked&&window.FicDemoLocales?.refreshPreset(state,defaults(),language)){render();scheduleSave();}
  else player?.setHintFallback(language);
 }));
 function renderEditor(){
  storyOpen=new Set([...document.querySelectorAll('.story-step[open]')].map(n=>n.dataset.step));
  const form=$('#editor-form');
  const expanded=new Set([...form.querySelectorAll('[data-settings-group][open]')].map(group=>group.dataset.settingsGroup));
  form.innerHTML=state.mode==='screenshot'?screenshotForm():phoneForm();
  form.querySelectorAll('[data-settings-group]').forEach(group=>{group.open=expanded.has(group.dataset.settingsGroup);});
  bindForm();
 }
 function render(){
  if(!state.collections)P.normalizeExtras(state,state);
  const phone=state.mode==='phone',story=state.phone.story.enabled;
  if(phone&&!story&&section==='rules')section='appearance';
  document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(state.mode===button.dataset.mode)));
  $('#phone-modes').hidden=!phone;
  document.querySelectorAll('[data-phone-mode]').forEach(button=>button.setAttribute('aria-pressed',String(story===(button.dataset.phoneMode==='story'))));
  $('#mode-caption').textContent=!phone?'选择模板，直接编辑和导出':story?'用线索触发消息、解锁应用和分支':'读者自行查看聊天、照片和备忘录';
  renderNavigation();renderEditor();$('#clear-template').hidden=state.mode!=='screenshot';renderPreview();$('#exportbar').innerHTML=state.mode==='screenshot'?'<button id="batch-export">批量导出截图 ZIP</button><button class="primary" data-export="screen">导出单屏 PNG</button><button data-export="long">导出长图</button><button data-export="pages">分页导出</button>':'<button class="primary" id="export-story">导出可交互作品 HTML</button><button id="show-desktop">查看桌面</button>';$('#exportbar').querySelectorAll('[data-export]').forEach(b=>b.onclick=()=>exportPNG(b.dataset.export));if($('#batch-export'))$('#batch-export').onclick=batchExport;if($('#export-story'))$('#export-story').onclick=exportStory;if($('#show-desktop'))$('#show-desktop').onclick=()=>player.navigate('home');
  if(state.mode==='phone'&&window.FicPhonePublishingURL){
   const publish=document.createElement('button');
   publish.type='button';
   publish.textContent='发布到 FicPhone';
   publish.onclick=publishDialog;
   $('#exportbar').append(publish);
  }}
 async function readImage(file){if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type))throw Error('请选择 PNG、JPEG、WebP 或 GIF 图片。');if(file.size>15*1024*1024)throw Error('单张图片请小于 15 MB。');const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('图片读取失败'));r.readAsDataURL(file);});const img=await new Promise((resolve,reject)=>{const el=new Image();el.onload=()=>resolve(el);el.onerror=()=>reject(Error('无法识别图片'));el.src=data;});const factor=Math.min(1,1600/img.width,1600/img.height);let canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*factor));canvas.height=Math.max(1,Math.round(img.height*factor));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL(file.type==='image/png'?'image/png':'image/webp',.9);}
 function bindForm(){const form=$('#editor-form');form.onsubmit=e=>e.preventDefault();form.querySelectorAll('[data-path]').forEach(el=>{const handler=()=>changeField(el);el.addEventListener(el.tagName==='SELECT'||el.type==='checkbox'?'change':'input',handler);});form.querySelectorAll('[data-asset]').forEach(el=>el.onchange=async()=>{try{let files=[...el.files];if(!files.length)return;if(el.dataset.asset==='phone.photos'&&files.length+state.phone.photos.length>50)throw Error('当前版本相册最多支持 50 张照片。');let values=[];for(let f of files)values.push(await readImage(f));if(el.dataset.asset.endsWith('.images')&&values.length+(getPath(el.dataset.asset)?.length||0)>9)throw Error('每条内容最多 9 张图片。');setPath(el.dataset.asset,el.multiple?[...(getPath(el.dataset.asset)||[]),...values]:values[0]);scheduleSave();render();toast('图片已加入本机工程。');}catch(e){toast(e.message);}});form.querySelectorAll('[data-clear]').forEach(b=>b.onclick=()=>{if(b.dataset.clear==='phone.photos'&&!confirm('清空全部照片前建议导出 JSON 备份。照片相关剧情需要重新检查。确认清空？'))return;if(b.dataset.clear==='phone.photos')for(const album of state.phone.albums||[])album.photoIndexes=[];setPath(b.dataset.clear,b.dataset.clear==='phone.photos'||b.dataset.clear.endsWith('.images')?[]:'');scheduleSave();render();});if($('#append-message'))$('#append-message').onclick=()=>{currentDraft().script+='\n我：';scheduleSave();render();};if($('#add-custom'))$('#add-custom').onclick=()=>{if(state.phone.apps.length>=24)return toast('当前版本最多显示 24 个应用配置。');state.phone.apps.push({type:'custom',name:'自定义应用',language:'inherit',target:'decoration',icon:'',enabled:true,dock:false});scheduleSave();render();};form.querySelectorAll('[data-edit-template]').forEach(b=>b.onclick=()=>{syncSheets();state.template=b.dataset.editTemplate;contentIndex=Number(b.dataset.editIndex??-1);state.mode='screenshot';scheduleSave();render();$('[data-settings-group=shot-content]').open=true;});}
 function download(blob,name){let a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
 const filename=()=>String(state.title||'FicPhone').replace(/[\\/:*?"<>|]/g,'-').slice(0,60);
 function backup(){download(new Blob([JSON.stringify(syncSheets(),null,2)],{type:'application/json'}),filename()+'.pocket.json');toast('工程已导出，包含文字与已上传图片。');}
 function normalise(raw){
  if(!raw||raw.format!=='pocket-story'||raw.version!==1)throw Error('不是支持的FicPhone 工程。');const fresh=defaults();
  for(let k of ['title','owner','partner','time'])if(typeof raw[k]==='string')fresh[k]=raw[k].slice(0,200);
  for(let k of ['ownerAvatar','partnerAvatar'])fresh[k]=P.image(raw[k]);
  if(P.devices[raw.device]&&!P.devices[raw.device].disabled)fresh.device=raw.device;
  if(P.templates[raw.template])fresh.template=raw.template;fresh.mode=raw.mode==='phone'?'phone':'screenshot';fresh.frame=raw.frame!==false;fresh.battery=Math.max(0,Math.min(100,+raw.battery||0));
  for(let id of Object.keys(fresh.drafts)){for(let key of [...Object.keys(fresh.drafts[id]),...(['instagram','x'].includes(id)?['bio','followers','following']:[])]){let v=raw.drafts?.[id]?.[key];if(key==='media')fresh.drafts[id][key]=P.image(v);else if(key==='unread'&&typeof v==='boolean')fresh.drafts[id][key]=v;else if(typeof v==='string')fresh.drafts[id][key]=v.slice(0,100000);}}
  let p=raw.phone;if(p&&typeof p==='object'){
   if(p.readerLayout==='screen')fresh.phone.readerLayout='screen';
   if(p.showLockIntro===true)fresh.phone.showLockIntro=true;
   if(/^(?:[0-9]{4}|[0-9]{6})$/.test(p.lockCode||''))fresh.phone.lockCode=String(p.lockCode);
   if(p.readerStart==='home')fresh.phone.readerStart='home';
   if(p.manualAppOrder===true)fresh.phone.manualAppOrder=true;
   const widgets=p.homeWidgets;
   fresh.phone.homeWidgets={
    overview:widgets?.overview===true,note:widgets?.note===true,photo:widgets?.photo===true,
    location:typeof widgets?.location==='string'?widgets.location.slice(0,100):'',
    noteId:typeof widgets?.noteId==='string'?widgets.noteId.slice(0,100):'',
    photoIndex:/^(?:[0-9]|[1-4][0-9])$/.test(widgets?.photoIndex)?String(widgets.photoIndex):'2'
   };
   if(p.calendarWidget===true)fresh.phone.calendarWidget=true;
   if(typeof p.lockNotification==='string'&&/^(kakao|line|imessage):[\w-]{1,80}$/.test(p.lockNotification))fresh.phone.lockNotification=p.lockNotification;
   if(['zh','en','ko','ja'].includes(p.hintLanguage))fresh.phone.hintLanguage=p.hintLanguage;
   if(['normal','lowPower','charging'].includes(p.batteryMode))fresh.phone.batteryMode=p.batteryMode;
   if(['en','zh','ko','ja'].includes(p.language))fresh.phone.language=p.language;
   if(['samsung','google'].includes(p.androidMessages))fresh.phone.androidMessages=p.androidMessages;
   for(let key of ['date','intro','photoCaption','notes','secret','calls','calendar','newMessage'])if(typeof p[key]==='string')fresh.phone[key]=p[key].slice(0,100000);
   fresh.phone.wallpaper=P.image(p.wallpaper);fresh.phone.lockwallpaper=P.image(p.lockwallpaper);fresh.phone.photos=Array.isArray(p.photos)?p.photos.slice(0,50).map(P.image).filter(Boolean):[];fresh.phone.rule=p.rule!==false;
   fresh.phone.story=P.Story.normalize(p.story||P.Story.migrate(p));
   if(['kakao','line','imessage'].includes(p.chatPlatform))fresh.phone.chatPlatform=p.chatPlatform;
   if(Array.isArray(p.noteItems))fresh.phone.noteItems=p.noteItems.slice(0,100).filter(n=>n&&typeof n==='object').map((n,i)=>({id:/^[\w-]{1,100}$/.test(n.id)?n.id:'note-'+i,title:String(n.title||'无标题').slice(0,200),body:String(n.body||'').slice(0,100000),date:String(n.date||'2026. 6. 6.').slice(0,100)}));
   else if(typeof p.notes==='string'){const lines=p.notes.split('\n');fresh.phone.noteItems=p.notes.trim()?[{id:'legacy',title:lines[0],body:lines.slice(1).join('\n').trim(),date:'2026. 6. 6.'}]:[];}
   if(Array.isArray(p.apps))fresh.phone.apps=p.apps.slice(0,24).filter(a=>a&&typeof a==='object').map(a=>({type:P.appTypes[a.type]?a.type:'custom',name:p.layoutVersion===4?String(a.name||"").slice(0,40):legacyAppName(a.name,a.type),language:['en','zh','ko','ja'].includes(a.language)?a.language:'inherit',target:P.appTypes[a.target]?a.target:'decoration',locked:!!a.locked,enabled:p.layoutVersion!==4&&P.defaultDock.includes(a.type)?true:!!a.enabled,icon:P.image(a.icon),iconPreset:P.appTypes[a.iconPreset]?a.iconPreset:'',...(a.page==='2'?{page:'2'}:{}),dock:p.layoutVersion!==4?P.defaultDock.includes(a.type):!!a.dock}));
  }
  const oldSample='道允：到宿舍了吗？\n我：到了。\n道允：你把相册里的那张照片删了吗？\n我：哪张？\n道允：6月6日，汉江。';
  if(raw.owner==='尹夏'&&raw.partner==='道允'&&raw.drafts?.kakao?.script===oldSample&&raw.phone?.notes==='今天的待办\n\n练习\n买电池\n记得带伞')applyDemo(fresh);
  const previousTwice='사나：언니, 아직 안 자?\n나연：응. 연습 영상 보고 있었어.\n사나：오늘 찍은 사진 보내 줄래?\n나연：한강에서 찍은 거?\n사나：응 ㅎㅎ 그건 지우지 마.\n나연：왜?\n사나：그냥. 언니랑 같이 나온 사진이잖아.';
  if(raw.owner==='나연'&&raw.partner==='사나'&&raw.drafts?.kakao?.script===previousTwice)applyDemo(fresh);
  if(raw.drafts?.forum?.board==='深夜讨论区'&&raw.drafts?.forum?.title==='有没有人看见今晚汉江边的两个人？')fresh.drafts.forum={...defaults().drafts.forum,media:fresh.drafts.forum.media};
  if(fresh.owner==='미나'&&fresh.partner==='사나'){if(fresh.drafts.instagram.handle==='mina.story')fresh.drafts.instagram.handle='mina_sr_my';fresh.drafts.instagram.comments=fresh.drafts.instagram.comments.replace(/^sana\.story：/m,'m.by__sana：');if(!fresh.phone.photos.length&&!raw.demoMediaRevision){fresh.phone.photos=defaults().phone.photos;if(fresh.phone.photos.length)fresh.phone.photoCaption=defaults().phone.photoCaption;}if(!raw.demoMediaRevision){if(!fresh.ownerAvatar)fresh.ownerAvatar=demoMedia.mina||'';if(!fresh.partnerAvatar)fresh.partnerAvatar=demoMedia.sana||'';if(!fresh.drafts.instagram.media)fresh.drafts.instagram.media=demoMedia.mina||'';}}
  fresh.demoMediaRevision=1;return P.normalizeExtras(raw,fresh);
 }
 function applyDemo(target){const source=defaults();const demo=window.FicDemoLocales?.preset(source,studioLanguage())||source;target.demoMediaRevision=1;target.demoRevision=4;if(!target.phone.photos.length)target.phone.photos=demo.phone.photos;if(!target.ownerAvatar)target.ownerAvatar=demo.ownerAvatar;if(!target.partnerAvatar)target.partnerAvatar=demo.partnerAvatar;target.title=demo.title;target.owner=demo.owner;target.partner=demo.partner;for(const id of ['kakao','line','imessage','instagram','x','forum'])target.drafts[id]={...demo.drafts[id],media:target.drafts[id].media||demo.drafts[id].media};for(const key of ['date','intro','photoCaption','notes','noteItems','secret','calls','calendar','newMessage','story'])target.phone[key]=demo.phone[key];target.phone.apps=target.phone.apps.map(a=>{const known=demo.phone.apps.find(b=>b.type===a.type);return known?{...a,name:a.name===P.appTypes[a.type]?known.name:a.name,locked:known.locked}:a;});}
 async function importProject(file){try{if(file.size>100*1024*1024)throw Error('当前版本仅支持导入 100 MB 以内的工程。');let next=normalise(JSON.parse(await file.text()));if(!confirm('导入会替换当前工程。请先导出 JSON 备份；取消可返回备份。确认继续导入？'))return;state=next;recoveryBlocked=false;contentIndex=-1;undoStack=[];redoStack=[];lastHistory=JSON.stringify(state);section='appearance';await save();render();toast('工程已导入。');}catch(e){toast('导入失败：'+e.message);}}
 function exportStory(){if(P.fontCatalog[state.phone.font]&&window.FicFonts&&!window.FicFonts.prepared){toast('正在打包离线字体…');return window.FicFonts.prepare().then(()=>{window.FicFonts.prepared=true;exportStory();}).catch(e=>toast('字体打包失败：'+e.message));}if(typeof storyWarnings==='function'&&storyWarnings().length&&!confirm('剧情检查发现 '+storyWarnings().length+' 项提醒，仍要导出吗？'))return;const reader=P.readerState(state);
 const editorLanguage=typeof document==='undefined'?'zh':document.documentElement.lang.split('-')[0];
 if(!['zh','en','ko','ja'].includes(reader.phone.hintLanguage))reader.phone.hintLanguage=editorLanguage;
 const data=JSON.stringify(reader).replace(/</g,'\\u003c');const runtime=PocketRuntime.toString(),storyRuntime=window.FicStoryRuntime.toString();const iconData=JSON.stringify(typeof window==='undefined'?{}:window.PocketIcons||{}).replace(/</g,'\\u003c');const fontData=JSON.stringify(P.fontCatalog[state.phone.font]?window.FicFonts?.data||{}:{}).replace(/</g,'\\u003c');const fontLicense=JSON.stringify(P.fontCatalog[state.phone.font]?window.FicFontLicenses||{}:{}).replace(/</g,'\\u003c');const title=E(state.title);const html=`<!doctype html><html lang="${E(reader.phone.hintLanguage)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{margin:0;background:#f2eff4;font-family:-apple-system,BlinkMacSystemFont,sans-serif}main{max-width:480px;margin:28px auto;padding:12px 16px}h1{font-size:14px;font-weight:500;color:#71667e;text-align:center;margin:0 0 20px}main{height:100dvh;display:flex;flex-direction:column;margin:0 auto;padding:12px 16px}h1{flex:none;margin-bottom:8px}#phone{width:100%;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}.reader-tools{flex:none;margin:10px 0}.reader-tools small{font-size:10px}.reader-tools{text-align:center;margin:20px 0;font-size:12px;color:#82768d}button.reset{font:inherit;color:inherit;border:1px solid #ddd2e3;border-radius:8px;background:#fff;padding:7px 12px}@media(max-width:460px){main{margin:0 auto;padding:8px}}main.reader-screen{max-width:none;padding:0;height:100vh;height:100dvh}main.reader-screen h1,main.reader-screen .reader-tools{position:absolute;width:1px;height:1px;margin:0;padding:0;clip-path:inset(50%);overflow:hidden}main.reader-screen .reader-tools:focus-within{bottom:0;left:0;width:auto;height:auto;clip-path:none;z-index:2}@media(prefers-color-scheme:dark){body{background:#211f26}.reader-tools,h1{color:#bbb1c7}}</style></head><body><main class="${state.phone.readerLayout==='screen'?'reader-screen':''}"><h1>${title}</h1><div id="phone"></div><div class="reader-tools">${state.phone.watermarkHTML&&state.phone.authorCredit&&state.phone.readerLayout!=='screen'?`<p class="author-credit">${E(state.phone.authorCredit)}</p>`:''}<small id="reader-save">进度保存在本机</small> <button class="reset" id="restart">重新开始</button></div></main><script>const PocketFontData=${fontData};const PocketFontLicenses=${fontLicense};const PocketIcons=${iconData};const StoryFactory=(${storyRuntime});const Pocket=(${runtime})(StoryFactory);const story=${data};const player=Pocket.mount(document.getElementById('phone'),story,{mode:'phone',frame:true,fitHeight:true,exported:true,storageKey:'ficphone-reader-'+Pocket.Story.signature({title:story.title,owner:story.owner,story:story.phone.story}),onStorageError:()=>{document.getElementById('reader-save').textContent='此浏览器无法保存进度';}});document.getElementById('restart').onclick=()=>player.reset();<\/script></body></html>`;download(new Blob([html],{type:'text/html;charset=utf-8'}),filename()+'.story.html');toast('互动 HTML 已导出。若要继续编辑，请同时导出 JSON 工程备份。');}
 function publishDialog(){
  const endpoint=window.FicPhonePublishingURL?.replace(/\/$/,'');
  const language=document.documentElement.lang.split('-')[0];
  const text={
   zh:['发布到 FicPhone','受邀作者可用邀请码直接发布。发布后，有链接的人即可阅读。','邀请码','作品标题','作者署名','简介','列入作品区','发布作品','正在发布…','作品已发布','打开阅读链接','复制阅读链接','邀请码无效、已停用或额度已用完。','作品超过 5 MB，请减少图片、音频或字体后再试。','暂时无法发布，请核对填写内容后重试。'],
   en:['Publish to FicPhone','Invited creators can publish with a code. Anyone with the resulting link can read.','Invite code','Title','Author credit','Summary','List in the gallery','Publish','Publishing…','Published','Open story','Copy link','The code is invalid, disabled or out of quota.','The work exceeds 5 MB. Remove some media and try again.','Publishing failed. Check the form and try again.']
  }[language]||['Publish to FicPhone','Invited creators can publish with a code. Anyone with the resulting link can read.','Invite code','Title','Author credit','Summary','List in the gallery','Publish','Publishing…','Published','Open story','Copy link','The code is invalid, disabled or out of quota.','The work exceeds 5 MB. Remove some media and try again.','Publishing failed. Check the form and try again.'];
  const [title,intro,invite,workTitle,author,summary,listed,submit,pending,done,open,copy,invalid,tooLarge,failed]=text;
  const listingHelp={
   zh:'勾选后，作品会显示在公开作品区。取消勾选后，读者仍可通过分享链接打开。',
   en:'List the story in the public gallery. If unchecked, readers can still open it from the share link.',
   ko:'선택하면 공개 작품 목록에 표시됩니다. 선택하지 않아도 공유 링크로 열 수 있습니다.',
   ja:'選ぶと公開作品一覧に掲載されます。選ばない場合も共有リンクから開けます。'
  }[language]||'List the story in the public gallery. If unchecked, readers can still open it from the share link.';
  openPanel(title,`<p>${intro}</p><form id="publish-form">
   <label>${invite}<input name="code" type="password" required minlength="16" maxlength="128" autocomplete="off"></label>
   <label>${workTitle}<input name="title" required maxlength="120" value="${E(state.title.slice(0,120))}"></label>
   <label>${author}<input name="author" required maxlength="80" value="${E((state.phone.authorCredit||'').slice(0,80))}"></label>
   <label>${summary}<textarea name="summary" maxlength="500"></textarea></label>
   <label class="checkrow"><input name="listed" type="checkbox" aria-describedby="listing-help" checked>${listed}</label>
   <p class="helper" id="listing-help">${listingHelp}</p>
   <button type="submit" class="primary">${submit}</button><p id="publish-status" role="status"></p>
  </form>`);
  const form=$('#publish-form'),status=$('#publish-status');
  const id=crypto.randomUUID();
  form.onsubmit=async event=>{
   event.preventDefault();
   const button=form.querySelector('button');
   const data=new FormData(form),story=P.readerState(state);
   story.phone.hintLanguage=story.phone.hintLanguage||language;
   const body=JSON.stringify({id,code:String(data.get('code')).trim(),title:String(data.get('title')),
    author:String(data.get('author')),summary:String(data.get('summary')),listed:data.has('listed'),story});
   if(new Blob([body]).size>5*1024*1024){status.textContent=tooLarge;return;}
   button.disabled=true;
   status.textContent=pending;
   try{
    const response=await fetch(endpoint+'/works',{method:'POST',headers:{'Content-Type':'application/json'},body});
    if(response.status===403)throw Error(invalid);
    if(response.status===413)throw Error(tooLarge);
    if(!response.ok)throw Error(failed);
    const result=await response.json();
    const url=new URL('play.html?work='+encodeURIComponent(result.id),location.href).href;
    const link=document.createElement('a');
    link.href=url;link.textContent=open;link.target='_blank';link.rel='noopener';
    const copyButton=document.createElement('button');
    copyButton.type='button';copyButton.textContent=copy;
    copyButton.onclick=()=>navigator.clipboard.writeText(url).then(()=>{copyButton.textContent='✓ '+copy;}).catch(()=>{copyButton.replaceWith(url);});
    status.replaceChildren(done,' · ',link,' ',copyButton);
    form.querySelector('[name="code"]').value='';
   }catch(error){
    status.textContent=[invalid,tooLarge,failed].includes(error.message)?error.message:failed;
    button.disabled=false;
   }
  };
 }

 async function exportPNG(kind){if(exportBusy)return;if(!window.html2canvas)return toast('截图组件未载入，请刷新后重试。');const buttons=[...$('#exportbar').querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);let host=document.createElement('div');host.style.cssText=`position:fixed;left:-10000px;top:0;width:${P.devices[state.device].w}px;pointer-events:none;`;document.body.append(host);let capturePlayer;
  try{await document.fonts.ready;capturePlayer=P.mount(host,editingState(),{mode:'screenshot',template:state.template,frame:false,long:kind!=='screen'});let el=capturePlayer.getCapture();await window.FicFonts?.ready(state.phone.font);if(state.phone.font==='custom')await document.fonts.load('15px FicImportedFont');await Promise.all([...el.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;})));const w=el.offsetWidth,h=el.offsetHeight;if(h>16000)throw Error('内容超过当前单次导出长度，请分段导出。工程内容不会丢失。');let scale=kind==='screen'?P.devices[state.device].scale:2;toast(kind==='screen'?'正在生成高清截图…':'正在生成长图…');let canvas=await window.html2canvas(el,{scale,backgroundColor:null,logging:false,useCORS:false,scrollX:0,scrollY:0});let pages=[];if(kind!=='pages')pages=[canvas];else{const rect=el.getBoundingClientRect(),boundaries=[...el.querySelectorAll('[data-split]')].map(n=>Math.round((n.getBoundingClientRect().top-rect.top)*scale)).filter(y=>y>0);let start=0,target=P.devices[state.device].h*scale;while(start<canvas.height){let end=Math.min(start+target,canvas.height);if(end<canvas.height){let candidates=boundaries.filter(y=>y>start+target*.4&&y<=end);if(candidates.length)end=candidates.at(-1);}if(end<=start)end=Math.min(start+target,canvas.height);let page=document.createElement('canvas');page.width=canvas.width;page.height=end-start;page.getContext('2d').drawImage(canvas,0,start,canvas.width,end-start,0,0,canvas.width,end-start);pages.push(page);start=end;}}
   const results=$('#export-results');results.innerHTML='';for(let i=0;i<pages.length;i++){let c=pages[i],blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('图片生成失败');let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download=filename()+'-'+state.template+(pages.length>1?'-'+String(i+1).padStart(2,'0'):'')+'.png';let img=document.createElement('img');img.src=url;img.alt='截图预览 '+(i+1);a.append(img,document.createTextNode(`保存${pages.length>1?'第 '+(i+1)+' 张':''} · ${c.width}×${c.height}`));results.append(a);}
   $('#export-summary').textContent=`已生成 ${pages.length} 张 PNG。点击缩略图保存。`;$('#export-dialog').showModal();toast('截图已生成，请在预览中选择保存。');
  }catch(e){toast('导出失败：'+e.message);}finally{capturePlayer?.destroy();host.remove();buttons.forEach(b=>b.disabled=false);}
 }
 document.querySelectorAll('[data-phone-mode]').forEach(button=>button.onclick=()=>{
  const enabled=button.dataset.phoneMode==='story';
  if(enabled===state.phone.story.enabled)return;
  state.phone.story.enabled=enabled;
  if(enabled){
   section='rules';
   previewRoute='home';
  }else if(section==='rules'){
   section='appearance';
   previewRoute=state.phone.lockCode?'lock':state.phone.readerStart||'lock';
  }
  scheduleSave();
  render();
  if(enabled)$('[data-settings-group="phone-story"]').open=true;
 });
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{syncSheets();state.mode=b.dataset.mode;scheduleSave();render();});$('#backup').onclick=backup;$('#import').onclick=()=>$('#import-file').click();$('#import-file').onchange=e=>{if(e.target.files[0])importProject(e.target.files[0]);e.target.value='';};$('#reset-reader').onclick=()=>player.reset();$('#export-dialog').addEventListener('close',()=>{$('#export-results').querySelectorAll('a').forEach(a=>URL.revokeObjectURL(a.href));$('#export-results').innerHTML='';});window.addEventListener('pagehide',()=>{save();});
 $('#load-demo').onclick=()=>{if(!confirm('建议先导出 JSON 备份。载入 미나 × 사나 的虚构示例文本？这会替换角色名、对话、备忘录和13步剧情；保留上传图片、壁纸和机型设置。'))return;recoveryBlocked=false;applyDemo(state);scheduleSave();render();toast('已载入当前语言的 TWICE 示例。');};
 $('#editor-form').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const steps=state.phone.story.steps;let changed=false;if(b.id==='story-add'&&steps.length<P.Story.MAX_STEPS){steps.push(P.Story.normalize({steps:[{id:'s-'+Date.now(),title:'新的剧情步骤',trigger:'photo',target:'*',actions:[{type:'message',app:state.phone.chatPlatform,text:''}]}]}).steps[0]);storyPage=Math.floor((steps.length-1)/STORY_PAGE_SIZE);changed=true;}if(b.id==='story-demo'){if(!confirm('用 13 步虚构示例替换当前剧情？会启用示例所需应用，并把 Instagram、X、theqoo 设为等待剧情解锁。其他文本和图片保留。'))return;state.phone.story=P.Story.demo();storyPage=0;for(const a of state.phone.apps){if(['kakao','notes','album','calls','instagram','x','forum'].includes(a.target||a.type))a.enabled=true;a.locked=['instagram','x','forum'].includes(a.target||a.type);}changed=true;}if(b.dataset.addAction!==undefined){let step=steps[+b.dataset.addAction];if(step.actions.length<3){step.actions.push(P.Story.normalize({steps:[{actions:[{type:'message',app:state.phone.chatPlatform,text:''}]}]}).steps[0].actions[0]);changed=true;}}if(b.dataset.removeAction){const [i,j]=b.dataset.removeAction.split(':').map(Number);steps[i].actions.splice(j,1);changed=true;}if(b.dataset.removeStep!==undefined){steps.splice(+b.dataset.removeStep,1);changed=true;}if(b.dataset.duplicateStep!==undefined&&steps.length<P.Story.MAX_STEPS){const i=+b.dataset.duplicateStep,copy=JSON.parse(JSON.stringify(steps[i]));copy.id='s-'+Date.now();copy.title+='（副本）';steps.splice(i+1,0,copy);changed=true;}if(b.dataset.moveStep){const [i,delta]=b.dataset.moveStep.split(':').map(Number);if(steps[i+delta]){[steps[i],steps[i+delta]]=[steps[i+delta],steps[i]];changed=true;toast('步骤已移动，请检查分支跳转和前置线索。');}}if(changed){scheduleSave();render();}});
 const chromeObserver=new ResizeObserver(()=>{const h=['.topbar','.projectbar','.modebar','.site-footer'].reduce((sum,sel)=>sum+$(sel).getBoundingClientRect().height,0);document.documentElement.style.setProperty('--chrome-height',h+'px');});for(const sel of ['.topbar','.projectbar','.modebar','.site-footer'])chromeObserver.observe($(sel));
 $('#editor-form').addEventListener('click',e=>{const add=e.target.closest('#add-note'),remove=e.target.closest('[data-remove-note]');if(e.target.closest('#default-dock')){for(const a of state.phone.apps){a.dock=P.defaultDock.includes(a.type);if(a.dock)a.enabled=true;}previewRoute='home';scheduleSave();render();return;}if(add){if(state.phone.noteItems.length>=100)return toast('当前版本最多支持 100 篇备忘录。');state.phone.noteItems.push({id:'note-'+Date.now(),title:'新备忘录',body:'',date:'2026. 6. 6.'});previewRoute='notes';scheduleSave();render();}if(remove){state.phone.noteItems.splice(+remove.dataset.removeNote,1);previewRoute='notes';scheduleSave();render();}});
 (async()=>{try{db=await openDB();let saved=await readDB();if(saved){try{state=normalise(saved);}catch(e){throw Error('旧草稿保留：'+e.message);}}$('#save-status').textContent=saved?'已恢复本机工程':'本机自动保存';}catch(e){recoveryBlocked=true;$('#save-status').dataset.status='error';$('#save-status').textContent='旧草稿未覆盖 · 请导出或恢复';toast(e.message||'本机存储无法读取');}P.normalizeExtras(state,state);if(!recoveryBlocked)window.FicDemoLocales?.refreshPreset(state,defaults(),studioLanguage());lastHistory=JSON.stringify(state);render();initBeta();})();
 function editingState(){return {...state,drafts:{...state.drafts,[state.template]:currentDraft()}};}
 $('#editor-form').addEventListener('click',e=>{const b=e.target.closest('[data-remove-album]');if(!b)return;P.removePhoto(state,+b.dataset.removeAlbum);previewRoute='album';scheduleSave();render();});
 function currentDraft(){return contentIndex<0?state.drafts[state.template]:state.collections[state.template][contentIndex];}
 function clone(v){return JSON.parse(JSON.stringify(v));}
 function snapshot(){return {id:'shot-'+Date.now(),name:'截图 '+((state.screenshotSheets?.length||0)+1),template:state.template,draft:clone(currentDraft()),time:state.time,battery:state.battery,device:state.device,owner:state.owner,partner:state.partner,ownerAvatar:state.ownerAvatar,partnerAvatar:state.partnerAvatar,style:{font:state.phone.font,workPoints:state.phone.workPoints,textSize:state.phone.textSize,hideCutout:state.phone.hideCutout,language:state.phone.language,batteryMode:state.phone.batteryMode,androidMessages:state.phone.androidMessages,authorCredit:state.phone.authorCredit,watermarkImage:state.phone.watermarkImage,watermarkHTML:state.phone.watermarkHTML}};}
 function syncSheets(){if(!state.collections)P.normalizeExtras(state,state);if(!state.screenshotSheets.length)state.screenshotSheets=[snapshot()];if(state.mode==='screenshot'){const old=state.screenshotSheets[state.activeSheet||0];state.screenshotSheets[state.activeSheet||0]={...snapshot(),id:old.id,name:old.name};}return state;}
 function sheetState(sheet){return {...state,...sheet,drafts:{...state.drafts,[sheet.template]:sheet.draft},phone:{...state.phone,...sheet.style}};}
 function sheetControls(){return `<section class="beta-panel"><strong>截图稿 · ${state.screenshotSheets?.length||1} / 9</strong><p class="helper">每稿独立保存内容和时间；批量导出为多个 PNG。</p><div class="sheet-tabs">${(state.screenshotSheets?.length?state.screenshotSheets:[{name:'截图 1'}]).map((s,i)=>`<button type="button" data-sheet="${i}" aria-pressed="${i===(state.activeSheet||0)}">${E(s.name)}</button>`).join('')}</div><div class="actions"><button type="button" data-sheet-add>复制为新稿</button><button type="button" data-sheet-move="-1">左移</button><button type="button" data-sheet-move="1">右移</button><button type="button" data-sheet-remove>删除当前稿</button></div></section>`;}
 function collectionControls(){return `<section class="beta-panel"><label>编辑会话／帖子<select id="content-select"><option value="-1" ${contentIndex<0?'selected':''}>1 · 原始内容</option>${(state.collections[state.template]||[]).map((d,i)=>`<option value="${i}" ${contentIndex===i?'selected':''}>${i+2} · ${E(d.roomTitle||d.title||d.body?.slice(0,15)||'内容')}</option>`).join('')}</select></label><div class="actions"><button type="button" data-content-add>复制为新会话／帖子</button>${contentIndex>=0?'<button type="button" data-content-remove>删除此内容</button>':''}</div></section>`;}
 function gallery(base,d){return file('附图（最多 9 张，可多选；聊天用 [图片] 插入整组）',base+'.images',true)+`<div class="asset-thumbs">${(d.images||[]).map((src,i)=>`<div><img src="${P.image(src)}" alt="图片 ${i+1}"><button type="button" data-remove-image="${base}:${i}">移除 ${i+1}</button></div>`).join('')}</div>`+(d.media?file('旧版单图（保留兼容，可移除）',base+'.media'):'');}
 function memberEditor(base,d){return `<details data-settings-group="chat-members"><summary>群聊成员（含手机主人最多九人）</summary><p class="helper">手机主人与对方占两个名额，以下最多添加七人；脚本中的发送者姓名应与成员一致。</p>${(d.members||[]).map((m,i)=>field('成员姓名',base+'.members.'+i+'.name',m.name)+file('成员头像',base+'.members.'+i+'.avatar')+field('该成员已读到第几条消息',base+'.members.'+i+'.readUntil',m.readUntil||0,'number')+`<button type="button" data-member-remove="${base}:${i}">移除成员</button>`).join('')}<button type="button" data-member-add="${base}">添加成员</button></details>`;}
 function remember(force=false){const now=Date.now(),next=JSON.stringify(state);if(next===lastHistory)return;if(lastHistory&&(force||now-lastHistoryAt>650||!undoStack.length)){undoStack.push(lastHistory);if(undoStack.length>20)undoStack.shift();}lastHistoryAt=now;lastHistory=next;redoStack=[];}
 function restoreHistory(from,to){
  const previous=from.pop();
  if(!previous)return toast('没有可恢复的操作');
  const template=state.template;
  const draftId=contentIndex>=0?currentDraft()?.id:null;
  to.push(JSON.stringify(state));
  state=normalise(JSON.parse(previous));
  contentIndex=draftId&&state.template===template?state.collections[template].findIndex(draft=>draft.id===draftId):-1;
  lastHistory=JSON.stringify(state);
  save();
  render();
 }
 function openPanel(title,html){delete $('#info-dialog').dataset.fixedLanguage;$('#info-title').textContent=title;$('#info-body').innerHTML=html;$('#info-body').querySelectorAll('a[href^="#guide-"]').forEach(a=>a.onclick=e=>{e.preventDefault();$('#info-body').querySelector(a.getAttribute('href'))?.scrollIntoView({block:'start',behavior:'smooth'});});if(!$('#info-dialog').open)$('#info-dialog').showModal();}
 let guideSection='guide-intro';
 function guide(language='zh'){openPanel(language==='en'?'FicPhone · Step-by-step guide':'FicPhone 新手使用教程',window.FicGuide.render(language));$('#info-dialog').dataset.fixedLanguage='true';const activate=id=>{guideSection=id;$('#info-body').querySelectorAll('.guide-chapter').forEach(p=>p.hidden=p.id!==id);$('#info-body').querySelectorAll('[role="tab"]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.guideTab===id)));$('#info-body').querySelector('.guide-panel-scroll').scrollTop=0;};$('#info-body').querySelectorAll('[data-guide-tab]').forEach(b=>b.onclick=()=>activate(b.dataset.guideTab));$('#info-body').querySelectorAll('[data-guide-language]').forEach(b=>b.onclick=()=>guide(b.dataset.guideLanguage));activate(guideSection);}

 function feedback(){const cfg=window.FicPhoneFeedback||{},safe=v=>typeof v==='string'&&/^https:\/\//.test(v)?E(v):'';openPanel('问题与建议',`<p>当前版本：v1.0.2-beta.1</p>${safe(cfg.privateUrl)?`<p><a target="_blank" rel="noopener" href="${safe(cfg.privateUrl)}">提交私密反馈</a></p>`:'<p>私密反馈暂不可用。可复制下方问题模板，保留操作步骤与环境信息。</p>'}${safe(cfg.publicUrl)?`<p><a target="_blank" rel="noopener" href="${safe(cfg.publicUrl)}">查看公开建议板</a></p>`:'<p>公开建议板尚未接通。</p>'}<p>请勿在公开建议中填写联系方式或其他个人信息。</p><textarea readonly>版本：v1.0.2-beta.1\n反馈类型：问题 / 建议\n设备与浏览器：${E(navigator.userAgent)}\n操作步骤：\n实际结果：\n期望结果：\n是否允许公开展示建议：否</textarea>`);}
 function redoWithConfirmation(){
  if(!redoStack.length){toast('没有可恢复的操作');return;}
  const dialog=$('#redo-dialog');
  if(dialog.open)return;
  const copy={
   zh:['确定要重做吗？','取消','确定重做'],
   en:['Redo the last undone edit?','Cancel','Redo'],
   ko:['마지막으로 취소한 편집을 다시 실행할까요?','취소','다시 실행'],
   ja:['取り消した編集をやり直しますか？','キャンセル','やり直す']
  };
  const [title,cancel,redo]=copy[studioLanguage()]||copy.en;
  $('#redo-title').textContent=title;
  $('#redo-cancel').textContent=cancel;
  $('#redo-confirm').textContent=redo;
  dialog.returnValue='';
  dialog.onclose=()=>{
   if(dialog.returnValue==='redo')restoreHistory(redoStack,undoStack);
  };
  dialog.showModal();
 }
 function clearTemplate(){
  if(state.mode!=='screenshot')return;
  const draft=currentDraft();
  const labels={
   zh:['清空当前模板？','会清空当前会话或帖子的内容。可以用撤销恢复。','取消','清空内容'],
   en:['Clear the current template?','This clears the current conversation or post. You can undo this action.','Cancel','Clear content']
  };
  const [title,description,cancel,clear]=labels[studioLanguage()]||labels.en;
  openPanel(title,`<p>${description}</p><div class="actions">
   <button type="button" id="clear-template-cancel">${cancel}</button>
   <button type="button" id="clear-template-confirm" class="primary">${clear}</button>
  </div>`);
  const dialog=$('#info-dialog');
  $('#clear-template-cancel').onclick=()=>dialog.close();
  $('#clear-template-confirm').onclick=()=>{
   if(state.mode!=='screenshot'||currentDraft()!==draft){dialog.close();return;}
   syncSheets();
   for(const key of Object.keys(draft)){
    if(key==='id')continue;
    const value=draft[key];
    draft[key]=Array.isArray(value)?[]:typeof value==='boolean'?false:typeof value==='number'?0:'';
   }
   remember(true);
   scheduleSave();
   dialog.close();
   render();
   $('[data-settings-group=shot-content]').open=true;
   toast('当前模板内容已清空，可以撤销。');
  };
  $('#clear-template-cancel').focus();
 }
 function initBeta(){syncSheets();$('#privacy-notice').onclick=()=>notice('privacy');$('#copyright-notice').onclick=()=>notice('copyright');$('#backup-after-export').onclick=backup;$('#help').onclick=()=>guide();$('#projects').onclick=projects;$('#new-phone').onclick=chooseNewPhone;$('#characters').onclick=characters;$('#preflight').onclick=preflight;$('#feedback').onclick=feedback;$('#feedback').hidden=!(window.FicPhoneFeedback?.privateUrl||window.FicPhoneFeedback?.publicUrl);$('#undo').onclick=()=>restoreHistory(undoStack,redoStack);$('#redo').onclick=redoWithConfirmation;$('#clear-template').onclick=clearTemplate;
  document.addEventListener('keydown',event=>{
   if(!(event.ctrlKey||event.metaKey)||event.altKey||event.isComposing||event.defaultPrevented)return;
   if(event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable=false]),dialog'))return;
   const key=event.key.toLowerCase();
   if(key==='z'||key==='y'){
    event.preventDefault();
    if(key==='y'||event.shiftKey)redoWithConfirmation();
    else restoreHistory(undoStack,redoStack);
   }
  });try{if(!localStorage.getItem('ficphone-guide-beta1')){guide();localStorage.setItem('ficphone-guide-beta1','seen');}}catch{} }
 $('#editor-form').addEventListener('change',e=>{
  if(e.target.id==='story-page'){
   storyPage=Number(e.target.value);
   renderEditor();
   $('#story-page').focus();
   return;
  }
  if(e.target.id==='content-select'){contentIndex=+e.target.value;render();}});
 $('#editor-form').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;let changed=false;
 if(b.hasAttribute('data-sheet-add')){syncSheets();if(state.screenshotSheets.length>=9)return toast('最多九张截图稿');state.screenshotSheets.push(snapshot());state.activeSheet=state.screenshotSheets.length-1;changed=true;}
 if(b.dataset.sheet!==undefined){syncSheets();state.activeSheet=+b.dataset.sheet;const s=state.screenshotSheets[state.activeSheet];for(const k of ['template','time','battery','device','owner','partner','ownerAvatar','partnerAvatar'])state[k]=s[k];Object.assign(state.phone,s.style);state.drafts[s.template]=clone(s.draft);contentIndex=-1;changed=true;}
 if(b.hasAttribute('data-sheet-remove')){syncSheets();if(state.screenshotSheets.length<2)return toast('至少保留一张截图稿');state.screenshotSheets.splice(state.activeSheet,1);state.activeSheet=Math.min(state.activeSheet,state.screenshotSheets.length-1);const s=state.screenshotSheets[state.activeSheet];for(const k of ['template','time','battery','device','owner','partner','ownerAvatar','partnerAvatar'])state[k]=s[k];Object.assign(state.phone,s.style);state.drafts[s.template]=clone(s.draft);contentIndex=-1;changed=true;}
 if(b.dataset.sheetMove){syncSheets();const i=state.activeSheet,j=i+Number(b.dataset.sheetMove);if(state.screenshotSheets[j]){[state.screenshotSheets[i],state.screenshotSheets[j]]=[state.screenshotSheets[j],state.screenshotSheets[i]];state.activeSheet=j;changed=true;}}
 if(b.hasAttribute('data-content-add')){const list=state.collections[state.template];if(list.length>=49)return toast('每个平台最多五十项内容');list.push({...clone(currentDraft()),id:state.template+'-'+Date.now()});contentIndex=list.length-1;changed=true;}
 if(b.hasAttribute('data-content-remove')){state.collections[state.template].splice(contentIndex,1);contentIndex=-1;changed=true;}
 if(b.dataset.memberAdd){const d=getPath(b.dataset.memberAdd);d.members??=[];if(d.members.length>=7)return toast('含手机主人与对方最多九人');d.members.push({name:'新成员',avatar:''});changed=true;}
 for(const [attr,key] of [['memberRemove','members'],['removeImage','images']])if(b.dataset[attr]){const [base,i]=b.dataset[attr].split(':');getPath(base)[key].splice(+i,1);changed=true;}
 if(changed){scheduleSave();render();}});
 // Stored ZIP without an external dependency; filenames are ASCII and ordered.
 async function makeZip(entries){let offset=0;const local=[],central=[],enc=new TextEncoder();const crc=bytes=>{let c=-1;for(const byte of bytes){c^=byte;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^-1)>>>0;};for(const [name,blob] of entries){const bytes=new Uint8Array(await blob.arrayBuffer()),n=enc.encode(name),sum=crc(bytes),h=new Uint8Array(30+n.length),v=new DataView(h.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint32(14,sum,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,n.length,true);h.set(n,30);local.push(h,bytes);const c=new Uint8Array(46+n.length),w=new DataView(c.buffer);w.setUint32(0,0x02014b50,true);w.setUint16(4,20,true);w.setUint16(6,20,true);w.setUint32(16,sum,true);w.setUint32(20,bytes.length,true);w.setUint32(24,bytes.length,true);w.setUint16(28,n.length,true);w.setUint32(42,offset,true);c.set(n,46);central.push(c);offset+=h.length+bytes.length;}const end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);v.setUint32(12,central.reduce((n,c)=>n+c.length,0),true);v.setUint32(16,offset,true);return new Blob([...local,...central,end],{type:'application/zip'});}
 async function batchExport(){if(exportBusy)return;if(!window.html2canvas)return toast('截图组件尚未载入');syncSheets();const sheets=clone(state.screenshotSheets),entries=[];exportBusy=true;const host=document.createElement('div');host.style.cssText='position:fixed;left:-10000px;top:0';document.body.append(host);let capture;document.body.inert=true;try{await document.fonts.ready;for(let i=0;i<sheets.length;i++){const s=sheetState(sheets[i]);host.style.width=P.devices[s.device].w+'px';toast(`正在生成 ${i+1} / ${sheets.length} 张截图…`);capture=P.mount(host,s,{mode:'screenshot',template:s.template,frame:false});const el=capture.getCapture();await window.FicFonts?.ready(s.phone.font);if(s.phone.font==='custom')await document.fonts.load('15px FicImportedFont');await Promise.all([...el.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));const canvas=await window.html2canvas(el,{scale:P.devices[s.device].scale,backgroundColor:null,logging:false});const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('第 '+(i+1)+' 张截图失败');entries.push([String(i+1).padStart(2,'0')+'-'+s.template+'.png',blob]);capture.destroy();capture=null;}download(await makeZip(entries),filename()+'-screenshots.zip');toast('已导出 '+entries.length+' 张独立 PNG（ZIP）');}catch(e){toast('批量导出失败：'+e.message+'；未下载不完整文件。');}finally{capture?.destroy();host.remove();document.body.inert=false;exportBusy=false;}}

 function structuredMessages(base,d){return `<details data-settings-group="chat-messages"><summary>逐条编辑消息与时间</summary><p class="helper">与上方脚本同步；支持每条消息单独设置时间。</p>${P.parse(d.script).map((m,i)=>{const parts=P.splitMessage(m);return `<div class="message-edit"><label>发送者<input data-msg="${i}" data-msg-key="who" value="${E(m.who)}"></label><label>时间<input data-msg="${i}" data-msg-key="time" value="${E(parts.time||'')}"></label><label>消息<textarea data-msg="${i}" data-msg-key="text">${E(parts.text.replace(/\[附件-[a-z0-9-]+\]$/,'').trimEnd())}</textarea></label><label>此条消息的图片或语音<input type="file" data-message-file="${i}" accept="image/png,image/jpeg,image/webp,image/gif,audio/mpeg,audio/mp4,audio/ogg,audio/wav,audio/webm"></label>${/\[附件-[a-z0-9-]+\]$/.test(parts.text)?`<button type="button" data-remove-attachment="${i}">移除附件</button>`:''}<button type="button" data-delete-msg="${i}">删除此消息</button></div>`;}).join('')}</details>`;}
 $('#editor-form').addEventListener('change',e=>{if(!e.target.dataset.msg)return;const i=+e.target.dataset.msg,rows=P.parse(currentDraft().script),m=rows[i],parts=P.splitMessage(m),marker=parts.text.match(/\[附件-[a-z0-9-]+\]$/)?.[0]||'';let text=parts.text.slice(0,parts.text.length-marker.length).trimEnd(),time=parts.time||'';const key=e.target.dataset.msgKey;if(key==='who')m.who=e.target.value;if(key==='text')text=e.target.value.replaceAll('\n',' ');if(key==='time')time=e.target.value;m.text=(time?'['+time+'] ':'')+text+(marker?' '+marker:'');currentDraft().script=rows.map(m=>m.who+'：'+m.text).join('\n');scheduleSave();render();});
 $('#editor-form').addEventListener('click',e=>{const b=e.target.closest('[data-delete-msg]');if(!b)return;const rows=P.parse(currentDraft().script);const [removed]=rows.splice(+b.dataset.deleteMsg,1);const id=removed?.text.match(/\[附件-([a-z0-9-]+)\]$/)?.[1];if(id)currentDraft().attachments=currentDraft().attachments?.filter(asset=>asset.id!==id)||[];currentDraft().script=rows.map(m=>m.who+'：'+m.text).join('\n');scheduleSave();render();});

 function setAttachment(draft,index,source){
  const rows=P.parse(draft.script),message=rows[index];
  const old=message.text.match(/\[附件-([a-z0-9-]+)\]$/);
  const attachments=(draft.attachments||[]).filter(asset=>asset.id!==old?.[1]&&draft.script.includes('[附件-'+asset.id+']'));
  if(old)message.text=message.text.slice(0,old.index).trimEnd();
  if(source){
   if(attachments.length>=60)throw Error('每个会话最多 60 个附件。');
   const id=crypto.randomUUID();
   attachments.push({id,src:source});
   message.text+=' [附件-'+id+']';
  }
  draft.attachments=attachments;
  draft.script=rows.map(row=>row.who+'：'+row.text).join('\n');
  scheduleSave();
  render();
  $('#editor-form').querySelector('[data-settings-group=chat-messages]')?.setAttribute('open','');
 }
 $('#editor-form').addEventListener('click',event=>{
  const button=event.target.closest('[data-remove-attachment]');
  if(button)setAttachment(currentDraft(),+button.dataset.removeAttachment,'');
 });
 $('#editor-form').addEventListener('change',async event=>{
  const index=event.target.dataset.messageFile;
  const file=event.target.files?.[0];
  if(index===undefined||!file)return;
  const draft=currentDraft(),script=draft.script;
  try{
   let source;
   if(file.type.startsWith('audio/')){
    if(file.size>2*1024*1024)throw Error('语音文件请小于 2 MB。');
    source=await new Promise((resolve,reject)=>{
     const reader=new FileReader();
     reader.onload=()=>resolve(P.audio(reader.result));
     reader.onerror=reject;
     reader.readAsDataURL(file);
    });
    if(!source)throw Error('请选择 MP3、M4A、OGG、WAV 或 WebM 音频。');
   }else source=await readImage(file);
   if(currentDraft()!==draft||draft.script!==script)throw Error('消息已改变，请重新选择附件。');
   setAttachment(draft,+index,source);
  }catch(error){toast(error.message||'无法读取附件。');}
 });

 function commentEditor(base,draft){
  const legacy=Array.isArray(draft.commentItems)?'':field('评论／回帖',base+'.comments',draft.comments,'textarea',['forum','x'].includes(state.template)?'用「用户名：内容」开始新评论。空行或没有用户名的续行保留在同一条评论里。评论行前按 Tab 或输入两个空格，可回复上方最近一条未缩进的评论。':'每行“用户名：内容”，顺序即展示顺序。');
  return legacy+`<div class="actions"><button type="button" id="edit-comment-items">编辑评论头像、账号和回复</button></div>`;
 }
 $('#editor-form').addEventListener('keydown',event=>{
  const field=event.target;
  if(!['forum','x'].includes(state.template)||!field.dataset.path?.endsWith('.comments')||event.key!=='Tab'||event.shiftKey)return;
  const start=field.selectionStart;
  if(start!==field.selectionEnd||(start>0&&field.value[start-1]!=='\n'))return;
  event.preventDefault();
  field.setRangeText('\t',start,start,'end');
  field.dispatchEvent(new Event('input',{bubbles:true}));
 });
 function editComments(){
  const draft=currentDraft();
  const rows=clone(P.commentItems(draft,['forum','x'].includes(state.template)));
  const empty={name:'',handle:'',avatar:'',text:'',parent:null};
  const avatarSources=(state.assetLibrary||[]).map(asset=>[asset.src,asset.name]);
  for(const character of state.characters||[]){
   const avatar=character.profiles?.[state.template]?.avatar||character.avatar;
   if(avatar)avatarSources.push([avatar,character.name]);
  }
  const draw=()=>{
   openPanel('编辑评论与回复',rows.map((row,index)=>`<section class="beta-panel">
    <strong>${index+1}</strong><label>显示名<input data-row="${index}" data-key="name" maxlength="80" value="${E(row.name)}"></label>
    <label>账号 ID<input data-row="${index}" data-key="handle" maxlength="80" value="${E(row.handle)}"></label>
    <label>评论内容<textarea data-row="${index}" data-key="text" maxlength="2000">${E(row.text)}</textarea></label>
    <label>头像<select data-comment-avatar="${index}"><option value="">当前头像</option><option value="-1">移除头像</option>${avatarSources.map(([,name],i)=>`<option value="${i}">${E(name)}</option>`).join('')}</select></label>
    ${row.avatar?`<img class="comment-preview" width="38" height="38" alt="头像" src="${P.image(row.avatar)}">`:''}
    <label>回复给<select data-parent="${index}"><option value="">顶层评论</option>${rows.slice(0,index).map((parent,i)=>parent.parent===null?`<option value="${i}" ${row.parent===i?'selected':''}>${i+1}. ${E(parent.name)}</option>`:'').join('')}</select></label>
    <button type="button" data-remove-comment="${index}">删除评论</button></section>`).join('')+
    '<div class="actions"><button id="add-comment">添加评论</button><button id="save-comments">保存评论</button></div>');
   const panel=$('#info-body');
   panel.querySelectorAll('[data-row]').forEach(input=>input.oninput=()=>{rows[+input.dataset.row][input.dataset.key]=input.value;});
   panel.querySelectorAll('[data-parent]').forEach(input=>input.onchange=()=>{
    const index=+input.dataset.parent;
    if(input.value!==''&&rows.some(row=>row.parent===index)){
     input.value='';toast('这条评论已有回复，请先移走回复。');return;
    }
    rows[index].parent=input.value===''?null:+input.value;
    draw();
   });
   panel.querySelectorAll('[data-comment-avatar]').forEach(input=>input.onchange=()=>{
    if(input.value==='')return;
    rows[+input.dataset.commentAvatar].avatar=avatarSources[+input.value]?.[0]||'';
    draw();
   });
   panel.querySelectorAll('[data-remove-comment]').forEach(button=>button.onclick=()=>{
    const index=+button.dataset.removeComment;
    rows.splice(index,1);
    for(const row of rows){
     if(row.parent===index)row.parent=null;
     else if(row.parent!==null&&row.parent>index)row.parent--;
    }
    draw();
   });
   $('#add-comment').onclick=()=>{
    if(rows.length>=100)return toast('每篇最多 100 条评论和回复。');
    rows.push({...empty});draw();
   };
   $('#save-comments').onclick=()=>{
    if(currentDraft()!==draft)return;
    draft.commentItems=rows;
    scheduleSave();render();$('#info-dialog').close();
   };
  };
  draw();
 }
 $('#editor-form').addEventListener('click',event=>{
  const button=event.target.closest('[data-app-move]');
  if(!button)return;
  const [index,delta]=button.dataset.appMove.split(':').map(Number);
  moveApp(index,index+delta);
 });
 function moveApp(index,target){
  if(!Number.isInteger(index)||!Number.isInteger(target)||index<0||target<0||index>=state.phone.apps.length||target>=state.phone.apps.length||index===target)return;
  const [app]=state.phone.apps.splice(index,1);
  state.phone.apps.splice(target,0,app);
  state.phone.manualAppOrder=true;
  scheduleSave();render();
  $('#editor-form').querySelector(`[data-app-order="${target}"]`)?.setAttribute('open','');
 }
 let draggedApp=null;
 $('#editor-form').addEventListener('dragstart',event=>{
  const row=event.target.closest('summary[draggable]')?.parentElement;
  if(!row?.hasAttribute('data-app-order'))return;
  draggedApp=+row.dataset.appOrder;
  event.dataTransfer.setData('text/plain',row.dataset.appOrder);
  event.dataTransfer.effectAllowed='move';
 });
 $('#editor-form').addEventListener('dragover',event=>{
  if(draggedApp!==null&&event.target.closest('[data-app-order]'))event.preventDefault();
 });
 $('#editor-form').addEventListener('drop',event=>{
  const row=event.target.closest('[data-app-order]');
  if(draggedApp===null||!row)return;
  event.preventDefault();moveApp(draggedApp,+row.dataset.appOrder);draggedApp=null;
 });
 $('#editor-form').addEventListener('dragend',()=>{draggedApp=null;});
 function assetLibrary(){
  openPanel('本机图片素材库',`<p>一次添加多张图片，然后在评论编辑器里选作头像。</p><input id="asset-library-files" aria-label="添加图片" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple><div class="asset-thumbs">${(state.assetLibrary||[]).map((asset,index)=>`<div><img src="${P.image(asset.src)}" alt="${E(asset.name)}"><button data-remove-library="${index}">移除 ${E(asset.name)}</button></div>`).join('')}</div>`);
  $('#asset-library-files').onchange=async event=>{
   const files=[...event.target.files],project=state;
   try{
    if(files.length+(state.assetLibrary?.length||0)>40)throw Error('素材库最多 40 张图片。');
    const incoming=[];
    for(const file of files)incoming.push({name:file.name.slice(0,100),src:await readImage(file)});
    if(state!==project||!$('#info-dialog').open||!$('#asset-library-files'))return;
    state.assetLibrary=[...(state.assetLibrary||[]),...incoming];
    scheduleSave();assetLibrary();
   }catch(error){toast(error.message);}
  };
  $('#info-body').querySelectorAll('[data-remove-library]').forEach(button=>button.onclick=()=>{
   state.assetLibrary.splice(+button.dataset.removeLibrary,1);scheduleSave();assetLibrary();
  });
 }
 $('#asset-library').onclick=assetLibrary;
 $('#editor-form').addEventListener('click',event=>{
  if(event.target.closest('#edit-comment-items'))editComments();
 });

 $('#editor-form').addEventListener('change',async event=>{
  if(event.target.id!=='custom-font-file')return;
  const file=event.target.files?.[0],project=state;
  if(!file)return;
  if(file.size>2*1024*1024)return toast('字体文件请小于 2 MB。');
  try{
   const source=await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(P.customFont(reader.result.replace(/^data:[^;]+;/,'data:font/woff2;')));
    reader.onerror=reject;
    reader.readAsDataURL(file);
   });
   if(!source)throw Error('请选择有效的 WOFF2 字体。');
   const candidate=new FontFace('FicImportedFont',`url('${source}')`);
   await candidate.load();
   if(state!==project)return;
   state.phone.customFont=source;state.phone.font='custom';state.phone.embedFont=false;
   scheduleSave();render();
  }catch{toast('无法读取 WOFF2 字体。');}
 });
 $('#editor-form').addEventListener('click',event=>{
  if(!event.target.closest('#remove-custom-font'))return;
  state.phone.customFont='';state.phone.embedFont=false;
  if(state.phone.font==='custom')state.phone.font='system';
  for(const sheet of state.screenshotSheets)if(sheet.style?.font==='custom')sheet.style.font='system';
  scheduleSave();render();
 });

 function characters(){state.characters??=[];openPanel('角色资料库',`<p>资料随 JSON 工程备份。通用资料用于默认显示，各平台资料可单独覆盖；应用时不会改写故事正文。</p>${state.characters.map((c,i)=>`<div class="beta-panel"><strong>${E(c.name)}</strong><div class="actions"><button data-use-character="${i}:owner">设为手机主人</button><button data-use-character="${i}:partner">设为对方</button><button data-edit-character="${i}">编辑角色</button><button data-delete-character="${i}">删除</button></div></div>`).join('')}<label>姓名<input id="character-name"></label><label>通用头像<input id="character-avatar" type="file" accept="image/png,image/jpeg,image/webp"></label>${Object.entries(P.templates).map(([id,t])=>`<details class="appsettings"><summary>${t.name}</summary><label>平台显示名（选填）<input data-character-platform="${id}" data-character-key="name"></label>${['instagram','x'].includes(id)?`<label>平台账号（选填）<input data-character-platform="${id}" data-character-key="handle"></label>`:''}<label>平台头像（选填）<input type="file" accept="image/png,image/jpeg,image/webp" data-character-avatar="${id}"></label><p class="helper">留空时使用通用资料；账号仅用于作品显示，不连接真实平台。</p></details>`).join('')}<button id="character-add">保存角色</button>`);
 let editIndex=-1;
 $('#character-add').onclick=async()=>{const name=$('#character-name').value.trim();if(!name)return toast('请填写角色姓名');if(editIndex<0&&state.characters.length>=50)return toast('最多五十个角色');try{const previous=state.characters[editIndex],profiles=clone(previous?.profiles||{}),f=$('#character-avatar').files[0];for(const id of Object.keys(P.templates)){const nameEl=$(`[data-character-platform="${id}"][data-character-key="name"]`),handleEl=$(`[data-character-platform="${id}"][data-character-key="handle"]`),imageFile=$(`[data-character-avatar="${id}"]`).files[0];profiles[id]={name:nameEl.value,handle:handleEl?.value||'',avatar:imageFile?await readImage(imageFile):profiles[id]?.avatar||''};}const c={name,profiles,handle:profiles.instagram?.handle||'',avatar:f?await readImage(f):previous?.avatar||''};if(editIndex>=0)state.characters[editIndex]=c;else state.characters.push(c);scheduleSave();characters();}catch(e){toast(e.message);}};
 $('#info-body').querySelectorAll('[data-edit-character]').forEach(b=>b.onclick=()=>{editIndex=+b.dataset.editCharacter;const c=state.characters[editIndex];$('#character-name').value=c.name;for(const id of Object.keys(P.templates)){const profile=c.profiles?.[id]||{};$(`[data-character-platform="${id}"][data-character-key="name"]`).value=profile.name||'';const el=$(`[data-character-platform="${id}"][data-character-key="handle"]`);if(el)el.value=profile.handle||(id==='instagram'?c.handle||'':'');}$('#character-name').focus();});
 $('#info-body').querySelectorAll('[data-use-character]').forEach(b=>b.onclick=()=>{const [i,role]=b.dataset.useCharacter.split(':'),c=state.characters[+i];state[role]=c.name;state[role+'Avatar']=c.avatar;for(const id of Object.keys(P.templates)){const profile=c.profiles?.[id]||{},drafts=[state.drafts[id],...(state.collections?.[id]||[])];for(const d of drafts){if(role==='owner'){d.ownerName=profile.name||c.name;d.authorAvatar=profile.avatar||c.avatar;if(P.templates[id].kind==='social'){if(profile.handle||id==='instagram'&&c.handle)d.handle=profile.handle||c.handle;if(profile.name||c.name)d.name=profile.name||c.name;}}else{d.contactName=profile.name||c.name;d.contactAvatar=profile.avatar||c.avatar;}}}scheduleSave();render();toast('角色资料已应用');});
 $('#info-body').querySelectorAll('[data-delete-character]').forEach(b=>b.onclick=()=>{state.characters.splice(+b.dataset.deleteCharacter,1);scheduleSave();characters();});}

 function chooseNewPhone(){
  openPanel('新建交互手机',`<p>新建时，当前工程会另存到工程库，并沿用手机外观和应用设置。</p>
   <div class="beta-panel"><button type="button" data-new-phone="free">自由探索</button><p>放入聊天、照片和备忘录，让读者按自己的顺序探索。</p></div>
   <div class="beta-panel"><button type="button" data-new-phone="story">剧情探索</button><p>用线索触发消息、解锁应用和分支，最多配置 99 步。</p></div>`);
  const buttons=[...$('#info-body').querySelectorAll('[data-new-phone]')];
  buttons.forEach(button=>button.onclick=()=>newBlankPhone(buttons,button.dataset.newPhone==='story'));
 }
 async function newBlankPhone(buttons,storyEnabled){
  if(!db)return toast('本机存储不可用，请先导出工程备份。');
  const original=state;
  const snapshot=clone(syncSheets());
  const next=clone(snapshot);
  next.title='未命名作品';
  next.mode='phone';
  next.owner='';
  next.partner='';
  next.ownerAvatar='';
  next.partnerAvatar='';
  for(const [platform,defaultDraft] of Object.entries(defaults().drafts)){
   next.drafts[platform]=Object.fromEntries(Object.entries(defaultDraft).map(([key,value])=>[key,typeof value==='boolean'?false:'']));
   next.collections[platform]=[];
  }
  for(const key of ['date','intro','notes','secret','calls','calendar','newMessage','photoCaption'])next.phone[key]='';
  for(const key of ['photos','albums','noteItems'])next.phone[key]=[];
  next.phone.story=P.Story.normalize({enabled:storyEnabled,steps:[]});
  next.phone.rule=false;
  next.phone.lockNotification='';
  next.phone.lockCode='';
  if(next.phone.homeWidgets){next.phone.homeWidgets.location='';next.phone.homeWidgets.noteId='';}
  next.screenshotSheets=[];
  next.activeSheet=0;
  buttons.forEach(button=>button.disabled=true);
  try{
   await new Promise((resolve,reject)=>{
    const transaction=db.transaction('projects','readwrite');
    const id='project-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
    transaction.objectStore('projects').put({...snapshot,_libraryId:id,_savedAt:new Date().toLocaleString()},id);
    transaction.oncomplete=resolve;
    transaction.onabort=()=>reject(transaction.error);
   });
   if(state!==original||JSON.stringify(syncSheets())!==JSON.stringify(snapshot))return toast('已备份原工程。编辑内容有变动，请再点一次新建。');
   state=next;
   $('#info-dialog').close();
   section=storyEnabled?'rules':'appearance';
   storyPage=0;
   undoStack=[];
   redoStack=[];
   lastHistory=JSON.stringify(state);
   recoveryBlocked=false;
   contentIndex=-1;
   previewRoute=next.phone.readerStart||'lock';
   render();
   if(storyEnabled)$('[data-settings-group="phone-story"]').open=true;
   await save();
   if($('#save-status').dataset.status==='saved')toast('空白作品已建立，原工程已另存到工程库。');
  }catch{
   toast('无法备份原工程，请先导出 JSON。');
  }finally{
   buttons.forEach(button=>button.disabled=false);
  }
 }
 $('#version-history').onclick=()=>{
  const language=document.documentElement.lang.split('-')[0];
  const copy={
   zh:['版本日志',
    '交互手机可在自由探索和剧情探索之间切换，已有步骤会保留。剧情上限提高到 99 步，长篇可按范围编辑，并改善了长时间探索后的续玩。',
    '首页可进入工作台或作品区。开放邀请码发布后，受邀作者可生成阅读链接，并选择是否列入公开作品区。',
    '读者可仅看手机屏幕。作品可从锁屏或桌面开始，支持指定开场通知、上滑和数字密码；编辑应用时可直接预览内容。',
    '桌面支持两页滑动、应用排序和 Dock。可添加时间日期与地点、备忘录和相册小组件。',
    '会话列表显示最新消息；可逐条添加图片与语音，并在输入框展示未发送草稿。统一了聊天气泡间距。',
    '剧情消息可发到指定会话、延时撤回或提供预写回复。提示卡可切换语言。',
    '评论可设置账号、头像和回复，并从本机素材库选择图片。theqoo 以楼号引用呈现回复。',
    '作品字号支持 7–30 pt，正文、联系人备注和账号名称一起缩放。可导入 WOFF2 字体并选择是否嵌入互动 HTML。',
    '工作台设置分区可折叠，新增撤销／重做快捷键、重做确认、当前模板清空和保留设置的新建空白作品。',
    '示例《雨》可切换四种语言，保留原有的 13 步与分支试玩。',
    '开放测试版，支持聊天截图和互动手机作品。'],
   en:['Changelog',
    'Switch between free and story exploration while keeping existing steps. Stories support 99 steps, range-based editing and improved resuming after long play sessions.',
    'Open the studio or gallery from the homepage. When invite publishing is enabled, creators can share a story link and choose whether to list it publicly.',
    'Reader view can show just the screen. Start on the lock screen or home screen, choose an opening notification and set a numeric passcode. App editing can preview content directly.',
    'Swipe between two home pages, reorder apps and configure the Dock. Add time, date and location, Notes and Photos widgets.',
    'Chat lists show the latest message. Add images and voice to individual messages, display an unsent draft and preview consistent bubble spacing.',
    'Story messages can target a conversation, be withdrawn on a timer or offer a scripted reply. Readers can change the hint language.',
    'Set usernames, avatars and replies for comments. Choose avatars from the local media library. Theqoo replies reference a numbered comment.',
    'Work size supports 7–30 pt and scales text, contact names and accounts together. Import a WOFF2 font and optionally embed it in interactive HTML.',
    'Collapse studio settings by category. Use undo and redo shortcuts, confirm redo, clear the current template or start a blank story with existing settings.',
    'Rain is available in four languages, with the 13-step and branching demos.',
    'Public beta with chat screenshots and interactive phone stories.'],
   ko:['업데이트 기록',
    '기존 단계를 유지하면서 자유 탐색과 스토리 탐색을 전환할 수 있습니다. 최대 99단계를 구간별로 편집할 수 있고 진행 상황 복원을 개선했습니다.',
    '홈에서 작업실이나 작품 목록으로 이동할 수 있습니다. 초대 게시가 활성화되면 초대 코드로 링크를 만들고 공개 목록에 표시할지 선택할 수 있습니다.',
    '독자 화면에 휴대전화 화면만 표시할 수 있습니다. 잠금 화면이나 홈 화면에서 시작하며 알림과 숫자 암호를 설정할 수 있습니다. 앱 편집 중에는 바로 미리 볼 수 있습니다.',
    '홈 화면 두 페이지를 넘기고 앱 순서와 Dock을 바꿀 수 있습니다. 시간·날짜·장소, 메모와 사진 위젯을 추가할 수 있습니다.',
    '채팅 목록에 최신 메시지가 표시됩니다. 개별 메시지에 사진과 음성을 추가하고, 보내지 않은 초안을 표시할 수 있습니다. 말풍선 간격을 통일했습니다.',
    '스토리 메시지의 대화방을 지정하고, 일정 시간 후 회수하거나 미리 작성한 답장을 제공할 수 있습니다. 힌트 언어도 바꿀 수 있습니다.',
    '댓글의 계정명, 프로필 사진과 답글을 설정하고 로컬 자료함에서 이미지를 고를 수 있습니다. 더쿠 답글에는 댓글 번호가 표시됩니다.',
    '7–30 pt로 본문, 연락처 이름과 계정명의 크기를 함께 조절할 수 있습니다. WOFF2 글꼴을 가져오고 HTML에 포함할지 선택할 수 있습니다.',
    '편집 설정을 항목별로 접을 수 있습니다. 실행 취소·다시 실행 단축키, 다시 실행 확인, 현재 템플릿 비우기와 기존 설정으로 새 작품 만들기를 추가했습니다.',
    '예제 「비」는 네 가지 언어로 13단계 이야기와 분기를 체험할 수 있습니다.',
    '채팅 스크린샷과 인터랙티브 휴대전화 스토리를 공개 베타로 제공합니다.'],
   ja:['更新履歴',
    '既存のステップを保持したまま自由探索とストーリー探索を切り替えられます。最大99ステップを範囲ごとに編集でき、続きからの再開を改善しました。',
    'ホームから作業画面と作品一覧を開けます。招待投稿が有効な場合は作品リンクを発行し、公開一覧に掲載するか選べます。',
    '読者には画面だけを表示できます。開始画面、最初の通知、数字のパスコードを設定できます。アプリ編集時には内容を直接プレビューできます。',
    'ホーム画面は2ページあり、アプリの順序やDockを変更できます。時刻・日付・場所、メモと写真のウィジェットを追加できます。',
    'トーク一覧に最新メッセージを表示します。メッセージごとに画像と音声を添付でき、未送信の下書きも表示できます。吹き出しの間隔を統一しました。',
    'ストーリーメッセージの送信先、時間差での取り消し、返信文を設定できます。ヒントの言語も切り替えられます。',
    'コメントにアカウント名、アイコンと返信を設定でき、素材ライブラリから画像を選べます。theqooの返信には元のコメント番号を表示します。',
    '本文、連絡先名とアカウント名を7–30 ptの設定に合わせて拡大・縮小します。WOFF2を読み込み、HTMLに埋め込むか選べます。',
    '編集設定を項目ごとに折りたためます。元に戻す・やり直すショートカット、やり直し時の確認、テンプレートの消去、設定を引き継いだ新規作成を追加しました。',
    'サンプル「雨」は4言語で、13ステップと分岐を体験できます。',
    'チャット画像とインタラクティブなスマホ作品に対応した公開ベータです。']
  }[language];
  const [title,latest,...earlier]=copy||['Changelog'];
  const releases=[
   ['v1.0.2-beta.1','2026-11-08',latest?[latest]:[],true],
   ['v1.0.1-beta.1','2026-11-07',earlier.slice(0,-1)],
   ['v1.0.0-beta.1','2026-11-06',earlier.slice(-1)]
  ];
  openPanel(title,`<div class="release-list">${releases.map(([version,date,changes,open])=>`
   <details class="release-entry"${open?' open':''}>
    <summary><strong>${version}</strong><time datetime="${date}">${date}</time></summary>
    <ul>${changes.map(change=>`<li>${E(change)}</li>`).join('')}</ul>
   </details>`).join('')}</div>`);
  $('#info-dialog').dataset.fixedLanguage='';
 };
 $('#editor-form').addEventListener('click',event=>{
  const button=event.target.closest('#blank-phone');
  if(button)chooseNewPhone();
 });

 function listProjects(){if(!db)return Promise.resolve([]);return new Promise((resolve,reject)=>{const r=db.transaction('projects').objectStore('projects').getAll();r.onsuccess=()=>resolve(r.result.filter(v=>v&&v._libraryId));r.onerror=()=>reject(r.error);});}
 async function projects(){try{const list=await listProjects();openPanel('本机工程库',`<p>工程仍保存在此浏览器；清理网站数据会丢失，请另存 JSON 备份。</p><button id="project-store">将当前工程另存到工程库</button>${list.map((v,i)=>`<div class="beta-panel"><strong>${E(v.title)}</strong><p>${E(v._savedAt)}</p><button data-project-load="${i}">载入此副本</button></div>`).join('')}`);$('#project-store').onclick=()=>{if(!db)return toast('本机存储不可用');const snapshot=clone(syncSheets());snapshot._libraryId='project-'+Date.now();snapshot._savedAt=new Date().toLocaleString();const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(snapshot,snapshot._libraryId);tx.oncomplete=()=>{toast('工程副本已保存');projects();};tx.onerror=()=>toast('保存失败，请导出 JSON');};$('#info-body').querySelectorAll('[data-project-load]').forEach(b=>b.onclick=()=>{if(!confirm('载入此副本？建议先将当前工程另存副本或导出备份。'))return;state=normalise(list[+b.dataset.projectLoad]);contentIndex=-1;recoveryBlocked=false;remember();save();render();$('#info-dialog').close();});}catch(e){toast('无法读取工程库：'+e.message);}}
 function preflight(){const warnings=storyWarnings();let size=new Blob([JSON.stringify(syncSheets())]).size;for(const id of Object.keys(P.templates))for(const d of P.items(state,id)){if(P.templates[id].kind==='chat'){const names=new Set([state.owner,state.partner,'我','나','me',...(d.members||[]).map(m=>m.name)]);if(P.parse(d.script).some(m=>!names.has(m.who)))warnings.push(P.templates[id].name+' 中存在未登记的发送者，请检查成员姓名。');if(d.script?.includes('[图片]')&&!d.media&&!d.images?.length)warnings.push(P.templates[id].name+' 使用了图片占位，但未上传图片。');}}if(size>20*1024*1024)warnings.push('工程较大，建议压缩图片，并检查托管的单文件上限。');openPanel('导出前检查',`<p>工程体积约 ${(size/1024/1024).toFixed(2)} MB；导出 HTML 会额外包含播放器。</p>${warnings.length?'<ul>'+warnings.map(w=>'<li>'+E(w)+'</li>').join('')+'</ul>':'<p>未发现当前检查覆盖的问题。仍请完整试玩分支与结局；此检查不保证所有路径均可到达。</p>'}${state.phone.story.enabled?'<button id="goto-rules">打开剧情设置</button>':''}`);const rulesButton=$('#goto-rules');if(rulesButton)rulesButton.onclick=()=>{syncSheets();state.mode='phone';section='rules';render();$('#info-dialog').close();};}

 function albumEditor(){state.phone.albums??=[];return `<hr class="formdivider"><h3>自定义相册</h3><p class="helper">照片可加入多个相册。删除相册只移除分组，不删除照片。</p>${state.phone.albums.map((album,i)=>`<details class="appsettings"><summary>${E(album.name||'未命名相册')} · ${album.photoIndexes.length}</summary>${field('相册名称',`phone.albums.${i}.name`,album.name)}<div class="album-photo-options">${state.phone.photos.map((src,j)=>`<label class="checkrow"><input type="checkbox" data-album-member="${i}:${j}" ${album.photoIndexes.includes(j)?'checked':''}><img src="${P.image(src)}" alt="照片 ${j+1}" width="48" height="48">${j+1}</label>`).join('')}</div><button type="button" data-remove-collection="${i}">删除此相册（保留照片）</button></details>`).join('')}<button type="button" id="album-add">新建相册</button>`;}
 $('#editor-form').addEventListener('click',e=>{if(e.target.closest('#album-add')){state.phone.albums??=[];if(state.phone.albums.length>=50)return toast('最多五十个相册');state.phone.albums.push({id:'album-'+Date.now(),name:'新相册',photoIndexes:[]});previewRoute='albums';scheduleSave();render();}const remove=e.target.closest('[data-remove-collection]');if(remove){state.phone.albums.splice(+remove.dataset.removeCollection,1);previewRoute='albums';scheduleSave();render();}});
 $('#editor-form').addEventListener('change',e=>{const value=e.target.dataset.albumMember;if(value===undefined)return;const [i,j]=value.split(':').map(Number),album=state.phone.albums[i];album.photoIndexes=e.target.checked?[...new Set([...album.photoIndexes,j])].sort((a,b)=>a-b):album.photoIndexes.filter(v=>v!==j);previewRoute='albums';scheduleSave();renderPreview();});

 function notice(kind){const language=document.documentElement.lang,english=!language.startsWith('zh'),t=(zh,en)=>english?en:zh;
 if(kind==='privacy')openPanel(t('隐私与数据','Privacy & data'),`<p>${t('当前版本：v1.0.2-beta.1。以下说明针对当前版本的创作编辑器。','Current version: v1.0.2-beta.1. This notice describes the current editor.')}</p><h3>${t('创作内容保存在当前浏览器','Your work stays in this browser')}</h3><p>${t('编辑器使用当前浏览器的本机存储保存工程、素材和设置。日常编辑和自动保存只使用本机存储。主动发布时上传的数据见下文。FicPhone 不提供云端备份。','The editor stores projects, media and settings in this browser’s local storage. Editing and autosave use local storage. See below for the data sent when you choose to publish. FicPhone does not provide cloud backups.')}</p><h3>${t('保存不等于备份','Saving is not a backup')}</h3><p>${t('清理网站数据、浏览器隐私模式、存储空间不足、换浏览器、设备或网址，都可能使原草稿不可用。请定期导出 JSON 工程备份，并自行保存。','Clearing site data, private browsing, storage limits, or changing browser, device or site address can make drafts unavailable. Export project JSON backups regularly and keep them safely.')}</p><h3>${t('导出与分享由你控制','You control exports and sharing')}</h3><p>${t('导出会在本机生成 PNG、ZIP、JSON 或 HTML 文件。受邀作者点击「发布」时，FicPhone 会把读者版内容和作品信息上传至发布服务，用于生成可分享链接。可编辑草稿、工程库与素材库本身保存在当前浏览器。','Export generates PNG, ZIP, JSON or HTML files on your device. When invited creators choose Publish, FicPhone sends the reader edition and its listing details to the publishing service. Editable drafts, project backups and the media library stay in the current browser.')}</p><h3>${t('访问日志与第三方链接','Hosting logs and external links')}</h3><p>${t('网站启用访问统计时，Cloudflare Web Analytics 会接收网页访问和性能指标。互动 HTML 导出不包含统计代码。GitHub Pages 也可能为安全目的记录访问者 IP。','When site analytics are enabled, Cloudflare Web Analytics receives page visit and performance metrics. Standalone HTML exports exclude analytics. GitHub Pages may also record visitor IP addresses for security.')}</p><p><a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages" target="_blank" rel="noopener">GitHub Pages · Data collection</a></p>`);
 else openPanel(t('版权与素材','Copyright & materials'),`<p>FicPhone · © 2026 anycolorulike</p><p>${t('FicPhone 的品牌、原创界面设计与使用文档由 anycolorulike 创作。使用、转载或修改相关内容，请遵循随附许可；未注明授权的内容请先联系作者。','FicPhone branding, original interface design and documentation are by anycolorulike. Reuse and modifications are subject to the accompanying licenses; contact the author for materials without stated permission.')}</p><h3>${t('第三方素材分别适用其权利与许可','Third-party materials retain their own terms')}</h3><p>${t('平台名称、商标、应用图标、人物照片和第三方代码、字体不因出现在 FicPhone 中而归工具作者所有。四款新增字体按 SIL Open Font License 提供，许可说明随网站与使用这些字体的 HTML 导出保留。','Platform names, trademarks, app icons, photographs, third-party code and fonts are not owned by the tool author merely because they appear here. The four added fonts use the SIL Open Font License; notices are included with the site and HTML exports using them.')}</p><p>${t('示例人物照片仅用于展示创作效果，相关权利归原权利人所有。','Sample photographs demonstrate creative features. Their respective rights remain with their rights holders.')}</p><h3>${t('作者创作的作品','Creators’ works')}</h3><p>${t('使用 FicPhone 不会把你的故事、文字或原创素材转让给工具作者。本说明也不替你获得所用第三方素材的授权。','Using FicPhone does not transfer your story, writing or original materials to the tool author. This notice does not grant rights in third-party materials you choose to use.')}</p>`);}

})();
