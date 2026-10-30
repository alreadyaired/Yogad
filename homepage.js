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


const dialog=$('#detail-dialog');let returnFocus=null;
function openDialog(html){returnFocus=document.activeElement;$('.dialog-content').innerHTML=html;dialog.showModal();document.body.classList.add('modal-open');$('.dialog-close').focus();}
function closeDialog(){dialog.close();document.body.classList.remove('modal-open');$('.dialog-content').innerHTML='';returnFocus?.focus?.({preventScroll:true});}
$('.dialog-close').addEventListener('click',closeDialog);dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});

$('#footer-newsletter').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const email=form.elements.email.value.trim();const address=form.dataset.studioEmail;const href='mailto:'+address+'?subject='+encodeURIComponent('Yogadyah newsletter request')+'&body='+encodeURIComponent('Hello, I would like to receive Yogadyah updates at '+email+'.');const status=$('#footer-status');status.textContent='Review and send the subscription request in your email app.';const link=document.createElement('a');link.href=href;link.textContent=' Open email request';status.append(link);location.href=href;});
$$('[data-privacy]').forEach(button=>button.addEventListener('click',()=>{openDialog('<div class="privacy-content"><p class="eyebrow">Yogadyah · Local preview</p><h2>Your privacy</h2><p>This website runs locally. Its fonts, images, and articles are served from the local project. No analytics or external booking service is connected.</p><p>The contact form prepares a WhatsApp message for you to review and send. It does not store new enquiries or book a class. The newsletter form prepares a subscription request in your email app. You choose whether to send it; the website does not automatically subscribe you.</p><button class="button primary" id="clear-preview-data">Clear locally saved form entries</button><p id="privacy-status" role="status"></p></div>');$('#clear-preview-data').addEventListener('click',()=>{localStorage.removeItem('yogadyah-contact-draft');localStorage.removeItem('yogadyah-newsletter-draft');$('#privacy-status').textContent='Locally saved form entries have been cleared.';});}));


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

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){closeMenu();menuToggle.focus();}});
