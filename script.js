/* ==========================================================================
   Oresti Jorgjiu - site behaviour

   Loaded with `defer` on every page. Nothing here is required for the page to
   be readable: if this file fails to load, the content is still visible and
   every link still works. See the `.js` note in section 2.

   1.  Config and helpers
   2.  Header and footer (shared chrome, injected once)
   3.  Content listing (work page + homepage "Latest" card)
   4.  Social rail
   5.  Navigation menu
   6.  Scroll behaviour (reveal, back-to-top)
   7.  Contact form
   8.  Background particles
   ========================================================================== */

(() => {
  "use strict";

  /* 1. Config and helpers ================================================= */

  const EMAIL = "jorgjiu.oresti@gmail.com";

  const LINKS = {
    github:   "https://github.com/Oresti-Jorgjiu",
    linkedin: "https://www.linkedin.com/in/oresti-jorgjiu",
    htb:      "https://profile.hackthebox.com/profile/019cb076-9282-7095-8870-ab7b1e4ed008",
    thm:      "https://tryhackme.com/p/Or3st1",
    credly:   "https://www.credly.com/users/oresti-jorgjiu"
  };

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Escape a value for interpolation into HTML text. */
  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Pages live either at the site root (index.html, work.html, ...) or one
  // level down in content/. Everything the shared chrome links to sits at the
  // root, so pages under content/ need to climb out first.
  const isContentPage = location.pathname.includes("/content/");
  const rootPath = (file) => (isContentPage ? "../" : "") + file;
  const postPath = (slug) => rootPath(`content/${slug}.html`);

  // Reveal-on-scroll is gated on this class so the site stays readable if this
  // script never loads - see styles.css section 13. An inline snippet in each
  // <head> sets it before first paint; this is the belt-and-braces path.
  document.documentElement.classList.add("js");

  /* 2. Header and footer ================================================== */

  // The chrome lives here rather than in each page so nav changes are a
  // one-file edit. Every page ships an empty <header data-site-header> and
  // <footer data-site-footer> for these to fill.

  const NAV = [
    { file: "index.html",   key: "home",    label: "Home" },
    { file: "about.html",   key: "about",   label: "About" },
    { file: "work.html",    key: "work",    label: "Work" },
    { file: "contact.html", key: "contact", label: "Contact" }
  ];

  const PROFILES = [
    ["GitHub",       LINKS.github],
    ["LinkedIn",     LINKS.linkedin],
    ["Hack The Box", LINKS.htb],
    ["TryHackMe",    LINKS.thm],
    ["Credly",       LINKS.credly]
  ];

  const header = $("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <div class="container header">
        <a class="brand" href="${rootPath("index.html")}"><i aria-hidden="true"></i>Oresti<span class="accent">Jorgjiu</span></a>
        <button class="toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">&#8801;</button>
        <nav id="site-nav" class="nav" aria-label="Primary">
          ${NAV.map(n => `<a href="${rootPath(n.file)}" data-nav="${n.key}">${n.label}</a>`).join("\n          ")}
        </nav>
      </div>`;
  }

  const footer = $("[data-site-footer]");
  if (footer) {
    // The social rail is hidden below 900px, so these profile links are the
    // only way to reach them on a phone. Keep them here.
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <p class="k">Oresti Jorgjiu</p>
            <p style="margin:0">Cybersecurity &bull; CTFs &bull; Documenting the journey</p>
            <p style="margin:0"><a class="link" href="mailto:${EMAIL}">${EMAIL}</a></p>
          </div>
          <div class="footer-col">
            <p class="k">Site</p>
            <nav class="footer-links" aria-label="Footer">
              ${NAV.map(n => `<a href="${rootPath(n.file)}">${n.label}</a>`).join("\n              ")}
            </nav>
          </div>
          <div class="footer-col">
            <p class="k">Elsewhere</p>
            <div class="footer-links">
              ${PROFILES.map(([label, href]) =>
                `<a href="${href}" target="_blank" rel="noopener noreferrer me">${label} &#8599;</a>`).join("\n              ")}
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} Oresti Jorgjiu</span>
          <span>Plain HTML/CSS/JS &bull; GitHub Pages</span>
        </div>
      </div>`;
  }

  // Mark the current page in the nav. <body data-page="..."> matches a NAV key.
  const currentPage = document.body.dataset.page;
  $$("#site-nav a[data-nav]").forEach(a => {
    if (a.dataset.nav === currentPage) a.setAttribute("aria-current", "page");
  });

  // Pages write <a data-link="github"> and the real URL is filled in here, so
  // profile URLs only ever need changing in LINKS above.
  $$("[data-link], [data-ctf]").forEach(a => {
    const key = a.dataset.link || a.dataset.ctf;
    if (LINKS[key]) a.href = LINKS[key];
  });

  /* 3. Content listing ==================================================== */

  // Writeups and projects share one directory and one manifest. Each entry in
  // content/data.json carries a "type" ("writeup" or "project") that drives the
  // badge colour, the call-to-action wording and the filter on the work page.

  const TYPE_TEXT = {
    writeup: { badge: "Writeup", cta: "Read writeup",  plural: "Writeups" },
    project: { badge: "Project", cta: "View project",  plural: "Projects" }
  };
  const typeOf = (item) => (item.type === "project" ? "project" : "writeup");
  const EMPTY_MESSAGE = "Nothing published yet - check back soon.";

  /** Load content/data.json, newest first. Resolves to [] on any failure.
   *  GitHub Pages caches everything for 10 minutes, which is fine for the pages
   *  themselves but means a freshly published entry can be missing from this
   *  listing for that long. The manifest is tiny, so bypass the cache for it and
   *  keep the listing current. */
  function loadPosts() {
    return fetch(rootPath("content/data.json"), { cache: "no-cache" })
      .then(res => (res.ok ? res.json() : []))
      .catch(() => [])
      .then(list => (Array.isArray(list) ? list : [])
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))));
  }

  /** Metadata badges. Hand-written entries carry platform/difficulty; ones
   *  imported from Notion do not, so these are all optional. */
  function metaBadges(item) {
    return [item.platform, item.difficulty]
      .filter(Boolean)
      .map(text => `<span class="badge">${esc(text)}</span>`)
      .join("");
  }

  function postCard(item) {
    const type = typeOf(item);
    const tags = Array.isArray(item.tags)
      ? item.tags.map(t => `<span class="pill tag">${esc(t)}</span>`).join("")
      : "";
    return `
      <article class="card glass stack" data-type="${type}">
        <div class="row">
          <span class="badge type-${type}">${TYPE_TEXT[type].badge}</span>
          ${metaBadges(item)}
        </div>
        <h2 class="h2">${esc(item.title)}</h2>
        ${item.date  ? `<p class="mono meta">${esc(item.date)}</p>` : ""}
        ${item.blurb ? `<p>${esc(item.blurb)}</p>` : ""}
        ${tags ? `<div class="row">${tags}</div>` : ""}
        <div class="push">
          <a class="btn small primary" href="${postPath(item.slug)}">${TYPE_TEXT[type].cta} &rarr;</a>
        </div>
      </article>`;
  }

  const workGrid = $("[data-work-grid]");
  if (workGrid) {
    const filterBar = $("[data-work-filter]");
    const notice = (msg) => `<p class="empty-state mono" style="grid-column:1/-1">${msg}</p>`;

    workGrid.innerHTML = notice("Loading...");

    loadPosts().then(posts => {
      if (!posts.length) {
        workGrid.innerHTML = notice(EMPTY_MESSAGE);
        return;
      }

      const render = (filter) => {
        const shown = filter === "all" ? posts : posts.filter(p => typeOf(p) === filter);
        workGrid.innerHTML = shown.length ? shown.map(postCard).join("") : notice(EMPTY_MESSAGE);
      };
      render("all");

      // The filter only earns its space once there is more than one type to
      // filter between, so it stays hidden while the site is thin.
      const typesPresent = new Set(posts.map(typeOf));
      if (!filterBar || typesPresent.size < 2) return;

      const options = [["all", "All"]].concat(
        ["writeup", "project"]
          .filter(t => typesPresent.has(t))
          .map(t => [t, TYPE_TEXT[t].plural])
      );

      filterBar.innerHTML = `
        <div class="filter" role="group" aria-label="Filter by type">
          ${options.map(([value, label], i) =>
            `<button class="chip filter-chip" type="button" data-filter="${value}" aria-pressed="${i === 0}">${label}</button>`
          ).join("\n          ")}
        </div>`;
      filterBar.hidden = false;

      filterBar.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        $$("[data-filter]", filterBar).forEach(b => b.setAttribute("aria-pressed", String(b === button)));
        render(button.dataset.filter);
      });
    });
  }

  // Homepage card for the newest entry of either type. It removes itself when
  // nothing is published, so the row never shows an empty placeholder.
  const latestCard = $("[data-latest]");
  if (latestCard) {
    loadPosts().then(posts => {
      const newest = posts[0];
      if (!newest) {
        latestCard.remove();
        return;
      }
      const type = typeOf(newest);
      latestCard.innerHTML = `
        <h2 class="h2">Latest</h2>
        <div class="row" style="margin-bottom:10px">
          <span class="badge type-${type}">${TYPE_TEXT[type].badge}</span>
          ${metaBadges(newest)}
        </div>
        <p style="color:var(--strong);margin:0 0 6px">${esc(newest.title)}</p>
        ${newest.date  ? `<p class="mono meta">${esc(newest.date)}</p>` : ""}
        ${newest.blurb ? `<p>${esc(newest.blurb)}</p>` : ""}
        <div class="push">
          <a class="btn small primary" href="${postPath(newest.slug)}">${TYPE_TEXT[type].cta} &rarr;</a>
        </div>`;
    });
  }

  /* 4. Social rail ======================================================== */

  // Brand marks come from the Simple Icons CDN, except LinkedIn which is
  // inlined because its mark is simple enough to be worth saving a request.
  // If the CDN is unreachable, `onerror` swaps in a text fallback.

  const RAIL = [
    // label,          key,        icon slug,      colour
    ["GitHub",         "github",   "github",       "ffffff"],
    ["LinkedIn",       "linkedin", null,           null],
    ["Hack The Box",   "htb",      "hackthebox",   "9FEF00"],
    ["TryHackMe",      "thm",      "tryhackme",    "ffffff"],
    ["Credly",         "credly",   "credly",       "FF6B00"]
  ];

  const TEXT_FALLBACK = { github: "GH", linkedin: "IN", htb: "HTB", thm: "THM", credly: "CR" };

  const LINKEDIN_SVG =
    '<svg class="logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

  function railLink([label, key, slug, colour]) {
    const icon = slug
      ? `<img class="logo" src="https://cdn.simpleicons.org/${slug}/${colour}" alt="" loading="eager" decoding="async"
              onerror="this.parentElement.classList.add('logo-fallback')">`
      : LINKEDIN_SVG;
    return `<a class="social is-${key}" href="${LINKS[key]}" target="_blank" rel="noopener noreferrer" aria-label="${label}">
        ${icon}<span class="fallback" aria-hidden="true">${TEXT_FALLBACK[key]}</span>
      </a>`;
  }

  const rail = $("[data-social-rail]");
  if (rail) {
    // The rail is display:none below 900px, but display:none does not stop an
    // <img> from being fetched - phones were pulling four cross-origin icons
    // nobody could see. Build it only when it will actually be visible, and
    // build it later if the window grows past the breakpoint.
    const wideEnough = matchMedia("(min-width:901px)");
    const buildRail = () => {
      if (!wideEnough.matches || rail.dataset.built) return;
      rail.dataset.built = "1";
      rail.innerHTML = RAIL.map(railLink).join("\n      ");
    };
    buildRail();
    wideEnough.addEventListener("change", buildRail);
  }

  /* 5. Navigation menu ==================================================== */

  const menuToggle = $(".toggle");
  const nav = $("#site-nav");
  if (menuToggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    menuToggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        menuToggle.focus();
      }
    });
  }

  /* 6. Scroll behaviour =================================================== */

  const revealTargets = $$("[data-reveal]");
  if (prefersReducedMotion) {
    revealTargets.forEach(el => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    revealTargets.forEach(el => observer.observe(el));
  }

  const toTopButton = $(".to-top");
  if (toTopButton) {
    const syncVisibility = () => { toTopButton.hidden = window.scrollY < 800; };
    addEventListener("scroll", syncVisibility, { passive: true });
    syncVisibility();
    toTopButton.addEventListener("click", () =>
      scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
  }

  /* 7. Contact form ======================================================= */

  // The form hands off to the visitor's mail client - there is no backend. A
  // mailto: navigation does nothing visible when no mail handler is registered,
  // which read as a broken form, so say what happened and keep the address
  // itself within reach.

  const contactForm = $("#contact-form");
  if (contactForm) {
    const note = $("[data-form-note]", contactForm);
    const copyButton = $("[data-copy-email]", contactForm);

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const subject = encodeURIComponent("Website contact");
      const body = encodeURIComponent(
        ["Name: " + data.get("name"), "Email: " + data.get("email"), "", data.get("message")].join("\n")
      );
      location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

      if (note) {
        note.className = "form-note ok";
        note.innerHTML = `Opening your email app... Nothing happened? Write to
          <a class="link" href="mailto:${EMAIL}">${EMAIL}</a>.`;
      }
    });

    if (copyButton) {
      // Clipboard access needs a secure context; hide the button rather than
      // offer one that silently fails.
      copyButton.hidden = !navigator.clipboard;
      if (navigator.clipboard) {
        copyButton.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(EMAIL);
            const original = copyButton.textContent;
            copyButton.textContent = "Copied";
            setTimeout(() => { copyButton.textContent = original; }, 1800);
          } catch {
            if (note) { note.className = "form-note"; note.textContent = EMAIL; }
          }
        });
      }
    }
  }

  /* 8. Background particles =============================================== */

  // Drifting dots joined by short lines, drawn on the fixed canvas behind the
  // page. Skipped entirely under prefers-reduced-motion, and torn down if the
  // visitor turns that on while the page is open.

  let stopParticles = prefersReducedMotion ? null : startParticles();

  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
    if (event.matches && stopParticles) {
      stopParticles();
      stopParticles = null;
    }
  });

  function startParticles() {
    const canvas = $("#particles");
    const ctx = canvas && canvas.getContext("2d");
    if (!ctx) return null;

    const COLOURS = [[40, 212, 231], [178, 75, 255], [255, 43, 214]];
    const random = (min, max) => Math.random() * (max - min) + min;

    const count = innerWidth < 480 ? 26 : innerWidth < 900 ? 42 : 62;
    const linkDistance = innerWidth < 900 ? 110 : 140;
    const linkDistanceSquared = linkDistance * linkDistance;

    // Drift speed. Bumped up from the original crawl so the motion reads as
    // motion at a glance - raise SPEED further for faster, lower for calmer.
    const SPEED = 4.4;
    const points = Array.from({ length: count }, () => ({
      x: random(0, innerWidth), y: random(0, innerHeight),
      vx: random(-0.22, 0.22) * SPEED,  vy: random(0.05, 0.30) * SPEED,
      radius: random(0.9, 2.2),
      colour: COLOURS[(Math.random() * COLOURS.length) | 0],
      alpha: random(0.18, 0.55)
    }));

    let width = 0, height = 0, frame = 0, resizeTimer = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = innerWidth;
      height = innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Mobile browsers fire resize every time the address bar slides, and each
    // one reallocates the canvas buffer, so coalesce the bursts.
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    function draw() {
      frame = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > height + 10) p.y = -10;
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;
      }

      // Joining lines. This pass is O(n^2) over the points, so compare squared
      // distances and only pay for the square root on pairs that actually link.
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared >= linkDistanceSquared) continue;

          const strength = 1 - Math.sqrt(distanceSquared) / linkDistance;
          ctx.strokeStyle = `rgba(40,212,231,${0.1 * strength})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of points) {
        const [r, g, b] = p.colour;
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const start = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const stop  = () => { if (frame) { cancelAnimationFrame(frame); frame = 0; } };

    // No point burning CPU on an animation in a tab nobody is looking at.
    const onVisibilityChange = () => (document.hidden ? stop() : start());

    addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();
    start();

    return () => {
      stop();
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimeout(resizeTimer);
      ctx.clearRect(0, 0, width, height);
    };
  }
})();
