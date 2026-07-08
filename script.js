/* ============================================================
   Rishit Sitholey — portfolio v2
   Vanilla JS: loader, cursor, parallax, particles, orbit,
   palette (nav + SQL), reveals, counters, terminal contact.
   ============================================================ */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(pointer: fine)').matches;

  /* ---------- loader ---------- */
  var loader = document.getElementById('loader');
  var loaderBar = document.getElementById('loaderBar');
  if (reduced) { loader.classList.add('done'); }
  else {
    var lp = 0;
    var lt = setInterval(function () {
      lp = Math.min(lp + 14 + Math.random() * 22, 100);
      loaderBar.style.width = lp + '%';
      if (lp >= 100) { clearInterval(lt); setTimeout(function () { loader.classList.add('done'); }, 180); }
    }, 90);
  }

  /* ---------- theme (with safe storage) ---------- */
  var root = document.documentElement;
  function getStored(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function setStored(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode / sandbox */ } }
  var saved = getStored('theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    setStored('theme', next);
  });

  /* ---------- custom cursor + spotlight + parallax ---------- */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var spot = document.getElementById('spotlight');
  var stage = document.getElementById('stage');
  var mx = innerWidth / 2, my = innerHeight / 3, rx = mx, ry = my;
  if (finePointer && !reduced) {
    document.body.classList.add('custom-cursor');
    addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      spot.style.setProperty('--mx', mx + 'px');
      spot.style.setProperty('--my', my + 'px');
      /* hero parallax layers */
      if (stage) {
        var cx = (mx / innerWidth - 0.5), cy = (my / innerHeight - 0.5);
        stage.querySelectorAll('.layer').forEach(function (l) {
          var d = parseFloat(l.dataset.depth || 10);
          l.style.transform = 'translate3d(' + (-cx * d) + 'px,' + (-cy * d) + 'px,0)';
        });
      }
    }, { passive: true });
    (function ringLoop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    })();
    document.querySelectorAll('a, button, .proj-head').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hot'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hot'); });
    });
  } else { dot.remove(); ring.remove(); spot.remove(); }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      var r = 60;
      btn.addEventListener('mousemove', function (e) {
        var b = btn.getBoundingClientRect();
        var dx = e.clientX - (b.left + b.width / 2);
        var dy = e.clientY - (b.top + b.height / 2);
        btn.style.transform = 'translate(' + dx * 0.18 + 'px,' + dy * 0.22 + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- scroll: progress, nav, dots, back-to-top ---------- */
  var progressBar = document.getElementById('progressBar');
  var nav = document.getElementById('nav');
  var sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
  var dotsWrap = document.getElementById('sectionDots');
  sections.forEach(function (id) {
    var a = document.createElement('a');
    a.href = '#' + id; a.dataset.for = id; a.setAttribute('aria-label', id);
    dotsWrap.appendChild(a);
  });
  var navLinks = document.querySelectorAll('.nav-links a');
  function onScroll() {
    var h = document.documentElement;
    var p = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progressBar.style.width = (p * 100) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 30);
    var cur = 'home';
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < innerHeight * 0.42) cur = id;
    });
    dotsWrap.querySelectorAll('a').forEach(function (d) { d.classList.toggle('on', d.dataset.for === cur); });
    navLinks.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + cur); });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  document.getElementById('toTop').addEventListener('click', function () {
    scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- reveals + counters ---------- */
  document.querySelectorAll('.sec-head, .about-grid > *, .t-item, .proj, .orbit-wrap, .term, .stats .stat')
    .forEach(function (el) { el.classList.add('rv'); });
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
    var dec = parseInt(el.dataset.dec || '0', 10);
    if (reduced) { el.textContent = prefix + target.toFixed(dec) + suffix; return; }
    var t0 = null, dur = 1300;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = prefix + (target * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      if (e.target.matches('[data-count]')) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- project expanders ---------- */
  document.querySelectorAll('.proj').forEach(function (proj) {
    var head = proj.querySelector('.proj-head');
    var body = proj.querySelector('.proj-body');
    head.addEventListener('click', function () {
      var open = proj.dataset.open === 'true';
      proj.dataset.open = String(!open);
      head.setAttribute('aria-expanded', String(!open));
      body.style.maxHeight = !open ? body.scrollHeight + 40 + 'px' : '0px';
      if (!open) body.querySelectorAll('[data-count]').forEach(countUp);
    });
  });

  /* ---------- hero particle field ---------- */
  (function () {
    var cv = document.getElementById('field');
    if (!cv || reduced) return;
    var ctx = cv.getContext('2d'), W, H, pts = [];
    var DPR = Math.min(devicePixelRatio || 1, 2);
    function theme() { return root.dataset.theme === 'light'; }
    function resize() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      pts = [];
      var n = Math.min(90, Math.floor(W * H / 16000));
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: 1 + Math.random() * 1.4
        });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      var light = theme();
      var lineBase = light ? '14,21,38,' : '154,163,178,';
      var dotCol = light ? 'rgba(8,145,178,.5)' : 'rgba(103,232,249,.55)';
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            ctx.strokeStyle = 'rgba(' + lineBase + (0.10 * (1 - d2 / 14400)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = dotCol;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize();
    addEventListener('resize', resize);
    requestAnimationFrame(frame);
  })();

  /* ---------- skills orbit constellation ---------- */
  (function () {
    var cv = document.getElementById('orbit');
    var tip = document.getElementById('orbitTip');
    if (!cv) return;
    var ctx = cv.getContext('2d'), W, H, CX, CY;
    var DPR = Math.min(devicePixelRatio || 1, 2);
    var SKILLS = [
      /* ring 1 — core */
      { l: 'SQL',        ring: 0, a: 0.0, note: 'Window functions, CTEs, MERGE loads, validation queries.' },
      { l: 'Python',     ring: 0, a: 2.1, note: 'Pandas pipelines, logging, retries, reusable ETL functions.' },
      { l: 'Snowflake',  ring: 0, a: 4.2, note: 'Stages, COPY INTO, virtual warehouses, star schemas.' },
      /* ring 2 — daily stack */
      { l: 'Power BI',   ring: 1, a: 0.7, note: '20+ dashboards; drill-through, bookmarks, semantic models.' },
      { l: 'DAX',        ring: 1, a: 1.9, note: 'Time intelligence, CALCULATE contexts, measure libraries.' },
      { l: 'ETL / ELT',  ring: 1, a: 3.1, note: 'Idempotent, incremental, validated — scheduled + on-demand.' },
      { l: 'Star schema',ring: 1, a: 4.4, note: 'Declared grain, surrogate keys, SCD Type 2 dimensions.' },
      { l: 'AWS S3',     ring: 1, a: 5.5, note: 'Landing zones and external-stage integration.' },
      /* ring 3 — databases + learning */
      { l: 'MySQL',      ring: 2, a: 0.4, note: 'Source-of-truth extraction — 2.2M+ rows shaped for BI.' },
      { l: 'PostgreSQL', ring: 2, a: 1.6, note: 'Relational modeling and extraction queries.' },
      { l: 'Databricks', ring: 2, a: 3.0, note: 'Currently learning.', learn: true },
      { l: 'PySpark',    ring: 2, a: 4.2, note: 'Currently learning.', learn: true },
      { l: 'Tableau',    ring: 2, a: 5.3, note: 'Currently learning.', learn: true }
    ];
    var speeds = [0.0016, -0.0011, 0.0008];
    var hover = -1, paused = false;
    function radii() { return [Math.min(W, H) * 0.16, Math.min(W, H) * 0.30, Math.min(W, H) * 0.44]; }
    function resize() {
      W = cv.clientWidth; H = cv.clientHeight; CX = W / 2; CY = H / 2;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function nodePos(s, R) {
      return { x: CX + Math.cos(s.a) * R[s.ring], y: CY + Math.sin(s.a) * R[s.ring] * 0.72 };
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      var light = root.dataset.theme === 'light';
      var R = radii();
      /* rings */
      for (var r = 0; r < 3; r++) {
        ctx.strokeStyle = light ? 'rgba(15,23,42,.10)' : 'rgba(255,255,255,.07)';
        ctx.setLineDash(r === 2 ? [4, 6] : []);
        ctx.beginPath(); ctx.ellipse(CX, CY, R[r], R[r] * 0.72, 0, 0, 7); ctx.stroke();
      }
      ctx.setLineDash([]);
      /* center core */
      var coreGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 46);
      coreGrad.addColorStop(0, light ? 'rgba(8,145,178,.20)' : 'rgba(103,232,249,.16)');
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath(); ctx.arc(CX, CY, 46, 0, 7); ctx.fill();
      ctx.font = '700 15px Sora, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = light ? '#0e1526' : '#eef1f7';
      ctx.fillText('RS', CX, CY);
      /* nodes */
      SKILLS.forEach(function (s, i) {
        if (!paused || i === hover) { if (!paused) s.a += speeds[s.ring]; }
        var p = nodePos(s, R);
        var isH = i === hover;
        var col = s.learn ? (light ? '124,58,237' : '167,139,250') : (light ? '8,145,178' : '103,232,249');
        ctx.fillStyle = 'rgba(' + col + ',' + (isH ? 0.28 : 0.13) + ')';
        ctx.strokeStyle = 'rgba(' + col + ',' + (isH ? 0.9 : 0.45) + ')';
        if (s.learn) ctx.setLineDash([3, 4]);
        var w = ctx.measureText(s.l).width;
        ctx.font = '500 11.5px "JetBrains Mono", monospace';
        w = ctx.measureText(s.l).width;
        roundRect(ctx, p.x - w / 2 - 10, p.y - 12, w + 20, 24, 12);
        ctx.fill(); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = light ? '#0e1526' : '#eef1f7';
        ctx.fillText(s.l, p.x, p.y + 0.5);
      });
      requestAnimationFrame(frame);
    }
    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r); c.closePath();
    }
    function hitTest(x, y) {
      var R = radii();
      for (var i = 0; i < SKILLS.length; i++) {
        var p = nodePos(SKILLS[i], R);
        if (Math.abs(x - p.x) < 46 && Math.abs(y - p.y) < 16) return i;
      }
      return -1;
    }
    cv.addEventListener('mousemove', function (e) {
      var b = cv.getBoundingClientRect();
      var i = hitTest(e.clientX - b.left, e.clientY - b.top);
      hover = i; paused = i > -1;
      if (i > -1) {
        var s = SKILLS[i];
        tip.hidden = false;
        tip.innerHTML = '<b>' + s.l + (s.learn ? ' · learning' : '') + '</b><span>' + s.note + '</span>';
        var p = nodePos(s, radii());
        tip.style.left = Math.min(Math.max(p.x - 60, 8), W - 240) + 'px';
        tip.style.top = (p.y + 22) + 'px';
      } else tip.hidden = true;
    });
    cv.addEventListener('mouseleave', function () { hover = -1; paused = false; tip.hidden = true; });
    cv.addEventListener('click', function (e) { /* touch support */
      var b = cv.getBoundingClientRect();
      var i = hitTest(e.clientX - b.left, e.clientY - b.top);
      if (i > -1) { hover = i; paused = true; cv.dispatchEvent(new MouseEvent('mousemove', { clientX: e.clientX, clientY: e.clientY })); }
      else { hover = -1; paused = false; tip.hidden = true; }
    });
    resize();
    addEventListener('resize', resize);
    if (!reduced) requestAnimationFrame(frame);
    else { /* static render once */ frame = function(){}; (function(){ resize(); })(); }
  })();

  /* ---------- contact terminal ---------- */
  (function () {
    var lines = document.getElementById('termLines');
    var typed = false;
    var SCRIPT_LINES = [
      { t: '$ init contact --with rishit', cls: 'c' },
      { t: 'establishing secure channel…', cls: '' },
      { t: '✓ channel ready — fill the fields, or email directly below.', cls: 'g' }
    ];
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting || typed) return;
        typed = true; tio.disconnect();
        if (reduced) {
          SCRIPT_LINES.forEach(function (l) { lines.innerHTML += '<div class="' + l.cls + '">' + l.t + '</div>'; });
          return;
        }
        var li = 0;
        (function nextLine() {
          if (li >= SCRIPT_LINES.length) return;
          var l = SCRIPT_LINES[li++];
          var div = document.createElement('div');
          div.className = l.cls; lines.appendChild(div);
          var ci = 0;
          (function typeChar() {
            div.textContent = l.t.slice(0, ++ci);
            if (ci < l.t.length) setTimeout(typeChar, 14);
            else setTimeout(nextLine, 260);
          })();
        })();
      });
    }, { threshold: 0.4 });
    tio.observe(lines);

    document.getElementById('contactForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cfName').value.trim();
      var email = document.getElementById('cfEmail').value.trim();
      var msg = document.getElementById('cfMsg').value.trim();
      var body = msg + '\n\n— ' + name + ' (' + email + ')';
      var ok = document.getElementById('termOk');
      ok.hidden = false;
      location.href = 'mailto:rishitsitholey002@gmail.com'
        + '?subject=' + encodeURIComponent('Portfolio contact — ' + name)
        + '&body=' + encodeURIComponent(body);
    });
  })();

  /* ---------- command palette (nav + SQL) ---------- */
  (function () {
    var ov = document.getElementById('paletteOv');
    var input = document.getElementById('paletteInput');
    var list = document.getElementById('paletteList');
    var DB = {
      portfolio: { cols: ['section', 'summary'], rows: [
        ['owner', 'Rishit Sitholey — Analytics Engineer, Lucknow'],
        ['focus', 'ETL/ELT · Snowflake · star schemas · Power BI'],
        ['status', 'Open to product-company data roles']]},
      projects: { cols: ['id', 'project', 'scale'], rows: [
        ['P·01', 'End-to-End ELT Pipeline (Snowflake)', '100K+ records · star schema'],
        ['P·02', 'Business 360 Dashboard Suite', '2.2M+ records · 10+ dashboards'],
        ['P·03', 'TikTok Commerce Analytics', '50+ stores · 15% reported lift']]},
      skills: { cols: ['skill', 'tier'], rows: [
        ['SQL / Python / Snowflake / Power BI / DAX', 'core'],
        ['ETL-ELT / star schema / AWS S3 / MySQL / PostgreSQL', 'stack'],
        ['Databricks / PySpark / Tableau', 'learning']]},
      experience: { cols: ['role', 'org', 'window'], rows: [
        ['Analytics Engineer', 'Appex Multisol', 'Jan 2026 → now'],
        ['Data Analyst', 'Appex Multisol', '2025'],
        ['Data Analyst', 'Bravoji.com', '2024'],
        ['Support Intern', 'PeopleStrong', '2024']]},
      contact: { cols: ['channel', 'handle'], rows: [
        ['email', 'rishitsitholey002@gmail.com'],
        ['linkedin', 'linkedin.com/in/rishitsitholey'],
        ['github', 'github.com/rishitsitholey002']]}
    };
    var ACTIONS = [
      { l: '⌂ Go to Home', k: 'nav', run: function () { go('#home'); } },
      { l: '◎ Go to About', k: 'nav', run: function () { go('#about'); } },
      { l: '▤ Go to Experience', k: 'nav', run: function () { go('#experience'); } },
      { l: '▣ Go to Projects', k: 'nav', run: function () { go('#projects'); } },
      { l: '✦ Go to Skills', k: 'nav', run: function () { go('#skills'); } },
      { l: '✉ Go to Contact', k: 'nav', run: function () { go('#contact'); } },
      { l: '◐ Toggle theme', k: 'action', run: function () { document.getElementById('themeToggle').click(); } },
      { l: '↓ Download résumé (PDF)', k: 'action', run: function () { var a = document.createElement('a'); a.href = 'assets/Rishit_Sitholey_Resume.pdf'; a.download = ''; a.click(); } },
      { l: '❯ Try SQL: SELECT * FROM projects', k: 'sql', run: function () { input.value = 'SELECT * FROM projects'; render(); input.focus(); } }
    ];
    var sel = 0, visible = [];
    function go(h) { close(); document.querySelector(h).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
    function open() { ov.classList.add('open'); input.value = ''; render(); setTimeout(function () { input.focus(); }, 40); }
    function close() { ov.classList.remove('open'); }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function isSQL(q) { return /^\s*(select|show)\b/i.test(q); }
    function runSQL(q) {
      var s = q.trim().replace(/;+\s*$/, '').toLowerCase();
      if (s === 'show tables') {
        return table({ cols: ['table_name'], rows: Object.keys(DB).map(function (k) { return [k]; }) });
      }
      var m = s.match(/^select\s+(.+?)\s+from\s+([a-z_]+)$/);
      if (!m) return '<div class="err">Syntax: SELECT * FROM &lt;table&gt; · SHOW TABLES</div>';
      var t = DB[m[2]];
      if (!t) return '<div class="err">Table "' + esc(m[2]) + '" not found. SHOW TABLES lists them.</div>';
      return table(t);
    }
    function table(t) {
      var h = '<table><tr>' + t.cols.map(function (c) { return '<th>' + esc(c).toUpperCase() + '</th>'; }).join('') + '</tr>';
      t.rows.forEach(function (r) { h += '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; });
      return h + '</table><div class="meta">' + t.rows.length + ' rows · read-only warehouse</div>';
    }
    function render() {
      var q = input.value;
      if (isSQL(q)) {
        list.innerHTML = '<div class="pal-sql">' + runSQL(q) + '</div>';
        visible = [];
        return;
      }
      var f = q.trim().toLowerCase();
      visible = ACTIONS.filter(function (a) { return !f || a.l.toLowerCase().indexOf(f) > -1; });
      sel = Math.min(sel, Math.max(visible.length - 1, 0));
      list.innerHTML = visible.map(function (a, i) {
        return '<button class="pal-item' + (i === sel ? ' sel' : '') + '" data-i="' + i + '">' + a.l + '<span class="pi-k">' + a.k + '</span></button>';
      }).join('') || '<div class="pal-sql">No matches — try SQL: SELECT * FROM skills</div>';
      list.querySelectorAll('.pal-item').forEach(function (b) {
        b.addEventListener('click', function () { visible[+b.dataset.i].run(); });
        b.addEventListener('mouseenter', function () { sel = +b.dataset.i; paintSel(); });
      });
    }
    function paintSel() {
      list.querySelectorAll('.pal-item').forEach(function (b, i) { b.classList.toggle('sel', i === sel); });
    }
    input.addEventListener('input', function () { sel = 0; render(); });
    input.addEventListener('keydown', function (e) {
      if (isSQL(input.value) && e.key === 'Enter') { render(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, visible.length - 1); paintSel(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); paintSel(); }
      if (e.key === 'Enter' && visible[sel]) visible[sel].run();
    });
    document.getElementById('openPalette').addEventListener('click', open);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        ov.classList.contains('open') ? close() : open();
      }
      if (e.key === 'Escape') close();
    });
  })();

})();
