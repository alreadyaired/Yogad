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



const dialog=$('#detail-dialog');let returnFocus=null;
function openDialog(html){returnFocus=document.activeElement;$('.dialog-content').innerHTML=html;dialog.showModal();document.body.classList.add('modal-open');$('.dialog-close').focus();}
function closeDialog(){dialog.close();document.body.classList.remove('modal-open');$('.dialog-content').innerHTML='';history.replaceState(null,'',location.pathname+location.search);returnFocus?.focus?.({preventScroll:true});}
$('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});
$('#footer-newsletter').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;try{localStorage.setItem('yogadyah-newsletter-draft',new FormData(form).get('email'));$('#footer-status').textContent='Saved on this device. Email delivery is not connected.';}catch{$('#footer-status').textContent='Email delivery is not connected in this local preview.';}});
$$('[data-privacy]').forEach(button=>button.addEventListener('click',()=>{openDialog('<div class="privacy-content"><p class="eyebrow">Yogadyah · Local preview</p><h2>Your privacy</h2><p>This website runs locally. Its fonts, images, and articles are served from the local project. No analytics or external booking service is connected.</p><p>Contact and newsletter forms save entries only in this browser on this device. They do not send messages or subscribe you to an email list.</p><button class="button primary" id="clear-preview-data">Clear locally saved form entries</button><p id="privacy-status" role="status"></p></div>');$('#clear-preview-data').addEventListener('click',()=>{localStorage.removeItem('yogadyah-contact-draft');localStorage.removeItem('yogadyah-newsletter-draft');$('#privacy-status').textContent='Locally saved form entries have been cleared.';});}));
const motionButton=$('.motion-toggle');
$('span',motionButton).textContent=reduced?'off':'on';
motionButton.setAttribute('aria-pressed',String(!reduced));
motionButton.addEventListener('click',()=>{try{localStorage.setItem('yogadyah-motion',reduced?'full':'reduce')}catch{}location.reload();});
let scheduled=false;
function updatePage(){
 updateHeader();header.classList.toggle('scrolled',scrollY>20);
 const footer=$('#footer').getBoundingClientRect();
 motionButton.classList.toggle('on-dark',footer.top<innerHeight-35&&footer.bottom>innerHeight-35);
}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{updatePage();scheduled=false;});}},{passive:true});
addEventListener('resize',updatePage);updatePage();
