const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const paths={menu:'M3 5h18M3 12h18M3 19h18',plus:'M12 5v14M5 12h14',close:'m6 6 12 12M18 6 6 18',chevron:'m6 9 6 6 6-6',external:'M14 4h6v6M20 4l-9 9M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5',bookmark:'M6 4h12v17l-6-4-6 4z',folder:'M3 7V5h7l2 3h9v12H3z',search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',check:'m5 12 4 4L20 5',play:'m9 5 11 7-11 7z',upload:'M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5',link:'M9 15l6-6M8 17l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 7l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',sparkles:'m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4M18 4h4',arrowUp:'M12 20V4m-6 6 6-6 6 6',analysis:'M4 19V9M9 19V4M14 19v-7M19 19V7M2 22h20',transcript:'M6 2h9l5 5v15H6zM15 2v6h5M9 12h8M9 16h8',remix:'M6 6l12 12M6 18 18 6M8 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M22 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0M22 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0',translate:'M3 5h11M8 2v3M5 5c1 6 4 9 9 11M12 5c-1 6-4 9-10 12M14 21l4-12 4 12M16 17h5',panel:'M3 4h18v16H3zM15 4v16',drag:'M5 12h14M12 5v14m-3-11 3-3 3 3m-7 1-3 3 3 3m8-6 3 3-3 3m-7 1 3 3 3-3',image:'M3 3h18v18H3zM3 17l6-6 4 4 3-3 5 5M8 7h.01',back:'m14 5-7 7 7 7'};
const icon=n=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.sparkles}"/></svg>`;
const logo=()=>'<img src="assets/qwen-white.png" alt="Qwen Create">';
const MAIN_URL='https://fe-create.qwen.com/r/ai-studio-pc-global/main/agent-team/ses_577fbd857dc9?api_env=pre';
const ASSETS_URL='https://fe-create.qwen.com/r/ai-studio-pc-global/main/assets/agent-team/all?api_env=pre&click=asset';
const TOOL_PROMPTS={
  'AI Analysis':'请分析这个参考视频的创作结构。',
  Transcript:'请提取参考视频中的对白和台词。',
  Remake:'请结合参考素材整理一个复刻方案。',
  Hooks:'请帮我根据我上传的这几个资料构思三个开头。',
  Script:'请基于 IP 创作短剧剧本。',
  Localization:'请将我上传的短剧视频进行印度本土化复刻，保留核心剧情和冲突，调整人物设定、场景、文化表达和对白，使其贴近印度观众，并适配印度平台，帮我完成一键出海。'
};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const videos=[{id:'skin',title:'The everyday glow',brand:'Lumé Skincare',source:'Instagram',time:'00:24',thumb:0,category:'skincare'},{id:'coffee',title:'A slower kind of morning',brand:'Oat & Co.',source:'TikTok',time:'00:18',thumb:1,category:'lifestyle'},{id:'ugc',title:'Skin first. Everything else follows.',brand:'Studio Sunday',source:'Instagram',time:'00:32',thumb:2,category:'skincare'},{id:'shoe',title:'Made for your next move',brand:'PACE Running',source:'YouTube',time:'00:16',thumb:3,category:'lifestyle'},{id:'ritual',title:'Less routine. More ritual.',brand:'Lumé Skincare',source:'TikTok',time:'00:21',thumb:0,category:'skincare'},{id:'weekend',title:'Your weekend, in a glass',brand:'Oat & Co.',source:'Instagram',time:'00:27',thumb:1,category:'lifestyle'}];
let savedState;try{savedState=JSON.parse(localStorage.getItem('create-demo-collections-v1'))}catch{}
let folders=Array.isArray(savedState?.folders)?savedState.folders:[{id:'inspiration',name:'日常灵感'},{id:'skincare',name:'护肤品牌参考'},{id:'campaign',name:'秋季 Campaign'}];
let saved=Array.isArray(savedState?.saved)?savedState.saved:[];
let mode='hover',feed='all',sidebarOpen=true,pending=null,popAnchor=null,selectedFolder=null,folderQuery='',createFolderVisible=false,draggedId=null,tool=null,generationType='video',toastTimer,returnFocus,librarySelect=false;
const chatState=()=>({id:crypto.randomUUID(),title:'New inspiration',attachments:[],prompt:'',messages:[],type:'auto',model:'Auto',models:{image:'Image model A',video:'Video model A'}});
let chats=[chatState(),{...chatState(),title:'Coffee ad concepts',messages:[{role:'agent',html:'<p>把日常饮用场景作为开头，用产品特写承接，再以一句简短口号收尾。</p>'}]},{...chatState(),title:'Brand moodboard',messages:[{role:'agent',html:'<p>参考方向：自然光、暖色背景与克制的产品特写。</p>'}]}],currentChat=chats[0];
currentChat.title='Skincare launch';currentChat.prompt='Create a short video for my sunscreen brand.';currentChat.attachments=[{id:'product-seed',name:'Product.png',asset:'assets/product-reference.png'},{id:'video-seed',name:'Ad-reference.mp4',asset:'assets/video-reference.png'}];
const thumb=(v,cls='')=>`<div class="thumb thumb-${v.thumb||0} ${cls}"></div>`;
function persist(){try{localStorage.setItem('create-demo-collections-v1',JSON.stringify({folders,saved}))}catch{toast('浏览器未允许保存，当前收藏仍可使用')}updateCounts()}
function updateCounts(){$('#saved-count').textContent=saved.length}
function toast(text,action){clearTimeout(toastTimer);const el=$('#toast');el.innerHTML=icon('check')+`<span>${esc(text)}</span>`+(action?`<a id="toast-action" href="${ASSETS_URL}" target="_blank" rel="noopener noreferrer">查看收藏</a>`:'');el.classList.remove('hidden');el.classList.toggle('page-wide',!sidebarOpen);toastTimer=setTimeout(()=>el.classList.add('hidden'),3500)}
function renderFeed(){let list=videos.filter(v=>feed==='all'||feed===v.category||(feed==='saved'&&saved.some(s=>s.videoId===v.id)));$('#video-grid').innerHTML=list.length?list.map(v=>{const isSaved=saved.some(s=>s.videoId===v.id);return `<article class="video-card"><div class="video-poster" draggable="true" data-video="${v.id}" tabindex="0" aria-label="${esc(v.title)}，可拖入侧边栏或收藏入口">${thumb(v,'poster-image')}<div class="video-shade"></div><button class="hover-save ${isSaved?'saved':''}" data-save="${v.id}" aria-label="${isSaved?'已收藏，管理':'收藏'} ${esc(v.title)} 到 Qwen Create"><img class="save-brand-mark" src="assets/qwen-black.png" alt="" aria-hidden="true"><span>${isSaved?'Saved':'Save'}</span></button><span class="duration">${v.time}</span><div class="video-bottom"><span>${v.source}</span><button class="play-button" data-preview="${v.id}" aria-label="预览 ${esc(v.title)}">${icon('play')}</button></div></div><div class="video-info"><h3>${v.title}</h3><p><span>${v.brand}</span><span>Creative reference</span></p></div></article>`}).join(''):'<div class="library-empty">还没有收藏。回到 Discover，收藏一个喜欢的创意。</div>';
$$('[data-save]').forEach(b=>b.onclick=e=>{e.stopPropagation();openSave(b.dataset.save,b,'hover')});$$('[data-preview]').forEach(b=>b.onclick=e=>{e.stopPropagation();openPreview(b.dataset.preview)});$$('.video-poster').forEach(el=>{el.ondragstart=e=>{draggedId=el.dataset.video;e.dataTransfer.setData('application/x-create-video',draggedId);e.dataTransfer.setData('text/plain',`demo-video:${draggedId}`);e.dataTransfer.effectAllowed='copy';document.body.classList.add('dragging-video');el.classList.add('is-drag-source');closePopovers()};el.ondragend=()=>{draggedId=null;document.body.classList.remove('dragging-video');el.classList.remove('is-drag-source');$('#launcher').classList.remove('over');$('#sidebar-drop').classList.add('hidden')};el.onkeydown=e=>{if(e.key==='Enter'){mode==='hover'?openSave(el.dataset.video,el,'hover'):openSave(el.dataset.video,$('#launcher'),'drag')}}})}
function setMode(m){mode=m;document.body.classList.toggle('drag-mode',m==='drag');$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));$('#interaction-hint').innerHTML='';closePopovers()}
function toggleSidebar(force){sidebarOpen=force??!sidebarOpen;$('#workspace').classList.toggle('closed',!sidebarOpen);$('#launcher').classList.toggle('collapsed',!sidebarOpen);$('#sidebar-toggle').setAttribute('aria-pressed',sidebarOpen);$('#sidebar').inert=!sidebarOpen;closePopovers()}
function closePopovers(){for(const s of ['#save-popover','#collector-menu','#history-menu','#upload-menu','#model-menu'])$(s)?.classList.add('hidden');$('#history-toggle').setAttribute('aria-expanded','false');$('#model-toggle')?.setAttribute('aria-expanded','false');pending=null}
function positionPopover(el,anchor,kind){const r=anchor.getBoundingClientRect(),h=el.offsetHeight,w=el.offsetWidth;let x,y;if(kind==='drag'){x=r.left-w-12;y=r.top-110}else{x=r.left;y=r.bottom+9;if(y+h>innerHeight-12)y=Math.max(78,r.top-h-9)}x=Math.max(12,Math.min(x,innerWidth-w-12));y=Math.max(76,Math.min(y,innerHeight-h-12));el.style.left=x+'px';el.style.top=y+'px'}
function openSave(id,anchor,kind){closePopovers();pending={id,kind};popAnchor=anchor;selectedFolder=null;folderQuery='';createFolderVisible=false;renderSave();$('#folder-search').focus()}
function renderSave(){if(!pending)return;const v=videos.find(v=>v.id===pending.id);const el=$('#save-popover');el.innerHTML=`<div class="popover-head"><strong>${pending.kind==='drag'?'收藏这个视频':'Save to collection'}</strong><button id="close-save" aria-label="关闭">${icon('close')}</button></div><div class="save-preview">${thumb(v)}<div><strong>${esc(v.title)}</strong><small>${v.source} · ${v.time}</small></div></div>${pending.kind==='drag'?'<p class="popover-status">已接收视频 · 选择文件夹后完成收藏</p>':''}<label class="search-field">${icon('search')}<input id="folder-search" value="${esc(folderQuery)}" placeholder="搜索文件夹" aria-label="搜索收藏文件夹"></label><div class="folder-options" id="folder-options"></div><div class="new-folder-line">${createFolderVisible?'<div class="folder-create"><input id="new-folder-name" placeholder="文件夹名称" maxlength="40" aria-label="新文件夹名称"><button id="confirm-new-folder">创建</button></div>':`<button id="new-folder-button">${icon('plus')}新建文件夹</button>`}</div><button class="save-commit" id="save-commit" ${selectedFolder?'':'disabled'}>收藏到所选文件夹</button>`;el.classList.remove('hidden');renderFolderOptions();positionPopover(el,popAnchor,pending.kind);$('#close-save').onclick=closePopovers;$('#folder-search').oninput=e=>{folderQuery=e.target.value;renderFolderOptions()};$('#save-commit').onclick=commitSave;if(createFolderVisible){$('#confirm-new-folder').onclick=addFolder;$('#new-folder-name').onkeydown=e=>{if(e.key==='Enter')addFolder()}}else $('#new-folder-button').onclick=()=>{createFolderVisible=true;renderSave();$('#new-folder-name').focus()}}
function renderFolderOptions(){const matches=folders.filter(f=>f.name.toLowerCase().includes(folderQuery.toLowerCase()));$('#folder-options').innerHTML=matches.length?matches.map(f=>{const already=saved.some(s=>s.videoId===pending.id&&s.folderId===f.id);return `<button class="folder-choice ${f.id===selectedFolder?'active':''}" data-folder="${f.id}">${icon('folder')}<span class="folder-name">${esc(f.name)}</span><small>${already?'已收藏':saved.filter(s=>s.folderId===f.id).length+' 个素材'}</small>${f.id===selectedFolder?`<span class="check">${icon('check')}</span>`:''}</button>`}).join(''):'<div class="collector-empty">没有匹配的文件夹</div>';$$('[data-folder]').forEach(b=>b.onclick=()=>{selectedFolder=b.dataset.folder;renderFolderOptions();$('#save-commit').disabled=false;$('#save-commit').textContent=`收藏到「${folders.find(f=>f.id===selectedFolder).name}」`})}
function addFolder(){const name=$('#new-folder-name').value.trim();if(!name)return;const existing=folders.find(f=>f.name===name);if(existing){selectedFolder=existing.id;toast('已选中同名文件夹')}else{const f={id:crypto.randomUUID(),name};folders.push(f);selectedFolder=f.id;persist()}createFolderVisible=false;folderQuery='';renderSave()}
function commitSave(){if(!pending||!selectedFolder)return;const name=folders.find(f=>f.id===selectedFolder).name,exists=saved.some(s=>s.videoId===pending.id&&s.folderId===selectedFolder);if(!exists)saved.unshift({videoId:pending.id,folderId:selectedFolder,at:Date.now()});persist();closePopovers();renderFeed();if(!exists)animateSaved();toast(exists?`已经收藏在「${name}」`:`收藏成功 · 已保存到「${name}」`,true)}
function openCollector(){closePopovers();const el=$('#collector-menu');el.innerHTML=`<div class="popover-head"><strong>最近收藏</strong><button id="close-collector" aria-label="关闭">${icon('close')}</button></div>${saved.length?saved.slice(0,4).map(s=>{const v=videos.find(v=>v.id===s.videoId);if(!v)return '';return `<div class="collector-item">${thumb(v)}<div class="text"><span>${esc(v.title)}</span><small>${esc(folders.find(f=>f.id===s.folderId)?.name)}</small></div><button data-ref="${v.id}">引用</button></div>`}).join(''):'<div class="collector-empty">把视频拖到这个图标<br>选择文件夹，开始积累灵感。</div>'}<button class="collector-library" id="collector-library">查看全部收藏 →</button>`;el.classList.remove('hidden');positionPopover(el,$('#launcher'),'drag');$('#close-collector').onclick=closePopovers;$('#collector-library').onclick=()=>openLibrary();$$('[data-ref]').forEach(b=>b.onclick=()=>{addReference(b.dataset.ref);closePopovers()})}
function showModal(html){closePopovers();returnFocus=document.activeElement;$('#modal').innerHTML=html;$('#modal-backdrop').classList.remove('hidden');$('#modal').focus();$$('[data-close-modal]').forEach(b=>b.onclick=closeModal)}
function closeModal(){$('#modal-backdrop').classList.add('hidden');returnFocus?.focus?.()}
function modalHeader(title,sub=''){return `<div class="modal-header"><div><h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</div><button data-close-modal aria-label="关闭">${icon('close')}</button></div>`}
function openLibrary(folderId,select=false){if(!select){openAssets();return}librarySelect=select;let html=modalHeader(select?'选择参考素材':'Assets / Collections','收藏素材与示例文件夹 · 当前浏览器保存');if(!folderId)html+=`<div class="folder-grid">${folders.map(f=>`<button class="folder-tile" data-library-folder="${f.id}">${icon('folder')}<strong>${esc(f.name)}</strong><small>${saved.filter(s=>s.folderId===f.id).length} references</small></button>`).join('')}</div>`;else{const f=folders.find(f=>f.id===folderId),items=saved.filter(s=>s.folderId===folderId);html+=`<div class="breadcrumb"><button id="library-back">${icon('back')} 全部文件夹</button><span>/</span><span>${esc(f.name)}</span></div>${items.length?`<div class="library-list">${items.map(s=>{const v=videos.find(v=>v.id===s.videoId);return `<div class="library-item">${thumb(v)}<div class="info">${esc(v.title)}<small>${v.source} · ${v.time}</small><button data-library-ref="${v.id}">用作 Reference ↗</button></div></div>`}).join('')}</div>`:'<div class="library-empty">文件夹还是空的。<br>从网页收藏一个喜欢的视频吧。</div>'}`;}showModal(html);$$('[data-library-folder]').forEach(b=>b.onclick=()=>openLibrary(b.dataset.libraryFolder,select));if($('#library-back'))$('#library-back').onclick=()=>openLibrary(null,select);$$('[data-library-ref]').forEach(b=>b.onclick=()=>{closeModal();addReference(b.dataset.libraryRef)})}
function openPreview(id){const v=videos.find(v=>v.id===id);showModal(modalHeader(v.title,`${v.source} · ${v.brand}`)+`<div class="preview-poster">${thumb(v)}<span class="duration">${v.time}</span></div><p class="preview-caption">演示素材预览。此 Demo 使用静态封面模拟网页中的视频。</p><button class="primary" id="preview-ref">添加到当前对话</button>`);$('#preview-ref').onclick=()=>{closeModal();addReference(id)}}
function addReference(id){const v=videos.find(v=>v.id===id);if(!v)return;if(!currentChat.attachments.some(a=>a.id===v.id))currentChat.attachments.push({id:v.id,name:v.title+'.mp4',thumb:v.thumb,source:v.source});toggleSidebar(true);renderAttachments();toast('已添加为创作参考')}
function renderAttachments(){$('#attachments').innerHTML=currentChat.attachments.map(a=>`<div class="attachment-chip">${a.url&&a.mime?.startsWith('image/')?`<img src="${esc(a.url)}" alt="">`:a.asset?`<img src="${esc(a.asset)}" alt="">`:Number.isInteger(a.thumb)?thumb(a):`<div class="file-glyph">${icon(a.mime?.startsWith('video/')?'play':'transcript')}</div>`}<span class="filename" title="${esc(a.name)}">${esc(a.name)}</span><button data-remove="${a.id}" aria-label="移除 ${esc(a.name)}">${icon('close')}</button></div>`).join('');$$('[data-remove]').forEach(b=>b.onclick=()=>{currentChat.attachments=currentChat.attachments.filter(a=>a.id!==b.dataset.remove);renderAttachments()});updateSend()}
function addFiles(files){const valid=[...files].filter(f=>f.type.startsWith('image/')||f.type.startsWith('video/'));if(!valid.length){toast('请添加图片或视频');return}for(const file of valid)currentChat.attachments.push({id:crypto.randomUUID(),name:file.name,mime:file.type,url:URL.createObjectURL(file)});renderAttachments();toast(`已添加 ${valid.length} 个参考素材`)}
function updateSend(){$('#send').disabled=!(currentChat.attachments.length||$('#prompt').value.trim());currentChat.prompt=$('#prompt').value}
function renderConversation(){
  $('#conversation').innerHTML=currentChat.messages.length?currentChat.messages.map((m,i)=>m.role==='user'?`<div class="message user">${m.refs?.length?`<div class="message-refs">${m.refs.map(n=>`<span>${esc(n)}</span>`).join('')}</div>`:''}${esc(m.text)}</div>`:`<div class="message agent"><div class="agent-label"><span class="brand-mark">${logo()}</span><span>${m.label||'Creative Agent'}</span></div><div class="agent-body">${m.kind==='analysis'?analysisResultHtml(m,i):m.kind==='transcript'?transcriptResultHtml(m,i):m.kind==='localization-plan'?localizationPlanHtml(m,i):m.kind==='document'?documentResultHtml(m,i):m.html}</div></div>`).join(''):`<div class="empty-chat"><img src="assets/drop-hint.png" alt=""><p>Drop images or videos anywhere<br>to add a reference</p></div>`;
  // Main-site handoffs use native links to preserve the current demo session.
  $$('[data-artifact-edit]').forEach(b=>b.onclick=()=>openArtifactEdit(currentChat.messages[Number(b.dataset.artifactEdit)]));
  $$('[data-artifact-download]').forEach(b=>b.onclick=()=>downloadArtifact(currentChat.messages[Number(b.dataset.artifactDownload)]));
  $$('[data-followup-query]').forEach(b=>b.onclick=()=>submitAnalysisFollowup(Number(b.dataset.followupQuery),b.dataset.reply));
  $('#conversation').scrollTop=$('#conversation').scrollHeight;
}
function renderChat(){$('#current-chat-title').textContent=currentChat.title;$('#prompt').value=currentChat.prompt;generationType=currentChat.type;renderModels();renderAttachments();renderConversation();setTool(null)}
function renderModels(){
  if(!$('#model-toggle')){
    const holder=$('#model-select').parentElement;
    holder.outerHTML='<div class="model-picker"><button id="model-toggle" class="model-toggle" aria-haspopup="dialog" aria-expanded="false" aria-controls="model-menu"></button><section id="model-menu" class="model-menu hidden" role="dialog" aria-label="创作模式"></section></div>';
    $('#model-toggle').onclick=()=>{const open=$('#model-menu').classList.contains('hidden');closePopovers();if(open){$('#model-menu').classList.remove('hidden');$('#model-toggle').setAttribute('aria-expanded','true');$('#model-menu [aria-pressed="true"]').focus()}};
  }
  currentChat.models||={image:'Image model A',video:'Video model A'};
  const selected=currentChat.type,labels={auto:'Auto',image:'Image',video:'Video'},icons={auto:'sparkles',image:'image',video:'play'};
  currentChat.model=selected==='auto'?'Auto':currentChat.models[selected];
  $('#model-toggle').innerHTML=icon(icons[selected])+`<span>${labels[selected]}${selected==='auto'?'':`<span class="model-trigger-divider">·</span>${esc(currentChat.model)}`}</span>`+icon('chevron');
  $('#model-toggle').setAttribute('aria-label',`创作模式：${labels[selected]}${selected==='auto'?'':'，'+currentChat.model}`);
  $('#model-menu').innerHTML=`<div class="model-menu-heading"><span>创作模式</span><button id="close-model-menu" aria-label="关闭创作模式">${icon('close')}</button></div><div class="creation-mode-options" aria-label="选择创作模式">${Object.keys(labels).map(type=>`<button data-creation-mode="${type}" aria-pressed="${type===selected}">${icon(icons[type])}<span>${labels[type]}</span></button>`).join('')}</div>${selected==='auto'?`<div class="model-auto-info"><span class="model-agent-mark">${logo()}</span><div><strong>Agent 自动选择</strong><p>根据你的需求，选择图片或视频和合适的模型。</p></div></div>`:`<div class="model-list-heading">${labels[selected]} models</div><div class="creation-model-list" aria-label="${labels[selected]} models">${['A','B'].map((suffix,i)=>{const name=`${selected==='image'?'Image':'Video'} model ${suffix}`;return `<button data-creation-model="${name}" aria-pressed="${name===currentChat.model}"><span class="model-monogram">${selected==='image'?'I':'V'}${i+1}</span><span>${name}</span><span class="model-check">${name===currentChat.model?icon('check'):''}</span></button>`}).join('')}</div>`}`;
  $$('[data-creation-mode]').forEach(b=>b.onclick=()=>{currentChat.type=b.dataset.creationMode;generationType=currentChat.type;renderModels();$(`[data-creation-mode="${currentChat.type}"]`).focus()});
  $$('[data-creation-model]').forEach(b=>b.onclick=()=>{currentChat.models[currentChat.type]=b.dataset.creationModel;renderModels();closePopovers();$('#model-toggle').focus()});
  $('#close-model-menu').onclick=()=>{closePopovers();$('#model-toggle').focus()};
}
function resolvedGenerationType(c){if(c.type!=='auto')return c.type;return /视频|video|film|动画|短片/i.test(c.prompt||c.lastRequest||'')?'video':'image'}
function setTool(t){tool=t;$$('.tool-pill').forEach(b=>b.classList.toggle('active',b.dataset.tool===t));$('#active-tool').classList.toggle('hidden',!t);$('#active-tool').textContent=t?`${t} ×`:'';$('#active-tool').onclick=()=>setTool(null)}
function openHistory(){const open=$('#history-menu').classList.contains('hidden');closePopovers();if(!open)return;$('#history-menu').classList.remove('hidden');$('#history-toggle').setAttribute('aria-expanded','true');renderHistory();$('#history-search').focus()}
function renderHistory(){const q=$('#history-search').value.toLowerCase();$('#history-items').innerHTML='<div class="history-heading">Recent chats</div>'+chats.filter(c=>c.title.toLowerCase().includes(q)).map(c=>`<button class="history-item ${c.id===currentChat.id?'current':''}" data-chat="${c.id}">${icon('transcript')}<span>${esc(c.title)}<small>${c.id===currentChat.id?'Current chat':'Saved conversation'}</small></span>${c.id===currentChat.id?icon('check'):''}</button>`).join('');$$('[data-chat]').forEach(b=>b.onclick=()=>{currentChat=chats.find(c=>c.id===b.dataset.chat);renderChat();closePopovers()})}
function optimize(){
  const input=$('#prompt').value.trim(),additions=[];
  if(!/秒|\bsec(?:ond)?s?\b|\bduration\b|\blength\b/i.test(input)&&resolvedGenerationType(currentChat)==='video')additions.push('Video duration: {{duration in seconds}}');
  if(!/平台|\bplatform\b|\bTikTok\b|\bInstagram\b|\bYouTube\b/i.test(input))additions.push('Publishing platform: {{platform}}');
  if(!/画幅|\baspect ratio\b|\b9:16\b|\b16:9\b|\b1:1\b/i.test(input))additions.push('Aspect ratio: {{e.g. 9:16}}');
  if(!/卖点|\bselling point\b|\bproduct benefit\b|\bkey benefit\b|\bUSP\b/i.test(input))additions.push('Key product benefit: {{benefit}}');
  $('#prompt').value=(input||'Create content based on the attached references.')+(additions.length?'\n'+additions.join('\n'):'');
  updateSend();$('#prompt').style.height='105px';$('#prompt').focus();
  const i=$('#prompt').value.indexOf('{{');if(i>=0)$('#prompt').setSelectionRange(i,$('#prompt').value.indexOf('}}',i)+2);
  toast(additions.length?'Missing details added. Fill in the placeholders before sending.':'The key details are already included.');
}
function createAction(){return `<a class="next-button create-action" data-main-action href="${MAIN_URL}" target="_blank" rel="noopener noreferrer" aria-label="去 Qwen Create 创作"><img class="create-action-mark" src="assets/qwen-black.png" alt=""><span>去 Qwen Create 创作</span></a>`}
function makeAnalysisArtifact(c,request){const source=(c.lastReferences||[]).map(a=>a.name).join('、')||'当前参考视频';return {title:'创作拆解报告',edited:false,body:`# 创作拆解报告\n参考素材：${source}\n当前目标：${request}\n\n## 01 · 前三秒 Hook\n- 用使用场景或产品特写快速建立关注点；首屏给出清晰的视觉主体。\n- 复刻时保留“场景问题 → 产品出现”的吸引方式，不照搬原品牌画面。\n\n## 02 · 叙事结构\n- 开头：提出场景和需求。\n- 中段：展示产品使用过程，并自然带出核心卖点。\n- 结尾：产品定格，搭配简洁的行动引导。\n\n## 03 · 镜头与节奏\n- 开头使用短镜头切换，中段放慢以展示产品细节，结尾回到品牌记忆点。\n- 建议在正式生成前确认时长、画幅和投放平台。\n\n## 04 · 卖点表达与 CTA\n- 用可观察的使用过程承载卖点，避免只堆叠口号。\n- CTA 与目标平台的观看语境保持一致。\n\n## 05 · 可迁移的复刻策略\n- 保留 Hook、三段式结构和镜头节奏；替换为你的产品、品牌素材与真实卖点。\n- 如需生成相似视频，可先据此形成复刻方案和分镜脚本，再到主端确认 Credits。\n\n## 待确认信息\n- 目标受众：【填写】\n- 视频时长：【填写秒数】\n- 投放平台：【填写】\n- 核心卖点：【填写】`}}
function artifactHtml(m,index){
  return `<div class="analysis-artifact"><button class="analysis-artifact-title" data-artifact-edit="${index}" title="点击编辑" aria-label="编辑${esc(m.artifact.title)}">${esc(m.artifact.title)}.md</button><button class="analysis-artifact-download" data-artifact-download="${index}" aria-label="下载${esc(m.artifact.title)}">下载 ↓</button></div>`;
}
function hintsHtml(index,options){
  return `<div class="analysis-followups" aria-label="建议回复">${options.map(([label,query])=>`<button data-followup-query="${index}" data-reply="${esc(query)}"><span aria-hidden="true">↳</span>${esc(label)}</button>`).join('')}</div>`;
}
function analysisResultHtml(m,index){
  if(m.workflow==='localization'){
    const followUp=m.stage==='ready'?`<p class="analysis-followup-copy">是否根据这份视频分析，进行印度本土化适配，继续一键出海？</p>${hintsHtml(index,[['开始印度本土化','请根据这份视频分析，生成印度本土化的视频转绘方案。'],['先不用','先不用，保留这份视频分析。']])}`:'';
    return `<p>参考视频采用“场景引入、主体呈现、结尾收束”的结构，以情绪变化和镜头节奏推动观看。报告梳理了可保留的叙事方式，以及面向印度受众时需要调整的人物、场景和对白。</p>${artifactHtml(m,index)}${followUp}`;
  }
  const isRemake=m.workflow==='remake';
  const question=isRemake?'视频结构已经拆解好了，要不要根据这份报告，结合你上传的参考素材生成复刻方案？':'我已经把参考内容拆解好了。要不要基于这份分析，继续帮你做一个相似视频的复刻方案？';
  const followUp=m.stage==='ready'?`<p class="analysis-followup-copy">${question}</p>${hintsHtml(index,[['好，帮我复刻','请帮我根据这份拆解报告和上传的参考素材进行复刻。'],['先不用','先不用，保留这份分析']])}`:'';
  return `<p>这支视频先用日常场景吸引注意，再通过产品特写和使用过程带出卖点，最后以品牌画面收尾。报告拆解了开头设计、叙事结构、镜头节奏和行动引导，并整理了可迁移的复刻方法。</p>${artifactHtml(m,index)}${followUp}`;
}
function transcriptResultHtml(m,index){
  const followUp=m.stage==='ready'?`<p class="analysis-followup-copy">要不要修改这份台词后进行复刻，或者基于它做一次二创？</p>${hintsHtml(index,[['改写台词并复刻','请帮我修改这份台词，并结合参考素材整理复刻方案。'],['基于台词做二创','请基于这份台词和参考素材，帮我创作一个新的版本。']])}`:'';
  return `<p>对白围绕“日常照护、轻盈肤感、随时出发”展开，整体是自然、轻量的生活方式口吻。文档已按时间段整理旁白，并单独列出画面文字。</p>${artifactHtml(m,index)}${followUp}`;
}
function localizationPlanHtml(m,index){
  const followUp=m.stage==='ready'?`<p class="analysis-followup-copy">是否根据这份视频转绘方案，继续生成印度本土化脚本？</p>${hintsHtml(index,[['生成脚本','请根据这份视频转绘方案，生成印度本土化脚本。'],['先不用','先不用，保留这份方案。']])}`:'';
  return `<p>方案保留原片的核心剧情和冲突，将人物身份、生活场景、文化细节及对白调整到印度受众的语境。文档整理了资产适配、语言与配音方向，以及关键帧和片段的生成安排。</p>${artifactHtml(m,index)}${followUp}`;
}
function makeLocalizationAnalysis(c,request){
  const analysis=makeAnalysisArtifact(c,request);
  return {...analysis,title:'视频分析报告',filename:'localization-video-analysis.md',body:analysis.body.replace('# 创作拆解报告','# 视频分析报告')+'\n\n## 本土化观察\n保留核心剧情和情绪转折；人物身份、生活场景、文化细节和对白需要结合印度目标受众重新适配。具体语言、地区与角色资产由用户确认。'};
}
function makeLocalizationPlan(source){
  const references=(source.references||[]).map(a=>a.name).join('、')||'上传的参考素材';
  return {title:'视频转绘方案',filename:'india-video-redo-plan.md',edited:false,body:`# 视频转绘方案\n\n处理方式：Video Redo · 印度本土化重制\n参考素材：${references}\n\n## 用户目标\n将参考视频的核心故事迁移到印度观众熟悉的文化语境中。人物、场景、叙事表达与对白一并适配，形成可用于后续脚本和画面生成的方案。\n\n## 保留的核心\n保留原片的人物动机、核心冲突、情绪转折及悬念设计，延续参考内容的节奏和观看理由。\n\n## 人物与资产适配\n- 关键角色：保留人物关系与剧情作用，重新确认姓名、社会身份和生活背景。\n- 外观资产：结合用户上传的角色或产品资料，明确需要保留与需要重制的视觉元素。\n- 人物形象：服饰、动作、表情与环境保持一致，具体设定以目标地区和受众为准。\n\n## 场景与文化适配\n- 使用与剧情和目标观众相关的家庭、工作或公共场景。\n- 检查原片特有的文化符号、社交礼仪和生活细节，按剧情作用进行替换。\n- 避免用单一文化符号代表所有印度观众；地区和受众未确认时保留可调整项。\n\n## 语言与声音\n目标语言：【由用户确认】。\n结合角色身份和情绪重写对白；字幕、口播、配音和口型需求同步整理。\n\n## 镜头与生成策略\n先确认人物和场景资产，再生成关键帧，按剧情段落生成关键片段，最终衔接成完整视频。\n\n## 待确认信息\n- 目标地区与受众：【填写】\n- 目标语言：【填写】\n- 需要保留的关键资产：【填写】\n\n## 视频分析依据\n${source.artifact.body}`};
}
function makeLocalizationScript(plan){
  const references=(plan.references||[]).map(a=>a.name).join('、')||'用户上传的参考素材';
  return {title:'印度本土化脚本',filename:'india-localized-script.md',edited:false,body:`# 印度本土化脚本\n\n参考资产：${references}\n目标语言：待用户确认；以下为可编辑的中文工作稿。\n\n## 角色与场景\n主角：沿用参考故事的核心动机，姓名和背景按目标受众确认。\n对手角色：保留原片中推动冲突的关系和剧情作用。\n场景：以目标地区观众熟悉的生活环境替换原片对应场景。\n\n## 开场 · 悬念\n画面：主角在一场重要的家庭聚会中发现一件与自己有关的旧物。\n动作：主角停下，观察在场人物的反应。\n对白：主角：“这件东西，为什么会在你这里？”\n声音：环境声渐弱，让观众注意人物之间的紧张关系。\n关键帧：旧物细节、主角反应、对手视线。\n\n## 推进 · 冲突\n画面：对手试图带走旧物，主角追问。\n对白：对手：“现在还不是你知道的时候。”\n主角：“如果和我有关，我就有权知道。”\n动作：第三个角色进入，改变现场关系。\n关键片段：人物之间的对话与反应，保持角色资产和空间位置一致。\n\n## 转折 · 留下钩子\n画面：主角发现新的线索，原本熟悉的人突然变得陌生。\n对白：主角：“所以，你从一开始就知道？”\n镜头：在答案揭晓前切到主角表情，再切出关键证据。\n收尾：保留悬念，引导观看后续内容。\n\n## 本土化执行\n姓名、服饰、家庭关系表达、场景细节和对白语言按已确认的目标地区细化。配音与字幕使用同一套人物设定。\n\n## 关键帧与片段清单\n- 人物定妆与场景设定。\n- 聚会开场的关系全景。\n- 旧物与人物反应的关键帧。\n- 冲突对话与转折片段。\n- 悬念结尾。\n\n## 视频转绘方案依据\n${plan.artifact.body}`};
}
function acceptLocalizationAnalysis(index,reply){
  const c=currentChat,source=c.messages[index];
  if(source?.kind!=='analysis'||source.workflow!=='localization'||source.stage!=='ready')return;
  source.stage='accepted';c.messages.push({role:'user',text:reply});c.lastRequest=reply;
  const result={role:'agent',label:'Localization Agent',references:source.references||[],html:'<p>我会按面向印度的视频转绘与本土化重制来处理，调整人物、场景、文化表达和对白，而不只是翻译台词。现在使用 Video Redo 整理适配策略。</p><p class="analysis-thinking">Thinking...</p>'};
  c.messages.push(result);renderConversation();const taskId=beginTask('thinking');
  setTimeout(()=>{
    result.artifact=makeLocalizationPlan(source);
    result.kind='localization-plan';result.stage='ready';
    endTask(taskId);if(currentChat.id===c.id)renderConversation();
  },2600);
}
function acceptLocalizationPlan(index,reply){
  const c=currentChat,source=c.messages[index];
  if(source?.kind!=='localization-plan'||source.stage!=='ready')return;
  source.stage='accepted';c.messages.push({role:'user',text:reply});c.lastRequest=reply;
  const result={role:'agent',label:'Localization Agent',html:'<p class="analysis-thinking">Thinking...</p>'};
  c.messages.push(result);renderConversation();const taskId=beginTask('thinking');
  setTimeout(()=>{
    result.kind='document';result.artifact=makeLocalizationScript(source);
    result.summary='脚本以聚会中发现旧物为开场，通过人物追问和关系冲突推进情节，并在新线索出现时留下悬念。文档包含角色与场景、对白、镜头动作，以及后续制作所需的关键帧和片段清单。';
    result.question='是否结合这份脚本和你上传的参考素材，继续生成面向印度的视频、关键帧或关键片段？';
    endTask(taskId);if(currentChat.id===c.id)renderConversation();
  },2600);
}
function documentResultHtml(m,index){
  return `<p>${esc(m.summary)}</p>${artifactHtml(m,index)}${m.question?`<p class="analysis-followup-copy">${esc(m.question)}</p>`:''}${createAction()}`;
}
function makeTranscriptArtifact(c){
  const sources=(c.lastReferences||[]).map(a=>a.name).join('、')||'参考视频';
  return {title:'对白台词',filename:'dialogue-transcript.md',edited:false,body:`# 对白台词\n\n参考素材：${sources}\n\n## 旁白 / Voice-over\n\n00:00–00:04\nEvery day starts with a little care.\n\n00:04–00:10\nLight on your skin. Ready for your day.\n\n00:10–00:18\nA simple step, wherever the day takes you.\n\n00:18–00:24\nMake a little room for everyday care.\n\n## 画面文字\n\nEveryday care.\nLight on your skin.\nReady for your day.`};
}
function makeRemakeArtifact(analysis){
  const fields=analysisFields(analysis);
  return {title:'复刻方案',filename:'video-remake-plan.md',edited:false,body:`# 复刻方案\n\n## 创作方向\n保留参考作品的开头吸引方式、叙事结构与节奏，用上传的产品、人物及品牌素材重新表达。\n\n## 素材适配\n- 主体：使用上传的关键角色或产品素材，保持外观一致。\n- 核心卖点：${fields.核心卖点||'结合产品真实信息补充。'}\n- 视频时长：${fields.视频时长||'根据参考结构确定。'}\n- 平台：${fields.投放平台||'根据目标平台调整。'}\n\n## 开头\n画面：真实使用场景切入，快速建立问题与观看理由。\n表达：以自然口播或动作带出需求。\n\n## 中段\n画面：参考素材中的主体进入场景，通过使用过程展示价值。\n表达：将核心卖点融入情节和产品细节。\n\n## 收尾\n画面：主角或产品定格，保持统一风格。\n表达：以简短文案收束，形成明确的记忆点。\n\n## 生成衔接\n依据以上内容准备关键帧，再生成对应片段并剪辑成片。\n\n## 拆解依据\n${analysis.artifact.body}`};
}
function makeHooksArtifact(c){
  const sources=(c.lastReferences||[]).map(a=>a.name).join('、')||'上传资料';
  return {title:'开头方案',filename:'hook-concepts.md',edited:false,body:`# 开头方案\n\n参考资料：${sources}\n\n## 方案一 · 场景共鸣\n开场画面：从用户熟悉的日常问题切入。\n首句：“你是不是也遇到过这样的时刻？”\n节奏：问题特写后快速切入主体，留下解决方式的悬念。\n关键帧：明确问题和人物情绪，保持主体清晰。\n\n## 方案二 · 结果前置\n开场画面：先展示最有吸引力的结果，再倒回过程。\n首句：“这个变化，是怎么发生的？”\n节奏：结果与过程形成反差，以短镜头衔接。\n关键帧：突出前后差异，沿用参考素材中的核心视觉元素。\n\n## 方案三 · 冲突悬念\n开场画面：人物作出一个出乎意料的选择。\n首句：“大家都以为我会选它，但我没有。”\n节奏：在答案揭晓前暂停，衔接后续剧情或卖点。\n关键帧：用人物表情和主体之间的关系建立悬念。\n\n## 后续制作\n选定一个方向后，制作 Hook 关键帧或短视频，与完整内容自然衔接。`};
}
function makeDramaArtifact(c,request){
  const sources=(c.lastReferences||[]).map(a=>a.name).join('、')||'IP 资料';
  return {title:'短剧剧本',filename:'short-drama-screenplay.md',edited:false,body:`# 短剧剧本\n\n创作需求：${request}\n参考资料：${sources}\n\n## 剧名\n被藏起的真相\n\n## 核心设定\n女主发现一份被隐瞒的旧信，在一次家族聚会中追查自己的身份，逐步揭开熟人之间的利益关系。\n\n## 主要角色\n林念：执着追寻真相，行动果断。\n顾川：掌握线索，态度克制，与林念既合作又对立。\n\n## 第一集 · 那封信\n\n### 场景：聚会大厅 / 夜 / 内\n画面：林念拿着旧信站在门口，厅内的人突然安静。\n林念：“有人告诉我，这封信从来没有存在过。”\n顾川看向她手中的信，放下酒杯。\n顾川：“你不该在今天打开它。”\n林念走进大厅：“为什么？因为上面写着我的名字？”\n\n### 场景：走廊 / 夜 / 内\n画面：顾川追出大厅，林念停在楼梯口。\n顾川：“你现在看到的，只是一半。”\n林念：“那另一半呢？”\n他递出一张被撕去一角的照片。\n画面：林念认出了照片中的人，手机同时收到一条匿名消息。\n消息：“别相信给你照片的人。”\n结尾钩子：她抬头，顾川已经消失在走廊尽头。\n\n## 关键帧与片段规划\n- 大厅入口：女主与旧信的特写，建立悬念。\n- 人群反应：快速切换视线与人物微表情。\n- 走廊对话：双人关系与照片细节。\n- 最后定格：匿名消息与女主反应。\n\n## 成片衔接\n确认角色资产与场景后，生成关键帧、对应片段，再完成剪辑和对白配音。`};
}
function acceptTranscript(index,reply){
  const c=currentChat,source=c.messages[index];
  if(source?.kind!=='transcript'||source.stage!=='ready')return;
  source.stage='accepted';
  c.messages.push({role:'user',text:reply});
  c.lastRequest=reply;
  const result={role:'agent',label:'Remake Agent',html:'<p class="analysis-thinking">Thinking...</p>'};
  c.messages.push(result);renderConversation();
  const taskId=beginTask('thinking');
  setTimeout(()=>{
    const isOriginal=/二创|新的版本/.test(reply);
    result.kind='document';
    result.summary=isOriginal?'二创脚本沿用原台词的主题，通过新的场景和人物关系重新组织表达，按“需求引入、情节推进、呼应收尾”展开。文档还整理了台词改写方向，以及画面、配音和剪辑的衔接。':'台词复刻方案保留原内容的表达节奏，将对白调整为适合自身产品或角色的口吻。文档按开头、中段、结尾整理改写方向，并补充对应的画面和片段制作安排。';
    const title=isOriginal?'二创脚本':'台词复刻方案';
    result.artifact={title,filename:isOriginal?'dialogue-recreation-script.md':'dialogue-remake-plan.md',edited:false,body:`# ${title}\n\n## 创作方向\n${isOriginal?'围绕原台词的主题，换用新的场景和人物关系，重新组织叙事。':'保留参考内容的表达节奏，将台词调整为适合自身产品或角色的表达。'}\n\n## 台词改写\n开头：用人物当前遇到的问题或需求建立关注。\n中段：通过自然对话推进情节，带出主体和关键价值。\n结尾：用一句呼应开头的表达收束。\n\n## 画面与节奏\n先准备场景及角色关键帧，再按台词段落生成片段，完成配音与剪辑。\n\n## 参考台词\n${source.artifact.body}`};
    result.question='是否依据这份方案，继续生成对应的视频？';
    endTask(taskId);if(currentChat.id===c.id)renderConversation();
  },2400);
}
function submitAnalysisFollowup(index,reply){
  const source=currentChat.messages[index];
  if(source?.stage!=='ready')return;
  if(reply.startsWith('先不用'))declineAnalysis(index,reply);
  else if(source.kind==='localization-plan')acceptLocalizationPlan(index,reply);
  else if(source.kind==='analysis'&&source.workflow==='localization')acceptLocalizationAnalysis(index,reply);
  else if(source.kind==='transcript')acceptTranscript(index,reply);
  else if(source.kind==='analysis')acceptAnalysis(index,reply);
}
function openArtifactEdit(m){if(!m?.artifact)return;const title=m.artifact.title;showModal(modalHeader(`编辑${title}`)+`<label class="artifact-edit-label">Markdown 内容<textarea id="artifact-editor" aria-label="编辑${esc(title)}">${esc(m.artifact.body)}</textarea></label><div class="artifact-modal-actions"><button data-close-modal>取消</button><button class="artifact-save" id="artifact-save">保存修改</button></div>`);$('#artifact-save').onclick=()=>{const value=$('#artifact-editor').value.trim();if(!value){toast('内容不能为空');return}m.artifact.body=value;m.artifact.edited=true;closeModal();renderConversation()};$('#artifact-editor').focus()}
function downloadArtifact(m){if(!m?.artifact)return;const blob=new Blob([m.artifact.body],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=m.artifact.filename||'creative-breakdown-demo.md';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function analysisFields(analysis){const fields={};for(const line of analysis.artifact.body.split('\n')){const match=line.match(/^\s*-?\s*(目标受众|视频时长|投放平台|核心卖点)\s*[：:]\s*(.+)\s*$/);if(match&&!/[【】]/.test(match[2]))fields[match[1]]=match[2].trim()}return fields}
function makeRemixArtifact(analysis){const fields=analysisFields(analysis);return {title:'视频复刻脚本',filename:'video-remix-script-demo.md',edited:false,body:`# 视频复刻脚本\n\n参考方向：真实使用场景切入 → 产品使用与卖点 → 品牌收尾\n视频时长：${fields.视频时长||'【填写秒数】'}\n投放平台：${fields.投放平台||'【填写平台】'}\n核心卖点：${fields.核心卖点||'【填写产品卖点】'}\n\n## 开头 · 吸引注意\n画面：以目标用户的真实使用场景开场，快速提出需求。\n文案：用一句自然的口播点出场景，不照搬参考视频的原品牌表达。\n\n## 中段 · 产品出现\n画面：展示产品特写和使用过程，让产品自然进入故事。\n文案：结合真实产品信息表达${fields.核心卖点||'【产品核心卖点】'}。\n\n## 结尾 · 品牌与行动引导\n画面：产品定格，保留简洁的品牌识别。\n文案：根据${fields.投放平台||'【投放平台】'}调整行动引导。`}}
function remixReadyHtml(result,index){return `<p class="remix-summary">这份脚本沿用“真实场景切入、产品使用与卖点展示、品牌收尾”的叙事方式，替换为你的产品和参考素材。文档按开头、中段和结尾整理画面与文案，并列出时长、平台和卖点等需要确认的信息。</p><div class="analysis-artifact"><button class="analysis-artifact-title" data-artifact-edit="${index}" title="点击编辑脚本" aria-label="编辑${esc(result.artifact.title)}">${esc(result.artifact.title)}.md</button><button class="analysis-artifact-download" data-artifact-download="${index}" aria-label="下载${esc(result.artifact.title)}">下载 ↓</button></div>${createAction()}`}
function acceptAnalysis(index,reply='好，帮我基于这份分析做相似视频。'){
  const c=currentChat,analysis=c.messages[index];
  if(analysis?.kind!=='analysis'||analysis.stage!=='ready')return;
  analysis.stage='accepted';c.messages.push({role:'user',text:reply});
  c.lastRequest='根据参考视频的拆解报告，为我的产品创作一个相似视频。';
  const result={role:'agent',label:'Remake Agent',html:'<p class="analysis-thinking">Thinking...</p>'};
  c.messages.push(result);renderConversation();
  const taskId=beginTask('thinking');
  setTimeout(()=>{
    if(analysis.workflow==='remake'){
      result.kind='document';
      result.summary='复刻方案保留“场景引入、产品呈现、品牌收尾”的结构，并结合上传的参考素材调整主体和卖点表达。文档已整理各段的画面、表达方式，以及关键帧到视频片段的制作衔接。';
      result.artifact=makeRemakeArtifact(analysis);
      result.question='是否依据这份方案，继续生成复刻视频？';
    }else{
      result.artifact=makeRemixArtifact(analysis);
      result.html=remixReadyHtml(result,c.messages.indexOf(result));
    }
    endTask(taskId);if(currentChat.id===c.id)renderConversation();
  },2600);
}
function declineAnalysis(index,reply='先不用，保留这份分析'){
  const c=currentChat,source=c.messages[index];
  if(!source||!['analysis','transcript','localization-plan'].includes(source.kind)||source.stage!=='ready')return;
  source.stage='declined';
  c.messages.push({role:'user',text:reply},{role:'agent',label:source.label,html:'<p>好的，你随时可以继续编辑或下载这份文档。</p>'});
  renderConversation();
}
async function send(){
  const input=$('#prompt').value.trim();
  if(!input&&!currentChat.attachments.length)return;
  const c=currentChat;
  const readyIndex=c.messages.findLastIndex(m=>['analysis','transcript','localization-plan'].includes(m.kind)&&m.stage==='ready');
  if(!tool&&readyIndex>=0&&/^(不用|先不|不要|no)/i.test(input)){
    $('#prompt').value='';c.prompt='';updateSend();declineAnalysis(readyIndex,input);return;
  }
  if(!tool&&readyIndex>=0&&/^(请|要|好的?|可以|继续|帮我|是的|yes|ok|okay|做吧|开始|改写|基于|生成|根据|印度|本土化)/i.test(input)){
    $('#prompt').value='';c.prompt='';updateSend();submitAnalysisFollowup(readyIndex,input);return;
  }
  if(/【[^】]+】|\{\{[^{}]+\}\}/.test(input)){toast('Please fill in or remove the placeholders before sending.');return}
  const chosenTool=tool,text=input||TOOL_PROMPTS[chosenTool]||'基于参考素材开始创作。';
  for(const message of c.messages)if(['analysis','transcript','localization-plan'].includes(message.kind)&&message.stage==='ready')message.stage='superseded';
  if(c.title==='New inspiration')c.title=text.length>22?text.slice(0,22)+'…':text;
  c.messages.push({role:'user',text,refs:c.attachments.map(a=>a.name)});
  c.lastRequest=text;
  if(c.attachments.length)c.lastReferences=c.attachments.map(a=>({...a}));
  c.attachments=[];c.prompt='';$('#prompt').value='';$('#prompt').style.height='';
  const labels={'AI Analysis':'Analysis Agent',Transcript:'Transcript Agent',Remake:'Remake Agent',Hooks:'Hooks Agent',Script:'Script Agent',Localization:'Localization Agent'};
  const m={role:'agent',label:labels[chosenTool]||'Creative Agent',html:(chosenTool==='Remake'?'<p>我会先拆解参考视频的创作结构。</p>':chosenTool==='Localization'?'<p>我会先分析参考视频的剧情、人物和创作结构。</p>':!chosenTool?'<p>我会先分析上传的参考素材，结合你的需求整理创作脚本。</p>':'')+'<p class="analysis-thinking">Thinking...</p>'};
  c.messages.push(m);setTool(null);$('#current-chat-title').textContent=c.title;renderAttachments();renderConversation();
  const taskId=beginTask('thinking');
  await new Promise(resolve=>setTimeout(resolve,2600));
  if(chosenTool==='AI Analysis'||chosenTool==='Remake'){
    m.artifact=makeAnalysisArtifact(c,text);m.stage='ready';m.kind='analysis';
    if(chosenTool==='Remake')m.workflow='remake';
  }else if(chosenTool==='Transcript'){
    m.kind='transcript';m.stage='ready';m.artifact=makeTranscriptArtifact(c);
  }else if(chosenTool==='Hooks'){
    m.kind='document';m.summary='我整理了三个开头方向：场景共鸣、结果前置和冲突悬念。每个方向都包含开场画面、首句文案、镜头节奏和关键帧建议。';
    m.artifact=makeHooksArtifact(c);
    m.question='是否基于这些开头方案，生成具体的 Hook 短视频或关键帧？';
  }else if(chosenTool==='Script'){
    m.kind='document';m.summary='这版短剧围绕一封旧信引出的身世秘密展开，以女主的追问和男主提供的线索推动冲突，并用匿名消息制造结尾反转。剧本包含人物设定、场景对白，以及后续制作的关键帧和片段规划。';
    m.artifact=makeDramaArtifact(c,text);
    m.question='是否根据这份剧本生成对应的关键帧和片段视频，最终完成成片？';
  }else if(chosenTool==='Localization'){
    m.kind='analysis';m.workflow='localization';m.stage='ready';m.references=(c.lastReferences||[]).map(a=>({...a}));m.artifact=makeLocalizationAnalysis(c,text);
  }else{
    const draft=makeRemixArtifact({artifact:makeAnalysisArtifact(c,text)});
    m.kind='document';
    m.summary='脚本已生成：先用日常场景引入需求，再通过产品特写和使用过程呈现卖点，最后以品牌画面收尾。文档按开头、中段和结尾整理了画面、文案及制作方向，可继续调整。';
    m.artifact={...draft,title:'创作脚本',filename:'creative-script.md',body:draft.body.replace('# 视频复刻脚本','# 创作脚本')+'\n\n## 创作需求\n'+text+'\n\n## 参考素材\n'+((c.lastReferences||[]).map(a=>a.name).join('、')||'当前创作需求')};
    m.question='是否根据这份脚本和参考素材，前往主端继续生成图片、关键帧、短视频或视频片段？';
  }
  endTask(taskId);if(currentChat.id===c.id)renderConversation();
}
function openMain(){window.open(MAIN_URL,'_blank','noopener,noreferrer')}
function openAssets(){window.open(ASSETS_URL,'_blank','noopener,noreferrer')}
function addUrl(){showModal(modalHeader('添加参考链接','输入图片或视频来源链接')+'<input class="text-input" id="reference-url" type="url" placeholder="https://…" aria-label="素材链接"><div class="url-actions"><button data-close-modal>取消</button><button class="primary" id="confirm-url">添加参考</button></div>');$('#confirm-url').onclick=()=>{const value=$('#reference-url').value.trim();let u;try{u=new URL(value);if(!['http:','https:'].includes(u.protocol))throw Error()}catch{toast('请输入有效的 http 或 https 链接');return}currentChat.attachments.push({id:crypto.randomUUID(),name:u.hostname,mime:'url',source:value});closeModal();renderAttachments();toast('已添加链接，Demo 不抓取外部内容')}}
function setupRail(){const rail=$('#tool-rail');let startX,startScroll,drag=false,suppress=false;rail.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;startX=e.clientX;startScroll=rail.scrollLeft;drag=true;suppress=false});window.addEventListener('pointermove',e=>{if(!drag)return;const d=e.clientX-startX;if(Math.abs(d)>5){suppress=true;rail.classList.add('dragging');rail.scrollLeft=startScroll-d}});window.addEventListener('pointerup',()=>{drag=false;rail.classList.remove('dragging');setTimeout(()=>suppress=false,0)});rail.addEventListener('click',e=>{if(suppress){e.stopImmediatePropagation();e.preventDefault()}},true);rail.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){const can=(e.deltaY>0&&rail.scrollLeft<rail.scrollWidth-rail.clientWidth-1)||(e.deltaY<0&&rail.scrollLeft>0);if(can){e.preventDefault();rail.scrollLeft+=e.deltaY}}},{passive:false})}
const runningTasks=new Map();let successTimer;
function syncLauncher(){const running=runningTasks.size>0,thinking=[...runningTasks.values()].includes('thinking');$('#launcher').classList.toggle('running',thinking);$('#launcher').setAttribute('aria-busy',String(running));$('#launcher').setAttribute('aria-label',thinking?'Qwen Create 正在思考，点击切换侧边栏':running?'Qwen Create 正在生成，点击切换侧边栏':'展开或收起 Create，拖入视频以收藏')}
function beginTask(kind){const id=crypto.randomUUID();runningTasks.set(id,kind);syncLauncher();return id}
function endTask(id){runningTasks.delete(id);syncLauncher()}
function animateSaved(){clearTimeout(successTimer);$('#launcher').classList.remove('saved-turn');void $('#launcher').offsetWidth;$('#launcher').classList.add('saved-turn');successTimer=setTimeout(()=>$('#launcher').classList.remove('saved-turn'),800)}
function scaleReference(){const compact=innerHeight<1100||innerWidth<850;const scale=compact?Math.max(.72,Math.min(.9,innerWidth/1200)):Math.max(.55,Math.min(innerWidth/1024,innerHeight/1536));document.documentElement.style.setProperty('--s',scale)}scaleReference();window.addEventListener('resize',scaleReference);
$('#demo-controls-toggle').onclick=()=>document.body.classList.toggle('controls-open');
$$('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));$('#brand-mark').innerHTML=logo();$('#launcher').innerHTML='<img class="launcher-mark" src="assets/qwen-black.png" alt="Qwen Create"><span class="drop-label">松开以收藏</span>';$('#launcher').title='打开 Qwen Create · 拖入视频收藏';$('#sidebar-toggle').innerHTML=icon('panel');
const tools=[['AI Analysis','analysis'],['Transcript','transcript'],['Remake','remix'],['Hooks','sparkles'],['Script','transcript'],['Localization','translate']];$('#tool-rail').innerHTML=tools.map(([n,i])=>`<button class="tool-pill" data-tool="${n}">${icon(i)}${n}</button>`).join('');$$('[data-tool]').forEach(b=>b.onclick=()=>{const previousTool=tool,previousPrompt=$('#prompt').value.trim();setTool(tool===b.dataset.tool?null:b.dataset.tool);$('#prompt').focus();if(tool&&(!previousPrompt||previousPrompt===TOOL_PROMPTS[previousTool]||Object.values(TOOL_PROMPTS).includes(previousPrompt)||previousPrompt==='Create a short video for my sunscreen brand.')){$('#prompt').value=TOOL_PROMPTS[tool];updateSend()}});
$$('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$$('[data-feed]').forEach(b=>b.onclick=()=>{feed=b.dataset.feed;$$('[data-feed]').forEach(x=>{x.classList.toggle('active',x.dataset.feed===feed);x.classList.toggle('selected',x.dataset.feed===feed)});renderFeed()});$('#sidebar-toggle').onclick=()=>toggleSidebar();$('#close-sidebar').onclick=()=>toggleSidebar(false);$('#launcher').onclick=()=>toggleSidebar();$('#library-button').onclick=()=>openLibrary();$('#open-library-nav').onclick=()=>openLibrary();$('#history-toggle').onclick=openHistory;$('#history-search').oninput=renderHistory;$('#new-chat').onclick=()=>{currentChat=chatState();chats.unshift(currentChat);renderChat();closePopovers()};$('#prompt').oninput=updateSend;$('#prompt').onkeydown=e=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter')send()};$('#send').onclick=send;$('#optimize').onclick=optimize;$('#open-main').onclick=()=>openMain();$('#upload-toggle').onclick=()=>$('#upload-menu').classList.toggle('hidden');$('#upload-local').onclick=()=>{$('#upload-menu').classList.add('hidden');$('#file-input').click()};$('#file-input').onchange=e=>{addFiles(e.target.files);e.target.value=''};$('#upload-assets').onclick=()=>openLibrary(null,true);$('#upload-photo').onclick=()=>{$('#upload-menu').classList.add('hidden');$('#photo-input').click()};$('#photo-input').onchange=e=>{addFiles(e.target.files);e.target.value=''};
$('#launcher').ondragover=e=>{if(draggedId){e.preventDefault();e.dataTransfer.dropEffect='copy';$('#launcher').classList.add('over')}};$('#launcher').ondragleave=()=>$('#launcher').classList.remove('over');$('#launcher').ondrop=e=>{e.preventDefault();const id=e.dataTransfer.getData('application/x-create-video')||draggedId;$('#launcher').classList.remove('over');document.body.classList.remove('dragging-video');if(id)openSave(id,$('#launcher'),'drag')};
let sidebarDragDepth=0;$('#sidebar').ondragenter=e=>{e.preventDefault();sidebarDragDepth++;$('#sidebar-drop').classList.remove('hidden')};$('#sidebar').ondragover=e=>{e.preventDefault();e.dataTransfer.dropEffect='copy'};$('#sidebar').ondragleave=()=>{sidebarDragDepth--;if(sidebarDragDepth<=0)$('#sidebar-drop').classList.add('hidden')};$('#sidebar').ondrop=e=>{e.preventDefault();sidebarDragDepth=0;$('#sidebar-drop').classList.add('hidden');document.body.classList.remove('dragging-video');const id=e.dataTransfer.getData('application/x-create-video')||draggedId;if(id)addReference(id);else if(e.dataTransfer.files.length)addFiles(e.dataTransfer.files);else{const u=e.dataTransfer.getData('text/uri-list')||e.dataTransfer.getData('text/plain');try{const url=new URL(u);if(['https:','http:'].includes(url.protocol)){currentChat.attachments.push({id:crypto.randomUUID(),name:url.hostname,mime:'url',source:u});renderAttachments();toast('已添加链接参考')}}catch{toast('请拖入图片、视频或有效链接')}}};
// Internal demo cards use a pointer drag so the preview works in embedded browsers too.
let pointerDrag=null,dragGhost=null;
$('#video-grid').addEventListener('dragstart',e=>{e.preventDefault()});
$('#video-grid').addEventListener('pointerdown',e=>{const card=e.target.closest('.video-poster');if(!card||e.target.closest('button')||e.button!==0||e.pointerType==='touch')return;pointerDrag={id:card.dataset.video,x:e.clientX,y:e.clientY,card,pointer:e.pointerId,active:false};card.setPointerCapture(e.pointerId)});
function hit(el,x,y){const r=el.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom}
window.addEventListener('pointermove',e=>{if(!pointerDrag)return;if(!pointerDrag.active&&Math.hypot(e.clientX-pointerDrag.x,e.clientY-pointerDrag.y)>7){pointerDrag.active=true;closePopovers();pointerDrag.card.classList.add('is-drag-source');document.body.classList.add('dragging-video');const v=videos.find(v=>v.id===pointerDrag.id);dragGhost=document.createElement('div');dragGhost.className='drag-ghost';dragGhost.innerHTML=thumb(v)+`<span>${esc(v.title)}</span>`;document.body.append(dragGhost)}if(pointerDrag.active){e.preventDefault();dragGhost.style.left=(e.clientX+15)+'px';dragGhost.style.top=(e.clientY+15)+'px';$('#launcher').classList.toggle('over',hit($('#launcher'),e.clientX,e.clientY));$('#sidebar-drop').classList.toggle('hidden',!(sidebarOpen&&hit($('#sidebar'),e.clientX,e.clientY)))}});
function endPointerDrag(e,cancel=false){if(!pointerDrag)return;const d=pointerDrag;pointerDrag=null;d.card.classList.remove('is-drag-source');document.body.classList.remove('dragging-video');$('#launcher').classList.remove('over');$('#sidebar-drop').classList.add('hidden');dragGhost?.remove();dragGhost=null;draggedId=null;if(d.card.hasPointerCapture(d.pointer))d.card.releasePointerCapture(d.pointer);if(d.active&&!cancel){if(hit($('#launcher'),e.clientX,e.clientY))openSave(d.id,$('#launcher'),'drag');else if(sidebarOpen&&hit($('#sidebar'),e.clientX,e.clientY))addReference(d.id)}}
window.addEventListener('pointerup',e=>endPointerDrag(e));window.addEventListener('pointercancel',e=>endPointerDrag(e,true));
$('#modal-backdrop').onclick=e=>{if(e.target===$('#modal-backdrop'))closeModal()};document.addEventListener('pointerdown',e=>{if(!e.target.closest('.save-popover,.collector-menu,.launcher,.hover-save,.history-menu,#history-toggle,.upload-wrap,.model-picker'))closePopovers()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePopovers();closeModal()}if(e.key==='Tab'&&!$('#modal-backdrop').classList.contains('hidden')){const list=[...$('#modal').querySelectorAll('button,input,textarea,select,[tabindex="0"]')].filter(x=>!x.disabled),first=list[0],last=list[list.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#modal'))){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}});window.addEventListener('resize',()=>{if(pending&&popAnchor)positionPopover($('#save-popover'),popAnchor,pending.kind);if(!$('#collector-menu').classList.contains('hidden'))positionPopover($('#collector-menu'),$('#launcher'),'drag')});setupRail();setMode('hover');toggleSidebar(sidebarOpen);renderChat();renderFeed();updateCounts();
