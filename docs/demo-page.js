(()=>{
 'use strict';
 const original=window.FicPhoneDemo;let player,story;
 function progress(p,config){document.getElementById('progress').textContent=p.ending?'故事已完成':p.choice?'作出你的选择':`已推进 ${p.completed.length} / ${config.steps.length} 步`;}
 function demoHint(step){const name=Pocket.appTypes[step.target]||step.target;return ({photo:'查看相册里的照片。',chat:`进入 ${name} 会话。`,note:'查看备忘录中的线索。',post:`打开 ${name} 帖子详情。`,like:`在 ${name} 帖子中试试点赞。`,call:'查看 Sana 的通话详情。',app:`打开 ${name}。`,start:'打开手机，开始阅读。'})[step.trigger]||'查看手机里尚未探索的内容。';}

 function load(branch=false){player?.destroy();story=JSON.parse(JSON.stringify(original));if(branch){story.phone.story=Pocket.Story.normalize({enabled:true,steps:[{id:'choice',title:'照片后的选择',trigger:'photo',target:'*',actions:[{type:'choice',text:'사진을 본 뒤, 어떻게 할까?',optionA:'사나에게 바로 물어본다',optionB:'조금 더 찾아본다',nextA:'2',nextB:'3'}]},{id:'ask',title:'直接问 Sana',trigger:'chat',target:'kakao',actions:[{type:'message',app:'kakao',text:'미나야, 나도 네 답을 기다리고 있었어 💜'},{type:'ending',title:'그날의 답',text:'먼저 꺼낸 한마디가, 두 사람의 밤을 바꾸었다.\n\nEND A'}]},{id:'look',title:'再找线索',trigger:'note',target:'daily',actions:[{type:'ending',title:'아직 남은 이야기',text:'미나는 메모를 한 번 더 읽고, 천천히 답장을 골랐다.\n\nEND B'}]}]});}story.phone.hintsPolicy='optional';for(const step of story.phone.story.steps){step.hint=step.hint||demoHint(step);step.hintMore=step.hintMore||step.hint;}player=Pocket.mount(document.getElementById('phone'),story,{mode:'phone',frame:true,onProgress:progress});}
 document.getElementById('desktop').onclick=()=>player.navigate('home');document.getElementById('restart').onclick=()=>player.reset();document.getElementById('linear').onclick=()=>load(false);document.getElementById('branch').onclick=()=>load(true);load(false);
})();
