const posts=$('#journal-posts');
function renderArticles(category='all') {
 const visible=articles.filter(article=>category==='all'||article.category===category);
 posts.innerHTML=visible.map(article=>`<button class="blog-card" type="button" data-article="${article.id}" aria-label="Preview ${article.title}"><span class="blog-image"><img src="${article.image}" alt="${article.alt}" loading="lazy"></span><span class="blog-meta"><time datetime="${article.date}">${article.dateLabel}</time><span>${article.category}</span></span><h2>${article.title}</h2><span class="blog-excerpt">${article.excerpt}</span><span class="read-link">Read preview</span></button>`).join('');
 document.dispatchEvent(new Event('yogadyah:content-ready'));
 $('#journal-results').textContent=`${visible.length} ${visible.length===1?'article':'articles'} shown`;
}
$$('[data-category]').forEach(button=>button.addEventListener('click',()=>{
 $$('[data-category]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 renderArticles(button.dataset.category);
}));
renderArticles();

function openArticle(id){
 const article=articles.find(item=>item.id===id);if(!article)return;
 openDialog(`<article class="article-dialog"><img src="${article.image}" alt="${article.alt}"><div class="article-body"><p class="eyebrow">Yogadyah journal · ${article.category}</p><h2>${article.title}</h2><p class="article-byline"><time datetime="${article.date}">${article.dateLabel}</time> · Article preview</p><p>${article.excerpt}</p><p class="article-preview-note">Full article coming soon.</p><a class="text-link" href="index.html#contact">Talk about your practice</a></div></article>`);
 history.replaceState(null,'',`#${article.id}`);
}
document.addEventListener('click',event=>{const article=event.target.closest('[data-article]');if(article)openArticle(article.dataset.article);});
const requestedArticle=location.hash.slice(1);
if(articles.some(article=>article.id===requestedArticle)){
 if(document.documentElement.classList.contains('intro-pending')){
  const observer=new MutationObserver(()=>{if(!document.documentElement.classList.contains('intro-pending')){observer.disconnect();openArticle(requestedArticle);}});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 }else openArticle(requestedArticle);
}

