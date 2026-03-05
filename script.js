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
    writeups: "Comming soon..."
  };

  const path = location.pathname.replace(/\\/g, "/");
  const isAL = /(^|\/)sq(\/|$)/.test(path);
  const pageNames = ["index.html","about.html","projects.html","contact.html"];
  const currentFile = (location.pathname.split("/").pop() || "index.html");
  const safeCurrent = pageNames.includes(currentFile) ? currentFile : "index.html";
  const pageHref = (file) => file;
  const switchHref = isAL ? `../${safeCurrent}` : `sq/${safeCurrent}`;
  const labels = isAL
    ? { home:"Kryefaqja", about:"Rreth Meje", projects:"Projektet", contact:"Kontakt", lang:"ENGLISH" }
    : { home:"Home", about:"About", projects:"Projects", contact:"Contact", lang:"ALBANIAN" };

  // Inject header/footer
  const header = $("[data-site-header]");
  if (header) header.innerHTML = `
    <div class="container header">
      <a class="brand" href="${pageHref("index.html")}"><i aria-hidden="true"></i>Oresti<span class="accent">Jorgjiu</span></a>
      <button class="toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">≡</button>
      <nav id="site-nav" class="nav" aria-label="Primary">
        <a href="${pageHref("index.html")}" data-nav="home">${labels.home}</a>
        <a href="${pageHref("about.html")}" data-nav="about">${labels.about}</a>
        <a href="${pageHref("projects.html")}" data-nav="projects">${labels.projects}</a>
        <a href="${pageHref("contact.html")}" data-nav="contact">${labels.contact}</a>
        <a class="lang-switch" href="${switchHref}" aria-label="${isAL ? "Switch to English" : "Kalo në Shqip"}">${labels.lang}</a>
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

  
  // Social rail injection (brand-style logos)
  const rail = $("[data-social-rail]");
  if (rail) rail.innerHTML = `
    ${social("GitHub", LINKS.github, "github", logoSrc("github"))}
    ${social("LinkedIn", LINKS.linkedin, "linkedin", logoSrc("linkedin"))}
    ${social("Hack The Box", LINKS.htb, "htb", logoSrc("hackthebox"))}
    ${social("TryHackMe", LINKS.thm, "thm", logoSrc("tryhackme"))}
    ${social("Credly", LINKS.credly, "credly", logoSrc("credly"))}
  `;

  function social(label, href, kind, src){
    const fallback = kind === "htb" ? "HTB" : kind === "thm" ? "THM" : kind === "credly" ? "CR" : kind === "github" ? "GH" : "IN";
    const icon = kind === "linkedin"
      ? `<svg class="logo logo-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
      : `<img class="logo" src="${src}" alt="" loading="eager" decoding="async" onerror="this.parentElement.classList.add('logo-fallback')">`;
    return `<a class="social is-${kind}" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">
      ${icon}
      <span class="fallback" aria-hidden="true">${fallback}</span>
    </a>`;
  }
  function logoSrc(name){
    // Simple Icons CDN (clean, recognizable brand shapes)
    const colors = {
      github: "ffffff",
      linkedin: "ffffff",
      hackthebox: "9FEF00",
      tryhackme: "ffffff",
      credly: "FF6B00"
    };
    return `https://cdn.simpleicons.org/${name}/${colors[name]||"ffffff"}`;
  }

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
      const subj = encodeURIComponent(isAL ? "Kontakt nga website" : "Website contact");
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
