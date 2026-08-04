/* =========================================================
   VIPUL SHARMA — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- THEME ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const saved = store.get("theme");
  if (saved) root.setAttribute("data-theme", saved);

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("theme", next);
  });

  /* ---------- YEAR ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- NAV: scroll state + mobile menu ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  const closeMenu = () => { navLinks.classList.remove("open"); menuBtn.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$(".nav__link").forEach(l => l.addEventListener("click", closeMenu));

  /* ---------- ACTIVE LINK ON SCROLL ---------- */
  const linkFor = {};
  $$(".nav__link").forEach(l => {
    const id = l.getAttribute("href");
    if (id && id.startsWith("#")) linkFor[id.slice(1)] = l;
  });
  const sections = ["about", "skills", "projects", "contact"].map(id => $("#" + id)).filter(Boolean);
  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Object.values(linkFor).forEach(l => l.classList.remove("active"));
        const l = linkFor[e.target.id];
        if (l) l.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => activeObs.observe(s));

  /* ---------- REVEAL ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => revealObs.observe(el));

  /* ---------- ORB PARALLAX ---------- */
  const orb = $("#orb");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (orb && !reduce) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 26;
      const y = (e.clientY / window.innerHeight - 0.5) * 26;
      orb.style.transform = `translate(${x}px, ${y - 12}px)`;
    }, { passive: true });
  }

  /* =========================================================
     SKILLS DATA + GRID
     ========================================================= */
  const skills = [
    { title: "Languages", icon: "code",
      items: ["JavaScript", "TypeScript", "Python", "HTML", "CSS"] },
    { title: "Frontend", icon: "layout",
      items: ["React", "Next.js", "Tailwind CSS"] },
    { title: "Backend", icon: "server",
      items: ["Node.js", "Express", "FastAPI", "Flask", "REST APIs"] },
    { title: "Databases", icon: "db",
      items: ["PostgreSQL", "pgvector"] },
    { title: "AI & Automation", icon: "spark",
      items: ["Multi-agent systems", "LLM integration — Claude, Gemini, Ollama", "Vector similarity search", "RAG pipelines", "Workflow automation", "n8n"] },
    { title: "Infrastructure & Tools", icon: "grid",
      items: ["Proxmox VE", "OPNsense", "Prometheus", "Grafana", "Git", "GitHub", "VS Code", "Figma", "Postman", "DBeaver"] },
  ];

  const icons = {
    layout: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="20"/></svg>',
    server: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><line x1="7" y1="7.5" x2="7.01" y2="7.5"/><line x1="7" y1="16.5" x2="7.01" y2="16.5"/></svg>',
    code:   '<svg viewBox="0 0 24 24"><polyline points="8 6 3 12 8 18"/><polyline points="16 6 21 12 16 18"/></svg>',
    db:     '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
    spark:  '<svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="3.2"/><path d="M6.3 6.3l2 2M15.7 15.7l2 2M17.7 6.3l-2 2M8.3 15.7l-2 2"/></svg>',
    grid:   '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  };

  function skillCard(s) {
    const el = document.createElement("article");
    el.className = "skill-card";
    const pills = s.items.map(i => '<span class="tech-pill">' + i + '</span>').join("");
    el.innerHTML =
      '<div class="skill-card__head">' +
        '<div class="skill-card__icon">' + icons[s.icon] + '</div>' +
        '<div>' +
          '<div class="skill-card__title">' + s.title + '</div>' +
          '<span class="skill-card__count">' + s.items.length + ' ' + (s.items.length === 1 ? 'tool' : 'tools') + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="skill-card__pills">' + pills + '</div>';
    return el;
  }

  const skillGrid = $("#skillGrid");
  skills.forEach(s => skillGrid.appendChild(skillCard(s)));

  /* =========================================================
     MODAL
     ========================================================= */
  const modal = $("#modal");
  const modalContent = $("#modalContent");
  let lastFocus = null;

  function openModal(html) {
    lastFocus = document.activeElement;
    modalContent.innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const close = modal.querySelector(".modal__close");
    if (close) close.focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalContent.innerHTML = "";
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });

  /* ---------- PROJECT MODALS ---------- */
  const projects = {
    offbeat: {
      kind: "Full-stack platform",
      title: "Offbeat",
      desc: "An editorial guide to underrated cafés and hangouts across major Indian cities. It offers intent-based filtering — for a date, with friends, solo, or a working session — alongside user ratings, personal wishlists, and semantic \"similar places\" recommendations that surface spots with the same vibe.",
      stack: ["Next.js", "TypeScript", "PostgreSQL", "NextAuth.js", "Tailwind CSS"],
    },
    sidenote: {
      kind: "RAG application",
      title: "Sidenote",
      desc: "A second-brain web app that ingests PDFs, notes, and article URLs, chunks and embeds them into pgvector, and answers natural-language questions with inline citations back to the exact source documents — so every answer is traceable.",
      stack: ["Next.js", "FastAPI", "PostgreSQL", "pgvector", "LLM APIs"],
    },
  };

  function openProject(p) {
    const pills = p.stack.map(i => '<span class="tech-pill">' + i + '</span>').join("");
    openModal(
      '<button class="modal__close" data-close aria-label="Close">×</button>' +
      '<span class="modal__kind">' + p.kind + '</span>' +
      '<h3 class="modal__title" id="modalTitle">' + p.title + '</h3>' +
      '<p class="modal__desc">' + p.desc + '</p>' +
      '<span class="modal__label">Built with</span>' +
      '<div class="modal__pills">' + pills + '</div>'
    );
  }

  $$(".proj-card").forEach(card => {
    const p = projects[card.dataset.project];
    if (!p) return;
    const open = () => openProject(p);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });

  /* ---------- EMAIL: copy to clipboard ---------- */
  const emailBtn = $("#emailBtn");
  if (emailBtn) {
    const emailLabel = $("#emailLabel");
    const address = "vsharmaa11116@gmail.com";
    let resetT;
    emailBtn.addEventListener("click", async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(address);
        ok = true;
      } catch (e) {
        const t = document.createElement("textarea");
        t.value = address; t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.focus(); t.select();
        try { ok = document.execCommand("copy"); } catch (_) {}
        document.body.removeChild(t);
      }
      emailLabel.textContent = ok ? "Copied!" : "vsharmaa11116@gmail.com";
      emailBtn.classList.add("copied");
      clearTimeout(resetT);
      resetT = setTimeout(() => { emailLabel.textContent = "Email"; emailBtn.classList.remove("copied"); }, 1700);
    });
  }

  /* ---------- PLAYABLE GAME MODAL ---------- */
  const gameURL = "https://vipulsharma016.github.io/pixel-slayer-2d/";
  $("#playGame").addEventListener("click", () => {
    openModal(
      '<button class="modal__close" data-close aria-label="Close">×</button>' +
      '<span class="modal__kind">Playable · 2D game</span>' +
      '<h3 class="modal__title" id="modalTitle">Pixel Slayer 2D</h3>' +
      '<iframe class="modal__frame" src="' + gameURL + '" title="Pixel Slayer 2D" loading="lazy" allowfullscreen></iframe>' +
      '<p class="modal__desc" style="margin-bottom:0">Controls load inside the game. If it doesn\'t start here, open it full-screen in a new tab.</p>' +
      '<div class="modal__links"><a class="btn btn--primary" href="' + gameURL + '" target="_blank" rel="noopener">Open full-screen ↗</a></div>'
    );
  });
})();
