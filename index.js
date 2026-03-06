/* CURSOR */
const dot=document.getElementById('cur-dot'),ring=document.getElementById('cur-ring');
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function anim(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim)})();

/* SCROLL */
window.addEventListener('scroll',()=>{
  const p=window.scrollY/(document.body.scrollHeight-window.innerHeight);
  document.getElementById('prog').style.width=(p*100)+'%';
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>60);
});

/* THEME */
function toggleTheme(){const h=document.documentElement;h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark')}

/* MOBILE MENU */
function tMob(){document.getElementById('mob').classList.toggle('open')}
function cMob(){document.getElementById('mob').classList.remove('open')}

/* REVEAL + SKILL BARS */
const ro=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      e.target.querySelectorAll('.skill-bar').forEach(b=>{b.style.width=b.dataset.w+'%'});
    }
  });
},{threshold:.12});
document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el=>ro.observe(el));

/* Trigger skill bars when section visible */
const sObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('.skill-bar').forEach(b=>{b.style.width=b.dataset.w+'%'})});
},{threshold:.1});
const sk=document.getElementById('skills');if(sk)sObs.observe(sk);

/* PARALLAX */
window.addEventListener('scroll',()=>{const el=document.querySelector('.hero-bg-text');if(el)el.style.transform=`translateY(calc(-50% + ${window.scrollY*.18}px))`});