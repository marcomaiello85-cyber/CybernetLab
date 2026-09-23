const icons = {
 brain:'<path d="M12 5c-3-4-7-1-7 2-4 0-5 5-2 7-3 4 0 8 4 7 1 3 5 3 5 0V5Zm0 0c3-4 7-1 7 2 4 0 5 5 2 7 3 4 0 8-4 7-1 3-5 3-5 0"/><path d="m7 8 2 2-2 3m10-5-2 2 2 3M7 17l2-1m8 1-2-1"/>',
 monitor:'<rect x="2" y="3" width="20" height="15" rx="1"/><path d="M2 15h20M9 18l-1 4m7-4 1 4M6 22h12"/>',
 database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 10c0 4 16 4 16 0M4 15c0 4 16 4 16 0"/>',
 eye:'<path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3.5"/>',
 bulb:'<path d="M8 17c0-4-4-4-4-9a8 8 0 0 1 16 0c0 5-4 5-4 9ZM8 20h8m-6 3h4"/>',
 pen:'<path d="m3 16 13-13c3-3 6 1 4 3L7 20l-5 2 1-6ZM14 5l5 5M3 16l4 4M11 22h11"/>',
 code:'<path d="m7 5-6 7 6 7m10-14 6 7-6 7M14 2 10 22"/>',
 chart:'<path d="M3 14h4v8H3zm7-10h4v18h-4zm7 5h4v13h-4z"/>',
 cloud:'<path d="M6 20a5 5 0 0 1-1-10 7 7 0 0 1 14-1 5.5 5.5 0 0 1 0 11Z"/>',
 layers:'<path d="m12 2 10 6-10 6L2 8 12 2ZM2 13l10 6 10-6M2 18l10 6 10-6"/>',
 gear:'<path d="m10 2-.5 3-3 1-2-1-2 3 2 2v4l-2 2 2 3 3-1 2 1 .5 3h4l.5-3 3-1 2 1 2-3-2-2v-4l2-2-2-3-3 1-2-1-.5-3Z"/><circle cx="12" cy="12" r="3"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 26" aria-hidden="true">${icons[name]}</svg>`;
const services = [ ['brain','AI & Automazione','Soluzioni intelligenti per semplificare, velocizzare, scalare.'],['monitor','Web Application','Piattaforme web moderne, scalabili e su misura.'],['database','Software gestionali','Strumenti per rendere più efficienti i tuoi processi.'],['eye','Computer Vision & Scanning','Dal mondo fisico al digitale con intelligenza artificiale.'] ];
document.querySelector('.services').innerHTML = services.map(([i,t,d])=>`<article class="service">${icon(i)}<h3>${t}</h3><p>${d}</p></article>`).join('');
const steps = [['bulb','Idea','Ascoltiamo, analizziamo e definiamo il potenziale.'],['pen','Design','Trasformiamo l’idea in un’esperienza concreta.'],['code','Build','Sviluppiamo soluzioni solide, scalabili e di qualità.'],['chart','Evolve','Monitoriamo, miglioriamo, facciamo crescere.']];
document.querySelector('.steps').innerHTML = steps.map(([i,t,d],n)=>`<article class="step"><div class="step-icon">${icon(i)}</div><div><span class="step-number">0${n+1}</span><h3>${t}</h3><p>${d}</p></div></article>`).join('');
document.querySelector('.technologies').innerHTML = [['brain','Intelligenza Artificiale'],['gear','Automazione'],['cloud','Cloud Software'],['chart','Data Analysis'],['layers','Piattaforme Digitali']].map(([i,t])=>`<div class="technology">${icon(i)}${t}</div>`).join('');
document.querySelector('#year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',open);menuButton.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Apri menu');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}});

const projectData = {
 scan:{title:'Vault Scan',description:'Dal mondo fisico al digitale: scansione e computer vision per analizzare le carte da collezione e trasformarle in informazioni digitali.',tags:['Scanning','Computer Vision','AI Analysis']}
};
const dialog=document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const p=projectData[button.dataset.project];
 document.querySelector('#dialog-title').textContent=p.title;
 document.querySelector('#dialog-description').textContent=p.description;
 document.querySelector('#dialog-tags').innerHTML=p.tags.map(t=>`<span>${t}</span>`).join('');
 dialog.setAttribute('aria-labelledby','dialog-title');
 dialog.showModal();
 document.body.classList.add('modal-open');
}));
document.querySelectorAll('dialog').forEach(d=>{
 d.querySelector('.close').addEventListener('click',()=>d.close());
 d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
 d.addEventListener('close',()=>document.body.classList.remove('modal-open'));
});
document.querySelector('#dialog-contact').addEventListener('click',()=>dialog.close());

const grid=document.querySelector('#project-grid');
function moveProjects(direction){
 if(grid.scrollWidth>grid.clientWidth+1){
  const amount=grid.querySelector('.project-card').getBoundingClientRect().width+22;
  const end=grid.scrollWidth-grid.clientWidth;
  let target=grid.scrollLeft+amount*direction;
  if(target>end+10)target=0;
  if(target<-10)target=end;
  grid.scrollTo({left:target,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }else{
  if(direction>0)grid.append(grid.firstElementChild);
  else grid.prepend(grid.lastElementChild);
 }
}
document.querySelector('#prev').addEventListener('click',()=>moveProjects(-1));
document.querySelector('#next').addEventListener('click',()=>moveProjects(1));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(entry.isIntersecting){
  navigation.querySelectorAll('a').forEach(a=>{
   const active=a.hash===`#${entry.target.id}`;
   a.classList.toggle('active',active);
   if(active)a.setAttribute('aria-current','location');
   else a.removeAttribute('aria-current');
  });
 }
}),{rootMargin:'-10% 0px -55% 0px',threshold:0});
document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));

const contactForm=document.querySelector('#contact-form-element');
const formStatus=document.querySelector('#form-status');
if(contactForm){
 contactForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!contactForm.reportValidity()) return;

  const data=new FormData(contactForm);
  const nome=String(data.get('nome')||'').trim();
  const cognome=String(data.get('cognome')||'').trim();
  const email=String(data.get('email')||'').trim();
  const oggetto=String(data.get('oggetto')||'').trim();
  const idea=String(data.get('idea')||'').trim();

  const subject=encodeURIComponent(`CybernetLab — ${oggetto}`);
  const body=encodeURIComponent(
`Nome: ${nome}
Cognome: ${cognome}
Email: ${email}

Oggetto: ${oggetto}

Descrivimi la tua idea:
${idea}`
  );

  formStatus.textContent='Apro il tuo programma email per completare l’invio.';
  window.location.href=`mailto:infocybernet24@gmail.com?subject=${subject}&body=${body}`;
 });
}
