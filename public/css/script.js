
document.addEventListener('DOMContentLoaded', () => {
  // Smooth-scroll for any in-page anchors and button click activity
  const pageLinks = document.querySelectorAll('a[href^="#"]');
  pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if(!href || href === '#') return;
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      if(targetSection){
        e.preventDefault();
        if(link.classList.contains('btn')){
          link.classList.add('btn-active');
          setTimeout(()=> link.classList.remove('btn-active'), 220);
        }
        window.scrollTo({ top: targetSection.offsetTop - 60, behavior: 'smooth' });
      }
    });
  });

  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('formStatus');
      status.textContent = 'Sending...';
      const formData = new FormData(contactForm);
      try{
        const res = await fetch('/contact', { method: 'POST', headers: { 'Accept': 'application/json' }, body: formData });
        if(res.ok){ status.textContent = 'Thanks — your message was sent.'; contactForm.reset(); }
        else { status.textContent = 'Sorry, there was a problem. Try again.'; }
      }catch(err){ status.textContent = 'Network error. Please try later.'; }
      setTimeout(()=>{ status.textContent = ''; }, 5000);
    });
  }

  // Header nav toggle for small screens
  const navToggle = document.querySelector('.nav-toggle');
  const siteHeader = document.querySelector('.site-header');
  if(navToggle && siteHeader){ navToggle.addEventListener('click', () => siteHeader.classList.toggle('open')); }

  /* Hero background slider with per-slide content and 4s auto-advance */
  (function(){
    const hero = document.querySelector('.hero');
    if(!hero) return;

    const slidesData = [
      { src: '/img/page_1.png', title: 'Local Repair Experts', subtitle: 'Fast on-site repairs for homes and small businesses — transparent pricing and a satisfaction guarantee.', ctaText: 'Request Repair', ctaHref: '/services-home-repairs' },
      { src: '/img/page_8.png', title: 'Professional Installations', subtitle: 'Skilled installation teams for appliances, fixtures, and systems — safety-first and clean finish.', ctaText: 'Book Installation', ctaHref: '/services-installations' },
      { src: '/img/page_6.png', title: 'Premium Cleaning Services', subtitle: 'Eco-friendly, thorough cleaning for residences and offices with flexible scheduling.', ctaText: 'Schedule Cleaning', ctaHref: '/services-cleaning' },
      { src: '/img/page_25.png', title: 'Custom Projects & Builds', subtitle: 'Bespoke solutions from concept to completion — design, build, and warranty support.', ctaText: 'Get a Quote', ctaHref: '/services-custom-projects' }
    ];

    // build slider DOM with per-slide overlay content
    const slider = document.createElement('div'); slider.className = 'hero-slider';
    const slides = slidesData.map((data,i)=>{
      const s = document.createElement('div'); s.className = 'hero-slide'; s.style.backgroundImage = `url(${data.src})`;
      if(i===0) s.classList.add('active');

      const overlay = document.createElement('div'); overlay.className = 'slide-overlay';
      overlay.innerHTML = `<div class="slide-inner"><h1>${data.title}</h1><p>${data.subtitle}</p><a class="btn" href="${data.ctaHref}">${data.ctaText}</a></div>`;
      s.appendChild(overlay);

      slider.appendChild(s);
      return s;
    });
    hero.insertBefore(slider, hero.firstChild);

    // find or create nav buttons
    const prevBtn = hero.querySelector('.hero-nav.left') || (function(){ const b=document.createElement('button'); b.type='button'; b.className='hero-nav left'; b.textContent='◀'; b.setAttribute('aria-label','Previous slide'); hero.appendChild(b); return b; })();
    const nextBtn = hero.querySelector('.hero-nav.right') || (function(){ const b=document.createElement('button'); b.type='button'; b.className='hero-nav right'; b.textContent='▶'; b.setAttribute('aria-label','Next slide'); hero.appendChild(b); return b; })();

    // auto-slide: 4s gap, restart when user navigates
    let index = 0; let timer = null; const interval = 4000;
    function show(i){ slides.forEach((s,idx)=> s.classList.toggle('active', idx===i)); index = i; }
    function nextSlide(){ show((index+1) % slides.length); }
    function prevSlide(){ show((index-1+slides.length) % slides.length); }
    function start(){ if(timer) clearInterval(timer); timer = setInterval(nextSlide, interval); }
    function stop(){ if(timer) { clearInterval(timer); timer=null; } }

    nextBtn.addEventListener('click', ()=>{ nextSlide(); stop(); start(); });
    prevBtn.addEventListener('click', ()=>{ prevSlide(); stop(); start(); });

    start();
  })();
});
