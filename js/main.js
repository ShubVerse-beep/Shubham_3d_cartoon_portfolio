(function () {
  'use strict';
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ---------- split text into animatable letters ---------- */
  function split(el) {
    var txt = el.textContent;
    el.setAttribute('aria-label', txt.replace(/\s+/g, ' ').trim());
    el.innerHTML = '';
    var i = 0;
    txt.split(/(\s+)/).forEach(function (part) {
      if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(' ')); return; }
      if (!part) return;
      var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      part.split('').forEach(function (ch) {
        var s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = ch; w.appendChild(s);
      });
      el.appendChild(w);
    });
  }
  $$('[data-split]').forEach(split);

  /* ---------- render content from data.js ---------- */
  var ARROW = '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15 15 5M7 5h8v8"/></svg>';

  // skills: two marquee rows + grouped cards
  var all = [];
  S.skills.forEach(function (g) { if (g.g !== 'People skills') all = all.concat(g.items); });
  var half = Math.ceil(all.length / 2);
  function pills(arr) { var h = arr.map(function (t) { return '<span class="pill">' + t + '</span>'; }).join(''); return h + h + h; }
  $('#mqA').innerHTML = pills(all.slice(0, half));
  $('#mqB').innerHTML = pills(all.slice(half));
  $('#skillGrid').innerHTML = S.skills.map(function (g, i) {
    return '<article class="skill-card tilt" data-tilt data-reveal style="--d:' + (i * 70) + 'ms"><div class="sk-ico">' + g.i + '</div><h3>' + g.g + '</h3><ul>' +
      g.items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></article>';
  }).join('');

  // project artwork (original, palette-matched SVG motifs)
  var A = {
    health: '<path d="M200 70v120M140 130h120" stroke="#fff" stroke-width="26" stroke-linecap="round"/><circle cx="200" cy="130" r="86" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3" stroke-dasharray="6 10"/><circle cx="310" cy="64" r="10" fill="#FFB79B"/><circle cx="82" cy="196" r="7" fill="#fff"/>',
    shield: '<path d="M200 54 284 86v58c0 42-34 66-84 84-50-18-84-42-84-84V86z" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="4"/><path d="m162 136 28 28 52-60" fill="none" stroke="#FFB79B" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>',
    grid: '<g fill="#fff">' + [0, 1, 2, 3].map(function (r) { return [0, 1, 2, 3, 4].map(function (c) { return '<rect x="' + (92 + c * 46) + '" y="' + (64 + r * 40) + '" width="34" height="28" rx="8" opacity="' + (((r + c) % 3) ? 0.28 : 0.95) + '"' + (((r + c) % 5 === 0) ? ' fill="#FFB79B"' : '') + '/>'; }).join(''); }).join('') + '</g>',
    pulse: '<path d="M40 150h70l22-62 36 112 30-80 20 30h102" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="318" cy="150" r="12" fill="#FFB79B"/><circle cx="318" cy="150" r="26" fill="none" stroke="#FFB79B" stroke-opacity=".5" stroke-width="3"/>',
    face: '<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"><path d="M110 92V66h26M264 66h26v26M290 168v26h-26M136 194h-26v-26"/></g><ellipse cx="200" cy="130" rx="46" ry="58" fill="rgba(255,255,255,.2)" stroke="#fff" stroke-width="3"/><circle cx="182" cy="122" r="6" fill="#fff"/><circle cx="218" cy="122" r="6" fill="#fff"/><path d="M184 154q16 14 32 0" fill="none" stroke="#FFB79B" stroke-width="5" stroke-linecap="round"/><path d="M104 130h192" stroke="#FFB79B" stroke-width="3" stroke-dasharray="4 8"/>',
    vr: '<rect x="96" y="86" width="208" height="92" rx="40" fill="rgba(255,255,255,.2)" stroke="#fff" stroke-width="4"/><circle cx="158" cy="132" r="26" fill="#fff"/><circle cx="242" cy="132" r="26" fill="#fff"/><circle cx="158" cy="132" r="10" fill="#1F5BFF"/><circle cx="242" cy="132" r="10" fill="#1F5BFF"/><path d="M96 126H70M304 126h26" stroke="#FFB79B" stroke-width="8" stroke-linecap="round"/>',
    leaf: '<path d="M120 188C110 110 168 60 290 66c6 104-44 152-130 134" fill="rgba(255,255,255,.22)" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M120 188c34-44 70-78 120-100" fill="none" stroke="#FFB79B" stroke-width="6" stroke-linecap="round"/><circle cx="312" cy="196" r="9" fill="#fff"/>'
  };
  function art(k) { return '<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + (A[k] || '') + '</svg>'; }

  $('#projGrid').innerHTML = S.projects.map(function (p, i) {
    var code = p.code || S.github;
    return '<article class="proj tilt ' + (p.featured ? 'feat ' : '') + 'v' + (i % 4) + '" data-tilt data-reveal style="--d:' + ((i % 2) * 90) + 'ms">' +
      '<div class="proj-art">' + art(p.art) + '<span class="proj-n mono">' + p.n + '</span><span class="proj-glare"></span></div>' +
      '<div class="proj-body"><p class="proj-sub mono">' + p.sub + '</p><h3>' + p.title + '</h3><p>' + p.desc + '</p>' +
      '<ul class="tags">' + p.tags.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<div class="proj-links">' +
      (p.live ? '<a class="link-pill solid" href="' + p.live + '" target="_blank" rel="noopener" data-cursor>Live ' + ARROW + '</a>' : '') +
      '<a class="link-pill" href="' + code + '" target="_blank" rel="noopener" data-cursor>Code ' + ARROW + '</a></div></div></article>';
  }).join('');

  var ICON = { edu: '🎓', role: '🧭', win: '🏆' };
  $('#timeline').innerHTML = S.timeline.map(function (t, i) {
    return '<li class="tl ' + t.kind + '" data-reveal style="--d:' + (i * 60) + 'ms"><span class="tl-when mono">' + t.when + '</span><span class="tl-dot">' + ICON[t.kind] + '</span>' +
      '<div class="tl-card"><h3>' + t.title + '</h3><p class="tl-org mono">' + t.org + '</p><p>' + t.body + '</p></div></li>';
  }).join('');
  $('#certs').innerHTML = S.certs.map(function (c) { return '<span>' + c + '</span>'; }).join('');

  /* ---------- smooth (inertial) scrolling ---------- */
  var maxScroll = function () { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); };
  var sTarget = window.scrollY, sCur = window.scrollY, sBusy = false, locked = true;
  var sLast = 0;
  function stick(now) {
    var dt = Math.min(0.1, Math.max(0.001, (now - sLast) / 1000)); sLast = now;   // frame-rate independent easing
    sCur = lerp(sCur, sTarget, reduce ? 1 : 1 - Math.exp(-dt * 7));
    if (Math.abs(sTarget - sCur) < 0.4) { sCur = sTarget; sBusy = false; }
    window.scrollTo(0, sCur);
    if (sBusy) requestAnimationFrame(stick);
  }
  function glideTo(y) { sTarget = clamp(y, 0, maxScroll()); if (!sBusy) { sBusy = true; sCur = window.scrollY; sLast = performance.now(); requestAnimationFrame(stick); } }
  if (fine && !reduce) {
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || locked) { if (locked) e.preventDefault(); return; }
      e.preventDefault();
      if (!sBusy) sTarget = window.scrollY;
      var d = e.deltaMode === 1 ? e.deltaY * 34 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      glideTo(sTarget + d);
    }, { passive: false });
  }
  window.addEventListener('scroll', function () { if (!sBusy) { sTarget = sCur = window.scrollY; } }, { passive: true });
  function goTo(hash) {
    var el = hash === '#home' ? document.body : $(hash); if (!el) return;
    var y = hash === '#home' ? 0 : el.getBoundingClientRect().top + window.scrollY - (hash === '#contact' ? 0 : 0);
    if (fine && !reduce) glideTo(y); else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    e.preventDefault(); goTo(a.getAttribute('href'));
    closeMenu();
  });

  /* ---------- progress bar + nav state ---------- */
  var prog = $('#progress'), nav = $('#nav');
  var navLinks = $$('#navLinks a'), pill = $('#navPill');
  function movePill(a) {
    if (!a) return;
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
  }
  var secs = ['home', 'about', 'skills', 'projects', 'journey', 'contact'].map(function (id) { return document.getElementById(id); });
  function onScroll() {
    var y = window.scrollY;
    prog.style.transform = 'scaleX(' + (y / Math.max(1, maxScroll())).toFixed(4) + ')';
    nav.classList.toggle('solid', y > 40);
    var cur = 0, mid = y + window.innerHeight * 0.4;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= mid) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
    movePill(navLinks[cur]);
    heroScroll(y);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { onScroll(); });

  var burger = $('#burger');
  function closeMenu() { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var o = document.body.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o);
  });

  /* ---------- custom cursor ---------- */
  if (fine) {
    document.body.classList.add('has-cursor');
    var ring = $('#cRing'), dot = $('#cDot');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
      var h = e.target.closest && e.target.closest('a,button,[data-cursor],input,textarea,.tilt');
      ring.classList.toggle('hot', !!(h && !h.classList.contains('tilt')));
      ring.classList.toggle('text', !!(e.target.closest && e.target.closest('input,textarea')));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { ring.style.opacity = 0; dot.style.opacity = 0; });
    document.addEventListener('mouseenter', function () { ring.style.opacity = 1; dot.style.opacity = 1; });
    (function loop() {
      rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    window.addEventListener('mousedown', function () { ring.classList.add('down'); });
    window.addEventListener('mouseup', function () { ring.classList.remove('down'); });
  }

  /* ---------- hero: 3D page tilt + layered parallax ---------- */
  var tiltEl = $('#heroTilt'), hero = $('#home'), stageWrap = $('#stageWrap');
  var tp = { x: 0, y: 0 }, tc = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (e) {
    tp.x = (e.clientX / innerWidth - 0.5) * 2; tp.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  var heroY = 0;
  function heroScroll(y) { heroY = y; }
  (function heroLoop() {
    tc.x = lerp(tc.x, reduce ? 0 : tp.x, 0.06); tc.y = lerp(tc.y, reduce ? 0 : tp.y, 0.06);
    var vis = heroY < window.innerHeight * 1.1;
    if (vis) {
      tiltEl.style.transform = 'perspective(1400px) rotateY(' + (tc.x * 1.6).toFixed(3) + 'deg) rotateX(' + (-tc.y * 1.2).toFixed(3) + 'deg)';
      hero.style.setProperty('--px', tc.x.toFixed(3));
      hero.style.setProperty('--py', tc.y.toFixed(3));
      hero.style.setProperty('--sy', (heroY * 0.18).toFixed(1) + 'px');
    }
    requestAnimationFrame(heroLoop);
  })();

  /* ---------- rotating role text ---------- */
  var roleEl = $('#roleSwap'), ri = 0;
  setInterval(function () {
    if (document.hidden) return;
    roleEl.classList.add('out');
    setTimeout(function () { ri = (ri + 1) % S.roles.length; roleEl.textContent = S.roles[ri]; roleEl.classList.remove('out'); }, 380);
  }, 2400);

  /* ---------- generic tilt cards ---------- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(function (el) {
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
          el.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
          el.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(0) + '%');
          el.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(0) + '%');
        });
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- reveal on scroll + counters ---------- */
  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target; el.classList.add('is-in'); io.unobserve(el);
      $$('[data-count]', el).forEach(count);
      if (el.matches('[data-count]')) count(el);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal],[data-split]:not(.line)').forEach(function (el) { io.observe(el); });

  function count(el) {
    if (el.__done) return; el.__done = true;
    var end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
    (function step(n) {
      var p = clamp((n - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec) + suf;
      if (p < 1 && !reduce) requestAnimationFrame(step); else el.textContent = end.toFixed(dec) + suf;
    })(t0);
  }

  /* ---------- contact ---------- */
  var toast = $('#toast');
  function showToast(m) { toast.textContent = m; toast.classList.add('on'); clearTimeout(showToast.t); showToast.t = setTimeout(function () { toast.classList.remove('on'); }, 1900); }
  $('#copyMail').addEventListener('click', function () {
    var m = 'shubhamsawant2205@gmail.com';
    (navigator.clipboard ? navigator.clipboard.writeText(m) : Promise.reject()).then(function () { showToast('Email copied ✓'); }, function () { location.href = 'mailto:' + m; });
  });
  $('#contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, n = f.name.value, em = f.email.value, msg = f.msg.value;
    location.href = 'mailto:shubhamsawant2205@gmail.com?subject=' + encodeURIComponent('Portfolio enquiry from ' + n) +
      '&body=' + encodeURIComponent(msg + '\n\n— ' + n + ' (' + em + ')');
    showToast('Opening your mail app…');
  });

  /* ---------- loader -> intro ---------- */
  var num = $('#ldNum'), bar = $('#ldBar'), ldStart = performance.now();
  var fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 2500); })]) : Promise.resolve();
  var imgsReady = Promise.all(['assets/body.webp', 'assets/head.webp'].map(function (s) { return new Promise(function (r) { var i = new Image(); i.onload = i.onerror = r; i.src = s; }); }));
  var assetsDone = false; Promise.all([fontsReady, imgsReady]).then(function () { assetsDone = true; });
  var dur = reduce ? 200 : 1900;
  (function tick(n) {
    var p = clamp((n - ldStart) / dur, 0, 1), eased = 1 - Math.pow(1 - p, 2.2);
    var shown = Math.min(eased, assetsDone ? 1 : 0.92);
    num.textContent = Math.round(shown * 100); bar.style.transform = 'scaleX(' + shown + ')';
    if (p < 1 || !assetsDone) { requestAnimationFrame(tick); return; }
    num.textContent = 100; bar.style.transform = 'scaleX(1)';
    setTimeout(function () {
      document.body.classList.remove('is-loading'); document.body.classList.add('is-ready');
      $$('.hero-title .line').forEach(function (l) { l.classList.add('is-in'); });
      locked = false; onScroll();
      setTimeout(function () { var l = $('#loader'); l.parentNode && l.parentNode.removeChild(l); }, 1300);
    }, 380);
  })(ldStart);
  // safety: never leave the user stuck on the loader
  setTimeout(function () { locked = false; document.body.classList.remove('is-loading'); document.body.classList.add('is-ready'); $$('.hero-title .line').forEach(function (l) { l.classList.add('is-in'); }); }, 6000);

  onScroll();
  setTimeout(function () { movePill($('#navLinks a.active')); }, 300);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill($('#navLinks a.active')); });
})();
