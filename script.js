(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LINKS = {
    github: "https://github.com/Oresti-Jorgjiu",
    linkedin: "https://www.linkedin.com/in/oresti-jorgjiu",
    htb: "https://profile.hackthebox.com/profile/019cb076-9282-7095-8870-ab7b1e4ed008",
    thm: "https://tryhackme.com/p/Or3st1",
    credly: "https://www.credly.com/users/oresti-jorgjiu"
  };

  const path = location.pathname.replace(/\\/g, "/");
  const isAL = /(^|\/)sq(\/|$)/.test(path);
  // Writeups and projects share one directory; a page under it is one level deep.
  const isSubPage = /\/content\//.test(path);
  const up = isAL || isSubPage ? "../" : "";
  const pageNames = ["index.html","about.html","work.html","contact.html"];
  const currentFile = (location.pathname.split("/").pop() || "index.html");
  const safeCurrent = pageNames.includes(currentFile) ? currentFile : "index.html";
  const pageHref = (file) => up + file;
  const postHref = (slug) => (isAL ? "../" : "") + `content/${slug}.html`;
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const switchHref = isAL ? `../${safeCurrent}` : isSubPage ? "../sq/work.html" : `sq/${safeCurrent}`;
  const labels = isAL
    ? { home:"Kryefaqja", about:"Rreth Meje", work:"Punimet", contact:"Kontakt", lang:"EN",
        primaryNav:"Navigimi kryesor", footerNav:"Navigimi i fundit", toTop:"Kthehu lart",
        footerSite:"Faqja", footerElsewhere:"Gjetkë", footerTag:"Siguri kibernetike • CTF • Duke dokumentuar rrugëtimin",
        builtWith:"HTML/CSS/JS pa framework • GitHub Pages",
        latestTitle:"Së fundmi", latestCta:"Lexo",
        typeAll:"Të gjitha", typeWriteup:"Shkrim", typeProject:"Projekt",
        typeWriteups:"Shkrimet", typeProjects:"Projektet",
        filterLabel:"Filtro sipas llojit",
        ctaWriteup:"Lexo shkrimin", ctaProject:"Shiko projektin",
        emptyAll:"Ende asgjë e publikuar — kthehu së shpejti.",
        mailOpening:"Po hapet aplikacioni juaj i email-it…",
        mailFallback:"Nuk u hap? Shkruani direkt te",
        copy:"Kopjo email-in", copied:"U kopjua" }
    : { home:"Home", about:"About", work:"Work", contact:"Contact", lang:"SQ",
        primaryNav:"Primary", footerNav:"Footer", toTop:"Back to top",
        footerSite:"Site", footerElsewhere:"Elsewhere", footerTag:"Cybersecurity • CTFs • Documenting the journey",
        builtWith:"Plain HTML/CSS/JS • GitHub Pages",
        latestTitle:"Latest", latestCta:"Read",
        typeAll:"All", typeWriteup:"Writeup", typeProject:"Project",
        typeWriteups:"Writeups", typeProjects:"Projects",
        filterLabel:"Filter by type",
        ctaWriteup:"Read writeup", ctaProject:"View project",
        emptyAll:"Nothing published yet — check back soon.",
        mailOpening:"Opening your email app…",
        mailFallback:"Nothing happened? Write to",
        copy:"Copy email", copied:"Copied" };
  const menuLabel = isAL ? { open:"Hap menunë", close:"Mbyll menunë" } : { open:"Open menu", close:"Close menu" };
  const EMAIL = "jorgjiu.oresti@gmail.com";

  // Reveal-on-scroll is gated on this class so the site stays readable if this
  // script never loads. The inline snippet in each <head> sets it before paint;
  // this is the belt-and-braces path for anything that missed it.
  document.documentElement.classList.add("js");

  // Inject header/footer
  const header = $("[data-site-header]");
  if (header) header.innerHTML = `
    <div class="container header">
      <a class="brand" href="${pageHref("index.html")}"><i aria-hidden="true"></i>Oresti<span class="accent">Jorgjiu</span></a>
      <button class="toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="${menuLabel.open}">≡</button>
      <nav id="site-nav" class="nav" aria-label="${labels.primaryNav}">
        <a href="${pageHref("index.html")}" data-nav="home">${labels.home}</a>
        <a href="${pageHref("about.html")}" data-nav="about">${labels.about}</a>
        <a href="${pageHref("work.html")}" data-nav="work">${labels.work}</a>
        <a href="${pageHref("contact.html")}" data-nav="contact">${labels.contact}</a>
        <a class="lang-switch" href="${switchHref}" aria-label="${isAL ? "Switch to English" : "Kalo në Shqip"}">${labels.lang}</a>
      </nav>
    </div>`;

  const footer = $("[data-site-footer]");
  if (footer) footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <p class="k">Oresti Jorgjiu</p>
          <p style="margin:0">${labels.footerTag}</p>
          <p style="margin:0"><a class="link" href="mailto:${EMAIL}">${EMAIL}</a></p>
        </div>
        <div class="footer-col">
          <p class="k">${labels.footerSite}</p>
          <nav class="footer-links" aria-label="${labels.footerNav}">
            <a href="${pageHref("index.html")}">${labels.home}</a>
            <a href="${pageHref("about.html")}">${labels.about}</a>
            <a href="${pageHref("work.html")}">${labels.work}</a>
            <a href="${pageHref("contact.html")}">${labels.contact}</a>
          </nav>
        </div>
        <div class="footer-col">
          <p class="k">${labels.footerElsewhere}</p>
          <div class="footer-links">
            <a href="${LINKS.github}" target="_blank" rel="noopener noreferrer me">GitHub &#8599;</a>
            <a href="${LINKS.linkedin}" target="_blank" rel="noopener noreferrer me">LinkedIn &#8599;</a>
            <a href="${LINKS.htb}" target="_blank" rel="noopener noreferrer me">Hack The Box &#8599;</a>
            <a href="${LINKS.thm}" target="_blank" rel="noopener noreferrer me">TryHackMe &#8599;</a>
            <a href="${LINKS.credly}" target="_blank" rel="noopener noreferrer me">Credly &#8599;</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span data-year></span> Oresti Jorgjiu</span>
        <span>${labels.builtWith}</span>
      </div>
    </div>`;

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

  // Writeups and projects share one manifest (content/data.json) and one page.
  // Each entry carries a "type", which drives the badge, the CTA and the filter.
  const DATA = (isAL ? "../" : "") + "content/data.json";
  const loadPosts = () => fetch(DATA)
    .then(r => r.ok ? r.json() : [])
    .catch(() => [])
    .then(list => (Array.isArray(list) ? list : [])
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))));

  const typeLabel = (t) => t === "project" ? labels.typeProject : labels.typeWriteup;
  const typeCta   = (t) => t === "project" ? labels.ctaProject  : labels.ctaWriteup;

  function card(item){
    // Older entries carry platform/difficulty/tags; Notion-imported ones don't.
    const badges = [item.platform, item.difficulty].filter(Boolean)
      .map(b => `<span class="badge">${esc(b)}</span>`).join("");
    const tags = Array.isArray(item.tags)
      ? item.tags.map(t => `<span class="pill tag">${esc(t)}</span>`).join("") : "";
    return `
        <article class="card glass stack" data-type="${esc(item.type || "writeup")}">
          <div class="row">
            <span class="badge type-${esc(item.type || "writeup")}">${esc(typeLabel(item.type))}</span>
            ${badges}
          </div>
          <h2 class="h2">${esc(item.title)}</h2>
          ${item.date ? `<p class="mono meta">${esc(item.date)}</p>` : ""}
          ${item.blurb ? `<p>${esc(item.blurb)}</p>` : ""}
          ${tags ? `<div class="row">${tags}</div>` : ""}
          <div class="push"><a class="btn small primary" href="${postHref(item.slug)}">${esc(typeCta(item.type))} &rarr;</a></div>
        </article>`;
  }

  const grid = $("[data-work-grid]");
  if (grid){
    const filterBar = $("[data-work-filter]");
    const cell = (msg) => `<p class="empty-state mono" style="grid-column:1/-1">${msg}</p>`;
    grid.innerHTML = cell(isAL ? "Duke ngarkuar…" : "Loading…");

    loadPosts().then(list => {
      if (!list.length){ grid.innerHTML = cell(labels.emptyAll); return; }

      const draw = (type) => {
        const shown = type === "all" ? list : list.filter(i => (i.type || "writeup") === type);
        grid.innerHTML = shown.length ? shown.map(card).join("") : cell(labels.emptyAll);
      };
      draw("all");

      // The filter only earns its space once both kinds are actually present.
      const kinds = new Set(list.map(i => i.type || "writeup"));
      if (filterBar && kinds.size > 1){
        const opts = [
          ["all", labels.typeAll],
          ["writeup", labels.typeWriteups],
          ["project", labels.typeProjects]
        ].filter(([v]) => v === "all" || kinds.has(v));

        filterBar.innerHTML = `
          <div class="filter" role="group" aria-label="${labels.filterLabel}">
            ${opts.map(([v, l], i) => `<button class="chip filter-chip" type="button" data-filter="${v}" aria-pressed="${i === 0}">${esc(l)}</button>`).join("")}
          </div>`;
        filterBar.hidden = false;

        filterBar.addEventListener("click", (e) => {
          const btn = e.target.closest("[data-filter]");
          if (!btn) return;
          $$("[data-filter]", filterBar).forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
          draw(btn.dataset.filter);
        });
      }
    });
  }

  // Homepage card for the most recent entry of either kind. Removed entirely
  // when nothing is published, so the row never shows an empty placeholder.
  const latest = $("[data-latest]");
  if (latest){
    loadPosts().then(list => {
      const newest = list[0];
      if (!newest){ latest.remove(); return; }
      const badges = [newest.platform, newest.difficulty].filter(Boolean)
        .map(b => `<span class="badge">${esc(b)}</span>`).join("");
      latest.innerHTML = `
        <h2 class="h2">${labels.latestTitle}</h2>
        <div class="row" style="margin-bottom:10px">
          <span class="badge type-${esc(newest.type || "writeup")}">${esc(typeLabel(newest.type))}</span>
          ${badges}
        </div>
        <p style="color:var(--strong);margin:0 0 6px">${esc(newest.title)}</p>
        ${newest.date ? `<p class="mono meta">${esc(newest.date)}</p>` : ""}
        ${newest.blurb ? `<p>${esc(newest.blurb)}</p>` : ""}
        <div class="push"><a class="btn small primary" href="${postHref(newest.slug)}">${esc(typeCta(newest.type))} &rarr;</a></div>`;
    });
  }

  // Social rail injection (brand-style logos).
  // The rail is display:none below 900px, but a hidden <img> is still fetched,
  // so phones were pulling four cross-origin icons nobody ever sees. Build it
  // only when it will actually be visible, and build it later if the viewport
  // grows past the breakpoint. Nothing is lost on mobile: the footer carries
  // all five profile links.
  const rail = $("[data-social-rail]");
  if (rail){
    const wide = matchMedia("(min-width:901px)");
    const buildRail = () => {
      if (!wide.matches || rail.dataset.built) return;
      rail.dataset.built = "1";
      rail.innerHTML = `
        ${social("GitHub", LINKS.github, "github", logoSrc("github"))}
        ${social("LinkedIn", LINKS.linkedin, "linkedin", logoSrc("linkedin"))}
        ${social("Hack The Box", LINKS.htb, "htb", logoSrc("hackthebox"))}
        ${social("TryHackMe", LINKS.thm, "thm", logoSrc("tryhackme"))}
        ${social("Credly", LINKS.credly, "credly", logoSrc("credly"))}
      `;
    };
    buildRail();
    if (wide.addEventListener) wide.addEventListener("change", buildRail);
  }

  function social(label, href, kind, src){
    const fallback = kind === "htb" ? "HTB" : kind === "thm" ? "THM" : kind === "credly" ? "CR" : kind === "github" ? "GH" : "IN";
    const icon = kind === "linkedin"
      ? `<svg class="logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
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

  // Menu disclosure pattern (aria-expanded)
  const toggle = $(".toggle"), nav = $("#site-nav");
  if (toggle && nav){
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? menuLabel.close : menuLabel.open);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")){
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded","false");
        toggle.setAttribute("aria-label", menuLabel.open);
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

  // Back to top
  const topBtn = $(".to-top");
  if (topBtn){
    topBtn.setAttribute("aria-label", labels.toTop);
    topBtn.title = labels.toTop;
    const sync = () => topBtn.hidden = window.scrollY < 800;
    addEventListener("scroll", sync, {passive:true}); sync();
    topBtn.addEventListener("click", () => scrollTo({top:0, behavior: reduced ? "auto" : "smooth"}));
  }

  // Contact form → mailto. A mailto: navigation does nothing visible when the
  // browser has no mail handler, so confirm what happened and always leave the
  // address itself within reach.
  const form = $("#contact-form");
  if (form){
    const note = $("[data-form-note]", form);
    const copyBtn = $("[data-copy-email]", form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const subj = encodeURIComponent(isAL ? "Kontakt nga website" : "Website contact");
      const body = encodeURIComponent(
        `Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\n\n${fd.get("message")}`
      );
      location.href = `mailto:${EMAIL}?subject=${subj}&body=${body}`;
      if (note){
        note.className = "form-note ok";
        note.innerHTML = `${labels.mailOpening} ${labels.mailFallback} <a class="link" href="mailto:${EMAIL}">${EMAIL}</a>.`;
      }
    });

    // Clipboard is unavailable on insecure origins; hide the button rather
    // than offer one that silently fails.
    const copy = copyBtn;
    if (copy){
      copy.hidden = !navigator.clipboard;   // markup ships it hidden; reveal only if usable
      if (navigator.clipboard) copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(EMAIL);
          const original = copy.textContent;
          copy.textContent = labels.copied;
          setTimeout(() => { copy.textContent = original; }, 1800);
        } catch {
          if (note){ note.className = "form-note"; note.textContent = EMAIL; }
        }
      });
    }
  }

  // Particles (custom canvas) using rAF.
  // The link pass is O(n^2) over the point set, so the loop is suspended while
  // the tab is hidden and torn down if the user turns on reduced motion.
  let stopParticles = null;
  if (!reduced) stopParticles = initParticles();

  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const onMotionChange = (e) => {
    if (e.matches && stopParticles){ stopParticles(); stopParticles = null; }
  };
  if (motionQuery.addEventListener) motionQuery.addEventListener("change", onMotionChange);

  function initParticles(){
    const c = $("#particles"); if (!c) return null;
    const ctx = c.getContext("2d"); if (!ctx) return null;
    let w=0,h=0,dpr=1,frame=0,resizeTimer=0;
    const rand=(a,b)=>Math.random()*(b-a)+a;
    const cols=[[40,212,231],[178,75,255],[255,43,214]];
    const count = innerWidth<480 ? 26 : innerWidth<900 ? 42 : 62;
    const maxD = innerWidth<900 ? 110 : 140;
    const maxD2 = maxD*maxD;
    const pts = Array.from({length:count},()=>({x:rand(0,innerWidth),y:rand(0,innerHeight),vx:rand(-.22,.22),vy:rand(.05,.30),r:rand(.9,2.2),c:cols[(Math.random()*3)|0],a:rand(.18,.55)}));

    const resize=()=>{
      dpr=Math.min(devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
      c.width=Math.floor(w*dpr); c.height=Math.floor(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    // Mobile browsers fire resize every time the address bar slides, and each
    // one reallocates the canvas buffer, so coalesce the bursts.
    const onResize=()=>{ clearTimeout(resizeTimer); resizeTimer=setTimeout(resize,150); };
    addEventListener("resize", onResize, {passive:true});
    resize();

    function tick(){
      frame = requestAnimationFrame(tick);
      ctx.clearRect(0,0,w,h);
      for (const p of pts){
        p.x+=p.vx; p.y+=p.vy;
        if (p.y>h+10) p.y=-10;
        if (p.x>w+10) p.x=-10;
        if (p.x<-10) p.x=w+10;
      }
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++){
        const a=pts[i], b=pts[j], dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy;
        // Compare squared distances and only pay for the sqrt on actual links.
        if (d2<maxD2){ const t=1-Math.sqrt(d2)/maxD;
          ctx.strokeStyle=`rgba(40,212,231,${0.10*t})`; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
      for (const p of pts){
        const [r,g,b]=p.c; ctx.fillStyle=`rgba(${r},${g},${b},${p.a})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
    }

    const start=()=>{ if (!frame) frame=requestAnimationFrame(tick); };
    const stop =()=>{ if (frame){ cancelAnimationFrame(frame); frame=0; } };
    const onVisibility=()=>{ document.hidden ? stop() : start(); };
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(resizeTimer);
      ctx.clearRect(0,0,w,h);
    };
  }
})();
