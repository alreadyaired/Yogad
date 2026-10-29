const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduced=document.documentElement.dataset.motion==='reduce';
const header=$('#header'),menu=$('#menu'),menuToggle=$('.menu-toggle');

function closeMenu(){document.body.classList.remove('menu-open');menu.inert=true;menuToggle.setAttribute('aria-expanded','false');$('.menu-word').textContent='Menu';}
menuToggle.addEventListener('click',()=>{const open=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);menu.inert=!open;header.classList.remove('is-hidden');menuToggle.setAttribute('aria-expanded',String(open));$('.menu-word').textContent=open?'Close':'Menu';});
$$('#menu a').forEach(link=>link.addEventListener('click',closeMenu));
header.addEventListener('focusin',()=>header.classList.remove('is-hidden'));
let navLastY=scrollY,navDirection=0,navTravel=0;
function updateHeader(){
 const y=Math.max(0,scrollY),delta=y-navLastY;navLastY=y;
 const direction=Math.sign(delta);
 if(direction&&direction!==navDirection){navTravel=0;navDirection=direction;}
 navTravel+=Math.abs(delta);
 const pinned=document.body.classList.contains('menu-open')||header.contains(document.activeElement);
 if(y<header.offsetHeight+20||pinned){header.classList.remove('is-hidden');navTravel=0;return;}
 if(navTravel>8){header.classList.toggle('is-hidden',navDirection>0);navTravel=0;}
}

document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();}});


$('#blog-posts').innerHTML=articles.map(article=>`<a class="blog-card" href="journal.html#${article.id}" aria-label="Read preview: ${article.title}"><span class="blog-image"><img src="${article.image}" alt="${article.alt}" loading="lazy"></span><span class="journal-card-badges"><span>Journal</span><span>${article.category}</span></span><span class="blog-meta"><time datetime="${article.date}">${article.dateLabel}</time></span><h3>${article.title}</h3><span class="blog-excerpt">${article.excerpt}</span><span class="read-link">Read preview</span></a>`).join('');

const dialog=$('#detail-dialog');let returnFocus=null;
function openDialog(html){returnFocus=document.activeElement;$('.dialog-content').innerHTML=html;dialog.showModal();document.body.classList.add('modal-open');$('.dialog-close').focus();}
function closeDialog(){dialog.close();document.body.classList.remove('modal-open');$('.dialog-content').innerHTML='';returnFocus?.focus?.({preventScroll:true});}
$('.dialog-close').addEventListener('click',closeDialog);dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});
function openArticle(id){const article=articles.find(item=>item.id===id);if(!article)return;openDialog(`<article class="article-dialog"><img src="${article.image}" alt="${article.alt}"><div class="article-body"><p class="eyebrow">Yogadyah journal · ${article.category}</p><h2>${article.title}</h2><p class="article-byline"><time datetime="${article.date}">${article.dateLabel}</time> · Article preview</p><p>${article.excerpt}</p><p class="article-preview-note">Full article coming soon.</p><a class="text-link modal-contact" href="#contact">Talk about your practice</a></div></article>`);$('.modal-contact').addEventListener('click',closeDialog);}

document.addEventListener('click',event=>{const article=event.target.closest('[data-article]');if(article)openArticle(article.dataset.article);});

const teachingServices=[
 {name:'Hatha Yoga',title:'Classic posture and breath control',image:'assets/teaching-hatha-uploaded.png',artWidth:1254,artHeight:1254,format:'studio-group',alt:'Hand-drawn yogi in a standing lunge with arms raised',focus:'Alignment & mobility',copy:'Slow-paced classes focused on correct body alignment, joint mobility, and holding postures (<em>Asanas</em>) with steady breathing (<em>Pranayama</em>). Ideal for beginners, seniors, and anyone recovering from desk-job stiffness.'},
 {name:'Power Yoga',title:'Active sequences for strength and stamina',image:'assets/teaching-power-uploaded.png',artWidth:1254,artHeight:1254,format:'studio-group',alt:'Hand-drawn yogi in warrior pose',focus:'Strength & stamina',copy:'A dynamic, faster-paced practice that links breath with continuous movement. Designed to build core strength, improve cardiovascular endurance, and support healthy weight management.'},
 {name:'Guided Meditation & Pranayama',title:'Breathing techniques for mental clarity',image:'assets/teaching-meditation-uploaded.png',artWidth:1254,artHeight:1254,format:'meditation-breathwork',alt:'Hand-drawn yogi sitting cross-legged in meditation',focus:'Breath & meditation',copy:'Structured breathwork and quiet meditation sessions to lower daily anxiety, improve sleep quality, and calm the nervous system.'},
 {name:'Women’s Special Batches',title:'Dedicated batches for women’s health',image:'assets/teaching-women-uploaded.png',artWidth:1254,artHeight:1254,format:'womens-batch',alt:'Hand-drawn group of three seated yoga practitioners',focus:'Women’s health',copy:'Comfortable, supportive group classes tailored for women across all life stages—focusing on hormonal balance, core recovery, and consistent daily fitness.'}
];
$('#practice-track').innerHTML=teachingServices.map(service=>`<article class="practice-card service-course-card"><p class="service-name">${service.name}</p><div class="service-illustration"><img src="${service.image}" alt="${service.alt}" loading="lazy" width="${service.artWidth}" height="${service.artHeight}"></div><div class="practice-card-copy"><h3>${service.title}</h3><p class="service-focus">${service.focus}</p><p class="service-description">${service.copy}</p></div><div class="service-card-footer"><a class="button primary service-enquiry" href="#contact" data-class-format="${service.format}" aria-label="Ask about ${service.name}">Explore this class</a></div></article>`).join('');

const topics=[
 {title:'Mindful movement',image:'assets/b9cb1780f3286242.webp',copy:'Explore movement as a way to notice, listen, and respond.',body:'Movement can become an exploration of attention. Rather than chasing an ideal shape, begin with curiosity about the experience you are having. Yogadyah’s approach invites thoughtful pacing, clear intention, and space for individual expression.'},
 {title:'Breath & attention',image:'assets/ce8bfadefcf00e21.webp',copy:'Make room for an easy, unforced awareness of the breath.',body:'Breath offers a simple point of attention. The invitation is to notice it without needing to force, hold, or perfect it. This gentle observation can become part of a movement practice or a quiet moment on its own.'},
 {title:'Rest & reflection',image:'assets/5e115c48f68bafd2.webp',copy:'Let stillness have a place in the practice, too.',body:'Rest is part of the conversation. A pause can offer a different way to notice what is present, without the need to fill every moment. Reflection gives the practice room to settle and become part of everyday life.'}
];
$('#topic-grid').innerHTML=topics.map((topic,index)=>`<button class="topic-card" data-topic="${index}"><span class="topic-image"><img src="${topic.image}" alt="${topic.title}" loading="lazy"></span><span class="topic-heading"><h3>${topic.title}</h3></span><p>${topic.copy}</p></button>`).join('');
$$('[data-topic]').forEach(button=>button.addEventListener('click',()=>{const topic=topics[+button.dataset.topic];openDialog(`<article class="article-dialog"><img src="${topic.image}" alt="${topic.title}"><div class="article-body"><p class="eyebrow">The Yogadyah approach</p><h2>${topic.title}</h2><p>${topic.body}</p><a class="text-link modal-contact" href="#contact">Ask about your practice</a></div></article>`);$('.modal-contact').addEventListener('click',closeDialog);}));

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


document.addEventListener('click',event=>{const link=event.target.closest('[data-class-format]');if(link){const format=$('#class-format');format.value=link.dataset.classFormat;}});
$('#contact-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));try{localStorage.setItem('yogadyah-contact-draft',JSON.stringify({...data,savedAt:new Date().toISOString()}));$('#contact-status').textContent='Your class enquiry is saved on this device. Phone/WhatsApp follow-up is not connected in this local preview.';}catch{$('#contact-status').textContent='Your request could not be saved on this device. Please keep a copy of your details.';}});
$('#footer-newsletter').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;try{localStorage.setItem('yogadyah-newsletter-draft',new FormData(form).get('email'));$('#footer-status').textContent='Saved on this device. Email delivery is not connected.';}catch{$('#footer-status').textContent='Email delivery is not connected in this local preview.';}});
$$('[data-privacy]').forEach(button=>button.addEventListener('click',()=>{openDialog('<div class="privacy-content"><p class="eyebrow">Yogadyah · Local preview</p><h2>Your privacy</h2><p>This website runs locally. Its fonts, images, and articles are served from the local project. No analytics or external booking service is connected.</p><p>Contact and newsletter forms save entries only in this browser on this device. They do not send messages or subscribe you to an email list.</p><button class="button primary" id="clear-preview-data">Clear locally saved form entries</button><p id="privacy-status" role="status"></p></div>');$('#clear-preview-data').addEventListener('click',()=>{localStorage.removeItem('yogadyah-contact-draft');localStorage.removeItem('yogadyah-newsletter-draft');$('#privacy-status').textContent='Locally saved form entries have been cleared.';});}));

// Sample testimonials are explicitly demo content, not real customer reviews.
const demoTestimonials=[
 {name:'Ananya M.',initials:'AM',format:'Hatha Yoga',quote:'The slower pace makes it easy to follow each posture and pay attention to alignment. I like having room to ask questions and choose an option that feels right for me. A welcoming way to return to the mat.'},
 {name:'Rohan S.',initials:'RS',format:'Power Yoga',quote:'A clear, energising class with thoughtful cues. I enjoy the flowing sequences and the quieter finish after an active practice.'},
 {name:'Meera K.',initials:'MK',format:'Meditation & breathwork',quote:'I had never tried a guided meditation class before, so I appreciated the simple explanations and the unhurried pace. There was time to find a comfortable seat, ask a question, and settle into the session without feeling rushed. I like that the practice feels approachable rather than complicated. The short breathing exercises give the class a clear structure, and the quiet finish is something I look forward to each week.'} ,
 {name:'Kavya R.',initials:'KR',format:'Women’s special batch',quote:'A welcoming group and patient instruction. There is always room to choose a gentler option or take a break when needed.'},
 {name:'Aditya V.',initials:'AV',format:'Personal home classes',quote:'Having a class at home makes it easier to fit practice around my working day. The sessions have a clear structure, and I appreciate the time spent explaining each movement instead of moving straight to the next one.'},
 {name:'Nisha P.',initials:'NP',format:'Hatha Yoga',quote:'I joined as a complete beginner and liked how approachable the class felt. The alignment cues are easy to understand, and there is time to settle into each posture. It feels like a practice I can keep learning from.'},
 {name:'Vikram A.',initials:'VA',format:'Meditation & breathwork',quote:'Simple instructions, a calm atmosphere, and time to pause. A lovely addition to my week.'},
 {name:'Priya D.',initials:'PD',format:'Women’s special batch',quote:'The group feels welcoming from the moment the class begins. The teacher explains each option patiently, so I never feel that I have to keep up with someone else. I especially appreciate the balance between movement and rest, and the chance to ask about a posture before trying it again. There is room to take a break, find another variation, and join back in when ready. That thoughtful pace makes the classes enjoyable.'},
 {name:'Aarav T.',initials:'AT',format:'Power Yoga',quote:'The flowing sequences keep the class engaging, while the modifications make it easy to choose the right level of effort. I enjoy building familiarity with the movements and ending with a few quieter minutes.'},
 {name:'Sonal K.',initials:'SK',format:'Personal home classes',quote:'I wanted a more personal introduction to yoga, and the one-to-one format is a good fit. There is time for questions, clear explanations, and a pace that feels comfortable. The sessions are thoughtfully put together.'}

];
const testimonialCards=demoTestimonials.map((review,index)=>`<article class="testimonial-card" aria-label="Demo testimonial ${index+1}"><div class="testimonial-top"><span class="testimonial-stars" aria-label="Demo rating: 5 out of 5">★★★★★</span><span class="testimonial-demo-badge">Demo review</span></div><blockquote>${review.quote}</blockquote><div class="testimonial-person"><span class="testimonial-avatar" aria-hidden="true">${review.initials}</span><div><strong>${review.name}</strong><span class="testimonial-student-role">Yogadyah student (demo)</span><span class="testimonial-class">${review.format}</span></div></div></article>`).join('');
$('#testimonials-track').innerHTML=`<div class="testimonials-group">${testimonialCards}</div><div class="testimonials-group" aria-hidden="true" inert>${testimonialCards}</div>`;
// Normal browser scrolling: no wheel, touch, PageUp, or PageDown interception.
const sections=$$('main>section:not([hidden]),footer');
$('.section-navigation').innerHTML=sections.map(section=>`<a class="section-dot" href="#${section.id}" aria-label="Go to ${section.dataset.label}" title="${section.dataset.label}"><span>${section.dataset.label}</span></a>`).join('');
function updateNavigation(){let active=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<innerHeight*.38)active=section;}$$('.section-dot').forEach(link=>{const selected=link.hash==='#'+active.id;link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});const dark=sections.find(section=>{const box=section.getBoundingClientRect();return box.top<innerHeight-35&&box.bottom>innerHeight-35;})?.classList.contains('dark-section');$('.section-navigation').classList.toggle('on-dark',!!dark);$('.motion-toggle').classList.toggle('on-dark',!!dark);header.classList.toggle('scrolled',scrollY>20);
 const group=['lineage','practice','community'].includes(active.id)?'practice':['contact','footer'].includes(active.id)?'contact':active.id;
 $$('[data-nav]').forEach(link=>{if(link.dataset.nav===group)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 updateHeader();}
let scheduled=false;addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{updateNavigation();scheduled=false;});}},{passive:true});addEventListener('resize',updateNavigation);updateNavigation();
const motionButton=$('.motion-toggle');$('span',motionButton).textContent=reduced?'off':'on';motionButton.setAttribute('aria-pressed',String(!reduced));motionButton.addEventListener('click',()=>{try{localStorage.setItem('yogadyah-motion',reduced?'full':'reduce');sessionStorage.setItem('yogadyah-restore-scroll',String(scrollY));}catch{}location.reload();});
addEventListener('load',()=>{try{const y=sessionStorage.getItem('yogadyah-restore-scroll');if(y!==null){scrollTo({top:+y,behavior:'instant'});sessionStorage.removeItem('yogadyah-restore-scroll');}}catch{}updateNavigation();});

// Reveal, image depth, and anchor motion are coordinated in motion.js.
