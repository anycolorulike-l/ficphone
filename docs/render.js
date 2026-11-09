function PocketRuntime(StoryFactory) {
 const Story=(StoryFactory||(typeof window!=='undefined'?window.FicStoryRuntime:null))();
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const image=v=>typeof v==='string'&&/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(v)?v:'';
 const devices={
  iphone18pro:{name:'iPhone 18 Pro',w:402,h:874,pixels:[1206,2622],scale:3,os:'ios',radius:55},
  iphone18promax:{name:'iPhone 18 Pro Max',w:440,h:956,pixels:[1320,2868],scale:3,os:'ios',radius:55},
  iphone17:{name:'iPhone 17',w:402,h:874,pixels:[1206,2622],scale:3,os:'ios',radius:55},
  iphone17pro:{name:'iPhone 17 Pro',w:402,h:874,pixels:[1206,2622],scale:3,os:'ios',radius:55},
  iphone17promax:{name:'iPhone 17 Pro Max',w:440,h:956,pixels:[1320,2868],scale:3,os:'ios',radius:55},
  iphone16:{name:'iPhone 16',w:393,h:852,pixels:[1179,2556],scale:3,os:'ios',radius:55},
  iphone16pro:{name:'iPhone 16 Pro',w:402,h:874,pixels:[1206,2622],scale:3,os:'ios',radius:55},
  iphone16promax:{name:'iPhone 16 Pro Max',w:440,h:956,pixels:[1320,2868],scale:3,os:'ios',radius:55},
  iphone15:{name:'iPhone 15',w:393,h:852,pixels:[1179,2556],scale:3,os:'ios',radius:55},
  iphone15pro:{name:'iPhone 15 Pro',w:393,h:852,pixels:[1179,2556],scale:3,os:'ios',radius:55},
  iphone15promax:{name:'iPhone 15 Pro Max',w:430,h:932,pixels:[1290,2796],scale:3,os:'ios',radius:55},
  galaxys26:{name:'Samsung Galaxy S26',w:360,h:780,pixels:[1080,2340],scale:3,os:'android',radius:32},
  galaxys26ultra:{name:'Samsung Galaxy S26 Ultra',w:360,h:780,pixels:[1440,3120],scale:4,os:'android',radius:22}
 };
 const builtInIcons=typeof PocketIcons!=='undefined'?PocketIcons:typeof window!=='undefined'?window.PocketIcons||{}:{};
 const templates={kakao:{name:'KakaoTalk',kind:'chat',mark:'TALK'},line:{name:'LINE',kind:'chat',mark:'LINE'},imessage:{name:'信息 / iMessage',kind:'chat',mark:'●'},instagram:{name:'Instagram',kind:'social',mark:'◎'},x:{name:'Twitter / X',kind:'social',mark:'𝕏'},forum:{name:'theqoo',kind:'social',mark:'theqoo'}};
 const appTypes={kakao:'KakaoTalk',line:'LINE',imessage:'信息',album:'照片',notes:'备忘录',calendar:'日历',calls:'电话',instagram:'Instagram',x:'X',forum:'theqoo'};
 const appNames={
  en:{kakao:'KakaoTalk',line:'LINE',imessage:'Messages',album:'Photos',notes:'Notes',calendar:'Calendar',calls:'Phone',instagram:'Instagram',x:'X',forum:'theqoo'},
  zh:{kakao:'KakaoTalk',line:'LINE',imessage:'信息',album:'照片',notes:'备忘录',calendar:'日历',calls:'电话',instagram:'Instagram',x:'X',forum:'theqoo'},
  ko:{kakao:'카카오톡',line:'LINE',imessage:'메시지',album:'사진',notes:'메모',calendar:'캘린더',calls:'전화',instagram:'Instagram',x:'X',forum:'더쿠'},
  ja:{kakao:'カカオトーク',line:'LINE',imessage:'メッセージ',album:'写真',notes:'メモ',calendar:'カレンダー',calls:'電話',instagram:'Instagram',x:'X',forum:'theqoo'}
 };
 const ui={
  en:{back:'Back',search:'Search',chats:'Chats',friends:'Friends',more:'More',openchat:'Open chats',today:'Today',recent:'Recent',all:'All',missed:'Missed',edit:'Edit',calls:'Calls',contacts:'Contacts',keypad:'Keypad',voicemail:'Voicemail',folders:'Folders',recentNotes:'Previous 7 Days',notesCount:'notes',noNotes:'No notes',noText:'No additional text',library:'Library',collections:'Collections',photo:'Photo',home:'Home',comments:'Comments',reply:'Reply',writeComment:'Add a comment…',like:'Like',likes:'likes',posts:'Posts',followers:'Followers',following:'Following',forYou:'For you',post:'Post',members:'Members',board:'Free board',views:'Views',read:'Read',delivered:'Delivered',messages:'Messages',sms:'Text Message',month:'June',weekdays:'S,M,T,W,T,F,S',calendarToday:'Today',event:'Event',noEvents:'No events',inactive:'This app is not activated in this story.',privateNotes:'Notes',photosCount:'photos',profile:'Profile',cafeHome:'My cafés',notifications:'Notifications',favorite:'Favorites',callDetails:'Call details',mobile:'mobile'},
  zh:{back:'返回',search:'搜索',chats:'聊天',friends:'好友',more:'更多',openchat:'开放聊天',today:'今天',recent:'最近',all:'全部',missed:'未接',edit:'编辑',calls:'通话',contacts:'通讯录',keypad:'拨号键盘',voicemail:'语音留言',folders:'文件夹',recentNotes:'最近七天',notesCount:'篇备忘录',noNotes:'没有备忘录',noText:'没有其他文本',library:'图库',collections:'精选集',photo:'照片',home:'首页',comments:'评论',reply:'回复',writeComment:'添加评论…',like:'赞',likes:'次赞',posts:'帖子',followers:'粉丝',following:'关注',forYou:'推荐',post:'帖子',members:'成员',board:'自由讨论',views:'浏览',read:'已读',delivered:'已送达',messages:'信息',sms:'短信',month:'六月',weekdays:'日,一,二,三,四,五,六',calendarToday:'今天',event:'日程',noEvents:'没有日程',inactive:'这部手机未启用此应用。',privateNotes:'备忘录',photosCount:'张照片',profile:'个人主页',cafeHome:'我的咖啡馆',notifications:'通知',favorite:'收藏',callDetails:'通话详情',mobile:'手机'},
  ko:{back:'뒤로',search:'검색',chats:'채팅',friends:'친구',more:'더보기',openchat:'오픈채팅',today:'오늘',recent:'최근 통화',all:'전체',missed:'부재중',edit:'편집',calls:'통화',contacts:'연락처',keypad:'키패드',voicemail:'음성 사서함',folders:'폴더',recentNotes:'최근 7일',notesCount:'개의 메모',noNotes:'메모 없음',noText:'추가 텍스트 없음',library:'보관함',collections:'모음',photo:'사진',home:'홈',comments:'댓글',reply:'답글',writeComment:'댓글을 입력하세요',like:'좋아요',likes:'명이 좋아합니다',posts:'게시물',followers:'팔로워',following:'팔로잉',forYou:'추천',post:'게시물',members:'멤버',board:'자유게시판',views:'조회',read:'읽음',delivered:'전송됨',messages:'메시지',sms:'문자 메시지',month:'6월',weekdays:'일,월,화,수,목,금,토',calendarToday:'오늘',event:'일정',noEvents:'일정 없음',inactive:'이 이야기에서는 사용하지 않는 앱입니다.',privateNotes:'메모',photosCount:'장의 사진',profile:'프로필',cafeHome:'내 카페',notifications:'알림',favorite:'즐겨찾기',callDetails:'통화 정보',mobile:'휴대전화'},
  ja:{back:'戻る',search:'検索',chats:'トーク',friends:'友だち',more:'その他',openchat:'オープンチャット',today:'今日',recent:'履歴',all:'すべて',missed:'不在着信',edit:'編集',calls:'通話',contacts:'連絡先',keypad:'キーパッド',voicemail:'留守番電話',folders:'フォルダ',recentNotes:'過去7日間',notesCount:'件のメモ',noNotes:'メモなし',noText:'追加のテキストなし',library:'ライブラリ',collections:'コレクション',photo:'写真',home:'ホーム',comments:'コメント',reply:'返信',writeComment:'コメントを追加…',like:'いいね',likes:'件のいいね',posts:'投稿',followers:'フォロワー',following:'フォロー中',forYou:'おすすめ',post:'ポスト',members:'メンバー',board:'自由掲示板',views:'閲覧',read:'既読',delivered:'配信済み',messages:'メッセージ',sms:'テキストメッセージ',month:'6月',weekdays:'日,月,火,水,木,金,土',calendarToday:'今日',event:'予定',noEvents:'予定なし',inactive:'この作品では有効になっていないアプリです。',privateNotes:'メモ',photosCount:'枚の写真',profile:'プロフィール',cafeHome:'マイカフェ',notifications:'通知',favorite:'お気に入り',callDetails:'通話の詳細',mobile:'携帯電話'}
 };
 const defaultDock=['calls','imessage','notes','kakao'];
 function appName(app,phone={}){const lang=appNames[app.language]?app.language:appNames[phone.language]?phone.language:'ko';return String(app.name||'').trim()||(appNames[lang][app.type]||'App');}
 function activeApp(state,type){return (state.phone.apps||[]).some(a=>a.enabled&&(a.target||a.type)===type);}
 function batteryState(value,mode='normal'){const level=Math.max(0,Math.min(100,Math.round(Number(value)||0)));const status=mode==='charging'?'charging':mode==='lowPower'?'lowPower':level<=20?'low':'normal';return {level,status,fill:22*level/100,color:status==='charging'?'#34c759':status==='lowPower'?'#ffd60a':status==='low'?'#ff453a':'currentColor'};}
 function readerState(state){const s=JSON.parse(JSON.stringify(state));delete s.characters;delete s.screenshotSheets;delete s.screenshotGroups;delete s.activeSheet;delete s.assetLibrary;if(!s.phone.embedFont||s.phone.font!=='custom')s.phone.customFont='';for(const id of Object.keys(s.collections||{}))if(!activeApp(s,id))s.collections[id]=[];if(s.phone.story)for(const step of s.phone.story.steps||[])for(const a of step.actions||[]){if(['message','prepareReply'].includes(a.type)&&!activeApp(s,a.app))a.text='';if(a.type==='note'&&!activeApp(s,'notes')){a.title='';a.text='';}}for(const id of Object.keys(templates))if(!activeApp(s,id))for(const key of Object.keys(s.drafts[id]||{}))s.drafts[id][key]=typeof s.drafts[id][key]==='boolean'?false:'';if(!activeApp(s,s.phone.chatPlatform))s.phone.newMessage='';for(const id of ['kakao','line','imessage']){
   for(const draft of [s.drafts[id],...(s.collections?.[id]||[])]){
    if(Array.isArray(draft?.attachments)){
     draft.attachments=draft.attachments.filter(asset=>String(draft.script||'').includes('[附件-'+asset.id+']'));
    }
   }
  }
  if(!activeApp(s,'album')){s.phone.photos=[];s.phone.albums=[];}if(!activeApp(s,'notes')){s.phone.noteItems=[];s.phone.notes='';s.phone.secret='';}for(const id of ['calls','calendar'])if(!activeApp(s,id))s.phone[id]='';if(!activeApp(s,'calendar'))delete s.phone.calendarDate;return s;}
 const paths={back:'M15 5l-7 7 7 7',search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M15 15l6 6',menu:'M4 6h16M4 12h16M4 18h16',plus:'M12 4v16M4 12h16',smile:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M7 14q5 6 10 0M8 8h.01M16 8h.01',hash:'M9 3L7 21M17 3l-2 18M3 8h18M2 16h18',phone:'M5 3l4 4-2 3q2 5 7 7l3-2 4 4q-2 5-7 2Q3 16 2 7q0-4 3-4',camera:'M3 7h4l2-3h6l2 3h4v14H3zM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8',user:'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 22v-3a8 8 0 0 1 16 0v3',chat:'M3 3h18v14H9l-6 4z',more:'M4 12h.01M12 12h.01M20 12h.01',heart:'M12 21L3 12C-3 4 8-2 12 6c4-8 15-2 9 6z',comment:'M3 3h18v14H9l-6 4z',share:'M3 10L22 2l-7 20-4-9zM11 13L22 2',bookmark:'M6 3h12v19l-6-4-6 4z',repeat:'M3 8l4-4 4 4M7 4v12h9M21 16l-4 4-4-4M17 20V8H8',arrow:'M12 20V4M5 11l7-7 7 7',wifi:'M2 8q10-9 20 0M5 12q7-6 14 0M9 16q3-3 6 0M12 20h.01',signal:'M4 20v-4M9 20v-8M14 20V8M19 20V4',home:'M3 11l9-8 9 8M5 10v11h14V10',grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',bell:'M5 16V9a7 7 0 0 1 14 0v7l2 3H3zM10 22h4',lock:'M6 10V7a6 6 0 0 1 12 0v3M4 10h16v12H4z',note:'M4 3h16v18H4zM7 8h10M7 12h10M7 16h6'};
 const icon=(name,cls='')=>`<svg class="pi ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.grid}"/></svg>`;
 paths.mic='M9 4a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0zM6 10v2a6 6 0 0 0 12 0v-2M12 18v4M8 22h8';
 const css=String.raw`
.pocket-device .album-collections strong,.pocket-device .album-collections small{display:block;text-align:left;margin:6px 3px;font-size:14px}.pocket-device .album-collections small{color:#888;font-size:12px}.pocket-device .empty-album{min-height:90px;display:grid;place-items:center;background:#f1f3f6;color:#8b929a;border-radius:9px}

.pocket-device .wallpaper-layer{position:absolute;inset:0;background-size:cover;z-index:-1;pointer-events:none}

.reader-hints .hint-language{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;margin:4px 0 8px}.reader-hints .hint-language select{font:inherit;max-width:100%}
.pocket-device .story-notification-banner{position:absolute;top:47px;left:12px;right:12px;padding:9px 12px;text-align:left;display:grid;gap:2px;border:0;border-radius:12px;box-shadow:0 3px 10px #0003;background:#fffffff0;color:#202030;z-index:10}.pocket-device .story-notification-banner span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.pocket-device .appglyph{position:relative}.pocket-device .appbutton{position:relative}.pocket-device .app-unread{position:absolute;left:calc(50% + 20px);top:-5px;z-index:1;padding:1px 4px;border-radius:9px;background:#e54952;color:white;font:11px/15px sans-serif}
.pocket-device .calendar-widget{display:grid;gap:3px;margin:4px 4px 10px;padding:12px 16px;max-width:94%;width:fit-content;text-align:left;border:0;border-radius:18px;background:#fffdfa;color:#29242c;flex:none}.pocket-device .calendar-widget small{color:#b02032}.pocket-device .calendar-widget span{font-size:12px}
.pocket-device .story-reply{margin:4px 10px;padding:8px;text-align:left;border:1px solid #abbbe1;border-radius:10px;background:#eef3ff;flex:none}.pocket-device .story-reply span{color:#1849a3;font-size:12px}
.pocket-device .unsent-draft{flex:1;min-width:0;color:#20242b;white-space:pre-wrap;overflow-wrap:anywhere;overflow:auto;max-height:100%;text-align:left}.pocket-device .inputshape:has(.unsent-draft){height:auto;min-height:36px;max-height:92px}.pocket-device .compose:has(.unsent-draft){height:auto;min-height:53px}.pocket-device .comment-row p{white-space:pre-wrap;overflow-wrap:anywhere}
.pocket-device .thread-reply{margin-left:20px;border-left:2px solid #e3e7ef;padding-left:10px}
.pocket-device .voice-message{display:none}
.pocket-device .work-watermark{position:absolute;bottom:38px;right:12px;padding:3px 7px;border-radius:5px;background:#fff9;color:#333b;font:11px/1.5 -apple-system,sans-serif;z-index:7;pointer-events:none;max-width:70%;overflow-wrap:anywhere}

.pocket-device .bubble,.pocket-device .tweet-body,.pocket-device .post-copy,.pocket-device .notepaper,.pocket-device .qoo-body,.pocket-device .qoo-comment p,.pocket-device .comment-row p,.pocket-device .feed-tweet-body,.pocket-device .unsent-draft{font-family:var(--work-font)!important;font-size:var(--work-size)!important}.pocket-device .media-carousel{display:flex;overflow-x:auto;scroll-snap-type:x mandatory}.pocket-device .media-carousel>.postmedia{flex:0 0 100%;min-width:100%;scroll-snap-align:start}.pocket-device .typing-bubble{display:flex;gap:5px;padding:12px;background:#9aaab3;border-radius:15px;width:max-content;margin:12px}.pocket-device .typing-bubble i{width:5px;height:5px;border-radius:50%;background:#fee500;animation:typing-dot 1s infinite alternate}.pocket-device .typing-bubble i:nth-child(2){animation-delay:.2s}.pocket-device .typing-bubble i:nth-child(3){animation-delay:.4s}.pocket-device.imessage .typing-bubble{background:#e9e9eb}.pocket-device.imessage .typing-bubble i{background:#888}.pocket-device.line .typing-bubble i{background:#fff}.pocket-device .item-picker{display:flex;gap:6px;overflow:auto;flex:none;padding:8px}.pocket-device .item-picker button{padding:6px 10px;background:#f1f4fa;border-radius:10px;font-size:12px;white-space:nowrap}.pocket-device [data-like][aria-pressed=true]{color:#ed375c}.pocket-fit + .reader-hints{z-index:8;font:12px/1.6 -apple-system,BlinkMacSystemFont,sans-serif;width:max-content;max-width:min(320px,100%);max-height:min(60dvh,420px);overflow:auto;flex-shrink:0;text-align:left;color:#002fa7}.pocket-fit + .reader-hints>button,.pocket-fit + .reader-hints>div{background:rgba(255,255,255,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#002fa7;padding:10px 12px;border:1px solid #ffffffa0;border-radius:12px;box-shadow:0 2px 12px #0002}.pocket-fit + .reader-hints>button{display:block;margin-left:auto}.pocket-fit + .reader-hints button{font:inherit;cursor:pointer}.pocket-fit + .reader-hints>div{white-space:pre-wrap;margin-top:6px;max-width:300px;overflow-wrap:anywhere}.pocket-fit + .reader-hints>div button{display:block;margin-top:10px;font-size:11px;border:1px solid #dce3f1;border-radius:7px;background:#edf2ff;color:#002fa7;padding:6px 9px}.pocket-fit + .reader-hints [data-hints]{touch-action:none}.pocket-fit + .reader-hints .hint-drag{display:flex;align-items:center;gap:6px;cursor:grab;touch-action:none;user-select:none;color:#536780;font-size:11px;border-bottom:1px solid #53678025;padding:0 0 6px;margin-bottom:7px}.pocket-fit + .reader-hints .hint-drag:active{cursor:grabbing}.pocket-fit + .reader-hints .hint-drag:focus-visible{outline:2px solid #002fa7}.pocket-fit + .reader-hints .hint-step{display:block;color:#657087;font-size:11px;margin-bottom:6px}@keyframes typing-dot{to{opacity:.25;transform:translateY(-3px)}}@media(prefers-reduced-motion:reduce){.pocket-device .typing-bubble i{animation:none}}

.pocket-device .battery-svg{width:29px;height:16px;overflow:visible;flex:none;color:inherit}.pocket-device .battery-svg.charging{width:37px}.pocket-device .battery-num{fill:#161616;font-family:-apple-system,BlinkMacSystemFont,sans-serif}.pocket-device .battery-svg.normal.high .battery-num{fill:#fff}.pocket-device.lockdevice .battery-svg.normal.high .battery-num{fill:#222}.pocket-device.lockdevice .battery-svg.normal.low-fill .battery-num{fill:#fff}.pocket-device .battery-svg.low .battery-num{fill:#ff453a}

.pocket-device .story-overlay{position:absolute;inset:59px 0 34px;z-index:9;background:#12203555;display:flex;align-items:center;justify-content:center;padding:22px;backdrop-filter:blur(8px)}.pocket-device .story-dialog{max-height:100%;overflow:auto;width:100%;background:#fff;color:#172038;border-radius:22px;padding:25px;text-align:center;box-shadow:0 15px 50px #0002}.pocket-device .story-dialog h2{font-size:21px;margin:14px 0}.pocket-device .story-dialog p{white-space:pre-wrap;font-size:15px;line-height:1.7;margin:0 0 20px}.pocket-device .story-dialog button{display:block;width:100%;padding:12px 14px;background:#edf2ff;color:#002fa7;border-radius:12px;margin-top:10px;font-size:14px}.pocket-device .story-dialog small{color:#002fa7;letter-spacing:2px;font-size:11px}

.pocket-fit,.pocket-fit *{box-sizing:border-box}.pocket-fit{position:relative;overflow:hidden;max-width:100%;margin:0 auto;font:16px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;color:#191919;color-scheme:light}.pocket-device{position:relative;transform-origin:top left;display:flex;flex-direction:column;overflow:hidden;background:#fff;color:#191919;isolation:isolate}.pocket-device.framed{border-radius:48px;box-shadow:inset 0 0 0 1px #0003}.pocket-fit.frame-host{padding:8px;background:#29282d;border-radius:55px;box-shadow:0 0 0 1px #aaa4ad,0 16px 35px #29202e20}.pocket-device button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;border-radius:0}.pocket-device .pi{width:24px;height:24px;flex:none;vertical-align:middle}.pocket-device .sysbar{height:59px;flex:none;position:relative;display:flex;align-items:center;justify-content:space-between;padding:0 27px;font-size:15px;font-weight:600;background:inherit;z-index:2}.pocket-device .island{position:absolute;width:126px;height:37px;border-radius:25px;background:#080808;left:50%;top:11px;transform:translateX(-50%)}.pocket-device .sysright{display:flex;gap:4px;align-items:center}.pocket-device .sysright .pi{width:17px;height:17px;stroke-width:2}.pocket-device .battery{background:#272727;border:1px solid #777;color:#fff;min-width:25px;height:14px;border-radius:4px;font-size:10px;display:grid;place-items:center}.pocket-device .gesture{height:34px;flex:none;display:flex;justify-content:center;align-items:flex-end;padding-bottom:8px;background:inherit}.pocket-device .gesture button{width:134px;height:5px;background:currentColor;border-radius:6px}.pocket-device .screen-main{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}.pocket-device.long{height:auto!important;min-height:852px}.pocket-device.long .screen-main{flex:none;overflow:visible}.pocket-device.long .chat-scroll,.pocket-device.long .social-scroll{overflow:visible;flex:none;min-height:650px}.pocket-device .screen-head{height:50px;flex:none;padding:0 14px;display:flex;align-items:center;gap:12px;background:inherit}.pocket-device .screen-head strong{font-size:18px;font-weight:500;flex:1}.pocket-device .screen-head button{display:grid;place-items:center;width:29px;height:40px}.pocket-device .headicons{display:flex;gap:18px;align-items:center}.pocket-device .avatar{width:42px;height:42px;flex:none;border-radius:15px;background:#e5e7eb;color:#8c909a;display:grid;place-items:center;overflow:hidden}.pocket-device .avatar img{width:100%;height:100%;object-fit:cover}.pocket-device .avatar.round{border-radius:50%}.pocket-device .chat-scroll{padding:20px 13px 35px;overflow-y:auto;flex:1;min-height:0;scrollbar-width:thin}.pocket-device .date-divider{display:table;margin:0 auto 27px;padding:5px 12px;border-radius:20px;font-size:11px;color:#384b58;background:#9eb3c5}.pocket-device .msg{display:flex;gap:9px;align-items:flex-start}.pocket-device .msg.mine{justify-content:flex-end}.pocket-device .msg.grouped .avatar{visibility:hidden}.pocket-device .msg-col{display:flex;flex-direction:column;max-width:calc(100% - 51px);min-width:0}.pocket-device .msg.mine .msg-col{max-width:88%;align-items:flex-end}.pocket-device .sender{font-size:12px;color:#354b5c;margin-bottom:6px}.pocket-device .msgline{display:flex;align-items:flex-end;gap:5px;min-width:0}.pocket-device .msg.mine .msgline{flex-direction:row-reverse}.pocket-device .bubble{position:relative;background:#fff;border-radius:12px;padding:9px 11px;font-size:15px;overflow-wrap:anywhere;white-space:pre-wrap;min-width:0}.pocket-device .bubble:before{content:'';position:absolute;left:-5px;top:8px;border-top:9px solid #fff;border-left:9px solid transparent}.pocket-device .msg.mine .bubble{background:#fee500}.pocket-device .msg.mine .bubble:before{left:auto;right:-5px;border-left:0;border-right:9px solid transparent;border-top-color:#fee500}.pocket-device .msg.grouped .bubble:before{display:none}.pocket-device .msgmeta{display:flex;flex-direction:column;align-items:flex-end;gap:1px;white-space:nowrap;font-size:10px;color:#485b68;padding-bottom:1px}.pocket-device .unread{font-size:12px;color:#ffe500}.pocket-device .bubble img{max-width:190px;width:100%;display:block;border-radius:7px}.pocket-device .compose{height:53px;background:#fafafa;display:flex;align-items:center;gap:12px;padding:8px 12px;flex:none;color:#888}.pocket-device .inputshape{flex:1;height:36px;border:1px solid #d9d9d9;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:0 9px}.pocket-device .inputshape .pi{width:22px;height:22px}.pocket-device.kakao{background:#b2c7d9}.pocket-device.kakao .gesture{background:#fafafa}.pocket-device.line{background:#8cabd9}.pocket-device.line .screen-head{background:#f5f5f5}.pocket-device.line .avatar{border-radius:50%}.pocket-device.line .msg.mine .bubble{background:#8de055}.pocket-device.line .msg.mine .bubble:before{border-top-color:#8de055}.pocket-device.line .date-divider{background:#6d8eb46b;color:#fff}.pocket-device.line .unread{color:#fff}.pocket-device.line .gesture{background:#fafafa}.pocket-device.imessage{background:#fff}.pocket-device.imessage .screen-head{height:86px;background:#f7f7f7;border-bottom:1px solid #ddd}.pocket-device.imessage .screen-head strong{font-size:13px;text-align:center}.pocket-device.imessage .screen-head>button{color:#007aff}.pocket-device.imessage .headicons{width:29px;color:#007aff}.pocket-device.imessage .chat-scroll{padding-top:18px}.pocket-device.imessage .msg-col{max-width:82%}.pocket-device.imessage .msg .avatar,.pocket-device.imessage .sender{display:none}.pocket-device.imessage .bubble{background:#e9e9eb;border-radius:18px;padding:10px 13px}.pocket-device.imessage .msg.mine .bubble{background:#007aff;color:#fff}.pocket-device.imessage .bubble:before{display:none}.pocket-device.imessage .msgmeta{display:none}.pocket-device.imessage .date-divider{background:transparent;color:#8a8a8e;font-size:11px;margin-bottom:20px}.pocket-device .im-read{font-size:11px;text-align:right;color:#888;margin-top:4px;margin-right:4px}.pocket-device.imessage .inputshape{border-radius:22px;justify-content:space-between;color:#aaa;font-size:15px}.pocket-device .sendcircle{background:#007aff;color:#fff;border-radius:50%;padding:3px}.pocket-device .sendcircle .pi{height:20px;width:20px}.pocket-device .social-scroll{overflow-y:auto;flex:1;min-height:0;background:#fff}.pocket-device .social-head{height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid #eee;flex:none}.pocket-device .igword{font-family:Georgia,serif;font-size:27px;font-style:italic;font-weight:600}.pocket-device .post-author{display:flex;align-items:center;gap:9px;padding:13px 14px;font-size:13px}.pocket-device .post-author strong{flex:1;font-weight:600}.pocket-device .post-author .avatar{width:34px;height:34px}.pocket-device .postmedia{display:block;width:100%;aspect-ratio:1;object-fit:cover;background:#e9e4ed}.pocket-device .post-placeholder{aspect-ratio:1;background:linear-gradient(155deg,#c9d7e0 0%,#8e9ba5 45%,#bcc5bb 45%,#dcd1bd 70%);display:flex;align-items:flex-end;padding:25px;color:#fff;font-family:Georgia,serif;font-size:25px}.pocket-device .post-actions{display:flex;gap:16px;padding:12px 14px}.pocket-device .post-actions .pi:last-child{margin-left:auto}.pocket-device .post-copy{padding:0 14px 12px;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere}.pocket-device .post-copy strong{font-weight:600}.pocket-device .post-time{padding:0 14px 12px;font-size:11px;color:#999}.pocket-device .comment-row{padding:9px 14px;display:flex;gap:9px;font-size:13px;overflow-wrap:anywhere}.pocket-device .comment-row .avatar{width:28px;height:28px;border-radius:50%}.pocket-device .comment-row p{margin:0}.pocket-device .bottomtabs{height:50px;display:flex;justify-content:space-around;align-items:center;background:#fff;border-top:1px solid #eee;flex:none}.pocket-device .tweet{padding:16px}.pocket-device .tweet .post-author{padding:0 0 13px}.pocket-device .tweet .post-author .avatar{width:42px;height:42px}.pocket-device .tweet-author{flex:1;font-size:15px}.pocket-device .tweet-author small{display:block;font-size:13px;color:#7a838d}.pocket-device .tweet-body{font-size:19px;white-space:pre-wrap;overflow-wrap:anywhere;margin:6px 0 15px}.pocket-device .tweet .postmedia{border-radius:16px;aspect-ratio:4/3}.pocket-device .tweet-time{font-size:13px;color:#75818b;border-bottom:1px solid #eee;padding:12px 0}.pocket-device .tweet-counts{font-size:13px;padding:14px 0;border-bottom:1px solid #eee;color:#67717b}.pocket-device .tweet-counts b{color:#191919}.pocket-device .tweet-icons{display:flex;justify-content:space-between;color:#687783;padding:12px 6px;border-bottom:1px solid #eee}.pocket-device .forum-banner{padding:16px;background:#f4f6f7;color:#445b63;border-bottom:1px solid #e3e7e8}.pocket-device .forum-title{font-size:22px;line-height:1.4;padding:18px 16px 8px;font-weight:600;overflow-wrap:anywhere}.pocket-device .forum-meta{padding:0 16px 16px;color:#8a9297;font-size:12px;border-bottom:1px solid #eee}.pocket-device .forum-body{padding:20px 16px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:15px}.pocket-device .forum-reply{padding:14px 16px;background:#fafbfc;border-top:1px solid #e6eaec;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere}.pocket-device .forum-reply small{display:block;color:#87939a;font-size:11px;margin-bottom:5px}.pocket-device .ioshead{height:58px;display:flex;align-items:center;padding:0 17px;gap:12px;background:#fff;border-bottom:1px solid #eee;flex:none}.pocket-device .ioshead strong{flex:1;font-size:20px;font-weight:600}.pocket-device .ioshead button{color:#007aff;display:flex;align-items:center;min-height:40px}.pocket-device .phonewall{flex:1;min-height:0;background:linear-gradient(150deg,#e2b7c6,#c8c3e4 45%,#70829b);background-size:cover;background-position:center;overflow-y:auto;padding:22px;color:#fff}.pocket-device .phonewall .wall-date{text-align:center;font-size:16px;margin-top:30px;text-shadow:0 1px 8px #0004}.pocket-device .wall-time{text-align:center;font-size:76px;letter-spacing:-4px;font-weight:500;text-shadow:0 1px 12px #0002}.pocket-device .unlock{width:100%;background:#ffffffd9;color:#292633;border-radius:22px;padding:20px;margin-top:170px;text-align:left;box-shadow:0 3px 20px #0001}.pocket-device .unlock small{display:block;font-size:12px;color:#777}.pocket-device .desktop-clock{padding:12px 2px 22px;font-size:22px;font-weight:500}.pocket-device .appgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px 9px}.pocket-device .appbutton{display:flex;flex-direction:column;align-items:center;gap:7px;min-width:0;font-size:11px;color:#fff;text-shadow:0 1px 4px #0005}.pocket-device .appglyph{width:57px;height:57px;border-radius:14px;background:#fff;display:grid;place-items:center;color:#555;text-shadow:none;font-size:24px;overflow:hidden;box-shadow:0 3px 9px #0001}.pocket-device .appglyph img{width:100%;height:100%;object-fit:cover}.pocket-device .appglyph.kakao{background:#fee500;color:#35221c;font-weight:700;font-size:12px}.pocket-device .appglyph.line{background:#06c755;color:#fff;font-size:13px;font-weight:700}.pocket-device .appglyph.imessage{background:#38c861;color:#fff}.pocket-device .appglyph.album{color:#da687e}.pocket-device .appglyph.notes{background:linear-gradient(#ffda63 0 28%,#fff 28%);color:#aaa}.pocket-device .appglyph.calendar{color:#e04444;font-size:28px}.pocket-device .appglyph.calls{background:#39c85b;color:#fff}.pocket-device .appglyph.instagram{background:linear-gradient(35deg,#f9b546,#d84185,#7256be);color:#fff}.pocket-device .appglyph.x{background:#111;color:#fff}.pocket-device .read-notification{display:block;width:100%;padding:15px;background:#ffffffe8;border-radius:19px;margin-top:24px;color:#292633;text-align:left;font-size:14px}.pocket-device .read-notification small{display:block;color:#777;font-size:11px;margin-bottom:4px}.pocket-device .albumgrid{padding:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;overflow-y:auto;align-content:start;flex:1}.pocket-device .albumgrid button{display:block;min-width:0}.pocket-device .albumgrid img{width:100%;aspect-ratio:1;object-fit:cover;display:block}.pocket-device .albumgrid .post-placeholder{font-size:17px;padding:15px}.pocket-device .photodetail{padding:12px;overflow-y:auto;flex:1}.pocket-device .photodetail img{width:100%;height:auto;display:block;border-radius:3px}.pocket-device .photodetail .photocaption{font-size:13px;color:#777;text-align:center;padding:14px 4px}.pocket-device .notepaper{padding:22px;font-size:17px;white-space:pre-wrap;overflow-wrap:anywhere;flex:1;overflow-y:auto;background:#fffdf5}.pocket-device .record{padding:18px;border-bottom:1px solid #e9e9ed;white-space:pre-wrap;overflow-wrap:anywhere}.pocket-device .record small{display:block;color:#888;font-size:12px}.pocket-device .listroom{display:flex;align-items:center;gap:12px;width:100%;padding:15px 17px;text-align:left}.pocket-device .roomcopy{flex:1;min-width:0;font-size:16px}.pocket-device .roomcopy small{display:block;color:#8a8a8e;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px;margin-top:5px}.pocket-device .roomtime{font-size:11px;color:#999}.pocket-device .fill{flex:1;min-height:0;overflow-y:auto}.pocket-device .kakaonav{display:flex;justify-content:space-around;align-items:center;height:57px;background:#f9f9f9;border-top:1px solid #eee;color:#777;font-size:10px;flex:none}.pocket-device .kakaonav span{display:grid;place-items:center;gap:4px}.pocket-device.lockdevice{background:linear-gradient(150deg,#e2b7c6,#c8c3e4 45%,#70829b);background-size:cover;background-position:center;color:#fff}.pocket-device.lockdevice .phonewall{background:none}.pocket-device.lockdevice .gesture{background:transparent}.pocket-device.lockdevice .battery{background:#fff;color:#333}.pocket-device.lockdevice .sysright{color:#fff}.pocket-device .blockedapp{padding:30px 22px;text-align:center;color:#888;font-size:14px}.pocket-device .blockedapp .pi{margin-bottom:14px}.pocket-device .story-end{font-size:11px;color:#8b8294;text-align:center;padding:14px;background:#faf9fb}
/* Unified device geometry: bezel, rounded corners and the entire screen scale together. */
.pocket-fit{overflow:visible}.pocket-fit.frame-host{padding:0;background:none;border-radius:0;box-shadow:none}
.pocket-shell{position:relative;transform-origin:top left;box-sizing:border-box;background:transparent}
.pocket-shell.hardware{background:#161618;box-shadow:0 0 0 .8px #7e7b83,0 14px 36px #342b4026}
.pocket-shell.hardware:before,.pocket-shell.hardware:after{content:'';position:absolute;width:2px;background:#66616a;border-radius:2px;left:-2px}
.pocket-shell.hardware:before{top:126px;height:28px}.pocket-shell.hardware:after{top:175px;height:58px}
.pocket-device{font:16px/1.38 -apple-system,BlinkMacSystemFont,"Helvetica Neue","Apple SD Gothic Neo","Noto Sans KR",sans-serif;transform:none;box-shadow:none}
.pocket-device.framed{box-shadow:none}.pocket-device .sysbar{height:62px;padding:0 29px 0 32px;font-size:16px;font-weight:600;letter-spacing:-.45px;align-items:flex-start;padding-top:20px}
.pocket-device .sysbar .sysright{gap:5px;padding-top:2px;letter-spacing:0}.pocket-device .sysright .pi{width:17px;height:17px;stroke-width:2.2}
.pocket-device .island{top:11px;width:126px;height:37px}.pocket-device .battery{position:relative;min-width:25px;height:13px;font-size:10px;line-height:1;border:0;border-radius:3.5px}
.pocket-device .battery:after{content:'';position:absolute;right:-2px;top:4px;width:1.5px;height:5px;border-radius:1px;background:#777}
.pocket-device .screen-head{height:48px;padding:0 15px;gap:10px}.pocket-device .screen-head strong{font-size:18px;letter-spacing:-.35px}
.pocket-device .social-head{height:46px}.pocket-device .ioshead{height:46px;padding:0 16px}.pocket-device .ioshead strong{font-size:17px;font-weight:600}
.pocket-device .gesture{height:34px;padding-bottom:8px}.pocket-device .gesture button{width:134px;height:5px;opacity:.95}
.pocket-device .avatar{width:40px;height:40px;border-radius:15px}.pocket-device .msg-col{max-width:calc(100% - 49px)}
.pocket-device .msg.mine .msg-col{max-width:83%}.pocket-device .bubble{font-size:16px;line-height:1.35;padding:9px 11px;border-radius:12px}
.pocket-device .chat-scroll{padding:16px 13px 28px}.pocket-device .date-divider{margin-bottom:24px;font-size:11px;padding:4px 12px}
.pocket-device .sender{font-size:12px;margin-bottom:5px}.pocket-device .msgmeta{font-size:10px}
.pocket-device .phonewall.homewall{padding:22px 25px 0;display:flex;flex-direction:column;overflow-y:auto;background:transparent}
.pocket-device.home-device,.pocket-device.lockdevice{background:radial-gradient(ellipse at 88% 20%,#c6c3ff 0%,transparent 45%),radial-gradient(ellipse at 14% 56%,#d6b7de 0%,transparent 50%),linear-gradient(170deg,#8991d5,#b5b1d9 48%,#555c9d);background-size:cover;background-position:center;color:#fff}
.pocket-device.home-device .sysbar,.pocket-device.home-device .gesture{background:transparent}
.pocket-device.home-device .battery,.pocket-device.lockdevice .battery{background:#fff;color:#646290}.pocket-device.home-device .battery:after,.pocket-device.lockdevice .battery:after{background:#fff9}
.pocket-device .appgrid{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:17px;row-gap:23px;align-content:start}
.pocket-device .appbutton{font-size:11px;line-height:1.2;gap:6px;font-weight:400;letter-spacing:-.15px}
.pocket-device .appglyph{width:60px;height:60px;border-radius:14px;box-shadow:0 2px 4px #28203e16;font-weight:400}
.pocket-device .appglyph img{width:100%;height:100%;object-fit:cover;display:block}.pocket-device .appglyph.calendar{display:flex;flex-direction:column;justify-content:center;background:#fff;gap:0}
.pocket-device .appglyph.calendar small{font-size:11px;color:#f04446;line-height:1.2}.pocket-device .appglyph.calendar b{font-size:36px;color:#151515;line-height:1;font-weight:300;letter-spacing:-2px}
.pocket-device .home-bottom{margin-top:auto;padding-top:20px}.pocket-device .home-search{display:block;width:74px;height:27px;margin:0 auto 18px;background:#ffffff30;border-radius:18px;color:#fff;font-size:11px}
.pocket-device .home-search .pi{width:12px;height:12px;margin-right:4px}.pocket-device .home-dock{display:flex;justify-content:space-evenly;gap:12px;background:#ffffff35;border:1px solid #ffffff25;border-radius:30px;padding:16px 10px;margin:0 -12px 0;min-height:92px;align-items:center}
.pocket-device .home-dock .appbutton>span:last-child{display:none}.pocket-device .home-dock .appbutton{gap:0}.pocket-device .home-dock .appglyph{box-shadow:0 2px 5px #2d254915}
.pocket-device .wall-date{font-size:20px!important;font-weight:500}.pocket-device .wall-time{font-size:82px;font-weight:600;line-height:1.15;letter-spacing:-4px}
.pocket-device .phonewall.lockwall{padding:15px 22px;position:relative;display:flex;flex-direction:column;background:transparent}
.pocket-device .lockwall .wall-date{margin-top:27px}.pocket-device .unlock{margin-top:70px;padding:15px 17px;border-radius:22px;background:#ffffffcc;box-shadow:none;font-size:14px}
.pocket-device .unlock small{font-size:11px;color:#625b70;margin-bottom:5px}.pocket-device .lock-bottom{margin-top:auto;padding:30px 10px 13px;display:flex;justify-content:space-between;align-items:center}
.pocket-device .lock-bottom button{display:grid;place-items:center;width:48px;height:48px;background:#34324c60;border-radius:50%;color:#fff}
.pocket-device .lock-intro{color:white;text-align:center;white-space:pre-wrap;overflow-wrap:anywhere;margin:18px 0 0}.pocket-device .lock-code{display:grid;justify-items:center;align-content:center;gap:16px;flex:1;min-height:0;padding:10px 16px;color:white;background:#171a3480;text-align:center}
.pocket-device .lock-code label{font-size:21px;font-weight:600}
.pocket-device .lock-code input{position:absolute;width:1px;height:1px;clip-path:inset(50%)}
.pocket-device .pin-dots{display:flex;gap:15px}
.pocket-device .pin-dot{width:13px;height:13px;border:1.5px solid #fff;border-radius:50%}
.pocket-device .pin-dot.filled{background:white}
.pocket-device .lock-code [data-pin-error]{min-height:1.4em;margin:0;font-size:13px;color:#ffe1e2}
.pocket-device .pin-keys{display:grid;grid-template-columns:repeat(3,65px);gap:12px 20px;justify-items:center;align-items:center}
.pocket-device .lock-code button{background:none;border:0;color:inherit;cursor:pointer}
.pocket-device .pin-keys [data-pin-digit]{width:65px;height:65px;border-radius:50%;background:#ffffff32;display:grid;place-content:center;text-align:center}
.pocket-device .pin-keys [data-pin-digit]:active{background:#ffffff75}
.pocket-device .pin-keys b{font-size:29px;font-weight:400;line-height:1}
.pocket-device .pin-keys small{font-size:8px;letter-spacing:1px;height:10px;font-weight:600}
.pocket-device .pin-keys .pin-action{font-size:12px}
.pocket-device .home-widgets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px}
.pocket-device .home-widget{grid-column:span 2;height:104px;border:0;border-radius:17px;overflow:hidden;text-align:left;padding:11px 13px;background:#ffffffdf;color:#252936;display:flex;flex-direction:column;justify-content:center;min-width:0}
.pocket-device .widget-overview strong{font-size:30px;line-height:1.05}.pocket-device .widget-overview span{font-size:12px;margin-top:5px}.pocket-device .widget-overview small{font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pocket-device .widget-photo{padding:0;cursor:pointer}.pocket-device .widget-photo img{width:100%;height:100%;object-fit:cover}
.pocket-device .widget-note{grid-column:span 4;cursor:pointer;justify-content:flex-start;background:#fffbed}.pocket-device .widget-note small{color:#775916}.pocket-device .widget-note strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pocket-device .widget-note span{white-space:pre-wrap;overflow:hidden;overflow-wrap:anywhere;font-size:12px}
.pocket-device .home-pages{flex:1;min-height:0;overflow:hidden;touch-action:pan-y}
.pocket-device .home-track{height:100%;display:flex;transition:transform .22s ease}
.pocket-device .home-page{flex:0 0 100%;min-width:0;overflow:auto;scrollbar-width:none;padding:6px 3px}
.pocket-device .home-controls{display:flex;justify-content:center;align-items:center;gap:8px;margin-bottom:5px}
.pocket-device .home-controls .home-search{margin:0}
.pocket-device .home-page-dot{display:grid;place-items:center;width:25px;height:28px;border:0;background:none;cursor:pointer}
.pocket-device .home-page-dot::before{content:'';width:7px;height:7px;border-radius:50%;background:#fff7;box-shadow:0 0 2px #0007}
.pocket-device .home-page-dot[aria-pressed=true]::before{background:white}
@media(prefers-reduced-motion:reduce){.pocket-device .home-track{transition:none}}
.pocket-device .lock-hint{background:none;border:0;cursor:pointer;text-align:center;font-size:12px;color:#fff9;padding-top:12px}.pocket-device .read-notification{background:#ffffffdf;box-shadow:0 3px 12px #3b335714;margin-top:18px}
/* Notes: list and individual notes, not a single generic text panel. */
.pocket-device.notes-device{background:#f2f2f7}.pocket-device .notes-toolbar{height:45px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;flex:none;color:#b98a08}
.pocket-device .notes-toolbar button{display:flex;align-items:center;gap:3px;color:#b98a08;min-height:40px;font-size:16px}.pocket-device .notes-toolbar .pi{width:24px;height:24px}
.pocket-device .notes-toolbar .note-tools{display:flex;gap:22px;align-items:center}.pocket-device .notes-list{flex:1;overflow-y:auto;padding:0 16px 12px}
.pocket-device .notes-title{font-size:34px;line-height:1.1;font-weight:700;letter-spacing:-1px;margin:7px 0 15px}
.pocket-device .notes-search{display:flex;align-items:center;gap:7px;color:#88888e;background:#e4e4e9;border-radius:11px;padding:9px 10px;font-size:16px;margin-bottom:24px}
.pocket-device .notes-search .pi{width:18px;height:18px}.pocket-device .notes-group-label{font-size:21px;font-weight:700;margin:0 0 10px 10px}
.pocket-device .notes-rows{border-radius:12px;background:#fff;overflow:hidden}
.pocket-device .note-row{display:block;width:100%;padding:13px 15px!important;text-align:left;border-bottom:1px solid #e8e8ec!important;background:#fff!important}
.pocket-device .note-row:last-child{border:0!important}.pocket-device .note-row strong{display:block;font-size:16px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pocket-device .note-row p{font-size:14px;color:#8e8e93;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:3px 0 0}
.pocket-device .note-row time{color:#89898d;margin-right:7px}.pocket-device .notes-footer{display:flex;align-items:center;justify-content:space-between;color:#b98a08;padding:10px 20px;height:47px;flex:none}
.pocket-device .notes-footer small{font-size:12px;color:#65656c;margin:auto}.pocket-device .notes-footer .pi{width:24px;height:24px}
.pocket-device.note-detail-device{background:#fff}.pocket-device .note-detail{padding:7px 22px 24px;flex:1;overflow-y:auto;white-space:pre-wrap;overflow-wrap:anywhere}
.pocket-device .note-timestamp{color:#94949a;font-size:12px;text-align:center;margin:5px 0 23px}.pocket-device .note-detail h2{font-size:28px;font-weight:700;letter-spacing:-.5px;line-height:1.2;margin:0 0 12px}
.pocket-device .note-body{font-size:17px;line-height:1.5;color:#1c1c1e}.pocket-device .note-bottom{display:flex;justify-content:space-between;align-items:center;padding:8px 24px;height:44px;color:#b98a08;flex:none}
.pocket-device .note-bottom span{font-size:18px}.pocket-device .photo-head{padding:14px 20px 10px;font-size:32px;font-weight:700}
.pocket-device .albumgrid{grid-template-columns:repeat(3,minmax(0,1fr));padding:3px;gap:2px}.pocket-device .albumgrid .post-placeholder{font-size:13px;padding:10px}
.pocket-device .photos-tabs{display:flex;justify-content:space-around;border-top:1px solid #eee;padding:12px;font-size:12px;color:#007aff}
/* Android hardware has a camera hole and its own status/navigation metrics. */
.pocket-device.android .sysbar{height:34px;padding:10px 21px 0;font-size:12px;letter-spacing:0}.pocket-device.android .sysright .pi{width:14px;height:14px}
.pocket-device .camera-hole{position:absolute;left:50%;top:9px;transform:translateX(-50%);background:#090909;border:1px solid #3a3a3a;width:11px;height:11px;border-radius:50%}
.pocket-device.android .gesture{height:24px;padding-bottom:5px}.pocket-device.android .gesture button{width:105px;height:4px}
.pocket-device.android .phonewall.homewall{padding-top:32px}.pocket-device.android .appglyph{border-radius:19px;width:55px;height:55px}
.pocket-device.android .appgrid{gap:24px 14px}.pocket-device.android .home-dock{background:#ffffff16;border:0;border-radius:25px;min-height:83px}
.pocket-device.android .notes-toolbar,.pocket-device.android .notes-footer,.pocket-device.android .note-bottom{color:#d66a38}
.pocket-device .notes-search input{font:inherit;color:#1c1c1e;background:none;border:0;outline-offset:2px;padding:0;min-width:0;width:100%;border-radius:0}
.pocket-device [hidden]{display:none!important}.pocket-device .search-apps .appbutton{color:#222;text-shadow:none}
.pocket-device.lockdevice .sysbar,.pocket-device.lockdevice .gesture{background:transparent}
.pocket-device.long{min-height:var(--screen-h)}
.pocket-device.imessage .im-contact{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;flex:1;font-size:12px;font-weight:400}
.pocket-device.imessage .im-contact .avatar{width:40px;height:40px;border-radius:50%;background:#a2a6af;color:#fff}
.pocket-device.imessage .im-contact .avatar .pi{width:26px;height:26px}
.pocket-device.imessage .im-contact span{display:flex;align-items:center;gap:1px}.pocket-device.imessage .im-contact span .pi{transform:rotate(180deg);width:11px;height:11px;color:#888}
.pocket-device.imessage .imessage-header{padding-top:0;padding-bottom:8px}.pocket-device.imessage .bubble{font-size:17px;line-height:1.3}
/* App-specific reading interfaces. */
.pocket-device.ios .appglyph.imessage>img{transform:scale(1.3334)}
.pocket-device .brand-message-icon{width:100%;height:100%;display:block}
.pocket-device .native-topline{display:flex;justify-content:space-between;align-items:center;padding:0 18px;height:38px;color:#007aff;font-size:16px;flex:none}
.pocket-device .native-title{font-size:34px;font-weight:700;letter-spacing:-1px;line-height:1.15;padding:2px 18px 12px}
.pocket-device .native-search{margin:0 16px 12px;border-radius:11px;padding:8px 10px;background:#efeff3;color:#8e8e93;display:flex;align-items:center;gap:7px}
.pocket-device .native-search input{background:none;border:0;padding:0;min-width:0;outline-offset:2px;font:inherit;color:#191919;width:100%;border-radius:0}
.pocket-device .native-search .pi{width:19px;height:19px}.pocket-device .listroom{padding:13px 16px;gap:12px}
.pocket-device .listroom .avatar{width:50px;height:50px;border-radius:19px}.pocket-device .listroom .roomcopy{font-size:16px;font-weight:600;overflow:hidden}
.pocket-device .listroom .roomcopy small{font-weight:400;font-size:13px;color:#8b8b90;line-height:1.3;margin-top:5px;max-width:none}
.pocket-device .listroom .roomtime{align-self:flex-start;margin-top:3px;font-size:11px;min-width:37px;text-align:right}
.pocket-device .listroom .roomline{border-bottom:1px solid #efeff0;display:flex;flex:1;min-width:0;padding-bottom:14px;gap:9px}
.pocket-device .unreadbadge{display:table;background:#ff594f;color:#fff;font-size:11px;line-height:17px;min-width:17px;border-radius:20px;margin:6px 0 0 auto;text-align:center}
.pocket-device .kakao-list-top{height:52px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;flex:none}
.pocket-device .kakao-list-top strong{font-size:26px;font-weight:700;letter-spacing:-1px}.pocket-device .list-actions{display:flex;gap:20px;align-items:center}
.pocket-device .kakao-list-tabs{display:flex;gap:9px;padding:10px 17px 15px;font-size:13px;color:#848484;flex:none}
.pocket-device .kakao-list-tabs span{padding:6px 12px;background:#f5f5f5;border-radius:18px}.pocket-device .kakao-list-tabs span:first-child{background:#282828;color:#fff}
.pocket-device .kakaonav{height:61px}.pocket-device .kakaonav span{font-size:10px}.pocket-device .kakaonav span.active{color:#171717}
.pocket-device .message-list .avatar{border-radius:50%;background:#999ca5;color:#fff}.pocket-device .message-list .listroom{padding-top:10px;padding-bottom:3px}
.pocket-device .message-list .roomcopy small{font-size:15px}.pocket-device .message-list .roomtime{font-size:12px;color:#8e8e93;min-width:56px}
.pocket-device .line-list .native-title{font-size:27px;padding-top:12px}.pocket-device .line-list .avatar{border-radius:50%}
.pocket-device .line-list .native-search{background:#f6f6f6}.pocket-device .line-list .roomtime{color:#aaa}
.pocket-device .sms-list .native-title{font-size:37px;font-weight:400;padding:45px 23px 35px}.pocket-device .sms-list .native-search{border-radius:22px;background:#f3f3f6}
.pocket-device.samsungmessages{background:#fff}.pocket-device.samsungmessages .screen-head{height:65px;border-bottom:1px solid #f0f0f0}
.pocket-device.samsungmessages .chat-scroll{background:#fff}.pocket-device.samsungmessages .date-divider{background:none;color:#888;font-size:11px}
.pocket-device.samsungmessages .msg .avatar,.pocket-device.samsungmessages .sender{display:none}.pocket-device.samsungmessages .msg-col{max-width:81%}
.pocket-device.samsungmessages .bubble{background:#f0f0f3;border-radius:19px;padding:11px 14px;font-size:16px;line-height:1.4}
.pocket-device.samsungmessages .bubble:before{display:none}.pocket-device.samsungmessages .msg.mine .bubble{background:#d9ecff;color:#172836}
.pocket-device.samsungmessages .msgmeta{font-size:10px;color:#999}.pocket-device.samsungmessages .unread{color:#8c8c91}
.pocket-device.samsungmessages .compose{background:#fff;height:60px}.pocket-device.samsungmessages .inputshape{border:0;background:#f4f4f6;border-radius:24px;justify-content:space-between;height:43px}
.pocket-device .native-bottom{display:flex;justify-content:space-around;align-items:center;flex:none;border-top:1px solid #e9e9ed;background:#fafafa;height:57px;color:#999}
.pocket-device .native-bottom span{display:grid;place-items:center;font-size:10px;gap:4px}.pocket-device .native-bottom span.selected{color:#007aff}
.pocket-device .call-controls{display:flex;justify-content:space-between;align-items:center;margin:5px 18px 17px}
.pocket-device .call-segment{display:flex;border-radius:8px;background:#eeeeef;padding:2px;font-size:13px}
.pocket-device .call-segment button{padding:4px 15px;border-radius:6px}.pocket-device .call-segment button.selected{background:#fff;box-shadow:0 1px 3px #0002}
.pocket-device .callrow{display:flex;width:100%;align-items:center;padding:0 16px;text-align:left;gap:10px;min-height:66px}
.pocket-device .callrow .pi{color:#a4a4aa;width:18px;height:18px}.pocket-device .callrow .calltext{padding:11px 0;border-bottom:1px solid #e9e9ed;flex:1;min-width:0}
.pocket-device .callrow strong{font-size:17px;font-weight:600}.pocket-device .callrow.missed strong{color:#ff3b30}
.pocket-device .callrow small{display:block;color:#909095;font-size:13px;margin-top:3px}.pocket-device .callrow time{font-size:13px;color:#96969b}
.pocket-device .callrow time{text-align:right}.pocket-device .callrow time small{font-size:11px;margin-top:1px}
.pocket-device .callrow .info{width:20px;height:20px;display:grid;place-items:center;border:1.5px solid #007aff;color:#007aff;border-radius:50%;font-size:12px;margin-left:4px}
.pocket-device .contact-detail{background:#f2f2f7;flex:1;padding:25px 17px}.pocket-device .contact-detail .avatar{margin:0 auto;width:80px;height:80px;border-radius:50%}
.pocket-device .contact-detail h2{font-size:26px;text-align:center;font-weight:500;margin:15px 0 25px}.pocket-device .contact-card{background:#fff;border-radius:12px;padding:17px;white-space:pre-wrap;font-size:15px}
.pocket-device .calendar-head{display:flex;align-items:center;justify-content:space-between;padding:8px 18px;color:#f14343;height:45px}
.pocket-device .calendar-month{padding:4px 20px 12px;font-size:29px;font-weight:700;letter-spacing:-.5px}
.pocket-device .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);padding:0 15px 12px;gap:4px 1px;text-align:center}
.pocket-device .calendar-grid span,.pocket-device .calendar-grid button{height:35px;display:grid;place-items:center;font-size:18px}
.pocket-device .calendar-grid .weekday{font-size:11px;height:22px;color:#909095}.pocket-device .calendar-grid button.selected{background:#ff3b30;color:#fff;border-radius:50%;width:34px;margin:auto}
.pocket-device .calendar-head .calendar-nav{display:flex;gap:10px}.pocket-device .calendar-nav button{min-width:30px;font-size:24px;line-height:1}
.pocket-device .calendar-grid button:nth-child(7n+1){color:#ff3b30}.pocket-device .calendar-grid button{position:relative}.pocket-device .calendar-grid button.selected{color:#fff}
.pocket-device .calendar-grid button.has-events::after{content:'';position:absolute;bottom:2px;width:4px;height:4px;border-radius:50%;background:#ff3b30}
.pocket-device .calendar-grid button.selected::after{background:currentColor}
.pocket-device .event-list{padding:15px 18px;border-top:1px solid #e8e8ed;overflow:auto;flex:1}.pocket-device .event-date{font-size:14px;font-weight:600;margin-bottom:16px}
.pocket-device .event-row{display:flex;gap:15px;margin:0 0 18px;font-size:14px;align-items:stretch}.pocket-device .event-row time{width:46px;color:#777;font-size:12px;text-align:right;flex:none;padding-top:3px}
.pocket-device .event-row div{padding:2px 0 2px 11px;border-left:3px solid #ab72cc;flex:1;font-weight:500}
.pocket-device .theqoo-header{height:47px;padding:0 15px;display:flex;align-items:center;gap:15px;border-bottom:1px solid #d7d7d7;flex:none;background:#fff}
.pocket-device .theqoo-logo{font-family:Arial,sans-serif;font-weight:700;font-size:28px;letter-spacing:-2px;color:#333;flex:1}
.pocket-device .theqoo-logo b{color:#e978a7;font-weight:700}.pocket-device .qoo-categories{display:flex;gap:16px;white-space:nowrap;padding:11px 15px;background:#fafafa;border-bottom:1px solid #ddd;font-size:12px;flex:none}
.pocket-device .qoo-categories strong{color:#dc6196}.pocket-device .qoo-board{font-size:19px;font-weight:700;padding:17px 15px 13px;border-bottom:1px solid #c7c7c7}
.pocket-device .qoo-filter{padding:10px 15px;border-bottom:1px solid #e2e2e2;font-size:12px;color:#666;display:flex;gap:16px}
.pocket-device .qoo-filter b{color:#222}.pocket-device .qoo-list-row{display:block;width:100%;text-align:left;padding:15px;border-bottom:1px solid #e2e2e2}
.pocket-device .qoo-list-row .qoo-meta{font-size:11px;color:#999;margin-top:7px}.pocket-device .qoo-label{font-size:11px;color:#949494;margin-right:6px}
.pocket-device .qoo-list-row .count{color:#e16a9e;font-size:12px;margin-left:5px}.pocket-device .qoo-title{padding:17px 15px 13px;background:#fafafa;border-bottom:1px solid #e1e1e1;font-size:18px;font-weight:600;line-height:1.5}
.pocket-device .qoo-postmeta{display:flex;justify-content:space-between;padding:11px 15px;font-size:11px;color:#999;border-bottom:1px solid #eee}
.pocket-device .qoo-body{padding:25px 16px;min-height:190px;font-size:15px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}
.pocket-device .qoo-comments-title{border-top:1px solid #ddd;border-bottom:1px solid #ddd;padding:11px 15px;font-size:13px;font-weight:600}
.pocket-device .qoo-comment{padding:13px 15px;border-bottom:1px solid #eee;font-size:14px;line-height:1.6;overflow-wrap:anywhere;white-space:pre-wrap}
.pocket-device .qoo-comment-meta{display:flex;align-items:center;flex-wrap:wrap;gap:5px 8px;color:#50565d;white-space:normal}.pocket-device .qoo-comment-meta .avatar{width:22px;height:22px}.pocket-device .qoo-comment-meta strong{font-weight:600}.pocket-device .qoo-comment-meta time{color:#767c83;font-size:10px}.pocket-device .qoo-comment p{margin:4px 0 0}.pocket-device .qoo-reply-ref{font-weight:600;color:#005f9e}
.pocket-device .browserbar{display:flex;justify-content:space-around;align-items:center;background:#f7f7f8;border-top:1px solid #e1e1e3;height:44px;flex:none;color:#777}
.pocket-device .browserbar small{font-size:12px;color:#666}.pocket-device .social-scroll{scrollbar-width:thin}
.pocket-device .ig-profile-head{height:51px;display:flex;align-items:center;padding:0 15px;gap:13px;font-size:20px;font-weight:600}
.pocket-device .ig-profile-head strong{flex:1}.pocket-device .profile-info{padding:15px;display:flex;gap:20px;align-items:center}
.pocket-device .profile-info .avatar{width:78px;height:78px;border-radius:50%}.pocket-device .profile-stats{flex:1;display:flex;justify-content:space-around;text-align:center;font-size:11px}
.pocket-device .profile-stats b{display:block;font-size:18px;font-weight:600}.pocket-device .profile-bio{padding:0 16px 15px;font-size:14px;white-space:pre-wrap}
.pocket-device .profile-buttons{display:flex;gap:8px;padding:0 15px 18px}.pocket-device .profile-buttons button{background:#efefef;border-radius:8px;font-size:13px;font-weight:600;padding:8px;flex:1}
.pocket-device .profile-gridtabs{display:flex;justify-content:space-around;padding:12px;border-top:1px solid #eee;border-bottom:1px solid #eee}
.pocket-device .profile-photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}.pocket-device .profile-photo-grid button{display:block}.pocket-device .profile-photo-grid .postmedia,.pocket-device .profile-photo-grid .post-placeholder{aspect-ratio:1;height:auto;font-size:12px;padding:10px}
.pocket-device .post-author button{font-size:13px;font-weight:600;flex:1;text-align:left}.pocket-device .post-actions button{display:block;height:26px}
.pocket-device .post-actions button.saved{margin-left:auto}.pocket-device .ig-storystrip{display:flex;gap:19px;padding:10px 15px 14px;border-bottom:1px solid #eee;font-size:10px}
.pocket-device .ig-storystrip>div{text-align:center}.pocket-device .ig-storystrip .avatar{width:58px;height:58px;border-radius:50%;border:2px solid #d67a9d;margin-bottom:5px}
.pocket-device .feed-tabs{display:flex;flex:none;border-bottom:1px solid #eee;justify-content:space-around;font-size:14px;padding:14px 8px;font-weight:600}
.pocket-device .feed-tabs span:first-child{border-bottom:3px solid #1d9bf0;padding-bottom:11px;margin-bottom:-14px}
.pocket-device .feed-tweet{display:flex;padding:14px 13px;gap:10px;border-bottom:1px solid #eee}.pocket-device .feed-tweet .avatar{border-radius:50%;width:40px;height:40px}
.pocket-device .feed-tweet-copy{flex:1;min-width:0}.pocket-device .feed-tweet-author{font-size:14px;font-weight:600}.pocket-device .feed-tweet-author small{font-weight:400;color:#85919b;font-size:12px}
.pocket-device .feed-tweet-body{font-size:15px;white-space:pre-wrap;line-height:1.45;text-align:left;width:100%;margin:7px 0 12px}
.pocket-device .feed-tweet .postmedia{border-radius:13px;aspect-ratio:4/3}.pocket-device .feed-tweet .tweet-icons{border:0;padding:12px 0 0}.pocket-device .feed-tweet .tweet-icons .pi{width:18px;height:18px}
.pocket-device .x-banner{height:114px;background:linear-gradient(115deg,#b8cbd3,#e8dce6)}.pocket-device .x-profile-info{padding:0 16px 18px}
.pocket-device .x-profile-info .avatar{width:76px;height:76px;border:4px solid #fff;border-radius:50%;margin-top:-37px}.pocket-device .x-profile-info h2{font-size:22px;font-weight:700;margin:10px 0 0}
.pocket-device .x-profile-info p{font-size:14px;white-space:pre-wrap;margin:12px 0}.pocket-device .x-profile-info small{color:#7c8790;font-size:13px}
.pocket-device .photo-viewer{background:#000;color:#fff;display:flex;flex-direction:column;flex:1;min-height:0}
.pocket-device .photo-viewer .photodetail{padding:0;display:flex;flex-direction:column;justify-content:center;min-height:0;flex:1}
.pocket-device .photo-viewer .postmedia{max-height:100%;aspect-ratio:auto;object-fit:contain}.pocket-device .photo-viewer .post-placeholder{aspect-ratio:4/3}
.pocket-device .photo-viewer .photocaption{background:#161616;color:#ddd;padding:15px;font-size:12px}
.pocket-device .photo-viewer .photo-actions{display:flex;justify-content:space-around;padding:12px 15px;flex:none}
.pocket-device.photo-device{background:#000;color:#fff}.pocket-device.photo-device .sysbar,.pocket-device.photo-device .gesture{background:transparent}
.pocket-device.photo-device .battery{background:#fff;color:#111}.pocket-device .photo-toolbar{display:flex;align-items:center;justify-content:space-between;padding:6px 15px 15px;height:48px;font-size:13px}
.pocket-device .photo-toolbar button{color:#fff}.pocket-device.googlemessages .msg.mine .bubble{background:#c2e7ff}.pocket-device.googlemessages .inputshape{background:#f0f4f8}
.pocket-device .native-search{font-size:16px}.pocket-device .appglyph.forum{background:#fff;color:#333}
.pocket-device .chat-scroll{--sender-size:calc(var(--work-size) * .8);--sender-line:calc(var(--sender-size) * 1.2);--message-gap:16px}
.pocket-device:is(.kakao,.line) .chat-scroll{--message-gap:max(16px,calc(var(--sender-line) + 5px))}
.pocket-device .msg + .msg{margin-top:var(--message-gap)}
.pocket-device:is(.kakao,.line) .msg:not(.mine){position:relative;padding-left:49px}
.pocket-device:is(.kakao,.line) .msg:not(.mine) .msg-col{max-width:100%}
.pocket-device:is(.kakao,.line) .msg > .avatar{position:absolute;top:0;left:0}
.pocket-device:is(.kakao,.line) .msg + .msg:not(.mine,.grouped){margin-top:calc(var(--message-gap) - var(--sender-line) - 3px)}
.pocket-device .msg .sender{font-size:var(--sender-size);line-height:var(--sender-line);margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pocket-device .screen-head strong,.pocket-device .ig-profile-head strong,.pocket-device .x-profile-info h2{font-size:calc(var(--work-size) * 1.2);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pocket-device.imessage .im-contact,.pocket-device .qoo-comment-meta strong,.pocket-device .feed-tweet-author small{font-size:calc(var(--work-size) * .8)}
.pocket-device .post-author button,.pocket-device .tweet-author small,.pocket-device .listroom .roomcopy small,.pocket-device .comment-row small,.pocket-device .qoo-comment-meta small,.pocket-device .x-profile-info .profile-handle,.pocket-device .qoo-postmeta .qoo-author{font-size:calc(var(--work-size) * .87)}
.pocket-device .message-list .roomcopy small,.pocket-device .tweet .tweet-author,.pocket-device .profile-bio strong,.pocket-device .x-profile-name{font-size:var(--work-size)}
.pocket-device .listroom .roomcopy{font-size:calc(var(--work-size) * 1.07)}
.pocket-device .feed-tweet-author,.pocket-device .ig-storystrip > div{font-size:calc(var(--work-size) * .93)}

.pocket-device .msg .bubble.photo-bubble{background:transparent;padding:0;border-radius:10px;overflow:hidden}
.pocket-device .msg .bubble.photo-bubble::before{display:none}
.pocket-device .photo-bubble .chat-photo{display:block;width:auto;max-width:min(100%,220px);max-height:270px;object-fit:contain;border-radius:inherit}
.pocket-device .photo-bubble .chat-photo+.chat-photo{margin-top:4px}
.pocket-device.line .msg .bubble.photo-bubble{border-radius:12px}
.pocket-device.imessage .msg .bubble.photo-bubble,.pocket-device.samsungmessages .msg .bubble.photo-bubble{border-radius:18px}
.pocket-device .voice-card{display:flex;align-items:center;gap:9px;white-space:nowrap;font:500 12px/1.2 system-ui,sans-serif}
.pocket-device .voice-play{display:grid;place-items:center;flex:none;width:29px;height:29px;border-radius:50%;background:#0000000f}
.pocket-device .voice-play svg{width:13px;height:13px}
.pocket-device .voice-pause,.pocket-device .voice-play[aria-pressed=true] .voice-triangle{display:none}
.pocket-device .voice-play[aria-pressed=true] .voice-pause{display:block}
.pocket-device .voice-card time{font-variant-numeric:tabular-nums}
.pocket-device .voice-track{width:70px;height:4px;border-radius:2px;background:currentColor;opacity:.28}
.pocket-device .voice-wave{width:88px;height:22px;opacity:.76}
.pocket-device.imessage .voice-play{background:#007aff;color:white}
.pocket-device.imessage .mine .voice-play{background:white;color:#007aff}
.pocket-device.line .voice-play,.pocket-device.kakao .voice-play{background:none}
.pocket-device.kakao .msg .voice-bubble{background:#fff;color:#242424;border-radius:16px}
.pocket-device.kakao .voice-bubble::before{display:none}
.pocket-device.kakao .voice-card{justify-content:space-between;min-width:124px}
.pocket-device.kakao .voice-card time{font-size:14px}
.pocket-device .voice-caption,.pocket-device .chat-image-caption{display:block;margin-bottom:5px}
`;
 function ensureStyle(){if(typeof PocketFontData!=='undefined'&&!document.getElementById('pocket-fonts')){const style=document.createElement('style');style.id='pocket-fonts';style.textContent=Object.entries(fontCatalog).map(([id,f])=>/^data:.*;base64,[A-Za-z0-9+/=]+$/.test(PocketFontData[id]||'')?`@font-face{font-family:${f.family};src:url('${PocketFontData[id]}') format('woff2');font-weight:400;font-style:normal;font-display:swap;}`:'').join('');document.head.append(style);}if(!document.getElementById('pocket-runtime-css')){const style=document.createElement('style');style.id='pocket-runtime-css';style.textContent=css;document.head.append(style);}}
 function avatar(src,round=false){return `<div class="avatar ${round?'round':''}">${image(src)?`<img src="${image(src)}" alt="头像">`:icon('user')}</div>`;}
 const MAX_SCREENSHOT_SHEETS=37;
 function parse(script){return String(script||'').split('\n').filter(s=>s.trim()).map(line=>{const at=line.indexOf('：')>=0?line.indexOf('：'):line.indexOf(':');return at>0?{who:line.slice(0,at).trim(),text:line.slice(at+1).trim()}:{who:'我',text:line};});}
 function noteItems(state,unlocked=false){
  const phone=state.phone,items=Array.isArray(phone.noteItems)?phone.noteItems:[{id:'legacy',title:String(phone.notes||'').split('\n')[0]||'메모',body:String(phone.notes||'').split('\n').slice(1).join('\n').trim(),date:'2026. 6. 6.'}];
  let visible=items.map((n,i)=>({id:String(n.id||'note-'+i),title:String(n.title||'제목 없음'),body:String(n.body||''),date:String(n.date||'2026. 6. 6.')}));
  if(unlocked&&phone.rule&&String(phone.secret||'').trim()){let text=phone.secret.split('\n');visible.push({id:'unlocked-secret',title:text[0]||'메모',body:text.slice(1).join('\n').trim(),date:'2026. 6. 6. 오후 11:10'});}
  return visible;
 }

 // Additive beta schema: legacy primary drafts stay addressable by platform ID.
 const fontCatalog={jua:{name:'Jua · 圆润韩文',family:'FicJua'},gamja:{name:'Gamja Flower · 手写韩文',family:'FicGamja'},yomogi:{name:'Yomogi · 手写日文',family:'FicYomogi'},kuaile:{name:'站酷快乐体 · 俏皮中文',family:'FicKuaiLe'}};
 function customFont(value){
  return typeof value==='string'&&value.length<=2800000&&/^data:font\/woff2;base64,d09GM[A-Za-z0-9+/]*={0,2}$/.test(value)?value:'';
 }
 function workPoints(value){
  const points=Number(value);
  return Number.isFinite(points)&&points>=7&&points<=30?points:0;
 }
 function fontStack(id){return fontCatalog[id]?[fontCatalog[id].family,...Object.values(fontCatalog).filter(f=>f!==fontCatalog[id]).map(f=>f.family),'sans-serif'].join(','):id==='serif'?'Georgia,serif':id==='mono'?'monospace':'-apple-system,BlinkMacSystemFont,sans-serif';}
 function unreadAt(messages,d,owner,index){if(!d.unread)return false;const own=m=>['我',owner,'나','me'].includes(m?.who);if(!own(messages[index]))return false;const configured=Math.floor(Number(d.unreadFrom)||0);let boundary=configured>0?configured-1:messages.reduce((n,m,i)=>own(m)?n:i+1,0);return index>=boundary;}
 function audio(value){
  return typeof value==='string'&&value.length<=2800000&&/^data:audio\/(mpeg|mp4|ogg|wav|webm);base64,[A-Za-z0-9+/]+={0,2}$/.test(value)?value:'';
 }
 function voiceSeconds(value){
  return Number.isInteger(value)&&value>0&&value<=3599?value:0;
 }
 function voiceTime(seconds,padded){
  return seconds?String(Math.floor(seconds/60)).padStart(padded?2:1,'0')+':'+String(seconds%60).padStart(2,'0'):'–:––';
 }
 function cleanAttachments(values){
  if(!Array.isArray(values))return [];
  return values.slice(0,60).flatMap(asset=>{
   const id=String(asset?.id||'');
   if(!/^[a-z0-9-]{1,50}$/.test(id))return [];
   const photo=image(asset?.src),recording=audio(asset?.src),duration=voiceSeconds(asset?.duration);
   if(photo)return [{id,src:photo}];
   return recording||duration?[{id,src:recording,...(duration?{duration}:{})}]:[];
  });
 }
 function splitMessage(message){
  const match=message.text.match(/^\[([^\]]+)\]\s*/);
  const timed=match&&match[1]!=='图片'&&!match[1].startsWith('附件-')&&!match[1].startsWith('分组-');
  const text=timed?message.text.slice(match[0].length):message.text;
  const group=text.match(/^\[分组-(另起|接续)\]\s*/);
  return {...message,...(timed?{time:match[1]}:{}),...(group?{group:group[1]}:{}),text:group?text.slice(group[0].length):text};
 }
 function cleanComments(input){
  if(!Array.isArray(input))return [];
  return input.slice(0,100).map((row,index)=>({
   name:String(row?.name||'').slice(0,80),handle:String(row?.handle||'').slice(0,80),avatar:image(row?.avatar),
   text:String(row?.text||'').slice(0,2000),
   parent:Number.isInteger(row?.parent)&&row.parent>=0&&row.parent<index&&input[row.parent]?.parent===null?row.parent:null
  }));
 }
 function commentItems(draft,threaded=false){
  if(Array.isArray(draft.commentItems))return draft.commentItems;
  let parent=null;
  const comments=[];
  for(const line of String(draft.comments||'').split('\n')){
   const entry=line.trimStart().match(/^([^：:\n]{1,80})[：:](?!\/\/)(.*)$/);
   if(!entry&&threaded){
    const previous=comments.at(-1);
    if(previous){previous.text+='\n'+line;continue;}
   }
   if(!line.trim())continue;
   const reply=threaded&&/^(?:\t| {2})/.test(line)&&parent!==null;
   const item={name:entry?entry[1].trim():'我',handle:'',avatar:'',text:entry?entry[2].trim():line,parent:reply?parent:null};
   if(!reply)parent=comments.length;
   comments.push(item);
  }
  return comments.map(comment=>({...comment,text:comment.text.trimEnd()}));
 }
 function cleanDraft(raw,base={}){const d={...base};for(const [k,v] of Object.entries(raw||{})){if(['__proto__','constructor','prototype'].includes(k))continue;if(['media','authorAvatar','contactAvatar'].includes(k))d[k]=image(v);else if(k==='images')d.images=Array.isArray(v)?v.slice(0,9).map(image).filter(Boolean):[];else if(k==='attachments')d.attachments=cleanAttachments(v);else if(k==='commentItems')d.commentItems=cleanComments(v);else if(k==='members')d.members=Array.isArray(v)?v.slice(0,7).map(m=>({name:String(m.name||'').slice(0,80),avatar:image(m.avatar),readUntil:Math.max(0,Number(m.readUntil)||0)})):[];else if(['typing','unread','animateDraft'].includes(k))d[k]=!!v;else if(['unreadFrom','incomingUnread'].includes(k))d[k]=Math.max(0,Number(v)||0);else if(typeof v==='string')d[k]=v.slice(0,100000);}return d;}
 function normalizeExtras(raw,fresh){if(raw===fresh)raw=JSON.parse(JSON.stringify(raw));if((raw.betaSchema||0)>1)throw Error('此工程来自更新版本，请先升级 FicPhone。');if((raw.screenshotSheets?.length||0)>MAX_SCREENSHOT_SHEETS)throw Error('截图稿数量超过上限，原工程未改动。');for(const id of Object.keys(templates)){if((raw.collections?.[id]?.length||0)>49)throw Error('当前每平台最多五十项内容，原工程未改动。');for(const d of [raw.drafts?.[id],...(Array.isArray(raw.collections?.[id])?raw.collections[id]:[])])if((d?.images?.length||0)>9)throw Error('每条内容最多九张图片，原工程未改动。');}fresh.betaSchema=1;fresh.assetLibrary=Array.isArray(raw.assetLibrary)?raw.assetLibrary.slice(0,40).map(asset=>({name:String(asset?.name||'').slice(0,100),src:image(asset?.src)})).filter(asset=>asset.src):[];fresh.characters=Array.isArray(raw.characters)?raw.characters.slice(0,50).map(c=>({name:String(c.name||'').slice(0,80),handle:String(c.handle||'').slice(0,100),avatar:image(c.avatar),profiles:Object.fromEntries(Object.keys(templates).map(id=>[id,{name:String(c.profiles?.[id]?.name||'').slice(0,80),handle:String(c.profiles?.[id]?.handle||(id==='instagram'?c.handle||'':'')).slice(0,100),avatar:image(c.profiles?.[id]?.avatar)}]))})):[];fresh.collections={};for(const id of Object.keys(templates)){fresh.drafts[id]=cleanDraft(raw.drafts?.[id],fresh.drafts[id]);fresh.collections[id]=(raw.collections?.[id]||[]).slice(0,49).map((d,i)=>({...cleanDraft(d,fresh.drafts[id]),id:/^[\w-]{1,80}$/.test(d.id)?d.id:id+'-'+i}));}fresh.phone.albums=normalizeAlbums(raw.phone?.albums,fresh.phone.photos.length);fresh.phone.hintsPolicy=raw.phone?.hintsPolicy==='off'?'off':'optional';fresh.phone.authorCredit=String(raw.phone?.authorCredit||'').slice(0,100);fresh.phone.watermarkImage=!!raw.phone?.watermarkImage;fresh.phone.watermarkHTML=!!raw.phone?.watermarkHTML;fresh.phone.hideCutout=!!raw.phone?.hideCutout;fresh.phone.customFont=customFont(raw.phone?.customFont);fresh.phone.embedFont=!!raw.phone?.embedFont;
  fresh.phone.font=['system','serif','mono',...Object.keys(fontCatalog)].includes(raw.phone?.font)?raw.phone.font:'system';
  if(fresh.phone.customFont&&raw.phone?.font==='custom')fresh.phone.font='custom';
  fresh.phone.workPoints=workPoints(raw.phone?.workPoints);fresh.phone.textSize=['small','normal','large'].includes(raw.phone?.textSize)?raw.phone.textSize:'normal';for(const k of ['wallZoom','lockZoom'])fresh.phone[k]=Math.max(100,Math.min(200,Number(raw.phone?.[k])||100));for(const k of ['wallX','wallY','lockX','lockY'])fresh.phone[k]=Math.max(0,Math.min(100,Number(raw.phone?.[k]??50)));const groups=new Set(),sheets=new Set();
  fresh.screenshotGroups=(Array.isArray(raw.screenshotGroups)?raw.screenshotGroups:[]).slice(0,MAX_SCREENSHOT_SHEETS).flatMap(group=>{
   if(!/^[\w-]{1,80}$/.test(group?.id)||groups.has(group.id))return [];
   groups.add(group.id);
   return [{id:group.id,name:String(group.name||'截图分组').slice(0,80)}];
  });
  fresh.screenshotSheets=(raw.screenshotSheets||[]).map((s,i)=>{
   let id=String(s.id||'shot-'+i);
   while(sheets.has(id))id+='-'+i;
   sheets.add(id);
   return {id,groupId:groups.has(s.groupId)?s.groupId:'',name:String(s.name||'截图 '+(i+1)).slice(0,80),template:templates[s.template]?s.template:'kakao',draft:cleanDraft(s.draft),time:String(s.time||'23:10').slice(0,30),battery:Math.max(0,Math.min(100,Number(s.battery)||0)),device:devices[s.device]?s.device:fresh.device,owner:String(s.owner||fresh.owner).slice(0,80),partner:String(s.partner||fresh.partner).slice(0,80),ownerAvatar:image(s.ownerAvatar),partnerAvatar:image(s.partnerAvatar),style:{font:s.style?.font==='custom'&&fresh.phone.customFont?'custom':['system','serif','mono',...Object.keys(fontCatalog)].includes(s.style?.font)?s.style.font:'system',workPoints:workPoints(s.style?.workPoints),textSize:['small','normal','large'].includes(s.style?.textSize)?s.style.textSize:'normal',hideCutout:!!s.style?.hideCutout,language:ui[s.style?.language]?s.style.language:fresh.phone.language,batteryMode:['normal','charging','lowPower'].includes(s.style?.batteryMode)?s.style.batteryMode:'normal',androidMessages:s.style?.androidMessages==='google'?'google':'samsung',authorCredit:String(s.style?.authorCredit||'').slice(0,100),watermarkImage:!!s.style?.watermarkImage,watermarkHTML:!!s.style?.watermarkHTML}};});fresh.activeSheet=Math.max(0,Math.min(fresh.screenshotSheets.length-1,Number(raw.activeSheet)||0));return fresh;}
 function items(state,id){return [{...state.drafts[id],id},...(state.collections?.[id]||[])];}
 function normalizeAlbums(raw,count){if(raw!=null&&!Array.isArray(raw))throw Error('相册格式不正确');if(raw?.length>50)throw Error('当前最多五十个相册');const ids=new Set();return (raw||[]).map((v,i)=>{let id=/^[\w-]{1,80}$/.test(v.id)?v.id:'album-'+i;if(ids.has(id))id+='-'+i;ids.add(id);return {id,name:String(v.name||'').slice(0,80),photoIndexes:[...new Set((Array.isArray(v.photoIndexes)?v.photoIndexes:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<count))]};});}
 function removePhoto(state,index){state.phone.photos.splice(index,1);for(const album of state.phone.albums||[])album.photoIndexes=album.photoIndexes.filter(i=>i!==index).map(i=>i>index?i-1:i);for(const s of state.phone.story?.steps||[]){for(const c of [{event:s.trigger,get target(){return s.target;},set target(v){s.target=v;}},...(s.clues||[])])if(c.event==='photo'&&/^\d+$/.test(c.target)){const n=Number(c.target);c.target=n===index?'removed-photo':String(n>index?n-1:n);}}}
 const legacyCalendarDate='2026-06-06';
 function validDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value.startsWith('0000'))return '';
  const date=new Date(value+'T00:00:00Z');
  return Number.isFinite(+date)&&date.toISOString().slice(0,10)===value?value:'';
 }
 function datedRows(script){
  return String(script||'').split('\n').filter(Boolean).map(line=>{
   const parts=line.split('·').map(part=>part.trim());
   const date=parts.length>1?validDate(parts[0]):'';
   if(date)parts.shift();
   return {date,parts,text:date?parts.join(' · '):line};
  });
 }
 function callRows(script){
  return datedRows(script).map(({date,parts:[name,time='',...status],text})=>({
   date,name,time,status:status.join(' · '),missed:/부재중|未接|missed|不在/i.test(text)
  }));
 }
 function calendarRows(phone){
  const rows=datedRows(phone.calendar);
  const start=validDate(phone.calendarDate)||rows.find(row=>row.date)?.date||legacyCalendarDate;
  return {start,rows:rows.map(({date,text})=>{
   const match=text.match(/^(\d{1,2}:\d{2})\s*[·：:]?\s*(.*)$/);
   return {date:date||start,time:match?.[1]||'',title:match?.[2]||text};
  })};
 }
 function mount(root,state,opts={}){
  ensureStyle();
  const passcode=opts.mode==='phone'&&!opts.authorPreview&&/^(?:[0-9]{4}|[0-9]{6})$/.test(state.phone.lockCode||'')?state.phone.lockCode:'';
  let unlocked=!passcode,unlockDestination='home',homePage=0;
  const initialView=opts.mode==='phone'?(!passcode&&state.phone.readerStart==='home'?'home':'lock'):opts.template||'kakao';
  const framed=opts.frame&&!(opts.mode==='phone'&&state.phone.readerLayout==='screen');
  let view=initialView,viewed=false,notify=false,photoIndex=0,currentChat=state.phone.chatPlatform,noteId=null;const candidate=devices[state.device],device=candidate&&!candidate.disabled?candidate:devices.iphone18pro;
  const language=ui[state.phone.language]?state.phone.language:'ko',t=key=>ui[language][key]||ui.en[key]||key,nameOf=type=>appNames[language][type]||appTypes[type];
  const agenda=calendarRows(state.phone),recentCalls=callRows(state.phone.calls);
  const monthLabel=new Intl.DateTimeFormat(language,{year:'numeric',month:'long',timeZone:'UTC'});
  const calendarLabels={zh:['上个月','下个月'],en:['Previous month','Next month'],ko:['이전 달','다음 달'],ja:['前の月','次の月']}[language];
  let currentAlbum=null,calendarDay=agenda.start,callIndex=0,callFilter='all',selected={},liked=new Set(),hintsOpen=false,hintMore=false,typingDone=new Set(),typingTimer=new Map(),hintPosition=null,suppressHintClick=false;
  const draft=id=>items(state,id).find(d=>d.id===(selected[id]||id))||state.drafts[id];
  function allowed(route){if(opts.mode!=='phone')return true;const base=({note:'notes',photo:'album',chatlist:currentChat,igprofile:'instagram',igcomments:'instagram',instagramfeed:'instagram',xfeed:'x',xprofile:'x',forumlist:'forum',calldetail:'calls',albums:'album'})[route]||route;return !appTypes[base]||state.phone.apps.some(a=>(a.target||a.type)===base&&visibleApp(a));}
  function go(route){
   if(!unlocked&&route!=='lock'){
    if(route!=='passcode')unlockDestination=route;
    view='passcode';render();root.querySelector('[data-pin-input]')?.focus();return;
   }
   if(route==='album-all'){currentAlbum=null;route='album';}if(route.startsWith('album-item:')){currentAlbum=route.slice(11);route='album';}if(route.startsWith('item:')){const parts=route.split(':');selected[parts[1]]=parts[2];route=parts[1];}if(route.startsWith('rooms:')){currentChat=route.slice(6);route='chatlist';}if(route==='chatlist'&&templates[view]?.kind==='chat')currentChat=view;view=allowed(route)?route:'inactive';if(view!=='inactive'&&storyEngine){const events=[];if(['kakao','line','imessage'].includes(view))events.push({event:'chat',target:view},{event:'chat',target:selected[view]||view});if(['instagram','x','forum'].includes(view))events.push({event:'post',target:view},{event:'post',target:selected[view]||view});if(view==='calldetail')events.push({event:'call',target:String(callIndex)});if(appTypes[view])events.push({event:'app',target:view});if(view==='notes'&&allNotes().length===1)events.push({event:'note',target:allNotes()[0].id});storyEngine.visit(events);persistStory();scheduleStory();}render();}
  let resize,timer,bannerTimer,alive=true,endingDismissed=false;
  const announcedMessages=new Set(),readMessages=new Set();
  let activeBanner=null;
  const storyConfig=state.phone.story?Story.normalize(state.phone.story):null,usingStory=opts.mode==='phone'&&!!storyConfig;
  let restored=opts.resume||null;if(usingStory&&opts.storageKey){try{restored=JSON.parse(localStorage.getItem(opts.storageKey)||'null');}catch{}}
  const storyEngine=usingStory?Story.engine(storyConfig,restored):null;if(storyEngine)for(const message of storyEngine.snapshot().messages)announcedMessages.add(message.id);
  if(storyEngine)for(const e of storyEngine.snapshot().seen)if(e.event==='like')liked.add((e.target.startsWith('x')?'x':'instagram')+':'+e.target);
  const progress=()=>storyEngine?.snapshot();
  const visibleApp=a=>a.enabled&&(!a.locked||!usingStory||!storyConfig.enabled||progress().unlocked.includes(a.target||a.type));
  const allNotes=()=>usingStory?[...noteItems(state,false),...(storyConfig.enabled?progress().notes.map(n=>({...n,date:state.phone.date})):[])]:noteItems(state,viewed);
  function persistStory(){if(!storyEngine)return;if(opts.storageKey){try{localStorage.setItem(opts.storageKey,JSON.stringify(storyEngine.save()));}catch{opts.onStorageError?.();}}opts.onJournal?.(storyEngine.save());opts.onProgress?.(progress(),storyEngine.story);}
  function scheduleStory(){
   clearTimeout(timer);
   const current=progress(),now=Date.now();
   if(!current)return;
   const expiry=current.messages.map(message=>message.withdrawAt).filter(at=>at>now);
   const due=Math.min(current.pending?.due??Infinity,...expiry);
   if(Number.isFinite(due))timer=setTimeout(()=>{
    if(!alive)return;
    storyEngine.tick();
    persistStory();
    render();
    scheduleStory();
   },Math.max(0,due-Date.now()));
  }
  function storyEvent(event,target){if(!storyEngine)return;storyEngine.dispatch(event,target);persistStory();scheduleStory();}
  const hintCopies={zh:['需要提示？','关闭提示','进一步提示','作者未填写此步提示。','作者未填写进一步提示。','本次探索已结束。'],en:['Need a hint?','Hide hints','More help','No hint was provided for this step.','No further hint was provided.','This exploration has ended.'],ko:['힌트가 필요해요?','힌트 닫기','추가 힌트','이 단계에는 힌트가 없습니다.','추가 힌트가 없습니다.','탐색이 끝났습니다.'],ja:['ヒントを見る？','ヒントを閉じる','さらにヒント','このステップにはヒントがありません。','追加のヒントはありません。','探索は終了しました。']};
  let hintOverride=false;
  let hintLanguage=[opts.readerLanguage,state.phone.hintLanguage,opts.hintFallback].find(key=>Object.hasOwn(hintCopies,key))||'zh';
  function hintMarkup(){if(opts.mode!=='phone'||state.phone.hintsPolicy==='off'||!storyEngine?.story.enabled||!storyEngine.story.steps.length)return '';const p=progress(),step=storyEngine.story.steps[p.cursor],lang=hintLanguage,readerCopy=hintCopies[lang];const waiting={zh:'已触发剧情，正在等待后续内容，请稍等。',en:'The event was triggered. Please wait for what happens next.',ko:'이벤트가 시작되었습니다. 다음 내용을 잠시 기다려 주세요.',ja:'イベントが始まりました。次の展開を少しお待ちください。'}[lang]||'Please wait.';const text=p.pending?waiting:step?(hintMore?step.hintMore||step.hint||readerCopy[4]:step.hint||readerCopy[3]):readerCopy[5];const dragLabel={zh:'拖动提示',en:'Drag hint',ko:'힌트 이동',ja:'ヒントを移動'}[lang]||'Drag hint';return `<aside class="reader-hints"><button data-hints aria-expanded="${hintsOpen}">${hintsOpen?readerCopy[1]:readerCopy[0]}</button>${hintsOpen?`<div role="status"><div class="hint-drag" data-hint-drag role="button" tabindex="0" aria-label="${dragLabel}"><span aria-hidden="true">⠿</span>${dragLabel}</div><label class="hint-language">${{zh:'提示语言',en:'Hint language',ko:'힌트 언어',ja:'ヒントの言語'}[lang]} <select data-hint-language>${Object.entries({zh:'中文',en:'English',ko:'한국어',ja:'日本語'}).map(([key,name])=>`<option value="${key}" ${key===lang?'selected':''}>${name}</option>`).join('')}</select></label>${opts.showHintStep&&step?`<small class="hint-step">${p.cursor+1} / ${storyEngine.story.steps.length} · ${esc(step.title)}</small>`:''}${esc(text)}${!p.pending&&step?`<button data-hint-more>${readerCopy[2]}</button>`:''}</div>`:''}</aside>`;}

  function setHintFallback(value){
   if(hintOverride||opts.readerLanguage||Object.hasOwn(hintCopies,state.phone.hintLanguage)||!Object.hasOwn(hintCopies,value))return;
   if(hintLanguage!==value){hintLanguage=value;render();}
  }

  function batteryMarkup(){const b=batteryState(state.battery,state.phone.batteryMode),charging=b.status==='charging';return `<svg class="battery-svg ${b.status} ${b.level>50?'high':'low-fill'}" viewBox="0 0 ${charging?37:29} 16" role="img" aria-label="电量 ${b.level}%${charging?' · 充电中':b.status==='lowPower'?' · 低电量模式':''}"><rect x=".7" y="1.5" width="25" height="13" rx="3.5" fill="currentColor" fill-opacity=".20" stroke="currentColor" stroke-opacity=".4" stroke-width=".7"/><rect x="2" y="2.8" width="${b.fill}" height="10.4" rx="2.4" fill="${b.color}"/><path d="M27 6v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><text class="battery-num" x="13.2" y="11.1" text-anchor="middle" font-size="9" font-weight="700">${b.level}</text>${charging?'<path d="M34 1l-4 7h3l-2 7 6-9h-4z" fill="#34c759"/>':''}</svg>`;}
  function storyOverlay(){const p=progress();if(!p)return '';const c=p.choice,e=endingDismissed?null:p.ending;if(!c&&!e)return '';return `<div class="story-overlay"><div class="story-dialog">${e?`<small>FicPhone</small><h2>${esc(e.title||'END')}</h2><p>${esc(e.text)}</p><button data-story-close>${t('back')}</button>`:`<p>${esc(c.prompt)}</p>${c.options.map((o,i)=>`<button data-story-choice="${i}">${esc(o.label)}</button>`).join('')}`}</div></div>`;}

  function head(title,back='home'){return `<div class="ioshead"><button data-go="${back}" aria-label="返回">${icon('back')}</button><strong>${esc(title)}</strong></div>`;}
  function media(src){if(Array.isArray(src))return `<div class="media-carousel">${src.map(s=>media(s)).join('')}</div>`;return image(src)?`<img class="postmedia" src="${image(src)}" alt="作品图片">`:'<div class="post-placeholder" role="img" aria-label="示意风景">after the rain.</div>';}
  function storyMessageText(message){
   if(!message.withdrawAt||message.withdrawAt>Date.now())return message.text;
   return {zh:'已撤回一条消息',en:'Message withdrawn',ko:'삭제된 메시지입니다',ja:'メッセージの送信を取り消しました'}[language];
  }
  function chatMessages(platform, conversation, storyMessages=progress()?.messages||[]) {
   const list=parse(conversation.script).map(splitMessage);
   const room=conversation.id||platform;
   const partner=conversation.contactName||state.partner;
   if(!usingStory&&viewed&&state.phone.rule&&platform===state.phone.chatPlatform&&room===platform){
    list.push({who:state.partner,text:state.phone.newMessage});
   }
   if(typingDone.has(platform+':'+room)&&conversation.typingReply){
    list.push({who:partner,text:conversation.typingReply,time:state.time});
   }
   if(usingStory){
    for(const message of storyMessages){
     if(message.app!==platform||(message.room||platform)!==room)continue;
     list.push({who:message.who==='owner'?state.owner:partner,text:storyMessageText(message),time:state.time});
    }
   }
   return list;
  }
  const voiceTitle={zh:'语音消息',en:'Voice message',ko:'음성 메시지',ja:'音声メッセージ'}[language];
  function voiceMarkup(asset,platform,mine){
   const recording=audio(asset.src),seconds=voiceSeconds(asset.duration);
   const playable=opts.mode==='phone'&&recording;
   const padded=platform!=='imessage';
   const time=voiceTime(seconds,padded);
   const isApple=platform==='imessage'&&device.os==='ios';
   const playColor=isApple?(mine?'#007aff':'#fff'):'#26282d';
   const waveColor=isApple&&mine?'#fff':'#353940';
   const pause=playable?'<path class="voice-pause" d="M4 3h3v10H4zm5 0h3v10H9z"/>':'';
   const voiceIcons=`<svg viewBox="0 0 16 16" fill="${playColor}" aria-hidden="true"><path class="voice-triangle" d="M4 2.5l10 5.5-10 5.5z"/>${pause}</svg>`;
   const play=playable?`<button type="button" class="voice-play" data-voice-play aria-label="${voiceTitle}" aria-pressed="false">${voiceIcons}</button>`:`<span class="voice-play" aria-hidden="true">${voiceIcons}</span>`;
   const bars=[6,10,8,13,17,10,6,11,18,14,8,11,6,13,19,13,9,15,7,10];
   const wave=platform==='kakao'?'':device.os==='android'&&platform==='imessage'?'<span class="voice-track" aria-hidden="true"></span>':
    `<svg class="voice-wave" viewBox="0 0 80 22" aria-hidden="true"><path fill="none" stroke="${waveColor}" stroke-width="${platform==='line'?1.4:2}" stroke-linecap="round" d="${bars.map((height,i)=>`M${2+i*4} ${11-height/2}v${height}`).join(' ')}"/></svg>`;
   const audioElement=recording&&(playable||!seconds)?
    `<audio class="voice-message" ${seconds?'':'data-voice-metadata'} preload="metadata" src="${recording}"></audio>`:'';
   return `<div class="voice-card">${play}${wave}<time ${seconds?'':`data-voice-time="${padded?'padded':'compact'}"`}>${time}</time>${audioElement}</div>`;
  }
  function chatMedia(message,conversation,platform,mine){
   const marker=message.match(/\[附件-([a-z0-9-]{1,50})\]$/);
   const asset=marker&&conversation.attachments?.find(item=>item.id===marker[1]);
   const caption=asset?message.slice(0,marker.index).trimEnd():'';
   if(asset&&(audio(asset.src)||voiceSeconds(asset.duration))){
    return {className:'voice-bubble',html:(caption?`<span class="voice-caption">${esc(caption)}</span>`:'')+voiceMarkup(asset,platform,mine)};
   }
   const photo=asset&&image(asset.src);
   const photos=photo?[photo]:message==='[图片]'?(conversation.images?.length?conversation.images:[conversation.media]):[];
   const html=photos.map(image).filter(Boolean).map(src=>`<img class="chat-photo" src="${src}" alt="聊天图片">`).join('');
   return html?{className:caption?'':'photo-bubble',html:(caption?`<span class="chat-image-caption">${esc(caption)}</span>`:'')+html}:null;
  }
  function chat(platform){const d=draft(platform),typingKey=platform+':'+(selected[platform]||platform);if(opts.mode==='phone'&&d.typing&&d.typingReply&&!typingDone.has(typingKey)&&!typingTimer.has(typingKey))typingTimer.set(typingKey,setTimeout(()=>{typingDone.add(typingKey);typingTimer.delete(typingKey);render();},Math.max(1,Math.min(30,Number(d.typingDelay)||3))*1000));const isIOS=platform==='imessage'&&device.os==='ios',isSMS=platform==='imessage'&&device.os==='android';let last='';const list=chatMessages(platform,d);
   const messages=list.map((m,i)=>{let mine=['我',state.owner,d.ownerName,'나','me'].includes(m.who),grouped=last===m.who&&m.group!=='另起';last=m.who;const unread=unreadAt(list,d,state.owner,i);const media=chatMedia(m.text,d,platform,mine),text=media?.html??esc(m.text);return `<div class="msg ${mine?'mine':''} ${grouped?'grouped':''}" data-split>${mine?'':avatar(d.members?.find(v=>v.name===m.who)?.avatar||d.contactAvatar||state.partnerAvatar)}<div class="msg-col">${!mine&&!grouped?`<div class="sender">${esc(m.who)}</div>`:''}<div class="msgline"><div class="bubble ${media?.className||''}">${text}</div><div class="msgmeta">${mine?`<span class="unread">${isSMS?(unread?'':t('read')):unread?(platform==='line'?'':1+(d.members||[]).filter(v=>Number(v.readUntil||0)<i+1).length):(platform==='line'?t('read'):'')}</span>`:''}<time>${esc(m.time||d.messageTime||'오후 11:08')}</time></div></div></div></div>`;}).join('');
   let header=isIOS?`<div class="screen-head imessage-header"><button data-go="chatlist" aria-label="聊天列表">${icon('back')}</button><div class="im-contact">${avatar(d.contactAvatar||state.partnerAvatar,true)}<span>${esc(d.contactName||state.partner)}${icon('back')}</span></div><div class="headicons">${icon('camera')}</div></div>`:`<div class="screen-head"><button data-go="chatlist" aria-label="聊天列表">${icon('back')}</button><strong>${esc(d.roomTitle||d.contactName||state.partner)}</strong><div class="headicons">${platform==='line'?icon('phone')+icon('menu'):icon('search')+icon('menu')}</div></div>`;
   const reply=usingStory&&progress().replies.find(reply=>reply.app===platform&&reply.room===(d.id||platform));
   const send={zh:'发送预写回复',en:'Send reply',ko:'답장 보내기',ja:'返信を送信'}[language];
   const replyButton=reply?`<button class="story-reply" data-story-reply="${esc(reply.id)}">${esc(reply.text)} <span>${send}</span></button>`:'';
   let compose=replyButton+`<div class="compose"  aria-label="输入栏示意">${icon('plus')}<div class="inputshape">${d.unsentDraft?`<span class="unsent-draft" ${d.animateDraft&&opts.mode==='phone'?'data-draft-typing="'+esc(typingKey)+'"':''}>${esc(d.unsentDraft.slice(0,1000))}</span>`:isIOS?'<span>iMessage</span>':isSMS?`<span style="color:#aaa;font-size:14px">${t('sms')}</span>`:''}${icon(isIOS?'mic':'smile')}${!isIOS&&!isSMS?icon(platform==='line'?'camera':'hash'):''}</div></div>`;
   return header+`<div class="chat-scroll"><div class="date-divider">${esc(d.date||'6월 6일 토요일')}</div>${messages}${d.typing&&!typingDone.has(typingKey)?`<div class="typing-bubble" aria-label="正在输入"><i></i><i></i><i></i></div>`:''}${isIOS&&['我',state.owner,d.ownerName,'나','me'].includes(list.at(-1)?.who)?`<div class="im-read">${unreadAt(list,d,state.owner,list.length-1)?'':t('read')+' '+esc(list.at(-1)?.time||d.messageTime||'23:08')}</div>`:''}</div>`+compose;
  }
  function socialTabs(type){return `<div class="bottomtabs"><button data-go="${type==='x'?'xfeed':'instagramfeed'}" aria-label="${t('home')}">${icon('home')}</button>${icon('search')}${icon(type==='x'?'bell':'plus')}<button data-go="${type==='x'?'xprofile':'igprofile'}" aria-label="${t('profile')}">${icon('user')}</button></div>`;}
  function qooHeader(){return `<div class="theqoo-header"><button data-go="${view==='forumlist'||opts.mode!=='phone'?'home':'forumlist'}" aria-label="${t('back')}">${icon('back')}</button><span class="theqoo-logo">the<b>q</b>oo</span>${icon('search')}${icon('menu')}</div><div class="qoo-categories"><span>전체</span><span>HOT</span><span>스퀘어</span><strong>케이돌토크</strong><span>드영배</span></div>`;}
  function commentThreads(comments,platform,date){
   const handleOf=comment=>comment.handle?` <small>@${esc(comment.handle.replace(/^@/,''))}</small>`:'';
   if(platform==='forum')return comments.map((comment,index)=>{
    const label=comment.name||'무명의 더쿠';
    const target=comment.parent===null?'':`<span class="qoo-reply-ref">☞${comment.parent+1}덬</span> `;
    return `<div class="qoo-comment" data-split><div class="qoo-comment-meta">${comment.avatar?avatar(comment.avatar,true):''}<strong>${esc(label)} = ${index+1}덬</strong>${handleOf(comment)}<time>${esc(date)}</time></div><p>${target}${esc(comment.text)}</p></div>`;
   }).join('');
   const row=comment=>`<div class="comment-row ${comment.parent===null?'':'thread-reply'}" data-split>${avatar(comment.avatar,true)}<p><strong>${esc(comment.name)}</strong>${handleOf(comment)} ${esc(comment.text)}</p></div>`;
   return comments.map((comment,index)=>comment.parent===null?row(comment)+comments.filter(reply=>reply.parent===index).map(row).join(''):'').join('');
  }
  function social(template){const picker=opts.mode==='phone'&&items(state,template).length>1?`<div class="item-picker">${items(state,template).map((v,i)=>`<button data-go="item:${template}:${v.id}" aria-pressed="${(selected[template]||template)===v.id}">${esc(v.title||v.body?.slice(0,16)||'Post '+(i+1))}</button>`).join('')}</div>`:'';const d=draft(template),comments=commentItems(d,template==='forum'||template==='x'),replies=commentThreads(comments,template,d.date);
   if(template==='instagram'){const feed=view==='instagramfeed';return picker+`<div class="social-head"><button data-go="${feed?'home':'instagramfeed'}" aria-label="${t('back')}">${icon('back')}</button>${feed?'<span class="igword">Instagram</span>':`<strong>${t('posts')}</strong>`}${icon('chat')}</div><div class="social-scroll">${feed?`<div class="ig-storystrip"><div>${avatar(state.ownerAvatar,true)}${esc(state.owner)}</div><div>${avatar(state.partnerAvatar,true)}${esc(d.contactName||state.partner)}</div></div>`:''}<div class="post-author">${avatar(d.authorAvatar||state.ownerAvatar,true)}<button data-go="igprofile">${esc(d.handle)}</button>${icon('more')}</div><button data-go="instagram" style="display:block;width:100%" aria-label="${t('post')}">${media(d.images?.length?d.images:d.media)}</button><div class="post-actions"><button data-like="instagram" aria-label="点赞" aria-pressed="${liked.has('instagram:'+ (selected.instagram||'instagram'))}">${icon('heart')}</button><button data-go="igcomments" aria-label="${t('comments')}">${icon('comment')}</button>${icon('share')}${icon('bookmark')}</div><div class="post-copy" data-split><strong>${esc(liked.has(template+':'+(selected[template]||template))?String((Number(String(d.likes).replaceAll(',',''))||0)+1):d.likes)} ${t('likes')}</strong></div><div class="post-copy" data-split><strong>${esc(d.handle)}</strong> ${esc(d.body)}</div><button data-go="igcomments" style="color:#999;font-size:13px;padding:0 14px 10px">${t('comments')} ${comments.length}</button>${feed?'':replies}<div class="post-time">${esc(d.date)}</div></div>${socialTabs('instagram')}`;}
   if(template==='x')return picker+`<div class="social-head"><button data-go="xfeed" aria-label="${t('back')}">${icon('back')}</button><strong>${t('post')}</strong>${icon('more')}</div><div class="social-scroll"><article class="tweet"><div class="post-author">${avatar(d.authorAvatar||state.ownerAvatar,true)}<button class="tweet-author" data-go="xprofile"><strong>${esc(d.name)}</strong><small>@${esc(d.handle.replace(/^@/,''))}</small></button>${icon('more')}</div><div class="tweet-body" data-split>${esc(d.body)}</div>${(d.images?.length||image(d.media))?media(d.images?.length?d.images:d.media):''}<div class="tweet-time">${esc(d.date)}</div><div class="tweet-counts"><b>${esc(d.reposts)}</b> ${icon('repeat')}　<b>${esc(liked.has(template+':'+(selected[template]||template))?String((Number(String(d.likes).replaceAll(',',''))||0)+1):d.likes)}</b> ${t('likes')}</div><div class="tweet-icons">${icon('comment')}${icon('repeat')}<button data-like="x" aria-label="点赞" aria-pressed="${liked.has('x:'+ (selected.x||'x'))}">${icon('heart')}</button>${icon('bookmark')}${icon('share')}</div></article>${replies}</div>${socialTabs('x')}`;
   return picker+qooHeader()+`<div class="social-scroll"><div class="qoo-board">${esc(d.board)}</div><div class="qoo-title" data-split><span class="qoo-label">${esc(d.category||'잡담')}</span>${esc(d.title)}</div><div class="qoo-postmeta"><span class="qoo-author">${esc(d.name)}</span><span>${esc(d.date)}　${t('views')} ${esc(d.views)}</span></div><div class="qoo-body" data-split>${esc(d.body)}</div>${(d.images?.length||image(d.media))?media(d.images?.length?d.images:d.media):''}<div class="qoo-comments-title">${t('comments')} ${comments.length}</div>${replies}</div><div class="browserbar">${icon('back')}<small>theqoo.net</small>${icon('share')}</div>`;
  }
  function socialProfile(type){const d=draft(type);if(type==='instagram')return `<div class="ig-profile-head"><button data-go="instagramfeed" aria-label="${t('back')}">${icon('back')}</button><strong>${esc(d.handle)}</strong>${icon('plus')}${icon('menu')}</div><div class="social-scroll"><div class="profile-info">${avatar(state.ownerAvatar,true)}<div class="profile-stats"><span><b>1</b>${t('posts')}</span><span><b>${esc(d.followers||'0')}</b>${t('followers')}</span><span><b>${esc(d.following||'0')}</b>${t('following')}</span></div></div><div class="profile-bio"><strong>${esc(state.owner)}</strong><br>${esc(d.bio||'')}</div><div class="profile-buttons"><button data-go="instagramfeed">${t('posts')}</button><button data-go="igcomments">${t('comments')}</button></div><div class="profile-gridtabs">${icon('grid')}${icon('user')}</div><div class="profile-photo-grid"><button data-go="instagram" aria-label="${t('post')}">${media(d.images?.length?d.images:d.media)}</button></div></div>${socialTabs('instagram')}`;
   return `<div class="social-head"><button data-go="xfeed" aria-label="${t('back')}">${icon('back')}</button><strong class="x-profile-name">${esc(d.name)}</strong>${icon('more')}</div><div class="social-scroll"><div class="x-banner"></div><div class="x-profile-info">${avatar(state.ownerAvatar,true)}<h2>${esc(d.name)}</h2><small class="profile-handle">@${esc(d.handle.replace(/^@/,''))}</small><p>${esc(d.bio||'')}</p><small><b>${esc(d.following||'0')}</b> ${t('following')}　<b>${esc(d.followers||'0')}</b> ${t('followers')}</small></div><div class="feed-tabs"><span>${t('posts')}</span><span>${t('reply')}</span></div>${xTweet()}</div>${socialTabs('x')}`;
  }
  function xTweet(){const d=draft('x');return `<article class="feed-tweet">${avatar(state.ownerAvatar,true)}<div class="feed-tweet-copy"><button data-go="xprofile" class="feed-tweet-author">${esc(d.name)} <small>@${esc(d.handle.replace(/^@/,''))}</small></button><button data-go="x" class="feed-tweet-body">${esc(d.body)}</button>${(d.images?.length||image(d.media))?`<button data-go="x" style="display:block;width:100%">${media(d.images?.length?d.images:d.media)}</button>`:''}<div class="tweet-icons">${icon('comment')}${icon('repeat')}${icon('heart')}${icon('share')}</div></div></article>`;}
  function chatList(){
   const p=currentChat,title=p==='imessage'?t('messages'):t('chats'),samsung=p==='imessage'&&device.os==='android';
   const storyMessages=progress()?.messages||[];
   const row=items(state,p).map(d=>{
    const latest=chatMessages(p,d,storyMessages).at(-1);
    return `<button class="listroom" data-go="item:${p}:${esc(d.id)}">${avatar(d.members?.[0]?.avatar||d.contactAvatar||state.partnerAvatar,p!=='kakao')}<div class="roomline"><div class="roomcopy">${esc(d.roomTitle||d.contactName||state.partner)}<small>${esc(latest?.text?.replace(/\[附件-([a-z0-9-]{1,50})\]$/,(_,id)=>d.attachments?.some(a=>a.id===id&&(audio(a.src)||voiceSeconds(a.duration)))?{zh:'[语音]',en:'[Voice]',ko:'[음성]',ja:'[音声]'}[language]:{zh:'[图片]',en:'[Image]',ko:'[사진]',ja:'[画像]'}[language])||'')}</small></div><div class="roomtime">${esc(latest?.time||d.messageTime||state.time)}${Number(d.incomingUnread)>0?`<span class="unreadbadge">${Number(d.incomingUnread)}</span>`:''}</div></div></button>`;
   }).join('');
   if(p==='kakao')return `<div class="kakao-list-top"><button data-go="home" aria-label="${t('back')}">${icon('back')}</button><strong>${title}</strong><div class="list-actions">${icon('search')}${icon('chat')}${icon('more')}</div></div><div class="kakao-list-tabs"><span>${t('all')}</span><span>${t('favorite')}</span></div><div class="fill">${row}</div><div class="kakaonav"><span>${icon('user')}${t('friends')}</span><span class="active">${icon('chat')}${t('chats')}</span><span>${icon('comment')}${t('openchat')}</span><span>${icon('more')}${t('more')}</span></div>`;
   return `<div class="${samsung?'sms-list':p==='line'?'line-list':'message-list'}" style="display:flex;flex-direction:column;flex:1;min-height:0"><div class="native-topline"><button data-go="home" aria-label="${t('back')}">${icon('back')}</button><span>${p==='line'?icon('chat'):icon('note')}</span></div><div class="native-title">${title}</div><label class="native-search">${icon('search')}<input data-room-search aria-label="${t('search')}" placeholder="${t('search')}"></label><div class="fill">${row}</div></div>`;
  }
  function calls(){
   const rows=recentCalls.map((r,i)=>callFilter==='missed'&&!r.missed?'':`<button class="callrow ${r.missed?'missed':''}" data-call="${i}">${icon('phone')}<div class="calltext"><strong>${esc(r.name)}</strong><small>${esc(r.status||t('mobile'))}</small></div><time>${esc(r.time)}${r.date?`<small>${r.date}</small>`:''}</time><span class="info">i</span></button>`).join('');
   return `<div class="native-topline"><button data-go="home" aria-label="${t('back')}">${icon('back')}</button><span>${t('edit')}</span></div><div class="native-title">${t('recent')}</div><div class="call-controls"><div class="call-segment"><button data-call-filter="all" class="${callFilter==='all'?'selected':''}">${t('all')}</button><button data-call-filter="missed" class="${callFilter==='missed'?'selected':''}">${t('missed')}</button></div>${icon('search')}</div><div class="fill">${rows}</div><div class="native-bottom"><span>${icon('heart')}${t('favorite')}</span><span class="selected">${icon('phone')}${t('recent')}</span><span>${icon('user')}${t('contacts')}</span><span>${icon('grid')}${t('keypad')}</span></div>`;
  }
  function calendar(){
   const month=calendarDay.slice(0,7);
   const first=new Date(month+'-01T00:00:00Z');
   const last=new Date(first);
   last.setUTCMonth(last.getUTCMonth()+1,0);
   const eventDates=new Set(agenda.rows.map(event=>event.date));
   const days=Array.from({length:last.getUTCDate()},(_,i)=>{
    const date=month+'-'+String(i+1).padStart(2,'0');
    return `<button data-day="${date}" aria-pressed="${calendarDay===date}" class="${calendarDay===date?'selected ':''}${eventDates.has(date)?'has-events':''}">${i+1}</button>`;
   }).join('');
   const events=agenda.rows.filter(event=>event.date===calendarDay).map(event=>
    `<div class="event-row"><time>${esc(event.time)}</time><div>${esc(event.title)}</div></div>`).join('');
   const weekdays=t('weekdays').split(',').map(w=>`<span class="weekday">${w}</span>`).join('');
   return `<div class="calendar-head"><button data-go="home" aria-label="${t('back')}">${icon('back')}</button><div class="calendar-nav"><button data-calendar-month="-1" aria-label="${calendarLabels[0]}" ${month==='0001-01'?'disabled':''}>‹</button><button data-calendar-month="1" aria-label="${calendarLabels[1]}" ${month==='9999-12'?'disabled':''}>›</button></div></div>
    <div class="calendar-month">${esc(monthLabel.format(first))}</div>
    <div class="calendar-grid">${weekdays}${'<span></span>'.repeat(first.getUTCDay())}${days}</div>
    <div class="event-list"><div class="event-date">${calendarDay}</div>${events||`<small style="color:#777">${t('noEvents')}</small>`}</div>
    <div class="native-bottom"><button data-calendar-start>${t('calendarToday')}</button><span>${nameOf('calendar')}</span><span>${t('event')}</span></div>`;
  }
  function messagesGlyph(){const android=device.os==='android',google=android&&state.phone.androidMessages==='google';return `<svg class="brand-message-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="64" height="64" rx="14" fill="${android?google?'#fff':'#168bf4':'#32c759'}"/><path d="M12 28C12 18 20 12 32 12s20 6 20 16-8 17-20 17c-3 0-6-.4-8-1l-11 6 3-12c-3-3-4-6-4-10Z" fill="${google?'#1a73e8':'#fff'}"/>${android?`<circle cx="24" cy="29" r="2.4" fill="${google?'#fff':'#168bf4'}"/><circle cx="32" cy="29" r="2.4" fill="${google?'#fff':'#168bf4'}"/><circle cx="40" cy="29" r="2.4" fill="${google?'#fff':'#168bf4'}"/>`:''}</svg>`;}
  const glyphs={forum:'<span style="font-family:Arial;font-size:15px;font-weight:700;letter-spacing:-1px">theqoo</span>'};
  function appbutton(id,cfg){let target=cfg.target||id;const chat=templates[target]?.kind==='chat',art=image(cfg.icon)||image(builtInIcons[cfg.iconPreset||id]);let glyph=art?`<img src="${art}" alt="">`:glyphs[id]||icon('grid');if(id==='imessage'&&device.os==='android'&&!image(cfg.icon)&&!cfg.iconPreset)glyph=messagesGlyph();if(id==='calendar'&&!image(cfg.icon)&&!cfg.iconPreset)glyph=`<small>${t('weekdays').split(',')[new Date(agenda.start+'T00:00:00Z').getUTCDay()]}</small><b>${Number(agenda.start.slice(-2))}</b>`;const route=chat?'rooms:'+target:({instagram:'instagramfeed',x:'xfeed',forum:'forumlist'})[target]||target;const label=appName(cfg,state.phone);
   const unread=chat?(progress()?.messages||[]).filter(m=>m.app===target&&!readMessages.has(m.id)&&(!m.withdrawAt||m.withdrawAt>Date.now())).length:0;
   return `<button class="appbutton" data-go="${esc(route)}" aria-label="${esc(label)}"><span class="appglyph ${esc(id)}">${glyph}</span>${unread?`<span class="app-unread">${unread}</span>`:''}<span>${esc(label)}</span></button>`;}
  function notesDetail(note,multiple){return `<div class="notes-toolbar"><button data-go="${multiple?'notes':'home'}" aria-label="${multiple?'返回备忘录列表':'返回桌面'}">${icon('back')}${nameOf('notes')}</button><div class="note-tools">${icon('share')}${icon('more')}</div></div><article class="note-detail"><div class="note-timestamp">${esc(note.date)}</div><h2>${esc(note.title)}</h2><div class="note-body">${esc(note.body)}</div></article><div class="note-bottom"><span>Aa</span>${icon('note')}${icon('camera')}${icon('grid')}</div>`;}
  function notes(){const items=allNotes();if(items.length===1)return notesDetail(items[0],false);return `<div class="notes-toolbar"><button data-go="home" aria-label="返回桌面">${icon('back')}${t('folders')}</button>${icon('more')}</div><div class="notes-list"><h1 class="notes-title">${nameOf('notes')}</h1><label class="notes-search">${icon('search')}<input data-note-search aria-label="搜索备忘录" placeholder="${t('search')}" autocomplete="off"></label><div class="notes-group-label">${t('recentNotes')}</div><div class="notes-rows">${items.map(n=>`<button class="note-row" data-note="${esc(n.id)}" aria-label="打开备忘录 ${esc(n.title)}"><strong>${esc(n.title)}</strong><p><time>${esc(n.date)}</time>${esc(n.body.split('\n').filter(Boolean)[0]||t('noText'))}</p></button>`).join('')}</div>${!items.length?`<div class="blockedapp">${t('noNotes')}</div>`:''}</div><div class="notes-footer">${icon('grid')}<small>${items.length} ${t('notesCount')}</small>${icon('note')}</div>`;}
  function latestNotification(){
   return progress()?.messages.findLast(message=>allowed(message.app)&&items(state,message.app).some(room=>room.id===(message.room||message.app)));
  }
  function homeWidgets(){
   const settings=state.phone.homeWidgets;
   if(!settings)return '';
   const overview=settings.overview?`<div class="home-widget widget-overview"><strong>${esc(state.time)}</strong><span>${esc(state.phone.date)}</span>${settings.location?`<small>${esc(settings.location)}</small>`:''}</div>`:'';
   const notes=allowed('notes')&&settings.note?allNotes():[];
   const note=notes.find(note=>note.id===settings.noteId)||(!settings.noteId&&notes[0]);
   const noteCard=note?`<button type="button" class="home-widget widget-note" data-note="${esc(note.id)}"><small>${nameOf('notes')}</small><strong>${esc(note.title)}</strong><span>${esc(note.body)}</span></button>`:'';
   const index=Number(settings.photoIndex??2);
   const photo=settings.photo&&allowed('album')?image(state.phone.photos[index]):'';
   const photoCard=photo?`<button type="button" class="home-widget widget-photo" data-photo="${index}" aria-label="${nameOf('album')} ${index+1}"><img src="${photo}" alt=""></button>`:'';
   return overview||noteCard||photoCard?`<div class="home-widgets">${overview}${photoCard}${noteCard}</div>`:'';
  }
  function calendarWidget(){
   if(!state.phone.calendarWidget||!allowed('calendar'))return '';
   const date=validDate(state.phone.calendarDate)||agenda.start!==legacyCalendarDate?agenda.start:state.phone.date;
   const event=agenda.rows.find(row=>row.date===agenda.start);
   const entry=event?[event.time,event.title].filter(Boolean).join(' · '):'';
   return `<button class="calendar-widget" data-go="calendar"><small>${esc(nameOf('calendar'))}</small><strong>${esc(date)}</strong><span>${esc(entry||'')}</span></button>`;
  }
  function lockNotification(){
   const [app,id]=(state.phone.lockNotification||'').split(':');
   if(!id||!templates[app]||!allowed(app))return '';
   const room=items(state,app).find(conversation=>conversation.id===id);
   if(!room)return '';
   const latest=chatMessages(app,room).at(-1);
   if(!latest)return '';
   return `<button class="read-notification" data-go="item:${app}:${esc(id)}"><small>${esc(nameOf(app))}</small><strong>${esc(latest.who)}</strong><br>${esc(latest.text.replace(/\[附件-[a-z0-9-]+\]$/,''))}</button>`;
  }
  const lockCopy={
   zh:['锁屏','向上轻扫或轻点以打开','输入锁屏密码','密码不正确，请重试。','取消','解锁'],
   en:['Lock Screen','Swipe up or tap to open','Enter the passcode','Incorrect passcode. Try again.','Cancel','Unlock'],
   ko:['잠금 화면','위로 쓸어올리거나 탭하여 열기','암호 입력','암호가 올바르지 않습니다.','취소','잠금 해제'],
   ja:['ロック画面','上にスワイプ、またはタップして開く','パスコードを入力','パスコードが違います。','キャンセル','ロック解除']
  }[language];
  function pinMarkup(){
   const letters=['','ABC','DEF','GHI','JKL','MNO','PQRS','TUV','WXYZ'];
   const digit=(number,label='')=>`<button type="button" data-pin-digit="${number}" aria-label="${number}"><b>${number}</b>${label?`<small>${label}</small>`:''}</button>`;
   const erase={zh:'删除',en:'Delete',ko:'삭제',ja:'削除'}[language];
   return `<form class="lock-code" data-pin-form>
    <label for="pocket-pin">${lockCopy[2]}</label>
    <input id="pocket-pin" data-pin-input type="password" inputmode="none" maxlength="${passcode.length}" autocomplete="off">
    <div class="pin-dots" aria-hidden="true">${Array.from(passcode,()=>'<span class="pin-dot"></span>').join('')}</div>
    <p data-pin-error role="status"></p>
    <div class="pin-keys">
     ${letters.map((label,i)=>digit(i+1,label)).join('')}
     <button type="button" class="pin-action" data-go="lock">${lockCopy[4]}</button>
     ${digit(0)}
     <button type="button" class="pin-action" data-pin-delete>${erase}</button>
    </div>
   </form>`;
  }
  function homeMarkup(){
   const latest=latestNotification();
   const apps=state.phone.apps.filter(visibleApp);
   const dockRank=app=>defaultDock.includes(app.type)?defaultDock.indexOf(app.type):10;
   const dock=apps.filter(app=>app.dock).sort((a,b)=>state.phone.manualAppOrder?0:dockRank(a)-dockRank(b)).slice(0,4);
   const grid=apps.filter(app=>!dock.includes(app));
   const first=grid.filter(app=>app.page!=='2').slice(0,12);
   const second=grid.filter(app=>!first.includes(app));
   const label=index=>({zh:'桌面第 '+(index+1)+' 页',en:'Home page '+(index+1),ko:'홈 화면 '+(index+1)+'페이지',ja:'ホーム画面 '+(index+1)+'ページ'})[language];
   const pages=[first,second].map((page,index)=>`<div class="home-page" aria-label="${label(index)}" ${index!==homePage?'inert aria-hidden="true"':''}>
    ${index===0?homeWidgets()+calendarWidget():''}<div class="appgrid">${page.map(app=>appbutton(app.type,app)).join('')}</div>
    ${index===0?`${usingStory&&latest&&allowed(latest.app)?`<button class="read-notification" data-go="item:${latest.app}:${esc(latest.room||latest.app)}"><small>${esc(nameOf(latest.app))}</small><strong>${esc(latest.who==='owner'?state.owner:state.partner)}</strong><br>${esc(storyMessageText(latest))}</button>`:''}${!usingStory&&notify&&activeApp(state,state.phone.chatPlatform)?`<button class="read-notification" data-go="${state.phone.chatPlatform}"><small>${esc(nameOf(state.phone.chatPlatform))}</small><strong>${esc(state.partner)}</strong><br>${esc(state.phone.newMessage)}</button>`:''}`:''}
   </div>`).join('');
   const dots=[0,1].map(index=>`<button type="button" class="home-page-dot" data-home-page="${index}" aria-label="${label(index)}" aria-pressed="${homePage===index}"></button>`).join('');
   return `<div class="phonewall homewall">
    <div class="home-pages"><div class="home-track" style="transform:translateX(${homePage*-100}%)">${pages}</div></div>
    <div class="home-bottom"><div class="home-controls">${dots}<button class="home-search" data-go="appsearch">${icon('search')}${t('search')}</button></div>
    <div class="home-dock">${dock.map(app=>appbutton(app.type,app)).join('')}</div></div>
   </div>`;
  }
  function content(){
   if(!allowed(view)||view==='inactive')return head('FicPhone')+`<div class="blockedapp">${icon('lock')}<p>${t('inactive')}</p></div>`;
   if(view==='lock')return `<div class="phonewall lockwall"><div class="wall-date">${esc(state.phone.date)}</div><div class="wall-time">${esc(state.time)}</div>${state.phone.showLockIntro&&state.phone.intro?`<p class="lock-intro">${esc(state.phone.intro)}</p>`:''}${lockNotification()}<div class="lock-bottom"><button data-go="home" aria-label="${lockCopy[0]} · ${lockCopy[5]}">${icon('lock')}</button><button data-go="album" aria-label="${nameOf('album')}">${icon('camera')}</button></div><button class="lock-hint" data-go="home">${lockCopy[1]}</button></div>`;
   if(view==='passcode')return pinMarkup();
   if(view==='home')return homeMarkup();
   if(view==='appsearch')return head(t('search'))+`<div class="notes-search" style="margin:15px">${icon('search')}<input data-app-search aria-label="搜索应用" placeholder="${t('search')}"></div><div class="appgrid search-apps" style="padding:20px">${state.phone.apps.filter(visibleApp).map(a=>appbutton(a.type,a)).join('')}</div><div class="fill"></div>`;
   if(templates[view])return templates[view].kind==='chat'?chat(view):social(view);
   if(view==='chatlist')return chatList();
   if(view==='instagramfeed')return social('instagram');
   if(view==='igprofile')return socialProfile('instagram');
   if(view==='xprofile')return socialProfile('x');
   if(view==='xfeed')return `<div class="social-head"><button data-go="home" aria-label="${t('back')}">${avatar(state.ownerAvatar,true)}</button><strong style="font-size:26px">𝕏</strong>${icon('more')}</div><div class="feed-tabs"><span>${t('forYou')}</span><span>${t('following')}</span></div><div class="social-scroll">${xTweet()}</div>${socialTabs('x')}`;
   if(view==='igcomments')return head(t('comments'),'instagram')+`<div class="social-scroll">${commentThreads(commentItems(draft('instagram')),'instagram',draft('instagram').date)}</div><div class="compose">${avatar(state.ownerAvatar,true)}<div class="inputshape" style="justify-content:flex-start;color:#aaa;font-size:13px">${t('writeComment')}</div></div>`;
   if(view==='forumlist'){const d=draft('forum');return qooHeader()+`<div class="social-scroll"><div class="qoo-board">${esc(d.board)}</div><div class="qoo-filter"><b>전체</b><span>잡담</span><span>스퀘어</span><span>후기</span></div><button class="qoo-list-row" data-go="forum"><span class="qoo-label">${esc(d.category||'잡담')}</span>${esc(d.title)}<span class="count">${commentItems(d,true).length}</span><div class="qoo-meta">${esc(d.date)}　${t('views')} ${esc(d.views)}</div></button></div><div class="browserbar">${icon('back')}<small>theqoo.net</small>${icon('share')}</div>`;}
   if(view==='albums')return head(({zh:'相册',en:'Albums',ko:'앨범',ja:'アルバム'})[language],'album-all')+`<div class="albumgrid album-collections"><button data-go="album-all">${state.phone.photos[0]?`<img src="${image(state.phone.photos[0])}" alt="${t('all')}">`:icon('grid')}<strong>${t('all')}</strong><small>${state.phone.photos.length}</small></button>${(state.phone.albums||[]).map(a=>`<button data-go="album-item:${a.id}">${a.photoIndexes.length?`<img src="${image(state.phone.photos[a.photoIndexes[0]])}" alt="${esc(a.name)}">`:`<div class="empty-album">${icon('grid')}</div>`}<strong>${esc(a.name||'Album')}</strong><small>${a.photoIndexes.length}</small></button>`).join('')}</div>`;
   if(view==='album'){const album=(state.phone.albums||[]).find(a=>a.id===currentAlbum),indexes=album?album.photoIndexes:state.phone.photos.map((_,i)=>i);return head(album?.name||nameOf('album'),album?'albums':'home')+`<div class="photo-head">${album?esc(album.name):t('library')}</div><div class="albumgrid">${indexes.length?indexes.map(i=>`<button data-photo="${i}" aria-label="打开照片 ${i+1}"><img src="${image(state.phone.photos[i])}" alt="照片 ${i+1}"></button>`).join(''):`<div class="empty-album">${({zh:'没有照片',en:'No photos',ko:'사진 없음',ja:'写真なし'})[language]}</div>`}</div><div class="photos-tabs"><button data-go="album-all">${t('library')}</button><button data-go="albums">${({zh:'相册',en:'Albums',ko:'앨범',ja:'アルバム'})[language]}</button></div>`;}

   if(view==='photo'){const latest=latestNotification();return `<div class="photo-toolbar"><button data-go="album" aria-label="${t('back')}">${icon('back')}</button><strong>${t('photo')}</strong>${icon('more')}</div><div class="photo-viewer"><div class="photodetail">${state.phone.photos.length?media(state.phone.photos[photoIndex]):media('')}</div><div class="photocaption">${esc(state.phone.photoCaption)}</div>${usingStory&&latest&&allowed(latest.app)?`<button class="read-notification" data-go="item:${latest.app}:${esc(latest.room||latest.app)}"><small>${esc(nameOf(latest.app))}</small><strong>${esc(latest.who==='owner'?state.owner:state.partner)}</strong><br>${esc(storyMessageText(latest))}</button>`:''}${!usingStory&&notify&&activeApp(state,state.phone.chatPlatform)?`<button class="read-notification" data-go="${state.phone.chatPlatform}"><small>${esc(state.partner)}</small>${esc(state.phone.newMessage)}</button>`:''}<div class="photo-actions">${icon('share')}${icon('heart')}${icon('more')}</div></div>`;}
   if(view==='notes')return notes();
   if(view==='note'){const items=allNotes();return notesDetail(items.find(n=>n.id===noteId)||items[0]||{title:'메모',body:'',date:''},items.length>1);}
   if(view==='calendar')return calendar();
   if(view==='calls')return calls();
   if(view==='calldetail'){const r=recentCalls[callIndex]||{name:state.partner,time:'',status:''};return head(t('callDetails'),'calls')+`<div class="contact-detail">${avatar(state.partnerAvatar,true)}<h2>${esc(r.name)}</h2><div class="contact-card"><strong>${esc(r.time)}</strong>${r.date?`<br><time datetime="${r.date}">${r.date}</time>`:''}<br>${esc(r.status)}<br><br><span style="color:#007aff">${t('mobile')}</span></div></div>`;}
   return head('应用')+`<div class="blockedapp">${icon('grid')}<br>此图标仅用于桌面装饰。</div>`;
  }
  function updateBanner(){
   const messages=progress()?.messages||[];
   for(const message of messages){
    const opened=message.app===view&&(message.room||message.app)===(selected[view]||view);
    if(opened)readMessages.add(message.id);
    if(announcedMessages.has(message.id))continue;
    announcedMessages.add(message.id);
    if(opened||['home','photo','lock'].includes(view)||!allowed(message.app)||message.who==='owner')continue;
    activeBanner=message;
    clearTimeout(bannerTimer);
    bannerTimer=setTimeout(()=>{activeBanner=null;if(alive)render();},3800);
   }
   if(!activeBanner||['home','photo','lock'].includes(view)||readMessages.has(activeBanner.id))return '';
   const message=activeBanner;
   return `<button class="story-notification-banner" data-go="item:${message.app}:${esc(message.room||message.app)}"><strong>${esc(nameOf(message.app))}</strong><span>${esc(storyMessageText(message))}</span></button>`;
  }
  function bindPin(form){
   const input=form.querySelector('[data-pin-input]');
   const error=form.querySelector('[data-pin-error]');
   const dots=[...form.querySelectorAll('.pin-dot')];
   function enter(value){
    input.value=value.replace(/[^0-9]/g,'').slice(0,passcode.length);
    error.textContent='';
    if(input.value.length===passcode.length){
     if(input.value===passcode){unlocked=true;go(unlockDestination);return;}
     input.value='';
     error.textContent=lockCopy[3];
    }
    dots.forEach((dot,i)=>dot.classList.toggle('filled',i<input.value.length));
   }
   input.oninput=()=>enter(input.value);
   form.onsubmit=event=>{event.preventDefault();enter(input.value);};
   form.querySelectorAll('[data-pin-digit]').forEach(button=>button.onclick=()=>enter(input.value+button.dataset.pinDigit));
   form.querySelector('[data-pin-delete]').onclick=()=>enter(input.value.slice(0,-1));
   form.addEventListener('keydown',event=>{
    if(event.target===input||event.ctrlKey||event.metaKey||event.altKey)return;
    if(event.key==='Backspace'){event.preventDefault();enter(input.value.slice(0,-1));}
    else if(/^[0-9]$/.test(event.key)){event.preventDefault();enter(input.value+event.key);}
   });
  }
  function bindHomePages(pages){
   const track=pages.querySelector('.home-track');
   const panels=[...track.children];
   const buttons=[...root.querySelectorAll('[data-home-page]')];
   function selectPage(index){
    homePage=index;
    track.style.transform=`translateX(${-index*100}%)`;
    panels.forEach((panel,i)=>{
     panel.inert=i!==index;
     if(i===index)panel.removeAttribute('aria-hidden');
     else panel.setAttribute('aria-hidden','true');
    });
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
   }
   buttons.forEach((button,index)=>button.onclick=()=>selectPage(index));
   let start=null,suppressClick=false;
   pages.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    suppressClick=false;
    start={x:event.clientX,y:event.clientY,id:event.pointerId};
   });
   pages.addEventListener('pointermove',event=>{
    if(start?.id!==event.pointerId)return;
    const dx=Math.abs(event.clientX-start.x),dy=Math.abs(event.clientY-start.y);
    if(dx>14&&dx>dy&&!pages.hasPointerCapture(event.pointerId))pages.setPointerCapture(event.pointerId);
   });
   pages.addEventListener('pointerup',event=>{
    if(start?.id!==event.pointerId)return;
    const dx=event.clientX-start.x,dy=event.clientY-start.y;
    if(Math.abs(dx)>=36&&Math.abs(dx)>Math.abs(dy)){
     suppressClick=true;
     selectPage(dx<0?1:0);
    }
    start=null;
   });
   pages.addEventListener('pointercancel',()=>{start=null;});
   pages.addEventListener('click',event=>{
    if(!suppressClick||event.detail===0)return;
    suppressClick=false;
    event.preventDefault();event.stopPropagation();
   },true);
  }
  const draftTypingStart=new Map();
  let draftFrame;
  function stopDraftTyping(){
   if(draftFrame!==undefined){cancelAnimationFrame(draftFrame);draftFrame=undefined;}
  }
  function animateUnsentDraft(){
   const draft=root.querySelector('[data-draft-typing]');
   if(!draft||typeof requestAnimationFrame!=='function'||globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
   const text=draft.textContent;
   const characters=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter().segment(text)].map(part=>part.segment):Array.from(text);
   const key=draft.dataset.draftTyping;
   const start=draftTypingStart.get(key)??performance.now();
   draftTypingStart.set(key,start);
   const interval=Math.min(65,5000/Math.max(1,characters.length));
   function frame(now){
    const count=Math.min(characters.length,Math.floor((now-start)/interval)+1);
    draft.textContent=characters.slice(0,count).join('');
    if(count<characters.length)draftFrame=requestAnimationFrame(frame);
    else draftFrame=undefined;
   }
   frame(performance.now());
  }
  function render(){
   stopDraftTyping();
   root.querySelectorAll('.voice-message').forEach(recording=>recording.pause());
   const banner=updateBanner();
   let theme=templates[view]?.kind==='chat'?view:'';if(theme==='imessage'&&device.os==='android')theme='samsungmessages'+(state.phone.androidMessages==='google'?' googlemessages':'');let lock=view==='lock'||view==='passcode',home=view==='home',noteView=view==='notes'||view==='note',single=noteView&&allNotes().length===1;let deviceClass=`pocket-device ${theme} ${device.os} ${framed?'framed':''} ${opts.long?'long':''} ${lock?'lockdevice':''} ${home?'home-device':''} ${view==='photo'?'photo-device':''} ${noteView?'notes-device':''} ${view==='note'||single?'note-detail-device':''}`;
   const border=framed?5:0,radius=framed?device.radius:0;const wall=lock?image(state.phone.lockwallpaper):home?image(state.phone.wallpaper):'';
   const custom=state.phone.font==='custom'&&customFont(state.phone.customFont);
   const points=workPoints(state.phone.workPoints);
   const family=custom?'FicImportedFont,sans-serif':fontStack(state.phone.font);
   const size=points?points+'pt':(({small:13,large:18})[state.phone.textSize]||15)+'px';
   root.innerHTML=`${custom?`<style>@font-face{font-family:FicImportedFont;src:url('${custom}') format('woff2');font-display:swap}</style>`:''}<div class="pocket-fit"><div class="pocket-shell ${framed?'hardware':''}" style="width:${device.w+border*2}px;padding:${border}px;border-radius:${radius+border}px"><div class="${deviceClass}" data-capture style="width:${device.w}px;height:${device.h}px;--screen-h:${device.h}px;border-radius:${radius}px;--work-font:${family};--work-size:${size};${wall?`background-image:url('${wall}');background-position:${lock?state.phone.lockX??50:state.phone.wallX??50}% ${lock?state.phone.lockY??50:state.phone.wallY??50}%`:''}">${wall?`<div class="wallpaper-layer" style="background-image:url('${wall}');background-position:${lock?state.phone.lockX??50:state.phone.wallX??50}% ${lock?state.phone.lockY??50:state.phone.wallY??50}%;transform:scale(${(lock?state.phone.lockZoom||100:state.phone.wallZoom||100)/100})"></div>`:''}<div class="sysbar"><span>${esc(state.time)}</span>${state.phone.hideCutout?'':device.os==='android'?'<div class="camera-hole" aria-label="前置摄像头"></div>':'<div class="island" aria-label="灵动岛"></div>'}<div class="sysright">${icon('signal')}${icon('wifi')}${batteryMarkup()}</div></div><div class="screen-main">${content()}</div>${banner}${storyOverlay()}${state.phone.authorCredit&&((opts.mode==='screenshot'&&state.phone.watermarkImage)||(opts.exported&&state.phone.readerLayout==='screen'&&state.phone.watermarkHTML))?`<div class="work-watermark">${esc(state.phone.authorCredit)}</div>`:''}<div class="gesture"><button data-go="home" aria-label="返回手机桌面"></button></div></div></div></div>${hintMarkup()}`;
   root.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{if(opts.mode==='phone')go(b.dataset.go);}));
   root.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{photoIndex=+b.dataset.photo;view='photo';if(!usingStory&&state.phone.rule&&!viewed){viewed=true;notify=true;}storyEvent('photo',String(photoIndex));render();}));
   root.querySelectorAll('[data-note]').forEach(b=>b.addEventListener('click',()=>{noteId=b.dataset.note;view='note';storyEvent('note',noteId);render();}));
   root.querySelectorAll('[data-voice-metadata]').forEach(recording=>{
    const time=recording.parentElement.querySelector('[data-voice-time]');
    const update=()=>{time.textContent=voiceTime(voiceSeconds(Math.ceil(recording.duration)),time.dataset.voiceTime==='padded');};
    if(recording.readyState>=1)update();
    else recording.addEventListener('loadedmetadata',update,{once:true});
   });
   root.querySelectorAll('[data-voice-play]').forEach(button=>{
    const card=button.parentElement,recording=card.querySelector('audio');
    button.addEventListener('click',()=>{
     if(!recording.paused){recording.pause();return;}
     root.querySelectorAll('.voice-message').forEach(player=>{if(player!==recording)player.pause();});
     recording.play().catch(()=>{button.setAttribute('aria-pressed','false');});
    });
    recording.addEventListener('play',()=>button.setAttribute('aria-pressed','true'));
    recording.addEventListener('pause',()=>button.setAttribute('aria-pressed','false'));
    recording.addEventListener('ended',()=>button.setAttribute('aria-pressed','false'));
   });
   root.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>{calendarDay=b.dataset.day;render();}));
   root.querySelectorAll('[data-calendar-month]').forEach(b=>b.addEventListener('click',()=>{
    const month=new Date(calendarDay.slice(0,7)+'-01T00:00:00Z');
    month.setUTCMonth(month.getUTCMonth()+Number(b.dataset.calendarMonth));
    const date=validDate(month.toISOString().slice(0,10));
    if(date){calendarDay=date;render();}
   }));
   root.querySelector('[data-calendar-start]')?.addEventListener('click',()=>{calendarDay=agenda.start;render();});
   root.querySelectorAll('[data-call]').forEach(b=>b.addEventListener('click',()=>{callIndex=+b.dataset.call;go('calldetail');}));
   root.querySelectorAll('[data-call-filter]').forEach(b=>b.addEventListener('click',()=>{callFilter=b.dataset.callFilter;render();}));
   const rs=root.querySelector('[data-room-search]');if(rs)rs.oninput=()=>root.querySelectorAll('.listroom').forEach(row=>row.hidden=!row.textContent.toLowerCase().includes(rs.value.toLowerCase()));
   const ns=root.querySelector('[data-note-search]');if(ns)ns.oninput=()=>root.querySelectorAll('[data-note]').forEach(row=>row.hidden=!row.textContent.toLowerCase().includes(ns.value.toLowerCase()));
   const as=root.querySelector('[data-app-search]');if(as)as.oninput=()=>root.querySelectorAll('.appbutton').forEach(row=>row.hidden=!row.textContent.toLowerCase().includes(as.value.toLowerCase()));
   root.querySelector('[data-story-reply]')?.addEventListener('click',event=>{
    if(storyEngine.respond(event.currentTarget.dataset.storyReply)){persistStory();scheduleStory();render();}
   });
   root.querySelectorAll('[data-story-choice]').forEach(b=>b.onclick=()=>{storyEngine.choose(+b.dataset.storyChoice);persistStory();render();});const close=root.querySelector('[data-story-close]');if(close)close.onclick=()=>{endingDismissed=true;render();};
   root.querySelector('[data-hints]')?.addEventListener('click',()=>{if(suppressHintClick){suppressHintClick=false;return;}hintsOpen=!hintsOpen;if(opts.storageKey)try{localStorage.setItem(opts.storageKey+'-hints',hintsOpen?'on':'off');}catch{}hintMore=false;render();});root.querySelector('[data-hint-more]')?.addEventListener('click',()=>{hintMore=true;render();});
   root.querySelectorAll('[data-like]').forEach(b=>b.onclick=()=>{const id=b.dataset.like,key=id+':'+(selected[id]||id);if(!liked.has(key)){liked.add(key);storyEngine?.visit([{event:'like',target:selected[id]||id},{event:'like',target:id}]);persistStory();scheduleStory();render();}});
   const languagePicker=root.querySelector('[data-hint-language]');
   if(languagePicker)languagePicker.onchange=()=>{
    hintOverride=true;
    hintLanguage=languagePicker.value;
    render();
    root.querySelector('[data-hint-language]')?.focus();
   };
   const pinForm=root.querySelector('[data-pin-form]');
   if(pinForm)bindPin(pinForm);
   const pages=root.querySelector('.home-pages');
   if(pages)bindHomePages(pages);
   const lockScreen=root.querySelector('.lockwall');
   if(lockScreen){
    lockScreen.style.touchAction='none';
    let swipe;
    lockScreen.addEventListener('pointerdown',event=>{
     if(event.isPrimary&&event.button===0)swipe={x:event.clientX,y:event.clientY};
    });
    lockScreen.addEventListener('pointerup',event=>{
     if(swipe&&swipe.y-event.clientY>45&&Math.abs(event.clientX-swipe.x)<swipe.y-event.clientY)go('home');
     swipe=null;
    });
    lockScreen.addEventListener('pointercancel',()=>{swipe=null;});
   }
   const hintWindow=root.querySelector('.reader-hints');
   if(hintWindow)for(const grip of hintWindow.querySelectorAll('[data-hint-drag],[data-hints]')){
    let drag=null;
    grip.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=hintWindow.getBoundingClientRect(),parent=root.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:r.left-parent.left,top:r.top-parent.top,moved:false};grip.setPointerCapture?.(e.pointerId);});
    grip.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<5)return;drag.moved=true;placeHint(drag.left+dx,drag.top+dy,true);e.preventDefault();});
    const end=e=>{if(!drag||drag.id!==e.pointerId)return;if(drag.moved){suppressHintClick=true;setTimeout(()=>{suppressHintClick=false;},0);e.preventDefault();}grip.releasePointerCapture?.(e.pointerId);drag=null;};
    grip.addEventListener('pointerup',end);grip.addEventListener('pointercancel',end);
    if(grip.hasAttribute('data-hint-drag'))grip.addEventListener('keydown',e=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!d)return;const r=hintWindow.getBoundingClientRect(),parent=root.getBoundingClientRect(),speed=e.shiftKey?24:8;placeHint(r.left-parent.left+d[0]*speed,r.top-parent.top+d[1]*speed,true);e.preventDefault();});
   }
   const chatScroll=root.querySelector('.chat-scroll');if(opts.mode==='phone'&&chatScroll)chatScroll.scrollTop=chatScroll.scrollHeight;
   animateUnsentDraft();
   fit();
  }
  function placeHint(x,y,remember=false){const hint=root.querySelector('.reader-hints');if(!hint)return;const width=root.clientWidth||1,height=root.clientHeight||1;const point={x:Math.max(4,Math.min(width-hint.offsetWidth-4,x)),y:Math.max(4,Math.min(height-hint.offsetHeight-4,y))};hint.style.left=point.x+'px';hint.style.top=point.y+'px';hint.style.bottom='auto';if(remember)hintPosition=point;}
  function fit(){
   const fitEl=root.querySelector('.pocket-fit'),shell=root.querySelector('.pocket-shell');if(!shell)return;
   const available=root.clientWidth||shell.offsetWidth,availableHeight=opts.fitHeight?root.clientHeight:Infinity;
   if(root.style){root.style.position='relative';root.style.flexDirection='row';}
   const scale=Math.min(1,available/shell.offsetWidth,availableHeight>0?availableHeight/shell.offsetHeight:1);
   shell.style.transform=`scale(${scale})`;fitEl.style.width=shell.offsetWidth*scale+'px';fitEl.style.height=shell.offsetHeight*scale+'px';fitEl.style.flex='none';fitEl.style.marginLeft='auto';fitEl.style.marginRight='auto';
   const hint=root.querySelector('.reader-hints');if(hint){hint.style.position='absolute';hint.style.margin='0';hint.style.right='auto';const phoneLeft=Math.max(0,(available-shell.offsetWidth*scale)/2),phoneTop=fitEl.offsetTop||0;const position=hintPosition||{x:phoneLeft+shell.offsetWidth*scale-hint.offsetWidth+20,y:phoneTop+shell.offsetHeight*scale-hint.offsetHeight-(hintsOpen?110:34)*scale};placeHint(position.x,position.y);}
  }

  if(storyEngine){storyEvent('start','*');scheduleStory();}render();if(typeof ResizeObserver!=='undefined'){resize=new ResizeObserver(fit);resize.observe(root);}
  return {setHintFallback,reset(){draftTypingStart.clear();hintsOpen=false;hintMore=false;for(const t of typingTimer.values())clearTimeout(t);typingTimer.clear();typingDone.clear();liked.clear();announcedMessages.clear();readMessages.clear();activeBanner=null;clearTimeout(bannerTimer);storyEngine?.reset();endingDismissed=false;clearTimeout(timer);persistStory();if(storyEngine)storyEvent('start','*');view=initialView;homePage=0;calendarDay=agenda.start;unlocked=!passcode;unlockDestination='home';viewed=false;notify=false;render();},navigate:go,destroy(){stopDraftTyping();root.querySelectorAll('.voice-message').forEach(recording=>recording.pause());alive=false;clearTimeout(timer);clearTimeout(bannerTimer);for(const timer of typingTimer.values())clearTimeout(timer);resize?.disconnect();root.innerHTML='';},getCapture(){return root.querySelector('[data-capture]');},getView(){return view;}};
 }
 return {mount,devices,templates,appTypes,css,esc,image,parse,noteItems,appNames,appName,activeApp,readerState,defaultDock,Story,batteryState,cleanDraft,normalizeExtras,items,unreadAt,fontCatalog,fontStack,normalizeAlbums,removePhoto,audio,splitMessage,commentItems,customFont,workPoints,MAX_SCREENSHOT_SHEETS,validDate,callRows,voiceSeconds};
}
window.Pocket=PocketRuntime();
