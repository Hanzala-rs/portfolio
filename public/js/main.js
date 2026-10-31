(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // Run `draw` every frame only while `el` is on screen.
  function loopWhileVisible(el, draw) {
    let raf = 0;
    let visible = false;
    const tick = (t) => {
      draw(t);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }).observe(el);
  }

  /* =========================================================
     INTRO: dot → flick → first name → scramble → PORTFOLIO
     ========================================================= */
  const hero = $('.hero');
  const word = $('.hero__word');
  let introDone = false;

  function setWord(text) {
    word.textContent = '';
    return [...text].map((c) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      word.appendChild(s);
      return s;
    });
  }

  async function scramble(from, to) {
    const chars = setWord(to.replace(/./g, ' '));
    const pool = (from + to).replace(/\s/g, '');
    const lead = 1.6; // frames between each letter starting to change
    const hold = 4; // frames a letter scrambles before settling
    const total = Math.ceil(to.length * lead + hold);
    for (let f = 0; f <= total && !introDone; f++) {
      chars.forEach((el, i) => {
        const start = i * lead;
        let c;
        if (f >= start + hold) c = to[i];
        else if (f >= start) c = pool[(Math.random() * pool.length) | 0];
        else c = from[i] || '';
        el.textContent = c;
        el.classList.toggle('is-on', c !== '');
      });
      await wait(55);
    }
  }

  function finishIntro() {
    if (introDone) return;
    introDone = true;
    setWord(word.dataset.to).forEach((c) => c.classList.add('is-on'));
    hero.classList.add('s-flick', 's-word', 's-morph', 's-settle');
    document.body.classList.remove('is-intro');
    document.body.classList.add('intro-done');
    startHeroParticles();
  }

  async function runIntro() {
    const skip = location.hash && location.hash !== '#top';
    if (reduceMotion || skip || scrollY > 20) return finishIntro();

    await wait(1100);
    if (introDone) return;
    hero.classList.add('s-flick');
    await wait(420);
    if (introDone) return;
    hero.classList.add('s-word');
    const chars = setWord(word.dataset.from);
    for (const c of chars) {
      if (introDone) return;
      c.classList.add('is-on');
      await wait(105);
    }
    await wait(700);
    if (introDone) return;
    hero.classList.add('s-morph');
    await scramble(word.dataset.from, word.dataset.to);
    await wait(300);
    finishIntro();
  }

  $('.intro__skip').addEventListener('click', finishIntro);
  addEventListener('keydown', (e) => { if (!introDone && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) finishIntro(); });
  addEventListener('wheel', () => { if (!introDone) finishIntro(); }, { passive: true });
  addEventListener('touchmove', () => { if (!introDone) finishIntro(); }, { passive: true });

  /* =========================================================
     HERO PARTICLES: a portrait made of light
     Uses /assets/portrait.png when present (transparent background works
     best), otherwise a generated silhouette.
     ========================================================= */
  let particlesStarted = false;

  function drawSilhouette() {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 520;
    const g = c.getContext('2d');
    const light = (x, y, r) => {
      const grad = g.createRadialGradient(x, y, 10, x, y, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#3c3c3c');
      return grad;
    };
    // shoulders / jacket
    g.fillStyle = light(170, 330, 300);
    g.beginPath();
    g.moveTo(20, 520);
    g.bezierCurveTo(30, 380, 90, 320, 165, 300);
    g.lineTo(235, 300);
    g.bezierCurveTo(310, 320, 370, 380, 380, 520);
    g.closePath();
    g.fill();
    // neck
    g.fillStyle = light(190, 250, 90);
    g.fillRect(168, 205, 64, 100);
    // head
    g.fillStyle = light(175, 120, 120);
    g.beginPath();
    g.ellipse(200, 140, 72, 92, 0, 0, Math.PI * 2);
    g.fill();
    // hair
    g.fillStyle = '#d8d8d8';
    g.beginPath();
    g.ellipse(198, 82, 80, 52, -0.08, Math.PI, Math.PI * 2.02);
    g.fill();
    // shirt collar V + tie
    g.fillStyle = '#f2f2f2';
    g.beginPath();
    g.moveTo(165, 300); g.lineTo(200, 380); g.lineTo(235, 300); g.closePath();
    g.fill();
    g.fillStyle = '#2a2a2a';
    g.fillRect(193, 318, 14, 202);
    // lapel shadows
    g.fillStyle = 'rgba(30,30,30,0.85)';
    g.beginPath(); g.moveTo(150, 305); g.lineTo(195, 430); g.lineTo(120, 340); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(250, 305); g.lineTo(205, 430); g.lineTo(280, 340); g.closePath(); g.fill();
    return c;
  }

  function loadPortrait(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function startHeroParticles() {
    if (particlesStarted) return;
    particlesStarted = true;

    const canvas = $('.hero__particles');
    const ctx = canvas.getContext('2d');
    const source = (await loadPortrait(canvas.dataset.portrait)) || drawSilhouette();
    const mouse = { x: -9999, y: -9999 };
    let W = 0;
    let H = 0;
    let dpr = 1;
    let particles = [];

    function sampleTargets() {
      const figH = H * 0.8;
      const figW = figH * (source.width / source.height);
      const off = document.createElement('canvas');
      off.width = Math.max(1, Math.round(figW));
      off.height = Math.max(1, Math.round(figH));
      const og = off.getContext('2d', { willReadFrequently: true });
      og.drawImage(source, 0, 0, off.width, off.height);
      const data = og.getImageData(0, 0, off.width, off.height).data;

      const budget = W < 700 ? 7000 : 16000;
      const step = Math.max(2, Math.round(Math.sqrt((off.width * off.height) / (budget * 1.6))));
      const ox = (W - off.width) / 2;
      const oy = H - off.height;
      const out = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const k = (y * off.width + x) * 4;
          // A small floor keeps dark clothing visible as a sparse outline.
          const alpha = data[k + 3] / 255;
          const lum = (0.12 + 0.88 * Math.pow((data[k] + data[k + 1] + data[k + 2]) / 765, 0.85)) * alpha;
          if (alpha > 0.4 && Math.random() < lum * 1.15) {
            out.push({ x: ox + x + (Math.random() - 0.5) * step, y: oy + y + (Math.random() - 0.5) * step, lum });
          }
        }
      }
      return out;
    }

    function build() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const targets = sampleTargets();
      particles = targets.map((t, i) => {
        const prev = particles[i];
        return {
          x: prev ? prev.x : Math.random() * W,
          y: prev ? prev.y : Math.random() * H,
          vx: 0,
          vy: 0,
          tx: t.x,
          ty: t.y,
          lum: t.lum,
          size: Math.random() < 0.15 ? 2 : 1.3,
          phase: Math.random() * Math.PI * 2,
        };
      });
    }

    build();
    let resizeTimer;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    });
    hero.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

    const R = 90;
    loopWhileVisible(hero, (t) => {
      ctx.clearRect(0, 0, W, H);
      const time = t * 0.001;
      for (const p of particles) {
        const tx = p.tx + Math.sin(time * 1.3 + p.phase) * 0.8;
        const ty = p.ty + Math.cos(time * 1.1 + p.phase) * 0.8;
        p.vx += (tx - p.x) * 0.012;
        p.vy += (ty - p.y) * 0.012;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const f = (1 - Math.sqrt(d2) / R) * 2.4;
          const d = Math.sqrt(d2) || 1;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = `rgba(214, 224, 255, ${Math.min(1, 0.25 + p.lum)})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });
  }

  /* =========================================================
     SWIRL: flowing "starry night" lines behind the About section
     ========================================================= */
  function startSwirl(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, vortices, parts;

    function build() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#050506';
      ctx.fillRect(0, 0, W, H);
      const n = W < 700 ? 4 : 7;
      vortices = Array.from({ length: n }, () => ({
        x: W * (0.25 + Math.random() * 0.75),
        y: Math.random() * H,
        r: 90 + Math.random() * 170,
        s: (Math.random() < 0.5 ? -1 : 1) * (0.7 + Math.random() * 0.6),
      }));
      const count = Math.min(1400, Math.round((W * H) / 1100));
      parts = Array.from({ length: count }, spawn);
    }

    function spawn() {
      return { x: Math.random() * W, y: Math.random() * H, life: 60 + Math.random() * 160 };
    }

    function field(x, y, t) {
      let vx = 0.55 + 0.35 * Math.sin(y * 0.007 + t);
      let vy = 0.3 * Math.cos(x * 0.005 - t * 0.7);
      for (const v of vortices) {
        const dx = x - v.x;
        const dy = y - v.y;
        const f = v.s * Math.exp(-(dx * dx + dy * dy) / (v.r * v.r)) * 2.6;
        vx += (-dy / v.r) * f;
        vy += (dx / v.r) * f;
      }
      return [vx, vy];
    }

    function step(t) {
      ctx.fillStyle = 'rgba(5, 5, 6, 0.04)';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(230, 230, 236, 0.32)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const [vx, vy] = field(p.x, p.y, t);
        ctx.moveTo(p.x, p.y);
        p.x += vx * 1.6;
        p.y += vy * 1.6;
        ctx.lineTo(p.x, p.y);
        if (--p.life < 0 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) parts[i] = spawn();
      }
      ctx.stroke();
      for (const v of vortices) {
        const g = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, 14);
        g.addColorStop(0, 'rgba(255,255,255,0.09)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(v.x - 14, v.y - 14, 28, 28);
      }
    }

    build();
    let resizeTimer;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 250);
    });

    if (reduceMotion) {
      for (let i = 0; i < 260; i++) step(i * 0.004);
      return;
    }
    loopWhileVisible(canvas, (t) => step(t * 0.00025));
  }

  /* =========================================================
     SCROLL REVEAL
     ========================================================= */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        revealer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal]').forEach((el) => revealer.observe(el));

  /* =========================================================
     JOURNEY: vertical scroll drives a horizontal track
     ========================================================= */
  function initJourney() {
    const section = $('.journey');
    const track = $('.journey__track');
    const bar = $('.journey__progress span');
    const desktop = matchMedia('(min-width: 901px)');
    let maxX = 0;

    function measure() {
      if (!desktop.matches) {
        section.style.height = '';
        track.style.transform = '';
        return;
      }
      maxX = Math.max(0, track.scrollWidth - innerWidth);
      section.style.height = `${maxX + innerHeight}px`;
      update();
    }

    function update() {
      if (!desktop.matches) return;
      const r = section.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - innerHeight || 1), 0, 1);
      track.style.transform = `translate3d(${-p * maxX}px,0,0)`;
      bar.style.width = `${p * 100}%`;
    }

    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', measure);
    document.fonts.ready.then(measure);
    measure();
  }

  /* =========================================================
     WORK: 3D project carousel
     ========================================================= */
  function initCarousel() {
    const root = $('.carousel');
    const ring = $('.carousel__ring');
    const cards = $$('.card', ring);
    const title = $('.work__title');
    const tagline = $('.work__tagline');
    const projects = window.__PROJECTS__ || [];
    const n = cards.length;
    const stepDeg = 360 / n;
    let radius = 0;
    let angle = 0;
    let target = 0;
    let active = -1;

    function layout() {
      const w = ring.offsetWidth;
      radius = w / 2 / Math.tan(Math.PI / n) + 50;
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${i * stepDeg}deg) translateZ(${radius}px)`;
      });
    }

    function setActive(i) {
      if (i === active) return;
      active = i;
      cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
      const p = projects[i];
      if (p) {
        title.textContent = p.title;
        tagline.textContent = p.tagline;
      }
    }

    function go(delta) {
      target = Math.round(target / stepDeg) * stepDeg - delta * stepDeg;
    }

    function goTo(i) {
      const current = Math.round(-target / stepDeg);
      let diff = (((i - current) % n) + n) % n;
      if (diff > n / 2) diff -= n;
      go(diff);
    }

    layout();
    addEventListener('resize', layout);

    loopWhileVisible(root, () => {
      angle += (target - angle) * (reduceMotion ? 1 : 0.1);
      ring.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
      setActive(((Math.round(-angle / stepDeg) % n) + n) % n);
    });

    // drag
    let startX = 0;
    let startTarget = 0;
    let dragging = false;
    let moved = false;
    root.addEventListener('pointerdown', (e) => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startTarget = target;
    });
    addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) {
        moved = true;
        root.classList.add('is-dragging');
      }
      target = startTarget + dx * 0.28;
    });
    addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('is-dragging');
      target = Math.round(target / stepDeg) * stepDeg;
    });

    cards.forEach((c, i) => {
      c.addEventListener('click', (e) => {
        if (moved) return e.preventDefault();
        if (i === active) openProject(i);
        else goTo(i);
      });
    });
    $$('.arrow').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.dir))));
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });
  }

  /* =========================================================
     PROJECT MODAL
     ========================================================= */
  const modal = $('.modal');
  const modalContent = $('.modal__content');
  let liveFetched = false;

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }

  function renderProject(p) {
    const langs = p.live && p.live.languages.length ? p.live.languages : null;
    const live = p.live
      ? `<span>★ ${p.live.stars} stars</span><span>Last push ${esc(formatDate(p.live.pushedAt))}</span>${langs ? `<span>${langs.map(esc).join(' · ')}</span>` : ''}`
      : '<span>Live GitHub stats unavailable right now</span>';
    modalContent.innerHTML = `
      <p class="eyebrow">${esc(p.tags)}</p>
      <div class="modal__glyph chrome">${esc(p.glyph)}</div>
      <h3 id="modal-title">${esc(p.title)} — <span class="muted">${esc(p.tagline)}</span></h3>
      <ul class="points">${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <ul class="chips">${p.stack.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="modal__live">${live}</div>
      <div class="modal__links">
        <a class="pill" href="${esc(p.url)}" target="_blank" rel="noopener">View on GitHub ↗</a>
        ${p.demo ? `<a class="pill pill--ghost" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo ↗</a>` : ''}
      </div>`;
  }

  async function openProject(i) {
    const projects = window.__PROJECTS__;
    renderProject(projects[i]);
    modal.showModal();
    if (!projects[i].live && !liveFetched) {
      liveFetched = true;
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          window.__PROJECTS__ = await res.json();
          if (modal.open) renderProject(window.__PROJECTS__[i]);
        }
      } catch { /* keep curated data */ }
    }
  }

  $('.modal__close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

  /* =========================================================
     CERTS: spinning hexagon
     ========================================================= */
  function initHex() {
    const scene = $('.hex__scene');
    if (reduceMotion) return;
    let spin = 0;
    let lastY = scrollY;
    let boost = 0;
    addEventListener('scroll', () => {
      boost += Math.abs(scrollY - lastY) * 0.02;
      lastY = scrollY;
    }, { passive: true });
    loopWhileVisible(scene.parentElement, () => {
      boost *= 0.92;
      spin = (spin - 0.18 - Math.min(boost, 4)) % 360;
      scene.style.setProperty('--spin', `${spin}deg`);
    });
  }

  /* =========================================================
     NAV
     ========================================================= */
  function initNav() {
    const nav = $('.nav');
    const toggle = $('.nav__toggle');
    const links = $$('.nav__links a');
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.forEach((a) => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (!introDone) finishIntro();
    }));

    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id === 'certs' ? 'work' : e.target.id;
        links.forEach((a) => a.classList.toggle('is-active', a === byId.get(id)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach((s) => spy.observe(s));
  }

  /* ========================================================= */
  initNav();
  initJourney();
  initCarousel();
  initHex();
  startSwirl($('.swirl'));
  runIntro();
})();
