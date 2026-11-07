/* Self-contained story engine, also embedded in standalone reader exports. */
function FicStoryRuntime(){
 'use strict';
 const MAX_STEPS=13,events=['start','photo','note','chat','post','call','app','like','reply'],actionTypes=['message','prepareReply','note','unlock','choice','ending'];
 const text=(v,n=10000)=>String(v??'').slice(0,n),clone=v=>JSON.parse(JSON.stringify(v));
 function normalize(raw){
  const input=raw&&typeof raw==='object'?raw:{};
  if(Array.isArray(input.steps)&&input.steps.length>MAX_STEPS)throw Error('当前测试版最多支持 13 个剧情步骤。请保留原工程，分成章节导入。');
  const ids=new Set();
  return {version:1,enabled:input.enabled!==false,steps:(Array.isArray(input.steps)?input.steps:[]).map((s,i)=>{
   s=s&&typeof s==='object'?s:{};let id=/^[\w-]{1,80}$/.test(s.id)?s.id:'step-'+(i+1);if(ids.has(id))id='step-'+i+'-'+id;ids.add(id);
   return {id,hint:text(s.hint,1000),hintMore:text(s.hintMore,2000),title:text(s.title||'剧情步骤 '+(i+1),100),trigger:events.includes(s.trigger)?s.trigger:'photo',target:text(s.target||'*',100),delay:Math.max(0,Math.min(60,Number(s.delay)||0)),match:s.match==='any'?'any':'all',clues:(Array.isArray(s.clues)?s.clues:[]).slice(0,2).map(c=>typeof c==='string'?{event:c.split(':')[0],target:c.slice(c.indexOf(':')+1)}:c).filter(c=>c&&events.includes(c.event)).map(c=>({event:c.event,target:text(c.target||'*',100)})),actions:(Array.isArray(s.actions)?s.actions:[]).slice(0,3).map(a=>{a=a&&typeof a==='object'?a:{};return {type:actionTypes.includes(a.type)?a.type:'message',app:['kakao','line','imessage','notes','album','calendar','calls','instagram','x','forum'].includes(a.app)?a.app:'kakao',who:a.who==='owner'?'owner':'partner',...(a.room&&/^[\w-]{1,100}$/.test(a.room)?{room:a.room}:{}),...(a.type==='message'&&Number(a.withdrawAfter)>0?{withdrawAfter:Math.max(1,Math.min(60,Number(a.withdrawAfter)))}:{}),text:text(a.text),title:text(a.title,200),optionA:text(a.optionA||'直接问她',100),optionB:text(a.optionB||'暂时不问',100),nextA:text(a.nextA||'next',10),nextB:text(a.nextB||'next',10)};})};
  })};
 }
 function migrate(phone){return normalize({enabled:phone.rule!==false,steps:[{id:'legacy-photo',title:'查看照片后收到消息',trigger:'photo',target:'*',delay:0,actions:[{type:'message',app:phone.chatPlatform||'kakao',text:phone.newMessage||''},{type:'note',title:String(phone.secret||'').split('\n')[0],text:String(phone.secret||'').split('\n').slice(1).join('\n').trim()}]}]});}
 function demo(){
  const msg=text=>({type:'message',app:'kakao',text}),note=(title,text)=>({type:'note',title,text}),unlock=app=>({type:'unlock',app});
  const rows=[
   ['사진 속의 우리','photo','*',[msg('사진 봤지? ㅎㅎ 다음 얘기는 채팅에서 해 💜')]],
   ['사나의 메시지','chat','kakao',[note('우산을 돌려주는 날','사나가 남긴 메모.\n\n오늘은 우산 말고, 돌려주고 싶은 말이 있어.')]],
   ['남겨진 메모','note','story-s2-0',[unlock('forum'),msg('그날 얘기, 더쿠에 올라왔더라. 나도 이제 봤어.')]],
   ['더쿠의 목격담','post','forum',[msg('한 명이 계속 웃었다는데… 그거 나잖아 ㅋㅋ')]],
   ['미나에게만 하는 말','chat','kakao',[note('그날 웃었던 이유','비가 와서 좋았던 게 아니야.\n네가 내 쪽으로 우산을 기울여 줘서.')]],
   ['같은 우산 아래','note','story-s5-0',[unlock('instagram')]],
   ['사진 아래 댓글','post','instagram',[msg('내 댓글 봤어? 💜 아까 부재중 전화도 확인해 봐.')]],
   ['놓친 전화','call','0',[note('오후 10시 48분','전화하려고 세 번이나 망설였어.\n그때 못 한 말은 X에 잠깐 남겨 뒀어.')]],
   ['통화 뒤의 메모','note','story-s8-0',[unlock('x')]],
   ['짧은 글 한 줄','post','x',[msg('오늘 연습 끝나고, 나랑 조금만 걸을래?')]],
   ['아직 하지 못한 말','chat','kakao',[note('보내기 직전','🙄\n\n같이 걷고 싶으면 그냥 그렇게 말해.\n나도 기다리고 있었으니까.')]],
   ['미나의 답장 초안','note','story-s11-0',[msg('미나야, 나 지금 입구야. 우산은 하나만 가져와 😊')]],
   ['비가 그친 뒤','chat','kakao',[{type:'ending',title:'비가 그치기 전에',text:'두 사람은 같은 우산 아래에서 다시 만났다.\n\nEND'}]]
  ];return normalize({enabled:true,steps:rows.map(([title,trigger,target,actions],i)=>({id:'s'+(i+1),title,trigger,target,delay:i===0?2:0,actions}))});
 }
 function signature(story){let h=2166136261;for(const c of JSON.stringify(story)){h=Math.imul(h^c.charCodeAt(0),16777619);}return (h>>>0).toString(36);}
 function engine(input,resume,clock=()=>Date.now()){
  const story=normalize(input),fingerprint=signature(story);let data={fingerprint,cursor:0,completed:[],seen:[],messages:[],replies:[],notes:[],unlocked:[],choice:null,ending:null,pending:null,log:[]};
  // Persist only an event journal. Replaying authored actions prevents modified storage from injecting content or unlocking arbitrary apps.
  const journal=[];
  function log(message){data.log.push(text(message,250));data.log=data.log.slice(-80);}
  const matches=(e,c)=>e.event===c.event&&(c.target==='*'||String(e.target)===String(c.target));
  const has=c=>data.seen.some(e=>matches(e,c));
  function apply(index,at=clock()){const step=story.steps[index];if(!step)return;data.pending=null;data.completed.push(step.id);data.cursor=index+1;
   step.actions.forEach((a,j)=>{
    if(a.type==='message')data.messages.push({id:'story-'+step.id+'-'+j,app:a.app,who:a.who,text:a.text,...(a.room?{room:a.room}:{}),...(a.withdrawAfter?{withdrawAt:at+a.withdrawAfter*1000}:{})});
    if(a.type==='prepareReply'&&a.text.trim())data.replies.push({id:'story-'+step.id+'-'+j,app:a.app,room:a.room||a.app,text:a.text});
    if(a.type==='note')data.notes.push({id:'story-'+step.id+'-'+j,title:a.title||'메모',body:a.text,date:''});
    if(a.type==='unlock'&&!data.unlocked.includes(a.app))data.unlocked.push(a.app);
    if(a.type==='choice')data.choice={step:index,prompt:a.text,options:[{label:a.optionA,next:a.nextA},{label:a.optionB,next:a.nextB}]};
    if(a.type==='ending')data.ending={title:a.title,text:a.text};
   });log('✓ '+(index+1)+'. '+step.title);
  }
  function dispatch(event,target='*',record=true,advance=true,at=clock()){if(!story.enabled||!events.includes(event))return false;const e={event,target:String(target)};const fresh=!data.seen.some(v=>v.event===e.event&&v.target===e.target);if(fresh){data.seen.push(e);if(record)journal.push({type:advance?'event':'observe',...e,at});}
   if(!advance)return false;
   if(data.pending||data.choice||data.ending)return false;const step=story.steps[data.cursor];if(!step||!matches(e,{event:step.trigger,target:step.target}))return false;
   const checks=step.clues.map(has);if(checks.length&&!(step.match==='any'?checks.some(Boolean):checks.every(Boolean))){log('等待额外线索：'+step.title);return false;}
   if(record&&!fresh)journal.push({type:'event',...e,at});if(step.delay){data.pending={index:data.cursor,due:at+step.delay*1000};log('等待 '+step.delay+' 秒：'+step.title);}else apply(data.cursor,at);return true;
  }
  function tick(record=true,at=clock()){
   if(!data.pending||at<data.pending.due)return false;
   if(record)journal.push({type:'tick',at});
   apply(data.pending.index,at);
   return true;
  }
  function respond(id,record=true,at=clock()){
   const index=data.replies.findIndex(reply=>reply.id===id);
   if(index<0||data.ending)return false;
   const [reply]=data.replies.splice(index,1);
   data.messages.push({...reply,who:'owner'});
   if(record)journal.push({type:'response',id,at});
   dispatch('reply',reply.room,false,true,at);
   return true;
  }
  function choose(index,record=true){const choice=data.choice,option=choice?.options[index];if(!option)return false;if(record)journal.push({type:'choice',index});data.choice=null;log('选择：'+option.label);if(option.next==='end'){data.ending={title:option.label,text:''};return true;}if(option.next!=='next'){const n=Number(option.next)-1;if(Number.isInteger(n)&&n>choice.step&&n<story.steps.length)data.cursor=n;}return true;}
  if(resume?.fingerprint===fingerprint&&Array.isArray(resume.journal)){
   for(const item of resume.journal.slice(0,600)){if(['event','observe'].includes(item?.type)&&events.includes(item.event)){const at=Number.isFinite(item.at)?item.at:clock();dispatch(item.event,text(item.target,100),false,item.type==='event',at);journal.push({type:item.type,event:item.event,target:text(item.target,100),at});}else if(item?.type==='tick'&&data.pending){const at=Number.isFinite(item.at)?item.at:clock();data.pending.due=at;tick(false,at);journal.push({type:'tick',at});}else if(item?.type==='response'&&typeof item.id==='string'){const at=Number.isFinite(item.at)?item.at:clock();if(respond(item.id,false,at))journal.push({type:'response',id:item.id,at});}else if(item?.type==='choice'&&[0,1].includes(item.index)){choose(item.index,false);journal.push({type:'choice',index:item.index});}}
   log('已恢复阅读进度');
  }
  return {story,dispatch,visit(list){const cursor=data.cursor;for(const e of list)dispatch(e.event,e.target,true,data.cursor===cursor);},tick,choose,respond,snapshot:()=>clone(data),save:()=>({fingerprint,journal:clone(journal.slice(0,600))}),reset(){Object.assign(data,{cursor:0,completed:[],seen:[],messages:[],replies:[],notes:[],unlocked:[],choice:null,ending:null,pending:null,log:[]});journal.length=0;}};
 }
 return {MAX_STEPS,events,actionTypes,normalize,migrate,demo,engine,signature};
}
window.FicStoryRuntime=FicStoryRuntime;
