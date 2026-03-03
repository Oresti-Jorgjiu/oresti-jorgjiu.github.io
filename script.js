(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LINKS = {
    github: "https://github.com/Oresti-Jorgjiu",
    linkedin: "https://www.linkedin.com/in/oresti-jorgjiu",
    htb: "https://app.hackthebox.com/users/2734417",
    thm: "https://tryhackme.com/p/Or3st1",
    credly: "https://www.credly.com/users/oresti-jorgjiu",
    writeups: "REPLACE_WITH_YOUR_WRITEUPS_URL"
  };

  // Inject header/footer
  const header = $("[data-site-header]");
  if (header) header.innerHTML = `
    <div class="container header">
      <a class="brand" href="index.html"><i aria-hidden="true"></i>Oresti<span class="accent">Jorgjiu</span></a>
      <button class="toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">≡</button>
      <nav id="site-nav" class="nav" aria-label="Primary">
        <a href="index.html" data-nav="home">Home</a>
        <a href="about.html" data-nav="about">About</a>
        <a href="projects.html" data-nav="projects">Projects</a>
        <a href="contact.html" data-nav="contact">Contact</a>
      </nav>
    </div>`;

  const footer = $("[data-site-footer]");
  if (footer) footer.innerHTML = `<div class="container">© <span data-year></span> Oresti Jorgjiu</div>`;

  // Year
  const y = $("[data-year]"); if (y) y.textContent = String(new Date().getFullYear());

  // Active nav
  const page = document.body?.dataset?.page;
  $$("#site-nav a[data-nav]").forEach(a => {
    if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
  });

  // Hydrate link placeholders
  $$("[data-link]").forEach(a => {
    const k = a.getAttribute("data-link");
    if (LINKS[k]) a.href = LINKS[k];
  });
  $$("[data-ctf]").forEach(a => {
    const k = a.getAttribute("data-ctf");
    a.href = LINKS[k] || "#";
  });

  // Social rail injection (inline SVG placeholders)
  const rail = $("[data-social-rail]");
  if (rail) rail.innerHTML = `
    ${social("GitHub", LINKS.github, svgGitHub())}
    ${social("LinkedIn", LINKS.linkedin, svgLinkedIn())}
    ${social("Hack The Box", LINKS.htb, svgCube())}
    ${social("TryHackMe", LINKS.thm, svgTHM())}
    ${social("Credly", LINKS.credly, svgBadge())}
  `;

  function social(label, href, svg){
    return `<a class="social" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${svg}</a>`;
  }
  function svgGitHub(){ return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.48c.5.1.68-.22.68-.48v-1.7c-2.5.55-3.02-1.2-3.02-1.2-.4-1.02-1-1.3-1-1.3-.82-.56.06-.55.06-.55.9.06 1.38.94 1.38.94.8 1.38 2.1.98 2.62.75.08-.6.3-.98.54-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.94-2.4-.1-.24-.4-1.2.1-2.5 0 0 .75-.24 2.45.93A8.4 8.4 0 0 1 12 6.8c.75 0 1.5.1 2.2.3 1.7-1.17 2.45-.93 2.45-.93.5 1.3.2 2.26.1 2.5.6.62.94 1.42.94 2.4 0 3.45-2.1 4.2-4.1 4.43.32.28.6.82.6 1.66v2.46c0 .26.18.58.7.48A10 10 0 0 0 12 2z"/></svg>`;}
  function svgLinkedIn(){ return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6.94 6.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.5 21h3V9h-3v12Zm5.5-12h2.9v1.64h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V21h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-2.95V9Z"/></svg>`;}
  function svgCube(){ return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2 21 7v10l-9 5-9-5V7l9-5z"/><path fill="currentColor" d="M12 6.6 17 9.4l-5 2.8-5-2.8 5-2.8z" opacity=".55"/></svg>`;}
  function svgTHM(){ return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 6h16v12H4z"/><path fill="currentColor" d="M7 9h10v2H7zm0 4h6v2H7z" opacity=".65"/></svg>`;}
  function svgBadge(){ return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2l7 4v7c0 5-3.5 9-7 9s-7-4-7-9V6l7-4z"/><path fill="currentColor" d="M9 12h6v2H9z" opacity=".6"/></svg>`;}

  // Menu disclosure pattern (aria-expanded) citeturn0search11
  const toggle = $(".toggle"), nav = $("#site-nav");
  if (toggle && nav){
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")){
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded","false");
        toggle.focus();
      }
    });
  }

  // Reveal
  const rev = $$("[data-reveal]");
  if (reduced) rev.forEach(el => el.classList.add("is-visible"));
  else if ("IntersectionObserver" in window){
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }), {threshold:0.14});
    rev.forEach(el => io.observe(el));
  }

  // Card hotspot
  $$("[data-hotspot]").forEach(card => {
    card.addEventListener("pointermove", (e) => {
      if (reduced) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (((e.clientX-r.left)/r.width)*100).toFixed(1)+"%");
      card.style.setProperty("--my", (((e.clientY-r.top)/r.height)*100).toFixed(1)+"%");
    });
  });

  // Back to top
  const topBtn = $(".to-top");
  if (topBtn){
    const sync = () => topBtn.hidden = window.scrollY < 800;
    addEventListener("scroll", sync, {passive:true}); sync();
    topBtn.addEventListener("click", () => scrollTo({top:0, behavior: reduced ? "auto" : "smooth"}));
  }

  // Contact form → mailto
  const form = $("#contact-form");
  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const subj = encodeURIComponent("Website contact");
      const body = encodeURIComponent(
        `Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\n\n${fd.get("message")}`
      );
      location.href = `mailto:jorgjiu.oresti@gmail.com?subject=${subj}&body=${body}`;
    });
  }

  // Particles (custom canvas) using rAF citeturn3search0turn3search4
  if (!reduced) initParticles();
  function initParticles(){
    const c = $("#particles"); if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let w=0,h=0,dpr=1;
    const rand=(a,b)=>Math.random()*(b-a)+a;
    const cols=[[40,212,231],[178,75,255],[255,43,214]];
    const count = innerWidth<480 ? 26 : innerWidth<900 ? 42 : 62;
    const maxD = innerWidth<900 ? 110 : 140;
    const pts = Array.from({length:count},()=>({x:rand(0,innerWidth),y:rand(0,innerHeight),vx:rand(-.22,.22),vy:rand(.05,.30),r:rand(.9,2.2),c:cols[(Math.random()*3)|0],a:rand(.18,.55)}));

    const resize=()=>{
      dpr=Math.min(devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
      c.width=Math.floor(w*dpr); c.height=Math.floor(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    addEventListener("resize", resize, {passive:true}); resize();

    (function tick(){
      ctx.clearRect(0,0,w,h);
      for (const p of pts){
        p.x+=p.vx; p.y+=p.vy;
        if (p.y>h+10) p.y=-10;
        if (p.x>w+10) p.x=-10;
        if (p.x<-10) p.x=w+10;
      }
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++){
        const a=pts[i], b=pts[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if (d<maxD){ const t=1-d/maxD;
          ctx.strokeStyle=`rgba(40,212,231,${0.10*t})`; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
      for (const p of pts){
        const [r,g,b]=p.c; ctx.fillStyle=`rgba(${r},${g},${b},${p.a})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(tick);
    })();
  }
})();
