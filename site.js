const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduced=document.documentElement.dataset.motion==='reduce';
const header=$('#header'),menu=$('#menu'),menuToggle=$('.menu-toggle');

function closeMenu(){document.body.classList.remove('menu-open');menu.inert=true;menuToggle.setAttribute('aria-expanded','false');$('.menu-word').textContent='Menu';}
menuToggle.addEventListener('click',()=>{const open=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);menu.inert=!open;header.classList.remove('is-hidden');menuToggle.setAttribute('aria-expanded',String(open));$('.menu-word').textContent=open?'Close':'Menu';});
$$('#menu a').forEach(link=>link.addEventListener('click',closeMenu));
function closeDropdowns(){ $$('.nav-disclosure').forEach(button=>{button.setAttribute('aria-expanded','false');button.dataset.openedBy='';$('#'+button.getAttribute('aria-controls')).hidden=true;}); }
$$('.nav-disclosure').forEach(button=>button.addEventListener('click',()=>{const open=button.dataset.openedBy==='hover'||button.getAttribute('aria-expanded')!=='true';closeDropdowns();button.setAttribute('aria-expanded',String(open));button.dataset.openedBy='click';$('#'+button.getAttribute('aria-controls')).hidden=!open;}));
$$('.nav-dropdown a').forEach(link=>link.addEventListener('click',closeDropdowns));

let dropdownTimer;
$$('.nav-item').forEach(item=>{
 const button=$('.nav-disclosure',item),panel=$('.nav-dropdown',item);
 const open=()=>{clearTimeout(dropdownTimer);closeDropdowns();button.setAttribute('aria-expanded','true');button.dataset.openedBy='hover';panel.hidden=false;header.classList.remove('is-hidden');};
 item.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')open();});
 item.addEventListener('pointerleave',()=>{dropdownTimer=setTimeout(()=>{if(!item.contains(document.activeElement))closeDropdowns();},180);});
 item.addEventListener('focusout',event=>{if(!item.contains(event.relatedTarget))closeDropdowns();});
});
header.addEventListener('focusin',()=>header.classList.remove('is-hidden'));
let navLastY=scrollY,navDirection=0,navTravel=0;
function updateHeader(){
 const y=Math.max(0,scrollY),delta=y-navLastY;navLastY=y;
 const direction=Math.sign(delta);
 if(direction&&direction!==navDirection){navTravel=0;navDirection=direction;}
 navTravel+=Math.abs(delta);
 const pinned=document.body.classList.contains('menu-open')||!!$('.nav-disclosure[aria-expanded="true"]')||header.contains(document.activeElement);
 if(y<header.offsetHeight+20||pinned){header.classList.remove('is-hidden');navTravel=0;return;}
 if(navTravel>8){header.classList.toggle('is-hidden',navDirection>0);navTravel=0;}
}

document.addEventListener('click',event=>{if(!event.target.closest('.nav-item'))closeDropdowns();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();closeDropdowns();}});

const articles=[
 {id:'begin-with-a-pause',title:'Begin with a pause',category:'Mindful living',time:'1 min read',image:'assets/5e115c48f68bafd2.webp',excerpt:'A small moment of attention can become a meaningful beginning.',paragraphs:[
  'A practice does not always need to begin with movement. Sometimes it begins with putting something down: your phone, a list of unfinished tasks, or the idea that this moment has to become something impressive.',
  'Take a comfortable seat and notice the room around you. Let your breath remain easy and unforced. There is nothing to achieve in this pause. You are simply making a little room to pay attention.',
  'From here, you might choose a few gentle movements, a longer practice, or a quiet moment before returning to your day. The pause is not a test. It is an invitation to begin where you are.'
 ]},
 {id:'rhythm-over-routine',title:'Find your rhythm',category:'On the mat',time:'1 min read',image:'assets/f8024f36b0f4d42f.webp',excerpt:'Consistency can be kind, flexible, and responsive to real life.',paragraphs:[
  'It is easy to picture consistency as the same practice at the same time, every day. Real life often has a different rhythm. Your energy, attention, and available time change. A practice can make space for that.',
  'Instead of choosing a routine that only works on an ideal day, choose a beginning that feels approachable. It might be rolling out your mat, making a few mindful movements, or spending a moment observing your breath.',
  'Allow the practice to grow when there is room, and to become smaller when life asks for something else. Returning with curiosity can matter more than following a perfect plan.'
 ]},
 {id:'listen-to-your-breath',title:'Let the breath be a conversation',category:'Breath & awareness',time:'1 min read',image:'assets/a961b89f11b4b30b.webp',excerpt:'An invitation to notice the breath without turning it into another task.',paragraphs:[
  'Breath is present throughout the day, yet it can be easy to overlook. Bringing attention to it does not have to mean changing it. Listening is a useful place to start.',
  'Notice the natural movement of breathing in a comfortable position. There is no need to deepen, hold, or force the breath. If paying attention to it feels uncomfortable, return your attention to the room or another simple point of focus.',
  'In movement, this same curiosity can help you notice pace and effort. Let the practice be a conversation: a chance to observe, respond, and choose what feels appropriate in the moment.'
 ]},
 {id:'beyond-the-mat',title:'Beyond the mat',category:'Everyday practice',time:'1 min read',image:'assets/adb21ed552d5eb30.webp',excerpt:'Small ways to bring a little more presence into an ordinary day.',paragraphs:[
  'A yoga practice can create a space to notice how you meet experience. That curiosity does not have to end when the mat is rolled away.',
  'There may be an opportunity to pause before answering a message, to notice your surroundings on a familiar walk, or to listen a little more fully in a conversation. These small moments do not need to become another checklist.',
  'Choose one ordinary moment and bring a little attention to it. Some days you will remember; some days you will not. The invitation remains available the next time you begin.'
 ]} ,
 {id:'make-space-for-rest',title:'Make space for rest',category:'Rest & reflection',time:'1 min read',image:'assets/ce8bfadefcf00e21.webp',excerpt:'Let a pause become part of your practice.',paragraphs:[
  'A practice can make room for stillness as well as movement. You do not need to fill every available moment or turn every session into a challenge. Sometimes a quieter beginning is the one that makes sense.',
  'Choose a comfortable place to pause. Notice the support beneath you and let your attention settle on the sounds around you. There is no special result to look for and no need to change your breathing.',
  'When you are ready, decide what comes next. A little movement, another quiet moment, or returning to your day are all possible ways to continue.'
 ]},
 {id:'stay-curious',title:'Stay curious',category:'Learning & practice',time:'1 min read',image:'assets/a86f336b59cc5ce9.webp',excerpt:'A familiar practice can offer something new to notice.',paragraphs:[
  'Familiarity can be reassuring, but it can also make it easy to move through a practice without paying much attention. Curiosity offers another way to meet the movements you already know.',
  'Choose one simple detail to notice: the pace of a transition, the way your feet meet the floor, or how your attention changes when you slow down. You are gathering an experience rather than trying to find a correct answer.',
  'Some days a question will lead to a useful discovery. Other days it may simply invite you to listen more carefully. Both can be part of an ongoing practice.'
 ]}
];
$('#blog-posts').innerHTML=articles.map(article=>`<button class="blog-card" data-article="${article.id}" aria-label="Read ${article.title}"><span class="blog-image"><img src="${article.image}" alt="Yoga and mindful practice" loading="lazy"><span class="image-arrow" aria-hidden="true">↗</span></span><span class="blog-meta"><span>${article.category}</span><span>${article.time}</span></span><h3>${article.title}</h3><span class="read-link">Read the article <span aria-hidden="true">→</span></span></button>`).join('');

const dialog=$('#detail-dialog');let returnFocus=null;
function openDialog(html){returnFocus=document.activeElement;$('.dialog-content').innerHTML=html;dialog.showModal();document.body.classList.add('modal-open');$('.dialog-close').focus();}
function closeDialog(){dialog.close();document.body.classList.remove('modal-open');$('.dialog-content').innerHTML='';returnFocus?.focus?.({preventScroll:true});}
$('.dialog-close').addEventListener('click',closeDialog);dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});
function openArticle(id){const article=articles.find(item=>item.id===id);if(!article)return;openDialog(`<article class="article-dialog"><img src="${article.image}" alt="A moment of yoga practice"><div class="article-body"><p class="eyebrow">Yogadyah journal · ${article.category}</p><h2>${article.title}</h2><p class="article-byline">By Yogadyah · ${article.time}</p>${article.paragraphs.map(paragraph=>`<p>${paragraph}</p>`).join('')}<a class="text-link modal-contact" href="#contact">Talk about your practice →</a></div></article>`);$('.modal-contact').addEventListener('click',closeDialog);}
document.addEventListener('click',event=>{const article=event.target.closest('[data-article]');if(article)openArticle(article.dataset.article);});

const practiceContent={
 practice:[
  {title:'Move with<br>awareness.',copy:'A thoughtful approach to movement, with room to explore your own pace.',points:['Notice how you move.','Stay curious about your experience.','Let the practice meet you today.'],button:'Explore the approach',target:'#practice'},
  {title:'Make space<br>to breathe.',copy:'Bring attention to the simple connection between movement, breath, and presence.',points:['Begin with observation.','Keep the breath comfortable.','Create moments of quiet attention.'],button:'Read a practice note',article:'listen-to-your-breath'},
  {title:'A practice<br>that is yours.',copy:'Find a way of practicing that makes sense in your everyday life.',points:['Start where you are.','Choose a rhythm you can return to.','Keep learning with kindness.'],button:'Begin a conversation',target:'#contact'}
 ],
 philosophy:[
  {title:'Curiosity over<br>comparison.',copy:'The mat can be a place to ask questions rather than measure yourself against someone else.',points:['Pay attention to your own experience.','Explore without rushing.','Leave room for discovery.'],button:'Meet Yogadyah',target:'#about'},
  {title:'Presence over<br>performance.',copy:'A meaningful practice can be simple, attentive, and free from the need to impress.',points:['Notice the small details.','Make space for a pause.','Let attention lead the way.'],button:'Begin with a pause',article:'begin-with-a-pause'},
  {title:'Practice beyond<br>the mat.',copy:'Carry a little of that awareness into the ordinary moments that shape your day.',points:['Listen with attention.','Take one thing at a time.','Return to what matters to you.'],button:'Read the journal',article:'beyond-the-mat'}
 ]
};
function setPracticeTab(key,animate=true){
 const photos=key==='practice'?[
  {src:'assets/a961b89f11b4b30b.webp',alt:'A mindful yoga movement practice',tag:'Movement'},
  {src:'assets/ce8bfadefcf00e21.webp',alt:'A quiet seated practice and awareness of breath',tag:'Breath'},
  {src:'assets/865c07aa44ad4dab.webp',alt:'A moment of personal yoga practice',tag:'Everyday'}
 ]:[
  {src:'assets/adb21ed552d5eb30.webp',alt:'Yoga practiced with curiosity',tag:'Curiosity'},
  {src:'assets/5e115c48f68bafd2.webp',alt:'A pause in warm natural light',tag:'Presence'},
  {src:'assets/f8024f36b0f4d42f.webp',alt:'A shared yoga practice',tag:'Living yoga'}
 ];
 $('#practice-track').innerHTML=practiceContent[key].map((card,index)=>`<article class="practice-card"><div class="practice-card-photo"><img src="${photos[index].src}" alt="${photos[index].alt}" loading="lazy"></div><div class="practice-card-badges"><span>${key==='practice'?'Practice':'Philosophy'}</span><span>${photos[index].tag}</span></div><div class="practice-card-copy"><h3>${card.title}</h3><p>${card.copy}</p></div>${card.article?`<button class="card-action" aria-label="${card.button}: ${card.title.replace(/<br>/g,' ')}" data-article="${card.article}">${card.button}<span>↗</span></button>`:`<a class="card-action" aria-label="${card.button}: ${card.title.replace(/<br>/g,' ')}" href="${card.target}">${card.button}<span>↗</span></a>`}</article>`).join('');
 $$('[data-path]').forEach(button=>{const selected=button.dataset.path===key;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
 $('#practice-panel').setAttribute('aria-labelledby','path-'+key);$('.practice-tab-indicator').style.transform=key==='philosophy'?'translateX(100%)':'translateX(0)';

}
$$('[data-path]').forEach(button=>{button.addEventListener('click',()=>setPracticeTab(button.dataset.path));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const next=button.dataset.path==='practice'?'philosophy':'practice';setPracticeTab(next);$('#path-'+next).focus();}});});setPracticeTab('practice',false);

const topics=[
 {title:'Mindful movement',image:'assets/b9cb1780f3286242.webp',copy:'Explore movement as a way to notice, listen, and respond.',body:'Movement can become an exploration of attention. Rather than chasing an ideal shape, begin with curiosity about the experience you are having. Yogadyah’s approach invites thoughtful pacing, clear intention, and space for individual expression.'},
 {title:'Breath & attention',image:'assets/ce8bfadefcf00e21.webp',copy:'Make room for an easy, unforced awareness of the breath.',body:'Breath offers a simple point of attention. The invitation is to notice it without needing to force, hold, or perfect it. This gentle observation can become part of a movement practice or a quiet moment on its own.'},
 {title:'Rest & reflection',image:'assets/5e115c48f68bafd2.webp',copy:'Let stillness have a place in the practice, too.',body:'Rest is part of the conversation. A pause can offer a different way to notice what is present, without the need to fill every moment. Reflection gives the practice room to settle and become part of everyday life.'}
];
$('#topic-grid').innerHTML=topics.map((topic,index)=>`<button class="topic-card" data-topic="${index}"><span class="topic-image"><img src="${topic.image}" alt="${topic.title}" loading="lazy"></span><span class="topic-heading"><h3>${topic.title}</h3><span aria-hidden="true">↗</span></span><p>${topic.copy}</p></button>`).join('');
$$('[data-topic]').forEach(button=>button.addEventListener('click',()=>{const topic=topics[+button.dataset.topic];openDialog(`<article class="article-dialog"><img src="${topic.image}" alt="${topic.title}"><div class="article-body"><p class="eyebrow">The Yogadyah approach</p><h2>${topic.title}</h2><p>${topic.body}</p><a class="text-link modal-contact" href="#contact">Ask about your practice →</a></div></article>`);$('.modal-contact').addEventListener('click',closeDialog);}));

const ways=[
 {title:'A shared space<br>for practice.',copy:'A group practice can offer the simple experience of showing up alongside others. Get in touch to talk about the kind of class or shared practice you are looking for.',image:'assets/f8024f36b0f4d42f.webp'},
 {title:'Make a little space<br>at home.',copy:'A quiet corner, a few moments, and an open mind can be a beginning. Explore the journal for ideas to bring attention and gentle movement into your own space.',image:'assets/adb21ed552d5eb30.webp'},
 {title:'Your questions.<br>Your own pace.',copy:'Sometimes the next step begins with a conversation. Share what you are curious about, and explore how a more personal approach to practice might support your intentions.',image:'assets/a86f336b59cc5ce9.webp'}
];
let wayRequest=0;
async function setWay(index){
 const request=++wayRequest;
 $$('[data-way]').forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
 $('.way-indicator').style.transform=`translateX(${index*100}%)`;
 $('#way-panel').setAttribute('aria-labelledby','way-'+index);
 $('#way-title').textContent=ways[index].title.replace(/<br>/g,' ');
 $('#way-title').setAttribute('aria-label',$('#way-title').textContent);
 $('#way-copy').textContent=ways[index].copy;
 if(!reduced){
  $('#way-panel').getAnimations().forEach(animation=>animation.cancel());
  $('#way-panel').animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:750,easing:'cubic-bezier(.32,.72,0,1)'});
 }
 const image=$('#way-image');
 const incoming=new Image();incoming.src=ways[index].image;
 try{await incoming.decode();}catch{return;}
 if(request!==wayRequest)return;
 $$('.way-image-leaving').forEach(element=>element.remove());
 const previous=image.cloneNode();previous.removeAttribute('id');previous.alt='';previous.setAttribute('aria-hidden','true');previous.classList.add('way-image-leaving');
 image.src=incoming.src;image.alt=['A shared yoga practice','A quiet personal practice','An individual moment of yoga practice'][index];
 if(!reduced){
  image.parentElement.append(previous);
  const fade=previous.animate([{opacity:1},{opacity:0}],{duration:850,easing:'cubic-bezier(.32,.72,0,1)',fill:'forwards'});
  fade.finished.then(()=>previous.remove()).catch(()=>previous.remove());
 }
}

$$('[data-way]').forEach(button=>{button.addEventListener('click',()=>setWay(+button.dataset.way));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const next=(+button.dataset.way+(event.key==='ArrowRight'?1:2))%3;setWay(next);$('#way-'+next).focus();}});});


$('#contact-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));try{localStorage.setItem('yogadyah-contact-draft',JSON.stringify({...data,savedAt:new Date().toISOString()}));$('#contact-status').textContent='Your note is saved on this device. Sending is not connected in this local preview.';}catch{$('#contact-status').textContent='This local preview cannot send messages. Please keep a copy of your note.';}});
$('#footer-newsletter').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;try{localStorage.setItem('yogadyah-newsletter-draft',new FormData(form).get('email'));$('#footer-status').textContent='Saved on this device. Email delivery is not connected.';}catch{$('#footer-status').textContent='Email delivery is not connected in this local preview.';}});
$$('[data-privacy]').forEach(button=>button.addEventListener('click',()=>{openDialog('<div class="privacy-content"><p class="eyebrow">Yogadyah · Local preview</p><h2>Your privacy</h2><p>This website runs locally. Its fonts, images, and articles are served from the local project. No analytics or external booking service is connected.</p><p>Contact and newsletter forms save entries only in this browser on this device. They do not send messages or subscribe you to an email list.</p><button class="button primary" id="clear-preview-data">Clear locally saved form entries</button><p id="privacy-status" role="status"></p></div>');$('#clear-preview-data').addEventListener('click',()=>{localStorage.removeItem('yogadyah-contact-draft');localStorage.removeItem('yogadyah-newsletter-draft');$('#privacy-status').textContent='Locally saved form entries have been cleared.';});}));

// Normal browser scrolling: no wheel, touch, PageUp, or PageDown interception.
const sections=$$('main>section,footer');
$('.section-navigation').innerHTML=sections.map(section=>`<a class="section-dot" href="#${section.id}" aria-label="Go to ${section.dataset.label}" title="${section.dataset.label}"><span>${section.dataset.label}</span></a>`).join('');
function updateNavigation(){let active=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<innerHeight*.38)active=section;}$$('.section-dot').forEach(link=>{const selected=link.hash==='#'+active.id;link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});const dark=sections.find(section=>{const box=section.getBoundingClientRect();return box.top<innerHeight-35&&box.bottom>innerHeight-35;})?.classList.contains('dark-section');$('.section-navigation').classList.toggle('on-dark',!!dark);$('.motion-toggle').classList.toggle('on-dark',!!dark);header.classList.toggle('scrolled',scrollY>20);
 const group=['lineage','practice','community'].includes(active.id)?'practice':['contact','footer'].includes(active.id)?'contact':active.id;
 $$('[data-nav]').forEach(link=>{if(link.dataset.nav===group)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 $('[data-nav-group="practice"]').classList.toggle('is-active',group==='practice');
 updateHeader();}
let scheduled=false;addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{updateNavigation();scheduled=false;});}},{passive:true});addEventListener('resize',updateNavigation);updateNavigation();
const motionButton=$('.motion-toggle');$('span',motionButton).textContent=reduced?'off':'on';motionButton.setAttribute('aria-pressed',String(!reduced));motionButton.addEventListener('click',()=>{try{localStorage.setItem('yogadyah-motion',reduced?'full':'reduce');sessionStorage.setItem('yogadyah-restore-scroll',String(scrollY));}catch{}location.reload();});
addEventListener('load',()=>{try{const y=sessionStorage.getItem('yogadyah-restore-scroll');if(y!==null){scrollTo({top:+y,behavior:'instant'});sessionStorage.removeItem('yogadyah-restore-scroll');}}catch{}updateNavigation();});

// Reveal, image depth, and anchor motion are coordinated in motion.js.
