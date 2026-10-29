const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=document.documentElement.dataset.motion==='reduce';
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));
const header=$('#header'),menu=$('#menu'),toggle=$('.menu-toggle');
function closeMenu(){document.body.classList.remove('menu-open');header.classList.remove('menu-visible');toggle.setAttribute('aria-expanded','false');$('.menu-word').textContent='Menu';menu.inert=true;updateScroll();}
toggle.addEventListener('click',()=>{if(document.body.classList.contains('menu-open'))return closeMenu();document.body.classList.add('menu-open');header.classList.add('menu-visible');toggle.setAttribute('aria-expanded','true');$('.menu-word').textContent='Close';menu.inert=false;});
$$('.menu-panel a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(e.key==='Tab'&&document.body.classList.contains('menu-open')){const focusable=[toggle,...$$('a,button',menu)];const i=focusable.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();focusable.at(-1).focus()}else if(!e.shiftKey&&i===focusable.length-1){e.preventDefault();toggle.focus()}}});
let cards=[];let scrollQueued=false;let lineageActive=0;
function updateScroll(){
 const y=scrollY;header.classList.toggle('scrolled',y>40);
 const heroBottom=$('.hero').getBoundingClientRect().bottom;
 const community=$('.community').getBoundingClientRect(),footer=$('.footer').getBoundingClientRect(),studios=$('.studios').getBoundingClientRect();
 const darkSection=heroBottom>70||(community.top<65&&community.bottom>65)||(studios.top<65&&studios.bottom>65);
 header.classList.toggle('dark',!darkSection);header.classList.toggle('footer-header',footer.top<80&&footer.bottom>80);const navigationSection=$$('main>section,footer').find(section=>{const r=section.getBoundingClientRect();return r.top<innerHeight-45&&r.bottom>innerHeight-45});$('.section-navigation').classList.toggle('on-dark',!!navigationSection?.matches('.hero,.community,.closing-image'));
 if(cards.length){
  const current=lineageActive;
  const cardHeight=Math.min($('.lineage-cards').clientHeight*.72,360);
  cards.forEach((card,i)=>{
   card.style.height=cardHeight+'px';card.style.width=(cardHeight*2/3)+'px';
   const distance=i-current,abs=Math.abs(distance),direction=distance<0?-1:(i%2?1:-1);
   const x=distance<-.65?distance*75:direction*Math.min(abs,4)*10;
   const rotate=distance<-.65?distance*5:direction*Math.min(abs,4)*3;
   const lift=Math.min(abs,4)*cardHeight*.015;
   card.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${lift}px)) rotate(${rotate}deg) scale(${1-Math.min(abs,5)*.025})`;
   card.style.zIndex=100-Math.round(abs*10);
   card.style.opacity=abs>5?Math.max(0,1-(abs-5)*.5):1;
   $('.lineage-year',card).style.opacity=abs<.6?1:0;
  });
 }
 if(!reduced&&$('.closing-image')){const rect=$('.closing-image').getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){$('.closing-image img').style.transform=`scale(1.08) translateY(${(rect.top/innerHeight)*-25}px)`;}}
 if(window.updateSectionNavigation)window.updateSectionNavigation();scrollQueued=false;
}
addEventListener('scroll',()=>{if(!scrollQueued){requestAnimationFrame(updateScroll);scrollQueued=true;}},{passive:true});addEventListener('resize',updateScroll);
const dialog=$('.detail-dialog');
function openDialog(content,video=false){$('.dialog-content').className='dialog-content'+(video?' video-dialog':'');$('.dialog-content').innerHTML=content;dialog.showModal();document.body.classList.add('modal-open');$('.dialog-close').focus();}
function closeDialog(){const video=$('video',dialog);if(video)video.pause();if(window.activeHls){window.activeHls.destroy();window.activeHls=null}dialog.close();document.body.classList.remove('modal-open');$('.dialog-content').innerHTML='';}
$('.dialog-close').addEventListener('click',closeDialog);dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog()});dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});
$('.showreel-media').addEventListener('click',async()=>{
 openDialog('<video controls playsinline autoplay poster="assets/5e115c48f68bafd2.webp"></video><p class="video-status" role="status">Loading the original showreel…</p>',true);
 const video=$('video',dialog),src='https://vz-08205200-417.b-cdn.net/15043218-ce65-4b49-a98f-db8ed0dfe5a6/playlist.m3u8';
 const failed=()=>{$('.video-status').innerHTML='The original video could not be loaded. <a href="https://www.becomeayogi.com/" target="_blank" rel="noopener" style="text-decoration:underline">Watch on the original website ↗</a>'};
 video.addEventListener('playing',()=>{$('.video-status').textContent='Showreel · Become A Yogi'},{once:true});video.addEventListener('error',failed,{once:true});
 if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src;video.play().catch(()=>{})}
 else{try{if(!window.Hls){await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js';script.onload=resolve;script.onerror=reject;document.head.append(script)})}if(!dialog.open)return;const hls=window.activeHls=new Hls();hls.loadSource(src);hls.attachMedia(video);hls.on(Hls.Events.MANIFEST_PARSED,()=>video.play().catch(()=>{}));hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)failed()})}catch{failed()}}
});
const cookie=$('.cookie-banner');
try{cookie.hidden=!!localStorage.getItem('bay-recreation-consent')}catch{cookie.hidden=false}
$$('[data-consent]').forEach(b=>b.addEventListener('click',()=>{try{localStorage.setItem('bay-recreation-consent',b.dataset.consent)}catch{}cookie.hidden=true}));
$$('.cookie-settings').forEach(b=>b.addEventListener('click',()=>{closeMenu();cookie.hidden=false}));
$('#cookie-details').addEventListener('click',()=>openDialog('<div><p class="eyebrow">Privacy preferences</p><h2>You choose what to open.</h2><p>This personal recreation uses local fonts and images. A small preference is saved in your browser when you dismiss the privacy panel.</p><p>Playing the showreel connects to the original video host and its player library. Studio map links open Google Maps. Newsletter fields are a local demonstration and do not transmit your details.</p></div>'));
$('.newsletter-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;$('.form-message').innerHTML='Preview only — your details have not been sent. <a href="https://www.becomeayogi.com/#newsletter" target="_blank" rel="noopener" style="text-decoration:underline">Subscribe on the original site ↗</a>';});
$('#load-map').addEventListener('click',()=>{open('https://www.google.com/maps/search/yoga+studios/','_blank','noopener')});

const trainingData=[
 {date:'Austin, TX March 5–7',title:'ROCKET VINYASA 20-hour',copy:'Two ways to move. Two individual voices. A shared devotion to the practice.',image:'background-0',href:'https://www.wetravel.com/trips/rocket-vinyasa-20hr-become-a-yogi-2066113958'},
 {date:'Miami Beach, FL Feb 5–7',title:'ART OF VINYASA',copy:'Explore Jonah’s approach to teaching through a complete, embodied immersion.',image:'background-1',href:'https://www.wetravel.com/trips/art-of-vinyasa-20hr-become-a-yogi-0714013559'},
 {date:'USA · May 16–30, 2027',title:'300HR USA',copy:'An immersive 300-hour training, surrounded by the quiet beauty of the Blue Ridge Mountains.',image:'background-2',href:'https://www.wetravel.com/trips/300hr-yoga-teacher-training-usa-kestyoga-6737762073'},
 {date:'Bali · August 14–28, 2027',title:'300HR BALI',copy:'Deepen your practice and your teaching in the heart of Bali.',image:'background-3',href:'https://www.wetravel.com/trips/bali-300hr-teacher-training-2027-kestyoga-1276290020'}
];
const doorwayData=[
 {image:'The Master Teacher',detailImage:'The Voice — The Master Teacher',title:'The Master Teacher',eyebrow:'01 · The voice',copy:'A teacher’s presence is shaped by the way they live and practice. Wisdom, care, balance, and gratitude become part of the room long before a single cue is offered.',more:'Explore rhythm, voice, observation, and the confidence to leave space for silence. The work is to discover a way of teaching that feels honest to you.'},
 {image:'The Intelligence of Flow',detailImage:'The Craft — The Intelligence of Flow',title:'The Intelligence of Flow',eyebrow:'02 · The craft',copy:'Sequencing brings movement into conversation with breath. Familiarity offers grounding; a new direction invites curiosity. Together, they create a rhythm the body can follow.',more:'Learn to shape an intentional class through effort and ease, expansion and contraction, rising energy and a gradual return to stillness.'},
 {image:'Lineage, Philosophy & the Eight Limbs',detailImage:'The Roots — Lineage, Philosophy & the Eight Limbs',title:'Lineage, Philosophy & the Eight Limbs',eyebrow:'03 · The roots',copy:'Yoga philosophy comes alive in the choices we make every day. Study provides a foundation, while relationships, work, and practice give us a place to explore it.',more:'The Kest lineage draws from Ashtanga Vinyasa through David Williams and Jonny Kest, continuing with Jonah and a new generation of teachers.'},
 {image:'Breath as the Architecture of Practice',detailImage:'The Carrier — Breath as the Architecture of Practice',title:'Breath as the Architecture of Practice',eyebrow:'04 · The carrier',copy:'Breath is the thread that connects each part of practice. By learning to notice and guide it, we begin to understand changes in attention, energy, and the nervous system.',more:'Explore traditional breath practices alongside a grounded understanding of the body. Start by paying attention to the breath that is already here.'},
 {image:'The Seven Doorways of Vinyasa',detailImage:'The Signature — The Seven Doorways of Vinyasa',title:'The Seven Doorways of Vinyasa',eyebrow:'05 · The signature',copy:'A class has an energetic journey. Stillness becomes breath, breath becomes movement, and intensity eventually makes room for rest. The Seven Doorways help teachers understand that arc.',more:'Explore the intention, timing, and rhythm behind each transition, so the experience unfolds naturally from its beginning to its close.'}
];
const journalData=[['Fifty Years of Practice','A lifetime on the mat','fifty-years-of-practice'],['Architecture of Resilience','The shape of resilience','architecture-of-resilience'],['Hold the Room','Presence in the room','hold-the-room'],["Yoga Isn't Enough",'Beyond the yoga mat','yoga-isnt-enough'],['Brakes of a Car','Learning when to pause','brakes-of-a-car'],['Yoga Saved My Life','How practice changes a life','yoga-saved-my-life'],['Steer Your Life','Finding your direction','steer-your-life']];
const studioData=[['West Hollywood, CA','Sweat Yoga West Hollywood','https://www.sweat-yoga.com/schedule-west-hollywood'],['Playa Vista, CA','Sweat Yoga Playa Vista','https://www.sweat-yoga.com/schedule-playa-vista'],['Santa Monica, CA','Sweat Yoga','https://www.sweat-yoga.com/schedule-santa-monica'],['Manila, Philippines','OCA Collective','https://theocacollective.rezerv.co/class'],['Winnipeg, Manitoba, Canada','Shapes Fitness','https://classes.shapes.ca/'],['Tel Aviv, Israel','Dahlia Rubin Yoga','https://www.instagram.com/dahliarubinyoga/'],['Arlington, Virginia, USA','SoulFire Collective','https://www.soulfirecollective.com/schedule.html'],['Bethesda, Maryland, USA','SoulFire Collective','https://www.soulfirecollective.com/schedule.html'],['Rehoboth Beach, Delaware, USA','SoulFire Collective','https://www.soulfirecollective.com/schedule.html'],['St. Joseph, Michigan, USA','Yoga Life','https://www.yogalifemichigan.com/schedule'],['Detroit, Michigan, USA','The Schvitz','https://schvitzdetroit.com/'],['Houston, Texas, USA','Life Time Greenway','https://www.lifetime.life/locations/tx/greenway.html'],['Houston, Texas, USA','24 Hour Fitness','https://www.24hourfitness.com/gyms/houston-tx/houston-heights-super-sport'],['Baton Rouge, Louisiana, USA','Preservation Yoga','https://www.preservationyoga.com/schedule'],['St. Petersburg, Florida, USA','SukhaLife Yoga','https://sukhalifeyoga.com/yoga-class-schedule/'],['St. Petersburg, Florida, USA','Fire Flow St. Pete','https://www.fireflowstpete.com/book-now'],['St. Petersburg, Florida, USA','Beach Town Yoga','https://www.beachtownyoga.com/locations/st-petersburg'],['Knoxville, Tennessee, USA','Real Hot Yoga','https://realhotyoga.net/schedule-knoxville/'],['Hershey, Pennsylvania, USA','Wild & Free Power Yoga','https://app.fitdegree.com/t/dashboard?f=731'],['Elizabethtown, Pennsylvania, USA','Wild & Free Power Yoga','https://app.fitdegree.com/t/dashboard?f=731'],['Denver, Colorado, USA','TruFusion Denver','https://new.trufusion.com/studios/denver'],['Seattle, Washington, USA','Brain & Body Recess','https://www.brainandbodyrecess.com/services'],['Salt Lake City, Utah, USA','B-Hive Yoga','https://www.bhiveyoga.com/schedule'],['South Jordan, Utah, USA','Suvita Hot Yoga','https://clients.mindbodyonline.com/classic/ws?studioid=650767&stype=-2&subTab=info'],['Bellingham, Washington, USA','Intent Hot Yoga','https://www.intenthotyoga.com/schedule'],['Oceanside, California, USA','Vital Climbing Gym','https://www.vitalclimbinggym.com/california-book-class'],['Bozeman, Montana, USA','Namaha Yoga','https://www.namahayogamt.com/schedule'],['Kailua, Hawaii, USA','ELEVATE Health Club','https://elevateoahu.com/schedule']];
function renderStudios(query=''){const filtered=studioData.filter(row=>row.join(' ').toLowerCase().includes(query.toLowerCase()));$('#studio-results').innerHTML=filtered.length?filtered.map(([city,name,url])=>`<article class="studio-item"><p class="eyebrow">${city}</p><h3>${name}</h3><a href="${url}" target="_blank" rel="noopener">View website →</a></article>`).join(''):'<p style="padding:25px 0">No studios match that search. Try another city.</p>';}
$('.studio-search input').addEventListener('input',e=>renderStudios(e.target.value));renderStudios();
function initCarousel(carousel){
 const track=$('.carousel-track',carousel),dots=$('.dots',carousel),prev=$('[data-step="-1"]',carousel),next=$('[data-step="1"]',carousel);let count=0;
 const step=()=>track.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||0);
 const update=()=>{const max=track.scrollWidth-track.clientWidth;const n=Math.max(1,Math.ceil((max-2)/step())+1);if(n!==count){count=n;dots.innerHTML=Array.from({length:n},(_,i)=>`<button class="dot" aria-label="Go to slide ${i+1}" data-index="${i}"></button>`).join('');$$('.dot',dots).forEach(b=>b.addEventListener('click',()=>track.scrollTo({left:Math.min(+b.dataset.index*step(),max),behavior:reduced?'instant':'smooth'})))}const active=Math.min(n-1,Math.round(track.scrollLeft/step()));$$('.dot',dots).forEach((b,i)=>{b.classList.toggle('active',i===active);b.setAttribute('aria-current',i===active?'true':'false')});prev.disabled=track.scrollLeft<5;next.disabled=track.scrollLeft>=max-5;};
 [prev,next].forEach(button=>button.addEventListener('click',()=>track.scrollBy({left:+button.dataset.step*step(),behavior:reduced?'instant':'smooth'})));
 track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);
 let start=0,left=0,dragged=false,down=false;
 track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;start=e.clientX;left=track.scrollLeft;down=true;dragged=false;});
 track.addEventListener('pointermove',e=>{if(!down)return;const delta=e.clientX-start;if(Math.abs(delta)>6){dragged=true;track.classList.add('dragging');track.scrollLeft=left-delta;e.preventDefault()}});
 window.addEventListener('pointerup',()=>{down=false;track.classList.remove('dragging')});
 track.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopPropagation();dragged=false}},true);track.addEventListener('dragstart',e=>e.preventDefault());update();
}

fetch('assets.json').then(r=>r.json()).then(assets=>{
 const image=(name)=>assets[name];
 const years=['1971','1988','1990s','1998','2000s','2012','2020','2021'];
 if($('.lineage-cards')){$('.lineage-cards').innerHTML=years.map((year,i)=>`<button class="lineage-card" data-year="${i}" aria-label="Explore lineage: ${year}"><img src="${image(year)}" alt="Kest lineage, ${year}" loading="lazy"><span class="lineage-year">${year}</span></button>`).join('');cards=$$('.lineage-card');cards.forEach(card=>card.addEventListener('click',()=>{lineageActive=+card.dataset.year;updateScroll()}));updateScroll();}
 $('#training-track').innerHTML=trainingData.map(d=>`<article class="training-card"><img src="${image(d.image)}" alt="${d.title} training destination" loading="lazy"><div class="training-meta"><span class="glass-pill">${d.date}</span><span class="available">Available</span></div><div class="training-copy"><h3>${d.title}</h3><p>${d.copy}</p><a class="arrow-link" href="${d.href}" target="_blank" rel="noopener"><span>Reserve Your Spot</span><i>→</i></a></div></article>`).join('');
 $('#doorway-track').innerHTML=doorwayData.map((d,i)=>`<button class="doorway-card" data-doorway="${i}"><img src="${image(d.image)}" alt="" loading="lazy"><h3>${d.title}</h3><span class="plus" aria-hidden="true">+</span></button>`).join('');
 $$('[data-doorway]').forEach(b=>b.addEventListener('click',()=>{const d=doorwayData[+b.dataset.doorway];openDialog(`<img src="${image(d.detailImage)}" alt="${d.title}"><div><p class="eyebrow">${d.eyebrow}</p><h2>${d.title}</h2><p>${d.copy}</p><p>${d.more}</p><a class="dark-button" href="#trainings" id="modal-trainings">Explore the trainings ↗</a></div>`);$('#modal-trainings').addEventListener('click',closeDialog);}));
 $('#journal-track').innerHTML=journalData.map(([asset,title,slug])=>`<a class="journal-card" href="https://www.becomeayogi.com/journal/${slug}/" target="_blank" rel="noopener"><div class="journal-thumb"><img src="${image(asset)}" alt="${title}" loading="lazy"><span class="play-big">▶</span></div><p class="eyebrow">YouTube</p><h3>${title}</h3><div class="author"><img src="${image('Jonah Kest')}" alt="">Jonah Kest</div></a>`).join('');
 $$('.carousel').forEach(initCarousel);
 const tabs=[{title:'Practice wherever<br>life takes you.',copy:'Make space for movement, breathwork, and the wisdom of the Kest lineage. Join Jonah live or roll out your mat in your own time, from wherever you call home.',image:'Full class practicing together in the Bali shala'},{title:'A community you<br>can feel.',copy:'Meet the people who make the journey richer. Share a flow, have an honest conversation, and turn plans for a retreat into friendships that travel home with you.',image:'Community moment from the Bali teacher training'},{title:'There is room<br>for your next step.',copy:'From a first immersion to your own voice as a teacher, explore trainings and mentorship with a community that supports you as you grow.',image:'Ceremony during the Bali retreat'}];
 function selectTab(index){$$('[data-tab]').forEach((b,i)=>{b.setAttribute('aria-selected',i===index?'true':'false');b.tabIndex=i===index?0:-1});$('.tab-highlight').style.transform=`translateX(${index*100}%)`;$('#community-panel').setAttribute('aria-labelledby','tab-'+index);$('#community-title').innerHTML=tabs[index].title;$('#community-copy').textContent=tabs[index].copy;$('#community-image').src=image(tabs[index].image);$('#community-image').alt=tabs[index].image;if(!reduced){$('#community-panel').animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.22,1,.36,1)'});$('#community-image').animate([{opacity:0,transform:'scale(1.08)'},{opacity:1,transform:'scale(1)'}],{duration:1000,easing:'cubic-bezier(.22,1,.36,1)'})}}
 $$('[data-tab]').forEach(b=>{b.addEventListener('click',()=>selectTab(+b.dataset.tab));b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(+b.dataset.tab+(e.key==='ArrowRight'?1:2))%3;selectTab(next);$('[data-tab="'+next+'"]').focus()}})});
 const reflections=[['Andrew W','There is always something new to discover when we approach a familiar practice with fresh attention. The smallest shift can open an entirely different experience.'],['Carey M','Learning alongside other people reminds us that every practice is a conversation. We bring our own experience, and leave with a wider way of seeing.'],['Carrie B','The most memorable part of a training is often the feeling of being in a room where everyone has chosen to show up, listen, and keep learning.'],['Siska H','Movement, breath, and moments of stillness have a way of making space for what matters. A shared practice helps us carry that awareness into everyday life.'],['Wendy C','Coming back to the mat is a chance to begin again. Some days bring energy, some bring patience, and every day offers a different lesson.'],['Jennifer K','Growth can begin with one more breath and a little curiosity. We discover our capacity by learning to stay present with the experience we are having.'],['Mikala O','Practice becomes meaningful through the people and places that shape it. The conversation continues long after everyone has rolled up their mats.'],['Spencer B','A new perspective can bring fresh energy to a familiar routine. Learning and teaching both ask us to remain open to what we have yet to discover.'],['Emma H','There is something generous about a room full of people learning together. Each question gives someone else permission to explore a little more deeply.'],['Anne G','The path keeps unfolding. We learn from our teachers, from each other, and from the quiet work of returning to our own practice.']];let quote=0;
 $('.avatar-row').innerHTML=reflections.map(([name],i)=>`<button aria-label="Reflection ${i+1}" data-quote="${i}"><img src="${image(name)}" alt="" loading="lazy"></button>`).join('');
 function setQuote(i){quote=(i+reflections.length)%reflections.length;$('#reflection-quote').textContent=reflections[quote][1];$('#reflection-name').textContent='Practice reflection '+String(quote+1).padStart(2,'0');$$('[data-quote]').forEach((b,j)=>{b.classList.toggle('active',j===quote);b.setAttribute('aria-pressed',j===quote?'true':'false')});if(!reduced)$('#reflection-quote').animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:600})}
 $$('[data-quote]').forEach(b=>b.addEventListener('click',()=>setQuote(+b.dataset.quote)));$('#quote-prev').addEventListener('click',()=>setQuote(quote-1));$('#quote-next').addEventListener('click',()=>setQuote(quote+1));setQuote(0);
 if(!reduced)setInterval(()=>{const rect=$('.reflections').getBoundingClientRect();if(rect.top<innerHeight&&rect.bottom>0&&!dialog.open)setQuote(quote+1)},8000);
}).catch(error=>{console.error('Asset setup failed',error);});
updateScroll();

// One complete viewport per section. Wheel and touch gestures advance a single page.
const pageSections=[...$$('main>section'),$('.footer')];
const sectionLabels=['Home','Trainings','Studios','What lives here','Seven Doorways','Conversations','Community','Reflections','Newsletter','Footer'];
const sectionNavigation=$('.section-navigation');
sectionNavigation.innerHTML=pageSections.map((section,i)=>`<button class="section-dot" aria-label="Go to ${sectionLabels[i]}" title="${sectionLabels[i]}" data-section="${i}"><span>${sectionLabels[i]}</span></button>`).join('');
let navigationUntil=0,wheelGesture=false,wheelAmount=0,wheelTimer;
function nearestSection(){let nearest=0,minimum=Infinity;pageSections.forEach((section,i)=>{const distance=Math.abs(section.getBoundingClientRect().top);if(distance<minimum){minimum=distance;nearest=i}});return nearest}
function goToSection(index){index=Math.max(0,Math.min(pageSections.length-1,index));navigationUntil=performance.now()+(reduced?100:700);pageSections[index].scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});}
window.updateSectionNavigation=()=>{const active=nearestSection();$$('.section-dot').forEach((button,i)=>{button.classList.toggle('active',i===active);button.setAttribute('aria-current',i===active?'step':'false')})};
$$('.section-dot').forEach(button=>button.addEventListener('click',()=>goToSection(+button.dataset.section)));
function pageNavigationBlocked(target){return dialog.open||document.body.classList.contains('menu-open')||!!target?.closest('input,textarea,select,[contenteditable="true"],.cookie-banner')}
addEventListener('wheel',event=>{
 if(event.ctrlKey||pageNavigationBlocked(event.target)||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY)return;
 event.preventDefault();clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{wheelGesture=false;wheelAmount=0},180);
 if(wheelGesture||performance.now()<navigationUntil)return;
 wheelAmount+=event.deltaY;if(Math.abs(wheelAmount)<10)return;
 wheelGesture=true;goToSection(nearestSection()+(wheelAmount>0?1:-1));
},{passive:false});
addEventListener('keydown',event=>{
 if(pageNavigationBlocked(event.target)||event.altKey||event.ctrlKey||event.metaKey)return;
 const key=event.key;if(key===' '&&event.target.closest('button,a'))return;
 if(!['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'].includes(key))return;
 event.preventDefault();if(event.repeat||performance.now()<navigationUntil)return;
 if(key==='Home')return goToSection(0);if(key==='End')return goToSection(pageSections.length-1);
 goToSection(nearestSection()+(['ArrowUp','PageUp'].includes(key)||(key===' '&&event.shiftKey)?-1:1));
});
let touchStart=null,touchBlocked=false,touchVertical=false;
addEventListener('touchstart',event=>{touchBlocked=pageNavigationBlocked(event.target)||event.touches.length!==1;touchStart=touchBlocked?null:{x:event.touches[0].clientX,y:event.touches[0].clientY};touchVertical=false},{passive:true});
addEventListener('touchmove',event=>{if(!touchStart||touchBlocked)return;const x=event.touches[0].clientX-touchStart.x,y=event.touches[0].clientY-touchStart.y;if(Math.abs(y)>Math.abs(x)&&Math.abs(y)>8){touchVertical=true;event.preventDefault()}},{passive:false});
addEventListener('touchend',event=>{if(!touchStart||!touchVertical||touchBlocked)return;const delta=touchStart.y-event.changedTouches[0].clientY;touchStart=null;if(Math.abs(delta)>35&&performance.now()>=navigationUntil)goToSection(nearestSection()+(delta>0?1:-1));},{passive:true});
window.updateSectionNavigation();
// The three yoga cards share the same layout for both audiences.
const practicePaths={
 practitioners:[
  {title:'Find your<br>practice.<br>Make it yours.',items:['Explore movement and breath.','Learn at your own pace.','Build a rhythm you can return to.'],button:'Explore the practice',href:'#doorways'},
  {title:'A deeper<br>connection<br>to yourself.',items:['Make space to listen.','Meet curiosity with consistency.','Bring the practice into daily life.'],button:'Find a place to begin',href:'#studios'},
  {title:'More presence.<br>More<br>possibility.',items:['Practice with a global community.','Share conversations and new ideas.','Keep growing, together.'],button:'Join our community',href:'#community'}
 ],
 teachers:[
  {title:'Teach from<br>your own<br>experience.',items:['Build an embodied understanding.','Explore voice, breath, and rhythm.','Develop a way of teaching that is yours.'],button:'Discover the Doorways',href:'#doorways'},
  {title:'Learn deeply.<br>Teach with<br>intention.',items:['Explore the Kest teaching lineage.','Develop thoughtful class experiences.','Take the next step in your training.'],button:'View teacher trainings',href:'#trainings'},
  {title:'Your voice.<br>A shared<br>purpose.',items:['Connect with fellow teachers.','Exchange questions and ideas.','Grow through continued practice.'],button:'Meet the community',href:'#community'}
 ]
};
function selectPracticePath(path){
 const track=$('#practice-track');if(!track)return;
 track.innerHTML=practicePaths[path].map(card=>`<article class="practice-card"><h3>${card.title}</h3><ul>${card.items.map(item=>`<li>${item}</li>`).join('')}</ul><a href="${card.href}"><span>${card.button}</span></a></article>`).join('');
 $$('[data-path]').forEach(button=>{const selected=button.dataset.path===path;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1});$('.practice-tabs>span').style.transform=path==='teachers'?'translateX(100%)':'translateX(0)';$('#practice-card-panel').setAttribute('aria-labelledby','path-'+path);track.scrollLeft=0;
 if(!reduced)$$('.practice-card',track).forEach((card,i)=>card.animate([{opacity:0,translate:'0 20px'},{opacity:1,translate:'0 0'}],{duration:700,delay:i*70,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
}
if($('#practice-track')){selectPracticePath('practitioners');$$('[data-path]').forEach(button=>{button.addEventListener('click',()=>selectPracticePath(button.dataset.path));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const path=button.dataset.path==='teachers'?'practitioners':'teachers';selectPracticePath(path);$('[data-path="'+path+'"]').focus()}})})}
if($('.footer-newsletter'))$('.footer-newsletter').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;$('.footer-form-message').textContent='Local preview only — no email was sent.'});
function closeNavDropdowns(){ $$('.nav-disclosure').forEach(button=>{button.setAttribute('aria-expanded','false');$('#'+button.getAttribute('aria-controls')).hidden=true}) }
$$('.nav-disclosure').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';closeNavDropdowns();button.setAttribute('aria-expanded',String(open));$('#'+button.getAttribute('aria-controls')).hidden=!open}));
document.addEventListener('click',event=>{if(!event.target.closest('.nav-item'))closeNavDropdowns()});document.addEventListener('keydown',event=>{if(event.key==='Escape')closeNavDropdowns()});$$('.nav-dropdown a').forEach(link=>link.addEventListener('click',closeNavDropdowns));
$('.motion-toggle span').textContent=reduced?'off':'on';$('.motion-toggle').setAttribute('aria-pressed',String(!reduced));
$('.motion-toggle').addEventListener('click',()=>{try{localStorage.setItem('bay-motion',reduced?'full':'reduce');sessionStorage.setItem('bay-motion-section',String(nearestSection()))}catch{}location.reload()});
addEventListener('load',()=>{try{const section=sessionStorage.getItem('bay-motion-section');if(section!==null){pageSections[+section]?.scrollIntoView({behavior:'instant',block:'start'});sessionStorage.removeItem('bay-motion-section')}}catch{}updateScroll()});

// Coordinated entrances replay when a section comes back into view.
if(!reduced){
 $$('main>section h2').forEach(heading=>{
  let index=0;
  [...heading.childNodes].forEach(node=>{
   if(node.nodeType!==Node.TEXT_NODE)return;
   const fragment=document.createDocumentFragment();
   node.textContent.split(/(\s+)/).forEach(word=>{
    if(!word.trim()){fragment.append(document.createTextNode(word));return}
    const clip=document.createElement('span');clip.className='word-clip';
    const inner=document.createElement('span');inner.className='motion-word';inner.textContent=word;inner.style.setProperty('--word-index',index++);clip.append(inner);fragment.append(clip);
   });node.replaceWith(fragment);
  });
 });
 const entranceObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const section=entry.target;
  if(!entry.isIntersecting){section.classList.remove('section-entered');return}
  section.classList.add('section-entered');
  $$('.motion-word',section).forEach((word,i)=>{word.getAnimations().forEach(animation=>animation.cancel());word.animate([{transform:'translateY(112%) rotate(2deg)',opacity:0},{transform:'translateY(0) rotate(0)',opacity:1}],{duration:900,delay:i*22,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})});
  const elements=$$('.carousel,.studio-layout,.community-photos,.newsletter-form,.reflection-right,.lineage-cards,.footer-grid,.footer-brand',section);
  elements.forEach((element,i)=>{element.getAnimations().forEach(animation=>animation.cancel());element.animate([{opacity:0,translate:'0 35px',filter:'blur(5px)'},{opacity:1,translate:'0 0',filter:'blur(0)'}],{duration:1100,delay:120+i*90,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})});
  const largeImage=section.matches('.closing-image')?$('img',section):null;
  if(largeImage)largeImage.animate([{scale:1.13,filter:'brightness(.7)'},{scale:1,filter:'brightness(1)'}],{duration:1800,easing:'cubic-bezier(.22,1,.36,1)'});
 }),{threshold:.52});
 pageSections.forEach(section=>entranceObserver.observe(section));
 document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||event.buttons)return;
  const card=event.target.closest('.training-card,.doorway-card');if(!card)return;
  const box=card.getBoundingClientRect(),x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;
  card.style.setProperty('--tilt-x',(-y*3)+'deg');card.style.setProperty('--tilt-y',(x*3)+'deg');
 });
 document.addEventListener('pointerout',event=>{const card=event.target.closest('.training-card,.doorway-card');if(card&&!card.contains(event.relatedTarget)){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')}});
}
